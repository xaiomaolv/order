<template>
  <div class="container">
    <van-nav-bar
      title="商家资料"
      left-text
      left-arrow
      class="van-nav-bar-top"
      @click-left="onClickLeft"
    ></van-nav-bar>
    <van-row class="main"  style="padding-bottom: 30px;">
      <van-form class="login-form" ref="form">
        <van-field
          size="large"
          required
          :readonly="disabled"
          input-align="right"
          v-model="storeInfo.name"
          name="name"
          label="门店名称"
          :rules="nameRules"
        >
          <div slot="right-icon" v-if="disabled == false">
            <van-icon name="edit" />
          </div>
        </van-field>

        <van-field
          size="large"
          required
          :readonly="disabled"
          input-align="right"
          v-model="storeInfo.chargePhone"
          name="chargePhone"
          label="门店电话"
          :rules="chargePhoneRules"
        >
          <div slot="right-icon" v-if="disabled == false">
            <van-icon name="edit" />
          </div>
        </van-field>
        <van-field
          size="large"
          name="address"
          label="  "
          v-if="disabled == false"
        >
          <template #input>
            <van-button
              size="small"
              class="button"
              type="warning"
              @click="showMap = true"
              native-type="button"
              >门店地址定位</van-button
            >
          </template>
        </van-field>
        <van-field
          size="large"
          input-align="right"
          required
          :readonly="disabled"
          v-model="storeInfo.address"
          name="address"
          label="门店地址"
          placeholder="请定位"
          :rules="addressRules"
        >
          <div slot="right-icon" v-if="disabled == false">
            <van-icon name="edit" />
          </div>
        </van-field>
        <van-field
          size="large"
          required
          input-align="right"
          readonly
          v-model="storeInfo.areaCode"
          name="areaCode"
          label="区域地址"
          placeholder="请选择"
          :rules="areaCodeRules"
        >
          <template #input>
            <el-select
              v-model="storeInfo.areaCode"
              placeholder="请选择"
              disabled
              style="margin-top: -8px"
            >
              <el-option
                v-for="item in areaList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </van-field>

        <van-field
          size="large"
          :readonly="disabled"
          v-model="storeInfo.doorPlate"
          name="doorPlate"
          label="详细地址"
          placeholder="请填写详细地址，如xxx区xx楼xx号"
          input-align="right"
        >
          <div slot="right-icon" v-if="disabled == false">
            <van-icon name="edit" />
          </div>
        </van-field>

        <van-field
          :hidden="disabled == false"
          size="large"
          required
          clickable
          readonly
          name="businessCategory"
          :value="categoryText"
          label="经营品类"
          placeholder="点击选择"
          is-link
          :rules="categoryRules"
          @click="goTo"
          input-align="right"
        >
          <div slot="right-icon" v-if="disabled == false">
            <van-icon name="edit" />
          </div>
        </van-field>

        <van-field
          name="shopFront"
          size="large"
          label="门店logo"
          required
          :rules="logoRules"
          input-align="right"
        >
          <template #input>
            <van-row :hidden="disabled == false">
              <!-- <van-image
                width="80"
                height="80"
                :src="IMG_BASR_URL + storeInfo.logo"
              /> -->
              <auth-img
                :authSrc="IMG_BASR_URL + storeInfo.logo"
                style="width: 80px; height: 80px"
                v-if="flag"
              ></auth-img>
            </van-row>
            <van-row :hidden="disabled">
              <van-uploader
                v-model="shopFrontList"
                :after-read="afterReadA"
                :max-count="1"
                :before-delete="beforeDeleteA"
              />
            </van-row>
          </template>
        </van-field>

        <van-field
          name="shopFront"
          size="large"
          label="店内环境"
          :rules="storeImageRules"
          input-align="right"
        >
          <template #input>
            <van-row :hidden="disabled == false">
              <!-- <van-image
                class="mg-rt-5"
                width="80"
                height="80"
                v-for="(img, index) in storeInfo.storeImageList"
                :key="index"
                :src="IMG_BASR_URL + img"
              /> -->
              <auth-img
                class="mg-rt-5"
                style="width: 80px; height: 80px"
                v-for="(img, index) in storeInfo.storeImageList"
                :key="index"
                :authSrc="IMG_BASR_URL + img"
              ></auth-img>
            </van-row>
            <van-row :hidden="disabled">
              <van-uploader
                v-model="environmentImgList"
                :after-read="afterReadB"
                multiple
                :max-count="5"
                :before-delete="beforeDeleteB"
              />
            </van-row>
          </template>
        </van-field>
        <van-field
          size="large"
          required
          clickable
          name="certificatefirstType"
          v-model="storeInfo.certificatefirstType"
          label="营业执照"
          :rules="typeOneRules"
          input-align="right"
        >
          <template #input>
            <el-select
              v-model="storeInfo.certificatefirstType"
              :disabled="disabled"
              placeholder="---请选择---"
              style="margin-top: -8px"
            >
              <el-option
                v-for="item in IDTypeOne"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </van-field>

        <van-field
          size="large"
          required
          v-model="storeInfo.businessImg"
          :rules="typeImgOne"
          name="businessImg"
          label="证件图片"
          input-align="right"
        >
          <template #input>
            <van-row :hidden="disabled">
              <van-uploader
                v-model="certificateOne"
                :after-read="afterReadC"
                multiple
                :max-count="1"
                :before-delete="beforeDeleteC"
              />
            </van-row>
            <van-row v-if="storeInfo.businessImg" :hidden="disabled == false">
              <!-- <van-image
                width="80"
                height="80"
                :src="IMG_BASR_URL + storeInfo.businessImg"
              /> -->
              <auth-img
                style="width: 80px; height: 80px"
                :authSrc="IMG_BASR_URL + storeInfo.businessImg"
              ></auth-img>
            </van-row>
          </template>
        </van-field>
        <van-field
          size="large"
          required
          clickable
          name="certificatesecondType"
          v-model="storeInfo.certificatesecondType"
          label="经营许可证"
          :rules="typeTwoRules"
          input-align="right"
        >
          <template #input>
            <el-select
              v-model="storeInfo.certificatesecondType"
              :disabled="disabled"
              placeholder="---请选择---"
              style="margin-top: -8px"
            >
              <el-option
                v-for="item in IDTypeTwo"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </van-field>
        <van-field
          size="large"
          required
          v-model="storeInfo.secondtypeImg"
          :rules="typeImgTwo"
          name="secondtypeImg"
          label="证件图片"
          input-align="right"
        >
          <template #input>
            <van-row v-if="storeInfo.secondtypeImg" :hidden="disabled == false">
              <!-- <van-image
                width="80"
                height="80"
                :src="IMG_BASR_URL + storeInfo.secondtypeImg"
              /> -->
              <auth-img
                style="width: 80px; height: 80px"
                :authSrc="IMG_BASR_URL + storeInfo.secondtypeImg"
              ></auth-img>
            </van-row>
            <van-row :hidden="disabled">
              <van-uploader
                v-model="certificateTwo"
                :after-read="afterReadD"
                multiple
                :max-count="1"
                :before-delete="beforeDeleteD"
              />
            </van-row>
          </template>
        </van-field>

        <van-field
          size="large"
          readonly
          :rules="typeThreeRules"
          name="specialQualification"
          v-model="storeInfo.specialQualification"
          label="其他"
          input-align="right"
        >
          <template #input>
            <el-select
              v-model="storeInfo.specialQualification"
              :disabled="disabled"
              placeholder="---请选择---"
              style="margin-top: -8px"
            >
              <el-option
                v-for="item in specialQualifications"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </van-field>
        <van-row
          :hidden="disabled == false"
          v-if="storeInfo.specialQualification && storeInfo.thirdImg"
        >
          <van-field
            v-model="storeInfo.thirdImg"
            size="large"
            name="thirdImg"
            label="证件图片"
            :rules="typeImgThree"
            input-align="right"
          >
            <template #input>
              <van-row v-if="storeInfo.thirdImg" :hidden="disabled == false">
                <!-- <van-image
                  width="80"
                  height="80"
                  :src="IMG_BASR_URL + storeInfo.thirdImg"
                /> -->
                <auth-img
                  style="width: 80px; height: 80px"
                  :authSrc="IMG_BASR_URL + storeInfo.thirdImg"
                ></auth-img>
              </van-row>
            </template>
          </van-field>
        </van-row>
        <van-row
          :hidden="disabled == true"
          v-if="storeInfo.specialQualification"
        >
          <van-field
            v-model="storeInfo.thirdImg"
            size="large"
            name="thirdImg"
            label="证件图片"
            :rules="typeImgThree"
            input-align="right"
          >
            <template #input>
              <van-row :hidden="disabled">
                <van-uploader
                  v-model="certificateThree"
                  :after-read="afterReadE"
                  multiple
                  :max-count="1"
                  :before-delete="beforeDeleteE"
                />
              </van-row>
            </template>
          </van-field>
        </van-row>
      </van-form>
    </van-row>

    <van-row class="bottom-btn">
      <van-button
        v-if="disabled == true"
        style="width: 90%"
        color="#C83C3C"
        class="loginOut"
        @click="onCheck"
        round
        >修改</van-button
      >
      <van-button
        round
        v-if="disabled == false"
        style="width: 90%"
        color="#C83C3C"
        class="loginOut"
        @click="saveChange"
        >保存</van-button
      >
    </van-row>

    <!-- 弹出地图选择(这里用的也是vant的弹出组件) -->
    <van-popup
      v-model="showMap"
      position="right"
      :style="{ height: '100%', width: '100%' }"
    >
      <qq-map
        :map-key="mapKey"
        :key-name="keyName"
        @callback="callback"
        @hideMap="showMap = false"
      ></qq-map>
    </van-popup>
    <!-- 经营品类 -->
    <van-popup
      v-model="showTree"
      position="right"
      :style="{ height: '100%', width: '100%' }"
    >
      <div class="container bg-w">
        <van-nav-bar
          title="经营品类"
          left-arrow
          class="van-nav-bar-top"
          @click-left="showTree = false"
        ></van-nav-bar>
        <van-tree-select
          :items="items"
          :main-active-index="mainActiveIndex"
          :active-id="activeIds"
          @navclick="onNavClick"
          @itemclick="onItemClick"
        />

        <div class="fixed-bottom row">
          <div class="pd-tb-15 pd-lr-15">
            <van-button
              style="width: 100%"
              color="#C83C3C"
              class="loginOut mg-tp-10"
              @click="onSubmitTree"
              round
              >确认
            </van-button>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  compressImage,
  convertBase64UrlToBlob,
  blobToFile,
  img_compress,
  requestImage,
} from "@/utils/imgbase.js";
import {
  getUserInfo,
  uploadFile,
  deleteImg,
  updateBussiness,
  getTypeTree,
  getAreaList,
} from "@/api/sys.js";
import QqMap from "@/views/common/map/BaiduMap";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { Dialog, Notify } from "vant";
import pictureCompress from "picture-compressor-plus";
import AuthImg from "../../components/authImg.vue";

