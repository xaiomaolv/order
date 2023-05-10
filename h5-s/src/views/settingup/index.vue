<template>
  <div class="container">
    <van-nav-bar title="注册" left-text left-arrow class="van-nav-bar-top" @click-left="onClickLeft"></van-nav-bar>
    <van-row class="mg-top-45">
      <form ref="infoForm" :model="infoForm" class="login-form" label-position="left">
        <van-tabs v-model="active" animated>
          <van-tab title="门店信息填写">
            <van-field
              v-model="infoForm.username"
              name="username"
              label="联系人姓名"
              placeholder="请填写"
              :rules="[{ required: true, message: '请填写姓名' }]"
            />

            <van-field
              v-model="infoForm.tel"
              name="tel"
              label="联系电话"
              placeholder="请填写"
              :rules="[{ pattern, message: '手机号码格式有误！' }]"
            />

            <van-field
              v-model="infoForm.address"
              name="address"
              label="门店地址"
              placeholder="请定位"
              :rules="[{ required: true, message: '请选择地址'}]"
            />

            <van-field
              readonly
              clickable
              name="foodType"
              :value="infoForm.foodType"
              label="经营品类"
              placeholder="点击选择"
              :rules="[{ required: true, message: '必选' }]"
              @click="showPicker = true"
            />

            <van-field
              v-model="infoForm.idcard"
              name="idcard"
              label="门店名称"
              placeholder="请填写"
              :rules="[{ required: true, message: ''}]"
            />

            <van-row
              style="margin: 0 auto; padding-bottom: 2.5rem; border-bottom:#F8F8F8 solid 1px;background-color: #FFF;"
            >
              <van-col span="24" style="padding-left: 1rem; color:#7F8080;" class="line-hg-28">门脸图片</van-col>
              <van-col span="24" style="text-align: center; margin-top: 0.9375rem; ">
                <van-uploader
                  v-model="shopFrontList"
                  :after-read="afterReadS"
                  multiple
                  :max-count="1"
                  :before-delete="beforeDeleteS"
                />
              </van-col>
            </van-row>

            <van-row
              style="margin: 0 auto; padding-bottom: 2.5rem; border-bottom:#F8F8F8 solid 1px;background-color: #FFF;"
            >
              <van-col span="24" style="padding-left: 1rem; color:#7F8080;" class="line-hg-28">店内环境</van-col>
              <van-col span="24" style="text-align: center; margin-top: 0.9375rem; ">
                <van-uploader
                  v-model="environmentImgList"
                  :after-read="afterReadE"
                  multiple
                  :max-count="1"
                  :before-delete="beforeDeleteE"
                />
              </van-col>
            </van-row>
          </van-tab>
          <van-tab title="资质信息填写">
            <van-field
              readonly
              clickable
              name="foodType"
              :value="infoForm.certificateType1"
              label="证件类型"
              placeholder="请选择证件类型"
              :rules="[{ required: true, message: '必选' }]"
              @click="showPicker1 = true"
            />

            <van-row
              style="margin: 0 auto; padding-bottom: 2.5rem; border-bottom:#F8F8F8 solid 1px;background-color: #FFF;"
            >
              <van-col span="24" style="text-align: center; margin-top: 0.9375rem; ">
                <van-uploader
                  v-model="shopFrontList"
                  :after-read="afterReadS"
                  multiple
                  :max-count="1"
                  :before-delete="beforeDeleteS"
                />
              </van-col>
            </van-row>

            <van-field
              readonly
              clickable
              name="foodType"
              :value="infoForm.certificateType2"
              label="证件类型"
              placeholder="请选择证件类型"
              :rules="[{ required: true, message: '必选' }]"
              @click="showPicker2 = true"
            />

            <van-row
              style="margin: 0 auto; padding-bottom: 2.5rem; border-bottom:#F8F8F8 solid 1px;background-color: #FFF;"
            >
              <van-col span="24" style="text-align: center; margin-top: 0.9375rem; ">
                <van-uploader
                  v-model="shopFrontList"
                  :after-read="afterReadS"
                  multiple
                  :max-count="1"
                  :before-delete="beforeDeleteS"
                />
              </van-col>
            </van-row>

            <van-field
              readonly
              clickable
              name="foodType"
              :value="infoForm.certificateType3"
              label="特殊资质"
              placeholder="请选择证件类型(选填)"
              :rules="[{ required: true, message: '必选' }]"
              @click="showPicker3 = true"
            />

            <van-row
              style="margin: 0 auto; padding-bottom: 2.5rem; border-bottom:#F8F8F8 solid 1px;background-color: #FFF;"
            >
              <van-col span="24" style="text-align: center; margin-top: 0.9375rem; ">
                <van-uploader
                  v-model="shopFrontList"
                  :after-read="afterReadS"
                  multiple
                  :max-count="1"
                  :before-delete="beforeDeleteS"
                />
              </van-col>
            </van-row>
          </van-tab>
          <van-tab title="开店人信息填写">
              <van-field
              v-model="infoForm.phone"
              name="phone"
              label="联系电话"
              placeholder="请填写"
              :rules="[{ pattern, message: '手机号码格式有误！' }]"
            />

            <van-field
              v-model="infoForm.cardNo"
              name="phone"
              label="银行卡号"
              placeholder="银行卡号"
              @blur="massage"
            ></van-field>

            <van-row
              style="margin: 0 auto; padding-bottom: 2.5rem; border-bottom:#F8F8F8 solid 1px;background-color: #FFF;"
            >
              <van-col span="24" style="padding-left: 1rem; color:#7F8080;" class="line-hg-28">身份证正面</van-col>
              <van-col span="24" style="text-align: center; margin-top: 0.9375rem; ">
                <van-uploader
                  v-model="shopFrontList"
                  :after-read="afterReadS"
                  multiple
                  :max-count="1"
                  :before-delete="beforeDeleteS"
                />
              </van-col>
            </van-row>
            <van-row
              style="margin: 0 auto; padding-bottom: 2.5rem; border-bottom:#F8F8F8 solid 1px;background-color: #FFF;"
            >
              <van-col span="24" style="padding-left: 1rem; color:#7F8080;" class="line-hg-28">身份证反面</van-col>
              <van-col span="24" style="text-align: center; margin-top: 0.9375rem; ">
                <van-uploader
                  v-model="shopFrontList"
                  :after-read="afterReadS"
                  multiple
                  :max-count="1"
                  :before-delete="beforeDeleteS"
                />
              </van-col>
            </van-row>
            
          </van-tab>
        </van-tabs>
      </form>
    </van-row>

    <!-- 品类 -->
    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @confirm="onConfirmType"
        @cancel="showPicker = false"
      />
    </van-popup>
    <!--证件类型一-->
    <van-popup v-model="showPicker1" position="bottom">
      <van-picker
        show-toolbar
        :columns="IDTypeOne"
        @confirm="onIDTypeOne"
        @cancel="showPicker1 = false"
      />
    </van-popup>
    <!--证件类型二-->
    <van-popup v-model="showPicker2" position="bottom">
      <van-picker
        show-toolbar
        :columns="IDTypeTwo"
        @confirm="onIDTypeTwo"
        @cancel="showPicker2 = false"
      />
    </van-popup>
    <!--特殊资质-->
    <van-popup v-model="showPicker3" position="bottom">
      <van-picker
        show-toolbar
        :columns="specialQualifications"
        @confirm="onIDTypeThree"
        @cancel="showPicker3 = false"
      />
    </van-popup>

    <van-row class="bottom-btn" v-if="active==0">
      <van-button
        color="#C83C3C"
        class="loginOut"
        @click="next(1)"
      >下一步</van-button>
    </van-row>
    <van-row class="bottom-btn" v-if="active==1">
      <van-button
        style="width:30%;margin-right:20px;"
        color="#C83C3C"
        class="loginOut"
        @click="next(0)"
      >上一步</van-button>
      <van-button
        style="width:30%;"
        color="#C83C3C"
        class="loginOut"
        @click="next(2)"
      >下一步</van-button>
    </van-row>
    <van-row class="bottom-btn" v-if="active==2">
      <van-button
        style="width:30%;margin-right:20px;"
        color="#C83C3C"
        class="loginOut"
        @click="next(1)"
      >上一步</van-button>
      <van-button
        round
        :disabled="handleClick"
        :loading="loading"
        style="width:30%;margin-right:20px;"
        color="#C83C3C"
        @click.native.prevent="onSubmit"
      >下一步</van-button>
    </van-row>
  </div>
