<template>
  <div class="container">
    <van-nav-bar
      title="开店人信息"
      left-text
      left-arrow
      class="van-nav-bar-top"
      @click-left="onClickLeft"
    ></van-nav-bar>

    <van-row class="mg-tp-10 main">
      <van-field
        size="large"
        readonly
        v-model="storeInfo.legalPersonName"
        input-align="right"
        name="legalPersonName"
        label="负责人姓名"
      />
      <van-field
        size="large"
        readonly
        v-model="storeInfo.legalPersonPhone"
        input-align="right"
        name="legalPersonPhone"
        label="联系电话"
      />
      <!-- <van-field
        size="large"
        readonly
        v-model="storeInfo.account"
        input-align="right"
        name="phone"
        placeholder="请输入工商银行卡号"
        label="收款卡号"
      ></van-field> -->
      <van-field size="large" label="身份证正面" input-align="right">
        <template #input>
          <!-- <van-image width="200" height="130" :src="storeInfo.identityFrontPhoto"/> -->
          <auth-img
            :authSrc="IMG_BASR_URL + storeInfo.identityFrontPhoto"
            v-if="flag"
            style="width: 200px; height: 130px"
          ></auth-img>
        </template>
      </van-field>
      <van-field size="large" label="身份证反面" input-align="right">
        <template #input>
          <!-- <van-image width="200" height="130" :src="storeInfo.identityBackPhoto"/> -->
          <authImg
            style="width: 200px; height: 130px"
            :authSrc="IMG_BASR_URL + storeInfo.identityBackPhoto"
            v-if="flag"
          />
        </template>
      </van-field>
    </van-row>
    <!-- <van-row class="bottom-btn">
      <van-button round style="width:90%;" color="#C83C3C" class="loginOut" @click="editCard">修改银行卡号</van-button>
    </van-row> -->

    <!-- <van-popup v-model="showPicker" position="bottom" :style="{ height: '25%' }">
      <van-form class="login-form mg-tp-20" ref="form">
        <van-cell-group inset>
          <van-field
            label="银行卡号:"
            size="large"
            required
            v-model="formData.account"
            name="account"
            center
            clearable
            placeholder="请填写银行卡号"
            :rules="[{ required: true,trigger:'onBlur',  message: '不能为空' }]"
          >
          </van-field>
        </van-cell-group>
        <div class="pd-20 tx-ct">
          <van-button
            round
            style="width:90%;"
            color="#C83C3C"
            class="mg-15"
            native-type="submit"
            @click="handleChange"
          >修改</van-button>
        </div>
      </van-form>
    </van-popup> -->
  </div>
</template>

<script>
import { getUserInfo } from "@/api/sys.js";
import authImg from "../../components/authImg.vue";
export default {
  components: { authImg },
  data() {
    return {
      storeInfo: {},
      showPicker: false,
      // formData:{
      //   account
      // }
      flag: false,
    };
  },
  created() {
    getUserInfo().then((res) => {
      // this.storeInfo.identityFrontPhoto = this.IMG_BASR_URL + this.storeInfo.identityFrontPhoto;
      // this.storeInfo.identityBackPhoto = this.IMG_BASR_URL + this.storeInfo.identityBackPhoto;
      if (res.code == 200) {
        this.flag = true;
        this.storeInfo = res.data;
      }
    });
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    // 修改银行卡号
    editCard() {
      this.showPicker = true;
      console.log(this.storeInfo.account, "account");
    },
    handleChange() {
      this.$refs.form.validate().then(() => {
        // console.log();
      });
    },
  },
};
</script>

<style scoped>
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
</style>
