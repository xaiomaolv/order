<template>
  <div class="container bg-w">
    <van-nav-bar
      title="资质证书"
      left-text
      left-arrow
      class="van-nav-bar-top"
      @click-left="onClickLeft"
    ></van-nav-bar>

    <van-row class="mg-tp-10 main">
      <van-form class="login-form" ref="formTwo">
        <van-field
          size="large"
          required
          clickable
          name="certificatefirstType"
          v-model="storeInfo.certificatefirstType"
          label="营业执照"
          :rules="typeOneRules"
        >
          <template #input>
            <el-select v-model="storeInfo.certificatefirstType" :disabled="disabled" placeholder="---请选择---" style="margin-top:-8px" @change="changeFirst">
              <el-option
                v-for="item in IDTypeOne"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </van-field>

        <van-row v-if="storeInfo.businessImg" :hidden="disabled == false" class="mg-lt-127">
          <van-image width="80" height="80" :src="IMG_BASR_URL+storeInfo.businessImg"/>
        </van-row>
        <!-- <van-row :hidden="disabled" v-if="storeInfo.certificatefirstType != '8'"> -->
        <van-row :hidden="disabled">
          <van-field
            size="large"
            required
            v-model="storeInfo.businessImg"
            :rules="typeImgOne"
            name="businessImg"
            label="证件图片"
          >
            <template #input>
              <van-uploader
                v-model="certificateOne"
                :after-read="afterReadC"
                multiple
                :max-count="1"
                :before-delete="beforeDeleteC"
              />
            </template>
          </van-field>
        </van-row>

        <van-field
          size="large"
          required
          clickable
          name="certificatesecondType"
          v-model="storeInfo.certificatesecondType"
          label="经营许可证"
          :rules="typeTwoRules"
        >
          <template #input>
            <el-select v-model="storeInfo.certificatesecondType" :disabled="disabled" placeholder="---请选择---" style="margin-top:-8px" @change="changeSecond">
              <el-option
                v-for="item in IDTypeTwo"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </van-field>

        <van-row v-if="storeInfo.secondtypeImg" class="mg-10 mg-lt-127" :hidden="disabled == false">
          <van-image width="80" height="80" :src="IMG_BASR_URL+storeInfo.secondtypeImg"/>
        </van-row>

        <!-- <van-row :hidden="disabled" v-if="storeInfo.certificatesecondType !='4' "> -->
        <van-row :hidden="disabled">
          <van-field
            size="large"
            required
            v-model="storeInfo.secondtypeImg"
            :rules="typeImgTwo"
            name="secondtypeImg"
            label="证件图片"
          >
            <template #input>
              <van-uploader
                v-model="certificateTwo"
                :after-read="afterReadD"
                multiple
                :max-count="1"
                :before-delete="beforeDeleteD"
              />
            </template>
          </van-field>
        </van-row>

        <van-field
          size="large"
          readonly
          :rules="typeThreeRules"
          name="specialQualification"
          v-model="storeInfo.specialQualification"
          label="其他"
          @click="showPicker3 = true"
        >
          <template #input>
            <el-select v-model="storeInfo.specialQualification" :disabled="disabled" placeholder="---请选择---" style="margin-top:-8px" @change="changeThird">
              <el-option
                v-for="item in specialQualifications"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </van-field>

        <van-row v-if="storeInfo.thirdImg" class="mg-10 mg-lt-127" :hidden="disabled == false">
          <van-image width="80" height="80" :src="IMG_BASR_URL+storeInfo.thirdImg"/>
        </van-row>
        <!-- <van-row :hidden="disabled" v-if="storeInfo.specialQualification !='2' "> -->
        <van-row :hidden="disabled" v-if="storeInfo.specialQualification">
          <van-field v-model="storeInfo.thirdImg" size="large" name="thirdImg" label="证件图片" :rules="typeImgThree">
            <template #input>
              <van-uploader
                v-model="certificateThree"
                :after-read="afterReadE"
                multiple
                :max-count="1"
                :before-delete="beforeDeleteE"
              />
            </template>
          </van-field>
        </van-row>
      </van-form>
    </van-row>

    <van-row class="bottom-btn">
      <van-button
      round
        v-if="disabled == true"
        style="width:90%;"
        color="#C83C3C"
        class="loginOut"
        @click="onCheck"
      >修改</van-button>
      <van-button
      round
        v-if="disabled == false"
        style="width:90%;"
        color="#C83C3C"
        class="loginOut"
        @click="saveChange"
      >保存</van-button>
    </van-row>
  </div>
</template>

<script>
import { compressImage } from "@/utils/imgbase.js";
import {
  getUserInfo,
  uploadFile,
  deleteImg,
  updateBussiness
} from "@/api/sys.js";

