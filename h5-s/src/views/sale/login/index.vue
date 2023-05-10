<template>
  <div class="login-container">
    <div style="text-align:center; margin-bottom: 2rem;margin-top: 5rem;">
      <p style="font-size:1.7rem;">账号注册</p>
    </div>

    <van-form class="login-form" ref="form">
      <van-cell-group inset class="ft-se-20">
        <van-field
          size="large"
          label="手机号码:"
          required
          v-model="registerForm.phone"
          name="phone"
          :rules="telRules"
        />
        <van-field
          size="large"
          label="验证码:"
          required
          type="number"
          maxlength="6"
          v-model="registerForm.code"
          name="code"
          center
          clearable
          :rules="codeRules"
        >
          <template #button>
            <!-- 这里有bug，使用<van-button>无法进行局部表单验证 -->
            <div class="button" v-if="show" @click="sendSms">发送验证码</div>
            <div class="button" v-if="!show">{{count}} S</div>
          </template>
        </van-field>

        <van-field
          size="large"
          name="password"
          required
          clearable
          v-model="registerForm.password"
          ref="password"
          label="密码:"
          :type="passwordType"
          minlength="6"
          onkeyup="this.value=this.value.replace(/\s+/g,'')"
          :rules="passwordRules"
        >
          <template #button>
            <span class="show-pwd" @click="showPwd">
              <van-icon :name="passwordType === 'password' ? 'closed-eye' : 'eye-o'"/>
            </span>
          </template>
        </van-field>

        <van-field
          size="large"
          required
          clearable
          name="confirmPwd"
          v-model="registerForm.confirmPwd"
          label="确认密码:"
          ref="confirmPwd"
          :type="passwordType"
          minlength="6"
          onkeyup="this.value=this.value.replace(/\s+/g,'')"
          :rules="[{ 
                        required: true,
                        trigger:'onBlur', 
                        message: '不能为空' 
                    },
          { validator, message: '两次密码不一致' }]"
        >
          <template #button>
            <span class="show-pwd" @click="showPwd">
              <van-icon :name="passwordType === 'password' ? 'closed-eye' : 'eye-o'"/>
            </span>
          </template>
        </van-field>
      </van-cell-group>
      <van-button
        class="login-btn"
        :disabled="disabled"
        :loading="loading"
        style="width:100%;margin-top:20px;"
        @click="handleRegister"
      >下一步</van-button>
      <van-row class="mg-tp-20 ft-se-14 mg-lt-20">
        <van-col>
          <van-checkbox v-model="checked" checked-color="#C83C3C">我已阅读并同意</van-checkbox>
        </van-col>
        <van-col>
          <i style="color:red;margin-top:40px" @click="showPopup=true">《彩云点餐商家版隐私政策》</i>
        </van-col>
      </van-row>
    </van-form>

    <!-- <van-row class="bottom-container">
      <van-image width="20px" fit="contain" :src="require('@/assets/login/icbc.jpg')"/>
      <span class="span">本服务由中国工商银行云南省分行提供</span>
    </van-row> -->
    <div class='copy'>
      <img class="img" :src="require('@/assets/login/icbc.jpg')"/>本服务由中国工商银行云南省分行提供
    </div>

    <van-popup v-model="showPopup" :style="{ height: '50%',width:'90%' }">
      <van-row class="mg-10 tx-ct">《彩云点餐商家版隐私政策》</van-row>
    </van-popup>
  </div>
</template>

<script>
import { setCode, removeCode } from "@/utils/auth";
import { Dialog, Notify } from "vant";
import { register, registerSend } from "@/api/sys.js";

export default {
  name: "Register",
  data() {
    return {
      disabled: false,
      checked: false,
      count: "",
      show: true,
      showPopup: false,
      resCode: null,
      registerForm: {
        phone: "", // '15288293823',
        code: "", // '123456'
        password: "",
        confirmPwd: ""
      },
      // 校验手机号码
      telRules: [
        {
          required: true,
          message: "",
          trigger: "onBlur"
        },
        {
          // 自定义校验规则
          validator: value => {
            return /^1(3|4|5|6|7|8|9)\d{9}$/.test(value);
          },
          message: "请输入正确格式的手机号码",
          trigger: "onBlur"
        }
      ],
      codeRules: [
        {
          required: true,
          message: "",
          trigger: "onBlur"
        }
      ],
      passwordRules: [
        {
          required: true,
          trigger: "onBlur",
          message: "不能为空"
        },
        {
          pattern: /^.*(?=.{6,16})(?=.*\d)(?=.*[A-Z]{1,})(?=.*[a-z]{1,}).*$/,
          message: "新密码6-16位，必须包含数字小写字母大写字母",
          trigger: "onBlur"
        }
      ],

      passwordType: "password",
      loading: false,
      redirect: undefined,
      pattern: /^1(3|4|5|6|7|8|9)\d{9}$/
    };
  },
  watch: {},

  created() {
    this.$store.commit("SET_CODE", "");
    removeCode();
  },

  methods: {
    validator(val) {
      return val === this.registerForm.password;
    },

    sendSms() {
      //局部表单验证
      this.$refs.form
        .validate("phone")
        .then(() => {
          let that = this;
          let params = {
            phone: that.registerForm.phone
          };
          registerSend(params).then(res => {
            if (res.data.code == 2) {
              this.disabled = true;
              Dialog.confirm({
                confirmButtonText: "去登录",
                confirmButtonColor: "#C83C3C",
                message: "当前账号已存在"
              })
                .then(() => {
                  this.$router.push({ path: "/login" });
                })
                .catch(() => {});
            } else if (res.code == 200) {
              this.disabled = false;
              this.resCode = res.data.code;
              setCode(res.data.code);
              this.$store.commit("SET_CODE", res.data.code);
              that.$notify({
                type: "success",
                message: "验证码发送成功！"
              });
              that.cutDown();
            }
          });
        })
        .catch(() => {});
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

    handleRegister() {
      if (this.resCode == null) {
        this.$message({
          message: "验证码未发送或发送失败！",
          type: "warning"
        });
      } else {
        this.$refs.form.validate().then(() => {
          this.loading = true;
          let params = {
            phone: this.registerForm.phone,
            verifyCode: this.registerForm.code
          };
          if (this.checked == true) {
            register(params).then(res => {
              let data = res.data;
              if (res.code == 200) {
                this.$router.push({
                  name: "merchantRegister",
                  params: {
                    info: JSON.stringify(this.registerForm)
                  }
                });
              }
            });
          } else {
            this.$message({
              message: "请阅读并勾选隐私政策！",
              type: "warning"
            });
          }
          this.loading = false;
        });
      }
    },

    onFailed(errorInfo) {
      console.log("failed", errorInfo);
    },
    onClickLeft() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss">
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
    padding: 0vw 2vw 0;
    margin: 0 auto;
    overflow: hidden;

    .login-btn {
      background: #c83c3c;
      border-radius: 22px;
      color: #ffffff;
    }
  }

  .bottom-container {
    display: inline;
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: 14px;
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
.copy{
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 25px;
  left: 0;
  font-size: 13px;
  color: rgba(0,0,0,.5);
}
.copy img{
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-bottom: -5px;
  margin-right:8px;
}
</style>
