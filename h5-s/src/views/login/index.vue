<template>
  <div class="login-container">
    <div
      @click="setUpShop"
      class="tx-rt pd-10"
      style="margin-bottom: 1rem; background: #c83c3c"
    >
      <span style="color: #fff; font-size: 22px">我要开店</span>
    </div>

    <div class="mg-tp-50 page-home__tabs">
      <van-tabs
        v-model="activeName"
        line-width="60px"
        class=""
        @change="onClickTab"
      >
        <van-tab title="验证码登录" name="a" style="font-size: 22px">
          <van-form class="login-form" ref="form">
            <van-field
              size="large"
              required
              v-model="loginForm.phone"
              placeholder="请输入手机号码"
              :rules="telRules"
              type="tel"
              name="phone"
            />
            <van-field
              size="large"
              required
              maxlength="6"
              v-model="loginForm.captCode"
              placeholder="请输入验证码"
              :rules="code1Rules"
            >
              <template #button>
                <div class="login-code">
                  <img :src="codeUrl" @click="getCode" class="login-code-img" />
                </div>
              </template>
            </van-field>
            <van-field
              size="large"
              required
              type="number"
              maxlength="6"
              v-model="loginForm.verifyCode"
              placeholder="请输入短信验证码"
              :rules="codeRules"
            >
              <template #button>
                <!-- 这里有bug，使用<van-button>无法进行局部表单验证 -->
                <!-- <div class="button" v-if="show" @click="sendSms">发送验证码</div>
                <div class="button" v-if="!show">{{count}} S</div> -->
                <van-button
                  size="small"
                  v-if="show"
                  class="button"
									native-type="button"
                  type="warning"
                  @click="sendSms"
                  >发送验证码</van-button
                >
                <van-button
                  size="small"
                  v-if="!show"
                  class="button"
                  color="#ff976a"
                  >{{ count }} S</van-button
                >
              </template>
            </van-field>
            <div class="mg-tp-20">
              <van-button
                color="#C83C3C"
                class="login-btn"
                :loading="loading"
                :disabled="disabled"
                style="width: 100%; margin-top: 20px"
                @click="handleLogin"
                >登录</van-button
              >
              <!-- <van-row class="mg-tp-20 ft-se-14">
                <van-col>
                  <van-checkbox v-model="checked" checked-color="#C83C3C">我已阅读并同意</van-checkbox>
                </van-col>
                <van-col>
                  <i style="color:#C83C3C;margin-top:40px" @click="showPopup=true">《隐私政策》</i>
                </van-col>
              </van-row> -->
            </div>
          </van-form>
        </van-tab>
        <van-tab title="密码登录" name="b" style="font-size: 22px">
          <van-form class="login-form" ref="pwdForm">
            <van-field
              size="large"
              required
              ref="phone"
              v-model="loginForm.phone"
              name="phone"
              :rules="telRules"
              placeholder="请填写账号"
            />
            <van-row prop="password">
              <van-field
                size="large"
                required
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="请填写密码"
                name="password"
                :rules="passwordRules"
              >
                <template #button>
                  <span class="show-pwd" @click="showPwd">
                    <van-icon
                      :name="
                        passwordType === 'password' ? 'closed-eye' : 'eye-o'
                      "
                    />
                  </span>
                </template>
              </van-field>
              <van-field
                size="large"
                required
                maxlength="6"
                v-model="loginForm.captCode"
                placeholder="请输入验证码"
                :rules="code1Rules"
              >
                <template #button>
                  <div class="login-code">
                    <img
                      :src="codeUrl"
                      @click="getCode"
                      class="login-code-img"
                    />
                  </div>
                </template>
              </van-field>
            </van-row>
            <div class="mg-tp-20">
              <van-button
                class="login-btn"
                :loading="loading"
                :disabled="disabled"
                style="width: 100%; margin-top: 20px"
                @click="handleLogin"
                >登录</van-button
              >
              <!-- <van-row class="mg-tp-20 ft-se-14">
                <van-col>
                  <van-checkbox v-model="checked" checked-color="#C83C3C">我已阅读并同意</van-checkbox>
                </van-col>
                <van-col>
                  <i style="color:#C83C3C;margin-top:40px" @click="showPopup=true">《隐私政策》</i>
                </van-col>
              </van-row> -->
            </div>
          </van-form>
        </van-tab>
      </van-tabs>
    </div>

    <van-popup
      v-model="showPopup"
      :style="{ height: '70%', width: '90%' }"
      close-icon-position="bottom-right"
    >
      <van-row class="pd-tb-10 tx-ct">《隐私政策》</van-row>
      <div>
        <van-row class="agreementlogin">
          <div>中国工商银行</div>
        </van-row>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import { setCode, removeCode } from "@/utils/auth";
import { Dialog, Notify } from "vant";
import i18n from "@/i18n/i18n";
import {
  login,
  loginSend,
  pwdlogin,
  getCodeImg,
  getTreeSelectList,
} from "@/api/sys.js";
import store from "@/store";