export default {
  data() {
    return {
      storeInfo: {},
      storeInfoOld: {},
      disabled: true,
      certificateOne: [], //证件类型图片
      certificateTwo: [], //证件类型图片
      certificateThree: [], //证件类型图片

      rules: {
        certificatefirstType: [{ required: false, message: "必选", trigger: "change" }],
      },
      typeOneRules: [{ required: true, message: "必选", trigger: "onBlur" }],
      typeImgOne: [{ required: true, message: "必传", trigger: "onBlur" }],
      typeTwoRules: [{ required: true, message: "必选", trigger: "onBlur" }],
      typeImgTwo: [{ required: true, message: "必传", trigger: "onBlur" }],
      typeThreeRules:[{ required: false, message: "必选", trigger: "onBlur" }],
      typeImgThree: [{ required: false, message: "必传", trigger: "onBlur" }],
      IDTypeOne: [
        {
          value: "1",
          label: "营业执照"
        },
        {
          value: "2",
          label: "电子营业执照"
        },
        {
          value: "3",
          label: "事业单位法人证书"
        },
        {
          value: "4",
          label: "民办非企业单位登记证书"
        },
        {
          value: "5",
          label: "社会团体法人登记证书"
        },
        {
          value: "6",
          label: "三小类许可证"
        },
        {
          value: "7",
          label: "双证合一"
        },
        {
          value: "8",
          label: "其他"
        }
      ],
      IDTypeTwo: [
        {
          value: "1",
          label: "食品经营许可证"
        },
        {
          value: "2",
          label: "食品生产许可证"
        },
        {
          value: "3",
          label: "三小类许可证"
        },
        {
          value: "4",
          label: "其他"
        }
      ],
      specialQualifications: [
        {
          value: "1",
          label: "清真食品许可证"
        },
        {
          value: "2",
          label: "其他"
        }
      ]
    };
  },
  created() {
    this.getBussinessInfo()
		
   
		
  },
  methods: {
    getBussinessInfo() {
      getUserInfo().then(res => {
        this.storeInfoOld = JSON.stringify(res.data)
        this.storeInfo = res.data;
        if (res.data.businessImg) {
          let a = { url: this.IMG_BASR_URL + this.storeInfo.businessImg };
          this.certificateOne.push(a);
        }
				if (res.data.secondtypeImg) {
          let b = { url: this.IMG_BASR_URL + this.storeInfo.secondtypeImg };
				this.certificateTwo.push(b);
        }
        if (res.data.thirdImg) {
          let c = { url: this.IMG_BASR_URL + this.storeInfo.thirdImg };
				  this.certificateThree.push(c);
        }
      });
    },

    onClickLeft() {
      this.$router.go(-1);
    },
    onCheck() {
      this.disabled = false;
    },
    saveChange() {
      this.$refs.formTwo.validate().then(() => {
        // if (this.storeInfo.certificatefirstType !='8' ) {
        //   if (!this.storeInfo.businessImg) {
        //     this.$message.warning("请上传营业执照图片")
        //     return
        //   }
        // }
        // if (this.storeInfo.certificatesecondType !='4' ) {
        //   if (!this.storeInfo.secondtypeImg) {
        //     this.$message.warning("请上传经营许可证图片")
        //     return
        //   }
        // }
        // if (this.storeInfo.specialQualification !='2' ) {
        //   if (!this.storeInfo.thirdImg) {
        //     this.$message.warning("请上传其他证件图片")
        //     return
        //   }
        // }
        
        if(JSON.stringify(this.storeInfo) !== this.storeInfoOld){
          // 是否重新审核标识  auditFlag  0-否，1-是
          this.storeInfo.auditFlag = "1"
          updateBussiness(this.storeInfo).then(res => {
            if (res.code == 200) {
              Dialog({ message: res.msg });
              this.certificateOne = []
              this.certificateTwo = []
              this.certificateThree = []
              this.getBussinessInfo();
            }
          });
        }else{
          this.$message.warning("数据没有修改，请先修改数据再提交！")
        }
        this.disabled = true;
      });
    },

    afterReadC(file) {
      compressImage(file.content).then(result => {
        const formData = new FormData();
        if (result.size > file.file.size) {
          //压缩后比原来更大，则将原图上传
          formData.append("file", file.file, file.file.name);
          //
        } else {
          //压缩后比原来小，上传压缩后的
          formData.append("file", result, file.file.name);
        }
        uploadFile(formData)
          .then(res => {
            if (res.code == 200) {
              this.storeInfo.businessImg = res.data.fileName;
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
    beforeDeleteC(file, index) {
      this.certificateOne.splice(index.index, 1);
      this.storeInfo.businessImg = ''
      // this.deleteImgUrl();
    },

    afterReadD(file) {
      compressImage(file.content).then(result => {
        const formData = new FormData();
        if (result.size > file.file.size) {
          //压缩后比原来更大，则将原图上传
          formData.append("file", file.file, file.file.name);
          //
        } else {
          //压缩后比原来小，上传压缩后的
          formData.append("file", result, file.file.name);
        }
        uploadFile(formData)
          .then(res => {
            if (res.code == 200) {
              this.storeInfo.secondtypeImg = res.data.fileName;
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

    beforeDeleteD(file, index) {
      this.certificateTwo.splice(index.index, 1);
      this.storeInfo.secondtypeImg = ''
      // this.deleteImgUrl();
    },

    afterReadE(file) {
      compressImage(file.content).then(result => {
        // file.status = "uploading";
        // file.message = "上传中...";
        const formData = new FormData();
        if (result.size > file.file.size) {
          //压缩后比原来更大，则将原图上传
          formData.append("file", file.file, file.file.name);
          //
        } else {
          //压缩后比原来小，上传压缩后的
          formData.append("file", result, file.file.name);
        }
        uploadFile(formData)
          .then(res => {
            if (res.code == 200) {
              //   let obj = {
              //     url: this.IMG_BASR_URL + res.data.fileName
              //   };
              //   this.environmentImgList = [];
              this.storeInfo.thirdImg = res.data.fileName;
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
      this.certificateThree.splice(index.index, 1);
      this.storeInfo.thirdImg = ''
      // this.deleteImgUrl();
    },
    changeFirst(val){
      // if (val == '8') {
      //   this.storeInfo.businessImg = ''
      //   this.certificateOne = []
      // }
    },
    changeSecond(val){
      // if (val == '4') {
      //   this.storeInfo.secondtypeImg = ''
      //   this.certificateTwo = []
      // }
    },
    changeThird(val){
      // if (val == '2') {
      //   this.storeInfo.thirdImg = ''
      //   this.certificateThree = []
      // }
    },
  }
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
.main /deep/ .el-form-item__label {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 16px !important;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.mg-lt-127{
  margin-left: 127px;
}
</style>
