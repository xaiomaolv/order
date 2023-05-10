<template>
  <div class="container">
    <van-nav-bar
      title="密码重置"
      left-text
      left-arrow
      class="van-nav-bar-top"
      @click-left="onClickLeft"
    ></van-nav-bar>

    <van-row class="mg-tp-10 main">
      <van-field
        size="large"
        readonly
        type="tel"
        v-model="storeInfo.legalPersonPhone"
        input-align="right"
        name="legalPersonPhone"
        label="手机号码"
      />
      <van-field
        size="large"
        readonly
        v-model="password"
        input-align="right"
        type="password"
        name="password"
        label="密码"
      />
    </van-row>

    <van-row class="bottom-btn">
      <van-button
        round
        style="width: 90%"
        color="#C83C3C"
        class="loginOut"
        @click="showPopup"
        >重置密码</van-button
      >
    </van-row>

    <van-popup
      v-model="showPicker"
      position="bottom"
      :style="{ height: '45%' }"
    >
      <van-form class="login-form" ref="form">
        <van-cell-group inset>
          <van-field
            label="手机号码:"
            size="large"
            readonly
            v-model="formData.phone"
            name="phone"
          />
          <van-field
            label="验证码:"
            size="large"
            required
            v-model="formData.verifyCode"
            name="verifyCode"
            center
            clearable
            type="number"
            maxlength="6"
            placeholder="请填写验证码"
            :rules="codeRules"
          >
            <template #button>
              <!-- 这里有bug，使用<van-button>无法进行局部表单验证 -->
              <div class="button" v-if="show" @click="sendSms">发送验证码</div>
              <div class="button" v-if="!show">{{ count }} S</div>
              <!-- <van-button native-type="button" size="small" v-if="show" class="button" type="warning" @click="sendSms">发送验证码</van-button>
              <van-button size="small" v-if="!show" class="button" color="#ff976a">{{count}} S</van-button> -->
            </template>
          </van-field>

          <van-field
            size="large"
            name="password"
            required
            clearable
            v-model="formData.password"
            ref="password"
            label="密码"
            placeholder="请输入密码"
            :type="passwordType"
            minlength="8"
            maxlength="16"
            :rules="passwordRules"
          >
            <template #button>
              <span class="show-pwd" @click="showPwd">
                <van-icon
                  :name="passwordType === 'password' ? 'closed-eye' : 'eye-o'"
                />
              </span>
            </template>
          </van-field>
          <!-- <van-field size="large" name="password" label="密码强度:">
            <template #input>
              <span class="line" :class="[level.includes('low') ? 'low' : '']">
              </span>
              <span
                class="line"
                :class="[level.includes('middle') ? 'middle' : '']"
              ></span>
              <span
                class="line"
                :class="[level.includes('high') ? 'high' : '']"
              ></span>
            </template>
          </van-field> -->

          <van-field
            size="large"
            required
            clearable
            name="confirmPwd"
            v-model="formData.confirmPwd"
            label="确认密码"
            placeholder="请确认密码"
            ref="confirmPwd"
            :type="passwordType"
            minlength="8"
            maxlength="16"
            :rules="[
              {
                required: true,
                trigger: 'onBlur',
                message: '必填',
              },
              { validator, message: '两次密码不一致' },
            ]"
          >
            <template #button>
              <span class="show-pwd" @click="showPwd">
                <van-icon
                  :name="passwordType === 'password' ? 'closed-eye' : 'eye-o'"
                />
              </span>
            </template>
          </van-field>
        </van-cell-group>
        <div class="pd-20 tx-ct">
          <van-button
            round
            style="width: 90%"
            :loading="loading"
            color="#C83C3C"
            class="mg-15"
            native-type="submit"
            @click="handleChange"
            >重置</van-button
          >
        </div>
      </van-form>
    </van-popup>
  </div>
</template>