export default {
  name: "Login",
  data() {
    return {
      timer: null,
      disabled: false,
      checked: false,
      activeName: "a",
      i18n: i18n,
      count: "",
      show: true,
      showPopup: false,
      codeUrl: "",
      loginForm: {
        phone: process.env.VUE_APP_USER, // '15288293823',
        verifyCode: "", // '123456'
        password: process.env.VUE_APP_PASS,
        wxCode: "071hR61w3vejzY2uf74w3er11z2hR61I",
        code: null,
        userType: "1",
        captCode: "", //短信验证码
      },

      // 校验手机号码
      telRules: [
        {
          required: true,
          message: "",
          trigger: "onBlur",
        },
        {
          // 自定义校验规则
          validator: (value) => {
            return /^1(3|4|5|6|7|8|9)\d{9}$/.test(value);
          },
          message: "请输入正确格式的手机号码",
          trigger: "onBlur",
        },
      ],
      codeRules: [
        {
          required: true,
          message: "",
          trigger: "onBlur",
        },
      ],
      code1Rules: [
        {
          required: true,
          message: "",
          trigger: "onBlur",
        },
      ],
      passwordRules: [
        {
          required: true,
          message: "",
          trigger: "onBlur",
        },
      ],

      loading: false,
      passwordType: "password",
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    if (process.env.VUE_APP_WX_LOGIN == 'true') {
      this.loadHref()
    }
    this.getCode();
    this.$store.dispatch("sys/resetToken");
    this.getTreeselect();
  },
  methods: {
    loadHref() {
      //   if (isWechat) {
      // let appid = "wx28013f88973fe172"; //微信APPid  appid  wxe847b8b7dae49a3b   wx28013f88973fe172
      let appid = process.env.VUE_APP_APP_ID;
      let code = this.getUrlCode().code; //是否存在code
      let local = window.location.href;
      if (code == null || code === "") {
        //不存在就打开上面的地址进行授权
        window.location.href =
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
          appid +
          "&redirect_uri=" +
          encodeURIComponent(local) +
          "&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
      } else {
        this.loginForm.wxCode = code;
      }
      //   }
    },
    getUrlCode() {
      // 截取url中的code方法
      var url = location.search;
      var theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
        }
      }
      console.log(theRequest);
      return theRequest;
    },
    // 获取验证码
    getCode() {
      getCodeImg().then((res) => {
        this.codeUrl = "data:image/gif;base64," + res.data.img;
        this.loginForm.code = res.data.code;
      });
      // this.codeUrl = "data:image/gif;base64,"
      // + "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"
    },
    sendSms() {
      // 局部表单验证
      this.$refs.form
        .validate("phone")
        .then(() => {
          if (!this.loginForm.captCode) {
            this.$notify({
              message: "请填写验证码！",
              type: "warning",
            });
            return;
          }
          let that = this;
          let params = {
            phone: that.loginForm.phone,
            code: that.loginForm.captCode,
            uuid: that.loginForm.code,
          };

          loginSend(params).then((res) => {
            if (res.data.code == 9) {
              this.$notify.error("验证码错误");
              return;
            }
            that.cutDown();
            if (res.data.code == 1) {
              clearInterval(this.timer);
              this.show = true;
              this.disabled = true;
              Dialog.confirm({
                confirmButtonText: "去开店",
                confirmButtonColor: "#C83C3C",
                message: "当前手机号尚无对应开店信息，暂不能登录",
              })
                .then(() => {
                  this.$router.push({ path: "/merchantRegister" });
                })
                .catch(() => {});
            } else if (res.data.code == 2) {
              // 提交审核中
              clearInterval(this.timer);
              this.show = true;
              this.disabled = false;
              Dialog({ message: res.msg });
            } else if (res.data.code == 3) {
              // 退回修改
              clearInterval(this.timer);
              this.show = true;
              this.disabled = false;
              Dialog.confirm({
                confirmButtonText: "去修改信息",
                confirmButtonColor: "#C83C3C",
                message: res.msg,
              })
                .then(() => {
                  this.$router.push({
                    path: "/merchantRegisterAgain",
                    query: { phone: this.loginForm.phone },
                  });
                })
                .catch(() => {});
            } else if (res.data.code == 4) {
              // 重新提交审核
              clearInterval(this.timer);
              this.show = true;
              this.disabled = false;
              Dialog({ message: res.msg });
            } else if (res.data.code == 5) {
              // 作废
              clearInterval(this.timer);
              this.show = true;
              this.disabled = false;
              Dialog.confirm({
                confirmButtonText: "重新注册",
                confirmButtonColor: "#C83C3C",
                message: res.msg,
              })
                .then(() => {
                  this.$router.push({ path: "/merchantRegister" });
                })
                .catch(() => {});
            } else {
              this.disabled = false;
              this.loginForm.code = res.data.code;
              that.$notify({
                type: "success",
                message: "验证码发送成功！",
              });
            }
          });
        })
        .catch(() => {});
    },

    //验证码倒计时
    cutDown() {
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.show = false;
        this.timer = setInterval(() => {
          if (this.count > 1 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.show = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },

    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    /** 查询经营分类结构树 */
    getTreeselect() {
      getTreeSelectList().then((response) => {
        if (response.code == 200) {
          this.$store.commit(
            "sys/SET_CATEGORYTREEDATA",
            response.data[0].children
          );
        }
      });
    },
    //去开店
    setUpShop() {
      this.$router.push({ path: "/merchantRegister" });
    },
    // 点击切换标签
    onClickTab(val) {
      this.disabled = false;
    },
    handleLogin() {
      // if (this.checked == true) {
      if (this.activeName === "a") {
        if (this.loginForm.code == null) {
          this.$message({
            message: "验证码未发送或发送失败！",
            type: "warning",
          });
        } else {
          // 全局表单验证
          this.$refs.form
            .validate()
            .then(() => {
              //验证码登录
              let params = {
                username: this.loginForm.phone,
                verifyCode: this.loginForm.verifyCode,
                userType: this.loginForm.userType,
                wxCode: this.loginForm.wxCode,
                code: this.loginForm.code,
              };
              this.$store
                .dispatch("sys/Login", params)
                .then((res) => {
                  // 提醒信息通知
                  if (res.msg) {
                    this.$notify.warning(res.msg);
                  }
                  this.$router.push({ path: "/index" }).catch(() => {});
                })
                .catch(() => {
                  this.loading = false;
                });
            })
            .catch(() => {});
        }
      } else {
        // 全局表单验证
        this.$refs.pwdForm
          .validate()
          .then(() => {
            //账户密码登录
            let params = {
              username: this.loginForm.phone,
              password: this.loginForm.password,
              userType: this.loginForm.userType,
              wxCode: this.loginForm.wxCode,
              code: this.loginForm.code,
              captCode: this.loginForm.captCode,
            };
            this.$store
              .dispatch("sys/pwdLogin", params)
              .then((res) => {
                if(res.token){
                  this.$router.push({ path: "/index" }).catch(() => {});
                }
                else if (res.data.code == 1) {
                  clearInterval(this.timer);
                  Dialog.confirm({
                    confirmButtonText: "去开店",
                    confirmButtonColor: "#C83C3C",
                    message: "当前手机号尚无对应开店信息，暂不能登录",
                  })
                    .then(() => {
                      this.$router.push({ path: "/merchantRegister" });
                    })
                    .catch(() => {});
                } else if (res.data.code == 2) {
                  // 提交审核中
                  Dialog({ message: res.msg });
                } else if (res.data.code == 3) {
                  Dialog.confirm({
                    confirmButtonText: "去修改信息",
                    confirmButtonColor: "#C83C3C",
                    message: res.msg,
                  })
                    .then(() => {
                      this.$router.push({
                        path: "/merchantRegisterAgain",
                        query: { phone: this.loginForm.phone },
                      });
                    })
                    .catch(() => {});
                }else if (res.data.code == 4) {
                  // 重新提交审核
                  Dialog({ message: res.msg });
                }
              })
              .catch(() => {
                this.loading = false;
              });
          })
          .catch(() => {});
      }
      // } else {
      //   this.$message({
      //     message: "请阅读并勾选彩云点餐商家版用户协议",
      //     type: "warning"
      //   });
      // }
    },

    onFailed(errorInfo) {
      console.log("failed", errorInfo);
    },
    onClickLeft() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #2d3a4b;
$bg: #ffffff;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  position: relative;
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    max-width: 100%;
    padding: 8vw 6vw 0;
    margin: 0 auto;
    overflow: hidden;

    .login-btn {
      background: #c83c3c;
      //   background: linear-gradient(to right, #C83C3C, #C83C3C);
      border-radius: 22px;
      color: #ffffff;
      width: 90%;
    }
  }

  .bottom-container {
    display: inline;
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: 12px;
    padding: 5px;

    .span {
      margin-bottom: 20px;
      color: #889aa4;
    }
  }
  .button {
    padding: 3px 5px;
    background: #ff976a;
    border-radius: 5px;
    color: #ffffff;
  }
}
/* van-tabs 设置高度 （总结自van-tabs实验）*/
// .van-tabs__wrap,
// .van-tabs__wrap scroll-view,
// .van-tabs__nav,
// .van-tab {
//   height: 60px !important;
//   background-color: white;
//   font-size: 20px;
// }
.page-home__tabs ::v-deep .van-tabs--line .van-tabs__wrap {
  height: 60px;
}
.page-home__tabs ::v-deep .van-tab {
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0 4px;
  color: #646566;
  font-size: 20px;
  line-height: 20px;
  cursor: pointer;
}

.login-code {
  width: 33%;
  height: 32px;
  // float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.login-code-img {
  height: 32px;
}

.agreementlogin {
  top: 50px;
  height: 70%;
  position: relative;
  overflow: auto;
}
</style>