export default {
  components: {
    QqMap,
    Treeselect,
    AuthImg,
  },
  data() {
    return {
      expandedKeys: [],
      showMap: false,
      address_info: {},
      // mapKey: "HVKBZ-PBFKP-5WVDL-LTBN7-6D6Q6-B5BII",
      // keyName: "ICBC_ORDER",
      mapKey: "44YBZ-MTPWD-2HW47-PKN4O-FDR4E-QAFXB", //工行地图
      keyName: "彩云点餐公众号地图",
      disabled: true,
      typeList: [],
      normalizer(node) {
        return {
          id: node.id,
          label: node.text,
          children: node.children,
        };
      },
      storeInfo: {},
      storeInfoOld: {},
      // 区域地址
      areaList: [],
      shopFrontList: [], //门脸图片
      environmentImgList: [], //店内环境
      imgList: [], //店内环境
      pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
      nameRules: [
        {
          required: true,
          message: "必填",
        },
      ],
      chargePhoneRules: [
        {
          required: true,
          message: "",
          trigger: "onBlur",
        },
        {
          // 自定义校验规则
          validator: (value) => {
            let tel = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
            return tel.test(value);
          },
          message: "号码格式不正确或者位数不正确",
          trigger: "onBlur",
        },
      ],
      addressRules: [
        {
          required: true,
          message: "请选择地址",
          trigger: "onBlur",
        },
      ],
      categoryRules: [
        {
          required: true,
          message: "必选",
          trigger: "onBlur",
        },
      ],
      logoRules: [
        {
          required: true,
          message: "必传",
          trigger: "onBlur",
        },
      ],
      storeImageRules: [
        {
          required: false,
          message: "必传",
          trigger: "onBlur",
        },
      ],
      areaCodeRules: [{ required: true, message: "必选", trigger: "onBlur" }],
      typeOneRules: [{ required: true, message: "必选", trigger: "onBlur" }],
      typeImgOne: [{ required: true, message: "必传", trigger: "onBlur" }],
      typeTwoRules: [{ required: true, message: "必选", trigger: "onBlur" }],
      typeImgTwo: [{ required: true, message: "必传", trigger: "onBlur" }],
      typeThreeRules: [{ required: false, message: "必选", trigger: "onBlur" }],
      typeImgThree: [{ required: false, message: "必传", trigger: "onBlur" }],
      IDTypeOne: [
        {
          value: "1",
          label: "营业执照",
        },
        {
          value: "2",
          label: "电子营业执照",
        },
        {
          value: "3",
          label: "事业单位法人证书",
        },
        {
          value: "4",
          label: "民办非企业单位登记证书",
        },
        {
          value: "5",
          label: "社会团体法人登记证书",
        },
        {
          value: "6",
          label: "三小类许可证",
        },
        {
          value: "7",
          label: "双证合一",
        },
        {
          value: "8",
          label: "其他",
        },
      ],
      IDTypeTwo: [
        {
          value: "1",
          label: "食品经营许可证",
        },
        {
          value: "2",
          label: "食品生产许可证",
        },
        {
          value: "3",
          label: "三小类许可证",
        },
        {
          value: "4",
          label: "其他",
        },
      ],
      specialQualifications: [
        {
          value: "1",
          label: "清真食品许可证",
        },
        {
          value: "2",
          label: "其他",
        },
      ],
      // 经营品类
      showTree: false,
      resultValue: "", //初始选中数据
      items: [],
      // 左侧高亮元素的index
      mainActiveIndex: 0,
      // 被选中元素的id
      activeIds: [],
      activeData: [],
      businessCategoryList: [],
      // 选择的分类
      category: [],
      categoryText: "",
      // 定位城市名
      cityName: "",
      certificateOne: [], //证件类型图片
      certificateTwo: [], //证件类型图片
      certificateThree: [], //证件类型图片
      flag:false
    };
  },
  watch: {
    cityName: function (cityName) {
      this.areaList.forEach((el) => {
        if (el.text == cityName) {
          this.storeInfo.areaCode = el.value;
        }
      });
    },
  },
  computed: {},
  created() {
    this.getAreaList();
    this.getTreeselect();
    this.getBussinessInfo();
  },
  methods: {
    getBussinessInfo() {
      this.storeInfo = {}
      getUserInfo().then((res) => {
        this.flag = true
        this.storeInfo = res.data;
        this.storeInfoOld = JSON.stringify(res.data);
        // // 判断vuex category里面是否有值，有值就取值
        // if(this.$store.state.sys.category){
        // 	this.storeInfo.businessCategory = this.$store.state.sys.category
        // }
        this.storeInfo.businessCategory = res.data.businessCategory;
        // this.category = res.data.businessCategoryList.join(',')
        this.category = res.data.businessCategory;
        let arr = [];
        let typeList = this.$store.state.sys.categoryTreeData;
        typeList.forEach((el) => {
          if (el.children) {
            // 合并所有二级分类数组
            arr = [...arr, ...el.children];
          }
        });

        let textArr = [];
        let categoryList = this.category
          ? this.category.split(",")
          : this.storeInfo.businessCategory.split(",");
        arr.forEach((e) => {
          categoryList.forEach((t) => {
            if (e.id == t) {
              textArr.push(e.text);
            }
          });
        });
        // 选中分类显示
        if (textArr.length != 0) {
          this.categoryText = textArr.join("/");
        }
      });
    },
    // 区域地址
    getAreaList() {
      getAreaList("sys_area").then((res) => {
        if (res.code == 200) {
          res.data.forEach((item) => {
            this.areaList.push({
              value: item.dictValue,
              text: item.dictLabel,
            });
          });
        }
      });
    },
    // 分类选择
    goTo() {
      if (!this.disabled) {
        // this.$router.push({
        // 	path: '/busCategory',
        // 	query: {
        // 	category: this.storeInfo.businessCategory
        // 	}
        // })
        this.showTree = true;
      }
    },
    /** 查询经营分类结构树 */
    getTreeselect() {
      getTypeTree().then((response) => {
        if (response.code == 200) {
          this.typeList = response.data[0].children;
          this.items = response.data[0].children;
          this.$store.commit(
            "sys/SET_CATEGORYTREEDATA",
            response.data[0].children
          );
        }
      });
    },

    onClickLeft() {
      this.$router.go(-1);
    },
    onCheck() {
      let that = this;
      this.disabled = false;
      if (this.category) {
        let arr = [];
        this.category.split(",").forEach((el) => {
          arr.push(Number(el));
        });

        that.activeIds = arr;
      }

      // 左侧选中索引处理
      let arr = that.items;

      arr.forEach((el, index) => {
        if (el.children) {
          el.children.forEach((item) => {
            if (that.activeIds.length == 0) return;
            if (el.children.some((item) => item.id == that.activeIds[0])) {
              that.mainActiveIndex = Number(index);
            }
          });
        }
      });
      requestImage(this.IMG_BASR_URL + this.storeInfo.logo).then((result) => {
        let str = {
          content: result,
        };
        this.shopFrontList.push(str);
      });
      if (this.storeInfo.storeImageList.length > 0) {
        this.storeInfo.storeImageList.forEach((ele) => {
          requestImage(this.IMG_BASR_URL + ele).then((result) => {
            let str = {
              content: result,
            };
            this.environmentImgList.push(str);
          });
        });
      }
      if (this.storeInfo.businessImg) {
        requestImage(this.IMG_BASR_URL + this.storeInfo.businessImg).then(
          (result) => {
            let str = {
              content: result,
            };
            this.certificateOne.push(str);
          }
        );
      }
      if (this.storeInfo.secondtypeImg) {
        requestImage(this.IMG_BASR_URL + this.storeInfo.secondtypeImg).then(
          (result) => {
            let str = {
              content: result,
            };
            this.certificateTwo.push(str);
          }
        );
      }
      if (this.storeInfo.thirdImg) {
        requestImage(this.IMG_BASR_URL + this.storeInfo.thirdImg).then(
          (result) => {
            let str = {
              content: result,
            };
            this.certificateThree.push(str);
          }
        );
      }
    },

    saveChange() {
      this.$refs.form
        .validate()
        .then(() => {
          this.disabled = true;
          if (JSON.stringify(this.storeInfo) !== this.storeInfoOld) {
            // 是否重新审核标识  auditFlag  0-否，1-是
            this.storeInfo.auditFlag = "1";
            updateBussiness(this.storeInfo).then((res) => {
              if (res.code == 200) {
                // this.$message({
                //   message: "修改成功，需审核后生效",
                //   type: "success",
                // });
                Dialog({ message: res.msg });
                this.shopFrontList = [];
                this.environmentImgList = [];
                this.certificateOne = [];
                this.certificateTwo = [];
                this.certificateThree = [];
                this.getBussinessInfo();
              }
            });
          } else {
            this.$message.warning("数据没有修改，请先修改数据再提交！");
          }
        })
        .catch({});
    },

    afterReadA(file) {
      // compressImage(file.content).then(result => {
      // 	// file.status = "uploading";
      // 	// file.message = "上传中...";
      // 	const formData = new FormData();
      // 	if (result.size > file.file.size) {
      // 		//压缩后比原来更大，则将原图上传
      // 		formData.append("file", file.file, file.file.name);
      // 		//
      // 	} else {
      // 		//压缩后比原来小，上传压缩后的
      // 		formData.append("file", result, file.file.name);
      // 	}
      // 	uploadFile(formData)
      // 		.then(res => {
      // 			if (res.code == 200) {
      // 				this.storeInfo.logo = res.data.fileName;
      // 				file.status = "success";
      // 				file.message = "上传成功";
      // 			}
      // 		})
      // 		.catch(err => {
      // 			file.status = "failed";
      // 			file.message = "上传失败";
      // 		});
      // });
      var that = this;
      var files = file.file;
      var reads = new FileReader();
      reads.readAsDataURL(files);
      reads.onload = function () {
        pictureCompress({
          img: this.result,
          width: 400,
          height: 400,
          fit: "fill",
        }).then((res) => {
          var img = new Image();
          img.src = res.img;
          let blob = convertBase64UrlToBlob(img.src);
          var filed = blobToFile(blob);
          const formData = new FormData();
          formData.append("file", filed, file.file.name);
          console.log(formData);
          uploadFile(formData)
            .then((res) => {
              console.log("上传图片结果报文", res);
              if (res.code == 200) {
                that.storeInfo.logo = res.data.fileName;
                file.status = "success";
                file.message = "上传成功";
              } else {
                file.status = "failed";
                file.message = "上传失败";
              }
            })
            .catch((err) => {
              console.log(err, "err");
              file.status = "failed";
              file.message = "上传失败";
            });
        });
      };
    },
    beforeDeleteA(file, index) {
      this.shopFrontList.splice(index.index, 1);
    },

    afterReadB(file) {
      var deviceFile = [];
      if (Array.isArray(file)) {
        //该组件单选是对象，多选是数组
        deviceFile = file;
        deviceFile.forEach((item, index) => {
          img_compress(item).then((result) => {
            this.uploadImage(item, result);
          });
        });
      } else {
        deviceFile.push(file);
        img_compress(deviceFile[0]).then((result) => {
          this.uploadImage(deviceFile[0], result);
        });
      }
    },
    uploadImage(file, formData) {
      var that = this;
      uploadFile(formData)
        .then((res) => {
          if (res.code == 200) {
            this.storeInfo.storeImageList.push(res.data.fileName);
            file.status = "success";
            file.message = "上传成功";
          }
        })
        .catch((err) => {
          file.status = "failed";
          file.message = "上传失败";
        });
    },
    beforeDeleteB(file, index) {
      Dialog.confirm({
        title: "提示",
        message: "是否确认删除该张图片?",
      })
        .then(() => {
          this.environmentImgList.splice(index.index, 1);
          this.storeInfo.storeImageList.splice(index.index, 1);
        })
        .catch(() => {
          // on cancel
        });
    },

    afterReadC(file) {
      compressImage(file.content).then((result) => {
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
          .then((res) => {
            if (res.code == 200) {
              this.storeInfo.businessImg = res.data.fileName;
              file.status = "success";
              file.message = "上传成功";
            }
          })
          .catch((err) => {
            file.status = "failed";
            file.message = "上传失败";
          });
      });
    },
    beforeDeleteC(file, index) {
      this.certificateOne.splice(index.index, 1);
      this.storeInfo.businessImg = "";
      // this.deleteImgUrl();
    },

    afterReadD(file) {
      compressImage(file.content).then((result) => {
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
          .then((res) => {
            if (res.code == 200) {
              this.storeInfo.secondtypeImg = res.data.fileName;
              file.status = "success";
              file.message = "上传成功";
            }
          })
          .catch((err) => {
            file.status = "failed";
            file.message = "上传失败";
          });
      });
    },

    beforeDeleteD(file, index) {
      this.certificateTwo.splice(index.index, 1);
      this.storeInfo.secondtypeImg = "";
      // this.deleteImgUrl();
    },

    afterReadE(file) {
      compressImage(file.content).then((result) => {
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
          .then((res) => {
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
          .catch((err) => {
            file.status = "failed";
            file.message = "上传失败";
          });
      });
    },

    beforeDeleteE(file, index) {
      this.certificateThree.splice(index.index, 1);
      this.storeInfo.thirdImg = "";
      // this.deleteImgUrl();
    },

    //选择定位
    checkMap() {
      var backUrl = window.location.href;
      window.location.href =
        "https://apis.map.qq.com/tools/locpicker?search=1&type=0&backurl=" +
        backUrl +
        "&key=" +
        this.mapKey +
        "&referer=" +
        this.keyName;
    },
    // 打开地图
    openMap() {
      if (!this.disabled) {
        this.showMap = true;
      }
    },

    // 地图选择回调
    callback(mapData) {
      this.showMap = false;
      this.storeInfo.lng = mapData.latlng.lng;
      this.storeInfo.lat = mapData.latlng.lat;
      this.storeInfo.address = mapData.poiaddress;
      this.cityName = mapData.cityname;
    },
    // 左侧点击
    onNavClick(index) {
      this.mainActiveIndex = index;
      this.activeIds = [];
    },
    // 右侧点击
    onItemClick(data) {
      // 深拷贝
      let activeArr = JSON.parse(JSON.stringify(this.activeIds));
      // 判断是否已经选中，如选中就取消选中
      if (activeArr.some((e) => e == data.id)) {
        activeArr.forEach((el, index) => {
          if (el == data.id) {
            // 删除数组元素
            activeArr.splice(index, 1);
          }
        });
      } else {
        activeArr.push(data.id);
      }

      this.activeIds = activeArr;
      this.storeInfo.businessCategoryList = this.activeIds;
    },
    // 确认
    onSubmitTree() {
      this.category = this.activeIds.join(",");
      this.showTree = false;
      if (this.category) {
        this.storeInfo.businessCategory = this.category;
      }
      let arr = [];
      this.typeList.forEach((el) => {
        if (el.children) {
          // 合并所有二级分类数组
          arr = [...arr, ...el.children];
        }
      });
      let textArr = [];
      let categoryList = this.category
        ? this.category.split(",")
        : this.storeInfo.businessCategory.split(",");

      arr.forEach((e) => {
        categoryList.forEach((t) => {
          if (e.id == t) {
            textArr.push(e.text);
          }
        });
      });
      // 选中分类显示
      if (textArr.length != 0) {
        this.categoryText = textArr.join("/");
      }
    },
  },
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
.main {
  margin-bottom: 60px;
}
.button {
  padding: 3px 5px;
  background: #ff976a;
  border-radius: 5px;
  color: #ffffff;
}
.bottom-btn {
  position: fixed;
  bottom: 5px;
  left: 0;
  right: 0;
  padding: 5px;
  text-align: center;
}
.mg-tp-50 {
  margin-top: 50px;
}
.login-form >>> .el-input.is-disabled .el-input__inner {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #323233;
  cursor: not-allowed;
}

:deep .el-input__inner{
	outline: none;
	border: 0;
	padding-left: 0;
	background: none;
	text-align: right;
}
:deep .el-input.is-disabled .el-input__inner {
    background: none;
    border: none;
    color: #646566;
    cursor: not-allowed;
}
:deep .el-select{
	width: 100%;
}
:deep .el-select .el-input .el-select__caret {
	font-size: 18px;
}
</style>