<script>
import { Dialog, Notify } from "vant";
import { getUserInfo, sendMsg, updateBussiness } from "@/api/sys.js";
export default {
  data() {
    return {
      loading: false,
      showPicker: false,
      storeInfo: {},
      password: "123456",
      passwordType: "password",
      count: "",
      show: true,
      formData: {
        phone: "",
        password: "",
        verifyCode: "",
        confirmPwd: "",
      },
      level: [],
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
      passwordRules: [
        {
          required: true,
          trigger: "onBlur",
          message: "必填",
        },
        {
          pattern:
            /^(?![0-9]+$)(?![^0-9]+$)(?![a-zA-Z]+$)(?![^a-zA-Z]+$)(?![a-zA-Z0-9]+$)[a-zA-Z0-9\S]{8,30}$/,
          message: "新密码8-16位，必须包含数字小写字母大写字母特殊字符",
          trigger: "onBlur",
        },
      ],
    };
  },

  created() {
    this.getBussinessInfo();
  },

  methods: {
    getBussinessInfo() {
      getUserInfo().then((res) => {
        this.storeInfo = res.data;
      });
    },

    validator(val) {
      return val === this.formData.password;
    },
    // 校验密码
    checkPassword() {
      let value = this.formData.password;
      this.level = [];
      // 校验是数字
      const regex1 = /^\d+$/;
      // 校验字母
      const regex2 = /^[A-Za-z]+$/;
      // 校验符号
      const regex3 =
        /^[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]+$/;
      if (regex1.test(value)) {
        this.level.push("low");
      } else if (regex2.test(value)) {
        this.level.push("low");
      } else if (regex3.test(value)) {
        this.level.push("low");
      } else if (/^[A-Za-z\d]+$/.test(value)) {
        this.level.push("low");
        this.level.push("middle");
      } else if (
        /^[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、\d]+$/.test(
          value
        )
      ) {
        this.level.push("low");
        this.level.push("middle");
      } else if (
        /^[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、A-Za-z]+$/.test(
          value
        )
      ) {
        this.level.push("low");
        this.level.push("middle");
      } else if (
        /^[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、A-Za-z\d]+$/.test(
          value
        )
      ) {
        this.level.push("low");
        this.level.push("middle");
        this.level.push("high");
      }
      return;
    },
    onClickLeft() {
      this.$router.go(-1);
    },

    showPopup() {
      this.formData.phone = this.storeInfo.legalPersonPhone;
      this.showPicker = true;
    },

    sendSms() {
      let that = this;
      let params = {
        phone: that.formData.phone,
      };
      that.cutDown();
      sendMsg(params).then((res) => {
        if (res.code == 200) {
          //   that.disabled = false;
          that.storeInfo.code = res.data.code;
          that.$notify({
            type: "success",
            message: "验证码发送成功！",
          });
        }
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

    handleChange() {
      this.$refs.form.validate().then(() => {
        this.storeInfo.password = this.formData.password;
        this.storeInfo.verifyCode = this.formData.verifyCode;
        this.storeInfo.auditFlag = "0";
        Dialog.confirm({
          confirmButtonText: "确定",
          confirmButtonColor: "#C83C3C",
          message: "确定要重置密码吗？",
        })
          .then(() => {
            updateBussiness(this.storeInfo).then((res) => {
              if (res.code == 200) {
                this.getBussinessInfo();
                this.$message({
                  message: res.msg,
                  type: "success",
                });
                this.showPicker = false;
                this.formData = {
                  password: "",
                  verifyCode: "",
                  confirmPwd: "",
                };
                this.count = "";
              }
            });
          })
          .catch(() => {
            this.showPicker = false;
          });
      });
    },
  },
};
</script>

<style scoped>
.container {
  height: 100%;
  overflow: scroll;
  position: relative;
  /* padding-top: 2.8125rem; */
  font-size: 0.875rem;
}
.main {
  margin-bottom: 40px;
}
.bottom-btn {
  position: fixed;
  bottom: 5px;
  left: 0;
  right: 0;
  padding: 5px;
  text-align: center;
}
.button {
  padding: 3px 5px;
  background: #ff976a;
  border-radius: 10px;
  color: #ffffff;
}
.line {
  display: inline-block;
  width: 48px;
  height: 4px;
  background: #d8d8d8;
  border-radius: 3px;
  margin-right: 8px;
}
.low {
  background: #f4664a;
}
.middle {
  background: #ffb700;
}
.high {
  background: #2cbb79;
}
.level {
  margin: 0 16px 0 8px;
}
</style>