</template>

<script>
import { compressImage } from "../../utils/imgbase.js";
import { checkCard } from '../../utils/checkCard.js';

export default {
  data() {
    return {
      handleClick: false,
      loading: false,
      payway: "1",
      activeNames: [],
      active: 0,
      msgText: null,
      cardType: null,
      infoForm: {
        username: "",
        tel: "",
        address: "",
        foodType: "",
        //证件信息
        certificateType1: "营业执照",
        certificateType2: "食品经营许可证",
        certificateType3: "",
        //经营者信息
        cardNo: "",
        phone: "",
      },
      showPicker: false,
      columns: ["小吃", "火锅", "其他"],
      showPicker1: false,
      IDTypeOne: [
        "营业执照",
        "电子营业执照",
        "事业单位法人证书",
        "民办非企业单位登记证书",
        "社会团体法人登记证书",
        "三小类许可证",
        "双证合一"
      ],
      showPicker2: false,
      IDTypeTwo: ["食品经营许可证", "食品生产许可证", "三小类许可证"],
      showPicker3: false,
      specialQualifications: ["清真食品许可证"],
      shopFrontList: [], //门脸图片
      environmentImgList: [], //店内环境
      pattern: /^1(3|4|5|6|7|8|9)\d{9}$/
    };
  },
  watch: {},
  methods: {
    onConfirmType(value) {
      this.infoForm.foodType = value;
      this.showPicker = false;
    },
    onIDTypeOne(value) {
      this.infoForm.certificateType1 = value;
      this.showPicker1 = false;
    },
    onIDTypeTwo(value) {
      this.infoForm.certificateType2 = value;
      this.showPicker2 = false;
    },
    onIDTypeThree(value) {
      this.infoForm.certificateType3 = value;
      this.showPicker3 = false;
    },

    onClickLeft() {
      this.$router.go(-1);
    },

    massage() {
      let $this = this;
      checkCard(this.infoForm.cardNo).then(response => {
        if (response.validated) {
          $this.msgText = response.bankName;
          $this.cardType = response.cardTypeName;
        } else {
          $this.msgText = null;
          $this.cardType = null;
          alert("请填写正确的卡号");
        }
      });
    },

    afterReadS(file) {
      compressImage(file.content).then(result => {
        file.status = "uploading";
        file.message = "上传中...";
        const formData = new FormData();
        if (result.size > file.file.size) {
          //压缩后比原来更大，则将原图上传
          formData.append("file", file.file, file.file.name);
          //
        } else {
          //压缩后比原来小，上传压缩后的
          formData.append("file", result, file.file.name);
        }
        uploadImg(formData)
          .then(res => {
            if (res.code == 200) {
              let obj = {
                url: this.IMG_BASR_URL + res.data
              };
              this.shopFrontList = [];
              this.shopFrontList.push(obj);
              file.status = "success";
              file.message = "上传成功";
            }
          })
          .catch(err => {
            file.status = "failed";
            file.message = "上传失败";
          });
      });
    },
    beforeDeleteS(file, index) {
      this.shopFrontList.splice(index.index, 1);
    },

    afterReadE(file) {
      compressImage(file.content).then(result => {
        file.status = "uploading";
        file.message = "上传中...";
        const formData = new FormData();
        if (result.size > file.file.size) {
          //压缩后比原来更大，则将原图上传
          formData.append("file", file.file, file.file.name);
          //
        } else {
          //压缩后比原来小，上传压缩后的
          formData.append("file", result, file.file.name);
        }
        uploadImg(formData)
          .then(res => {
            if (res.code == 200) {
              let obj = {
                url: this.IMG_BASR_URL + res.data
              };
              this.environmentImgList = [];
              this.environmentImgList.push(obj);
              file.status = "success";
              file.message = "上传成功";
            }
          })
          .catch(err => {
            file.status = "failed";
            file.message = "上传失败";
          });
      });
    },

    beforeDeleteE(file, index) {
      this.environmentImgList.splice(index.index, 1);
    },

    onSubmit() {
      this.$router.push({ path: "/index" });
    },

    next(val) {
      this.active = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  overflow: scroll;
  position: relative;
  /* padding-top: 2.8125rem; */
  font-size: 0.875rem;
}
.van-nav-bar-top {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
}
.mg-top-45 {
  margin-top: 2.8125rem;
}
.width-100 {
  width: 100%;
  text-align: center;
}
.loginOut {
  margin: 0 auto;
  width: 80%;
  border-radius: 2.5rem;
}
.van-hairline--top-bottom::after,
.van-hairline-unset--top-bottom::after {
  border-width: 0px 0;
}

.bottom-btn {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  padding: 5px;
  text-align: center;
}
</style>