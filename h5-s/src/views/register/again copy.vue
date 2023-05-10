<template>
  <div class="container">
    <van-nav-bar title="注册信息修改" left-text left-arrow class="van-nav-bar-top" @click-left="onClickLeft" style="z-index: 1111;"></van-nav-bar>
    <van-form class="login-form" ref="form">
      <van-row class="main pd-tp-10">
        <el-steps :active="active" align-center finish-status="success" class="theSteps" style="z-index:1111">
          <el-step title="账号信息"></el-step>
          <el-step title="门店信息"></el-step>
          <el-step title="资质信息"></el-step>
          <el-step title="负责人信息"></el-step>
        </el-steps>

        <van-tabs v-model="active">
          <van-tab>
            <van-form class="login-form cellGroup" ref="formZero">
              <!-- <van-cell-group inset class="ft-se-20"> -->
                <van-field
                  size="large"
                  label="手机号码:"
                  required
                  type="tel"
                  placeholder="请输入手机号码"
                  v-model="infoForm.phone"
                  name="phone"
                  :rules="telRules"
                />
                <van-cell-group inset class="">
                <van-field
                  size="large"
                  label="验证码:"
                  required
                  type="number"
                  maxlength="6"
                  placeholder="请输入验证码"
                  v-model="infoForm.code"
                  name="code"
                  center
                  clearable
                  :rules="codeRules"
                >
                  <!-- <template #button>
                    <div class="button" v-if="show" @click="sendSms">发送验证码</div>
                    <div class="button" v-if="!show">{{count}} S</div>
                  </template> -->
                  <template #button>
                    <van-button size="small" v-if="show" class="button" native-type="button" type="warning" @click="sendSms">发送验证码</van-button>
                    <van-button size="small" v-if="!show" class="button" color="#ff976a">{{count}} S</van-button>
                  </template>
                </van-field>
                </van-cell-group>

                <van-field
                  size="large"
                  name="password"
                  required
                  clearable
                  v-model="infoForm.password"
                  ref="password"
                  label="密码:"
                  :type="passwordType"
                  placeholder="请输入密码"
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
                  v-model="infoForm.confirmPwd"
                  label="确认密码:"
                  placeholder="请再次确认密码"
                  ref="confirmPwd"
                  :type="passwordType"
                  minlength="6"
                  onkeyup="this.value=this.value.replace(/\s+/g,'')"
                  :rules="[{ 
                                required: true,
                                trigger:'onBlur', 
                                message: '' 
                            },
                  { validator, message: '两次密码不一致' }]"
                >
                  <template #button>
                    <span class="show-pwd" @click="showPwd">
                      <van-icon :name="passwordType === 'password' ? 'closed-eye' : 'eye-o'"/>
                    </span>
                  </template>
                </van-field>
              
              <van-row class="mg-tp-30 tx-ct" v-if="active==0">
                <van-button color="#C83C3C" class="loginOut" :disabled="disabled" :loading="loading" @click="nextStep(1)">下一步</van-button>
              </van-row>
              <van-row class="mg-tp-20 ft-se-14 mg-lt-20">
                <van-col>
                  <van-checkbox v-model="checked" checked-color="#C83C3C">我已阅读并同意</van-checkbox>
                </van-col>
                <van-col>
                  <i style="color:#C83C3C;margin-top:40px" @click="showPopup=true">《彩云点餐商家版用户协议》</i>
                </van-col>
              </van-row>
            </van-form>
          </van-tab>
          <van-tab>
            <van-form class="login-form" ref="formOne">
              <van-field
                size="large"
                required
                v-model="infoForm.name"
                name="name"
                label="门店名称"
                placeholder="请填写门店名称"
                :rules="nameRules"
              />

              <van-field
                size="large"
                required
                v-model="infoForm.chargePhone"
                name="chargePhone"
                label="门店电话"
                placeholder="请填写"
                :rules="chargePhoneRules"
              />
              <!-- <van-field
                size="large"
                required
                readonly
                v-model="infoForm.address"
                name="address"
                label="门店地址"
                placeholder="请定位"
                :rules="addressRules"
                is-link
                @click="showMap = true"
              /> -->
              <van-field
                size="large"
                name="address"
                label="  "
              >
                <template #input>
                  <van-button size="small" class="button" type="warning" @click="showMap = true" native-type="button">门店地址定位</van-button>
                </template>
              </van-field>
              <van-field
                size="large"
                required
                v-model="infoForm.address"
                name="address"
                label="门店地址"
                placeholder="请定位"
                :rules="addressRules"
              >
              </van-field>
              <van-field
                size="large"
                required
                readonly
                v-model="infoForm.areaCode"
                name="areaCode"
                label="区域地址"
                placeholder="请选择"
                :rules="areaCodeRules"
              >
              <template #input>
                  <el-select v-model="infoForm.areaCode" placeholder="请选择" disabled style="margin-top:-8px">
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
                v-model="infoForm.doorPlate"
                name="doorPlate"
                label="详细地址"
                placeholder="请填写详细地址"
              />
              <van-field size="large" required clickable readonly name="businessCategory"
                :value="categoryText" label="经营品类" placeholder="点击选择" is-link
                :rules="categoryRules" @click="goTo" input-align="left">
                <template #input>

                </template>
              </van-field>

              <van-field
                size="large"
                required
                v-model="infoForm.logo"
                :rules="logoRules"
                name="shopFront"
                label="门店logo"
              >
                <template #input>
                  <van-uploader
                    v-model="shopFrontList"
                    :after-read="afterReadA"
                    multiple
                    :max-count="1"
                    :before-delete="beforeDeleteA"
                  />
                </template>
              </van-field>

              <van-field size="large" name="shopFront" label="店内环境">
                <template #input>
                  <van-uploader
                    v-model="storeImgList"
                    :after-read="afterReadB"
                    multiple
                    :max-count="5"
                    :before-delete="beforeDeleteB"
                  />
                </template>
              </van-field>

              <van-row class="mg-tp-30 tx-ct" v-if="active==1">
                <!-- <van-button
                  style="width:30%;margin-right:20px;"
                  color="#C83C3C"
                  class="loginOut"
                  @click="lastStep(0)"
                >上一步</van-button> -->
                <van-button
                  color="#C83C3C"
                  class="loginOut"
                  @click="nextStep(2)"
                >下一步</van-button>
                <!-- <van-button color="#C83C3C" class="loginOut" @click="nextStep(1)">下一步</van-button> -->
              </van-row>
            </van-form>
          </van-tab>

          <van-tab>
            <van-form class="login-form" ref="formTwo">
              <van-field
                size="large"
                clickable
                required
                name="certificatefirstType"
                v-model="infoForm.certificatefirstType"
                label="营业执照"
                :rules="typeOneRules"
              >
                <template #input>
                  <el-select v-model="infoForm.certificatefirstType" placeholder="---请选择---" style="margin-top:-8px" @change="changeFirst">
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
                :rules="typeImgOne"
                v-model="infoForm.businessImg"
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

              <van-field
                size="large"
                clickable
                required
                name="certificatesecondType"
                v-model="infoForm.certificatesecondType"
                label="经营许可证"
                :rules="typeTwoRules"
              >
                <template #input>
                  <el-select v-model="infoForm.certificatesecondType" placeholder="---请选择---" style="margin-top:-8px" @change="changeSecond">
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
                :rules="typeImgTwo"
                v-model="infoForm.secondtypeImg"
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

              <van-field
                size="large"
                readonly
                clickable
                name="specialQualification"
                v-model="infoForm.specialQualification"
                label="其他"
                :rules="typeThreeRules"
                @click="showPicker3 = true"
              >
                <template #input>
                  <el-select v-model="infoForm.specialQualification" placeholder="---请选择---" style="margin-top:-8px" @change="changeThird">
                    <el-option
                      v-for="item in specialQualifications"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </van-field>

              <van-field v-if="infoForm.specialQualification" v-model="infoForm.thirdImg" size="large" name="thirdImg" label="证件图片" :rules="typeImgThree">
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

              <van-row class="mg-tp-30 tx-ct" v-if="active==2">
                <van-button
                  style="width:30%;margin-right:20px;"
                  color="#C83C3C"
                  class="loginOut"
                  @click="lastStep(1)"
                >上一步</van-button>
                <van-button
                  style="width:30%;"
                  color="#C83C3C"
                  class="loginOut"
                  @click="nextStep(3)"
                >下一步</van-button>
              </van-row>
            </van-form>
          </van-tab>

          <van-tab>
            <van-form class="login-form" ref="formThree">
              <van-field
                size="large"
                required
                v-model="infoForm.legalPersonName"
                name="legalPersonName"
                label="负责人姓名"
                placeholder="请填写"
                :rules="[{ required: true, message: '请填写负责人姓名' }]"
              />

              <van-field
                size="large"
                required
                v-model="infoForm.legalPersonPhone"
                name="legalPersonPhone"
                :readonly="true"
                label="联系电话"
                placeholder="请填写"
                :rules="chargePhoneRules1"
              />

              <!-- <van-field
                size="large"
                v-model="infoForm.account"
                name="account"
                label="收款卡号"
                placeholder="请输入工商银行卡号"
                @blur="refoundNumber"
              ></van-field> -->

              <van-field
                size="large"
                v-model="infoForm.identityFrontPhoto"
                name="identityFrontPhoto"
                label="身份证正面"
                required
                :rules="[{ required: true, message: '必传' }]"
              >
                <template #input>
                  <van-uploader
                    v-model="frontIDcard"
                    :after-read="afterReadF"
                    multiple
                    :max-count="1"
                    :before-delete="beforeDeleteF"
                  />
                </template>
              </van-field>

              <van-field
                v-model="infoForm.identityBackPhoto"
                size="large"
                name="identityBackPhoto"
                label="身份证反面"
                required
                :rules="[{ required: true, message: '必传' }]"
              >
                <template #input>
                  <van-uploader
                    v-model="versoIDcard"
                    :after-read="afterReadG"
                    multiple
                    :max-count="1"
                    :before-delete="beforeDeleteG"
                  />
                </template>
              </van-field>

              <van-row class="mg-tp-30 tx-ct" v-if="active==3">
                <van-button
                  style="width:30%;margin-right:20px;"
                  color="#C83C3C"
                  class="loginOut"
                  @click="lastStep(2)"
                >上一步</van-button>
                <van-button
                  round
                  :disabled="handleClick"
                  :loading="loading"
                  style="width:30%;margin-right:20px;"
                  color="#C83C3C"
                  @click="onSubmit"
                >提交审核</van-button>
              </van-row>
            </van-form>
          </van-tab>
        </van-tabs>
      </van-row>
    </van-form>

    <!-- 弹出地图选择(这里用的也是vant的弹出组件) -->
    <van-popup v-model="showMap" position="right" :style="{ height: '100%',width:'100%' }">
      <qq-map :map-key="mapKey" :key-name="keyName" @callback="callback" @hideMap="showMap = false"></qq-map>
    </van-popup>

    <van-popup v-model="showPopup" :style="{ height: '50%',width:'90%' }">
      <van-row class="mg-10 tx-ct">《彩云点餐商家版用户协议》</van-row>
    </van-popup>

    <van-popup v-model="showTree" position="right" :style="{ height: '100%',width:'100%' }">
      <div class="container bg-w" >
        <van-nav-bar title="经营品类" left-arrow class="van-nav-bar-top" @click-left="showTree = false"></van-nav-bar>
        <van-tree-select :items="items" :main-active-index="mainActiveIndex" :active-id="activeIds"
          @navclick="onNavClick" @itemclick="onItemClick" />

        <div class="fixed-bottom  row">
          <div class="pd-tb-15 pd-lr-15 ">
            <van-button style="width:100%;" color="#C83C3C" class="loginOut mg-tp-10" @click="onSubmitTree" round>确认
            </van-button>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { compressImage, convertBase64UrlToBlob,blobToFile } from "../../utils/imgbase.js";
import pictureCompress from 'picture-compressor-plus';
import {
  Upload,
  addBusiness,
  getImgInfo,
  deleteImg,
  getTypeList,
  register, 
  registerSend,
  getAreaList,
  businessreviewInfo,
  businessreview,
  UploadImageAdd
} from "@/api/sys.js";
import { setCode, removeCode } from "@/utils/auth";
import { Dialog, Notify } from "vant";
import { checkCard } from "../../utils/checkCard.js";
import QqMap from "@/views/common/map/BaiduMap";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: {
    QqMap,
    Treeselect
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
      handleClick: false,
      loading: false,
      active: 1,
      msgText: null,
      cardType: null,
      // 账户注册信息
      disabled: false,
      checked: false,
      count: "",
      show: true,
      showPopup: false,
      resCode: null,

      infoForm: {
        code: "", // 验证码'123456'
        password: "", //账户密码
        confirmPwd: "", //确认密码
        chargeName: "", //负责人姓名
        chargePhone: "", //负责人电话
        address: "", //商户地址
        areaCode: "", //区域地址
        doorPlate: "", //详细地址
        lng: "", //经度坐标
        lat: "", //纬度
        name: "", //商户名称
        logo: "", //商户log
        storeImageList: [], //门店环境图片
        storeIntroduce: "", //商户介绍
        businessCategoryList: null, //经营品类
        //证件信息
        certificatefirstType: '',
        businessImg: "",

        certificatesecondType: '',
        secondtypeImg: "",

        specialQualification: '',
        thirdImg: "",
        //经营者信息
        account: "", //收款账户
        legalPersonName: "", //法人姓名
        legalPersonPhone: "", //法人联系电话
        identityFrontPhoto: "", //身份证照片正面
        identityBackPhoto: "" //身份证照片反面
      },
      value: null,
      normalizer(node) {
        return {
          id: node.id,
          label: node.text,
          children: node.children
        };
      },
      shopFrontList: [], //门脸图片
      storeImgList: [], //店内环境
      certificateOne: [], //证件类型图片
      certificateTwo: [], //证件类型图片
      certificateThree: [], //证件类型图片
      frontIDcard: [], //身份证正面
      versoIDcard: [], //身份证反面
      // 区域地址
      areaList:[],
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
      ],
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
          message: ""
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
      pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,

      //表单验证
      nameRules: [{ required: true, message: "必填" }],
      chargePhoneRules: [
        {
          required: true,
          message: "",
          trigger: "onBlur"
        },
        {
          // 自定义校验规则
          validator: (value) => {
            let tel = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/
            return tel.test(value) 
          },
          message: "号码格式不正确或者位数不正确",
          trigger: "onBlur",
        },
      ],
      chargePhoneRules1: [
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
      addressRules: [
        { required: true, message: "请选择地址", trigger: "onBlur" }
      ],
      areaCodeRules: [{ required: true, message: "必选", trigger: "onBlur" }],
      categoryRules: [{ required: true, message: "必选", trigger: "onBlur" }],
      logoRules: [{ required: true, message: "必传", trigger: "onBlur" }],
      storeImageRules: [{ required: true, message: "必传", trigger: "onBlur" }],
      typeOneRules: [{ required: true, message: "必选", trigger: "onBlur" }],
      typeImgOne: [{ required: true, message: "必传", trigger: "onBlur" }],
      typeTwoRules: [{ required: true, message: "必选", trigger: "onBlur" }],
      typeImgTwo: [{ required: true, message: "必传", trigger: "onBlur" }],
      typeThreeRules:[{ required: false, message: "必选", trigger: "onBlur" }],
      typeImgThree: [{ required: false, message: "必传", trigger: "onBlur" }],
      legalPersonName: [{ required: true, message: "必传", trigger: "onBlur" }],
      legalPersonPhone: [
        { required: true, message: "必传", trigger: "onBlur" }
      ],
      account: [{ required: true, message: "必传", trigger: "onBlur" }],
      identityFrontPhoto: [
        { required: true, message: "必传", trigger: "onBlur" }
      ],
      identityBackPhoto: [
        { required: true, message: "必传", trigger: "onBlur" }
      ],
      // 经营品类
      showTree:false,
      typeList: [],
      treeselectList:[],
      items: [],
      // 左侧高亮元素的index
      mainActiveIndex: null,
      // 被选中元素的id
      activeIds: [],
      // 选择的分类
      category: [],
      categoryText:'',
      // 定位城市名
      cityName:''
    };
  },
  watch: {
    "cityName": function(cityName) {
      this.areaList.forEach(el=>{
        if (el.text == cityName) {
          this.infoForm.areaCode = el.value
        }
      })
    }
  },

  mounted() {
    // this.init();
  },
  created() {
    this.getTreeselect();
    this.infoForm.phone = this.$route.query.phone
    this.getAreaList()
    this.getInfo()
  },
  methods: {
    // 审核退回商户信息
    getInfo(){
      let params = {
        phone: this.infoForm.phone
      }
      businessreviewInfo(params).then(res=>{
        if (res.code == 200) {
          this.infoForm = res.data
          this.infoForm.businessCategory = res.data.businessCategory
					this.category = res.data.businessCategory
					let arr=[]
					let typeList = this.$store.state.sys.categoryTreeData;
					typeList.forEach(el=>{
						if(el.children){
							// 合并所有二级分类数组
							arr = [...arr, ...el.children]
						}						
					})
				
					let textArr = []
					let categoryList = this.category ?  this.category.split(',') :	this.infoForm.businessCategory.split(',')
					arr.forEach(e=>{
						categoryList.forEach(t => {
							if(e.id == t){
								textArr.push(e.text)
							}
						})
              
            })
            // 选中分类显示
            if(textArr.length != 0){
              this.categoryText = textArr.join('/')
            }

            if (this.category) {
              let arr = []		
              this.category.split(',').forEach(el => {
                arr.push(Number(el))
              })
              this.activeIds = arr			
            }
          // 门店logo
          if (this.infoForm.logo) {
            this.shopFrontList.push({url: this.IMG_BASR_URL + this.infoForm.logo});
          }
          // 资质认证
          if (this.infoForm.businessImg) {
            this.certificateOne.push({url: this.IMG_BASR_URL + this.infoForm.businessImg});
          }
					if (this.infoForm.secondtypeImg) {
            this.certificateTwo.push({url: this.IMG_BASR_URL + this.infoForm.secondtypeImg});
          }
          if (this.infoForm.thirdImg) {
            this.certificateThree.push({url: this.IMG_BASR_URL + this.infoForm.thirdImg});
          }
          if (this.infoForm.identityFrontPhoto) {
            this.frontIDcard.push({url: this.IMG_BASR_URL + this.infoForm.identityFrontPhoto});
          }
          if (this.infoForm.identityBackPhoto) {
            this.versoIDcard.push({url: this.IMG_BASR_URL + this.infoForm.identityBackPhoto});
          }
					if (this.infoForm.storeImageList) {
            // 店内环境
            this.infoForm.storeImageList.forEach(ele => {
            let str = {
              url: this.IMG_BASR_URL + ele
            };
            this.storeImgList.push(str);
            });
          }
        }
      })
    },
    // 区域地址
    getAreaList(){
      getAreaList("sys_area").then(res=>{
        if (res.code == 200) {
          // this.areaList = res.data
          res.data.forEach(item => {
            this.areaList.push({
              value:item.dictValue,
              text:item.dictLabel
            })
          });
        }
      })
    },
    validator(val) {
      return val === this.infoForm.password;
    },

    sendSms() {
      if (!this.infoForm.phone) {
        this.$message({
          message: "请填写手机号码！",
          type: "warning"
        });
        return
      }
      let that = this;
      let params = {
        phone: that.infoForm.phone
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
          this.infoForm.chargePhone = this.infoForm.phone;
          this.infoForm.legalPersonPhone = this.infoForm.phone;
          setCode(res.data.code);
          this.$store.commit("SET_CODE", res.data.code);
          that.$notify({
            type: "success",
            message: "验证码发送成功！"
          });
          that.cutDown();
        }
      });
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
    /** 查询经营分类结构树 */
    getTreeselect() {
      getTypeList().then(response => {
        if (response.code == 200) {
						this.typeList = response.data[0].children;
            this.items = response.data[0].children;
            this.treeselectList = response.data[0].children;
            // this.$store.commit('sys/SET_CATEGORYTREEDATA', response.data[0].children)
					}
      });
    },
    // 分类选择 
    goTo() {
      this.showTree = true
    },
    onClickLeft() {
      this.$router.go(-1);
    },

    massage() {
      let $this = this;
      checkCard(this.infoForm.account).then(response => {
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

    refoundNumber() {
      let thie = this;
      let number = thie.infoForm.account;
      if (number) {
        let num = number.replace(/\s+/g, "");
        let obj = checkCard(num);
        let s = Promise.resolve(obj);
        s.then(function(result) {
          if (result.validated) {
            thie.infoForm.account = result.key;
          } else {
            thie.disabled = false;
            thie.infoForm.account = "";
          }
        });
      }
    },

    afterReadA(file) {
      // compressImage(file.content).then(result => {
      //   // file.status = "uploading";
      //   // file.message = "上传中...";
      //   const formData = new FormData();
      //   if (result.size > file.file.size) {
      //     //压缩后比原来更大，则将原图上传
      //     formData.append("file", file.file, file.file.name);
      //     //
      //   } else {
      //     //压缩后比原来小，上传压缩后的
      //     formData.append("file", result, file.file.name);
      //   }
      //   Upload(formData)
      //     .then(res => {
      //       if (res.code == 200) {
      //         this.infoForm.logo = res.data.fileName;
      //         file.status = "success";
      //         file.message = "上传成功";
      //       }
      //     })
      //     .catch(err => {
      //       file.status = "failed";
      //       file.message = "上传失败";
      //     });
      // });
      var that = this
      var files = file.file;
      var reads = new FileReader();
      reads.readAsDataURL(files);
      reads.onload = function() {
        pictureCompress({
          img: this.result,
          width: 400,
          height: 400,
          fit: 'fill'
        }).then(res => {
          var img = new Image();
          img.src = res.img;
          let blob = convertBase64UrlToBlob(img.src);
          var filed = blobToFile(blob);
          const formData = new FormData();
          formData.append("file", filed, file.file.name);
          that.uploadImg(file,formData)
        });
      };
    },
    uploadImg(file,formData){
      UploadImageAdd(formData)
        .then(res => {
          if (res.code == 200) {
            this.infoForm.logo = res.data.fileName;
            file.status = "success";
            file.message = "上传成功";
          }
        })
        .catch(err => {
          file.status = "failed";
          file.message = "上传失败";
        });
    },
    beforeDeleteA(file, index) {
      this.shopFrontList.splice(index.index, 1);
    },

    afterReadB(file) {
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
        UploadImageAdd(formData)
          .then(res => {
            console.log("上传图片结果报文", res);
            if (res.code == 200) {
              // let arr
              // arr.push(res.data.fileName)
              // console.log(arr,'arr');
              this.infoForm.storeImageList.push(res.data.fileName);
              file.status = "success";
              file.message = "上传成功";
            } else {
              file.status = "failed";
              file.message = "上传失败";
            }
          })
          .catch(err => {
            console.log(err,'rrrrrrrrrrr');
            file.status = "failed";
            file.message = "上传失败";
          });
      });
    },

    beforeDeleteB(file, index) {
      this.storeImgList.splice(index.index, 1);
      this.infoForm.storeImageList.splice(index.index, 1);
      // let url = file.url.split('=')[1]
			// // this.infoForm.storeImageList.push(url)
      // this.storeImgList.splice(index.index, 1);
      // let arr = []
      // let imgList = []
      // this.storeImgList.forEach(el=>{
      //   let url = el.url.split('=')[1]
      //   imgList.push(url)
      //   // arr = Array.from(new Set(imgList));
      // })
      // this.infoForm.storeImageList = imgList
    },
    afterReadC(file) {
      // compressImage(file.content).then(result => {
      //   const formData = new FormData();
      //   if (result.size > file.file.size) {
      //     //压缩后比原来更大，则将原图上传
      //     formData.append("file", file.file, file.file.name);
      //     //
      //   } else {
      //     //压缩后比原来小，上传压缩后的
      //     formData.append("file", result, file.file.name);
      //   }
      //   Upload(formData)
      //     .then(res => {
      //       if (res.code == 200) {
      //         this.infoForm.businessImg = res.data.fileName;
      //         file.status = "success";
      //         file.message = "上传成功";
      //       }
      //     })
      //     .catch(err => {
      //       file.status = "failed";
      //       file.message = "上传失败";
      //     });
      // });
      var that = this
      var files = file.file;
      var reads = new FileReader();
      reads.readAsDataURL(files);
      reads.onload = function() {
        pictureCompress({
          img: this.result,
          width: 500,
          height: 600,
          fit: 'fill'
        }).then(res => {
          var img = new Image();
          img.src = res.img;
          let blob = convertBase64UrlToBlob(img.src);
          var filed = blobToFile(blob);
          const formData = new FormData();
          formData.append("file", filed, file.file.name);
          UploadImageAdd(formData)
          .then(res => {
            if (res.code == 200) {
              that.infoForm.businessImg = res.data.fileName;
              file.status = "success";
              file.message = "上传成功";
            }
          })
          .catch(err => {
            file.status = "failed";
            file.message = "上传失败";
          });
        });
      };
    },

    beforeDeleteC(file, index) {
      this.certificateOne.splice(index.index, 1);
      this.infoForm.businessImg = ''
    },

    afterReadD(file) {
      var that = this
      var files = file.file;
      var reads = new FileReader();
      reads.readAsDataURL(files);
      reads.onload = function() {
        pictureCompress({
          img: this.result,
          width: 500,
          height: 600,
          fit: 'fill'
        }).then(res => {
          var img = new Image();
          img.src = res.img;
          let blob = convertBase64UrlToBlob(img.src);
          var filed = blobToFile(blob);
          const formData = new FormData();
          formData.append("file", filed, file.file.name);
          UploadImageAdd(formData)
          .then(res => {
            if (res.code == 200) {
              that.infoForm.secondtypeImg = res.data.fileName;
              file.status = "success";
              file.message = "上传成功";
            }
          })
          .catch(err => {
            file.status = "failed";
            file.message = "上传失败";
          });
        });
      };
    },

    beforeDeleteD(file, index) {
      this.certificateTwo.splice(index.index, 1);
      this.infoForm.secondtypeImg = ''
    },

    afterReadE(file) {
      var that = this
      var files = file.file;
      var reads = new FileReader();
      reads.readAsDataURL(files);
      reads.onload = function() {
        pictureCompress({
          img: this.result,
          width: 500,
          height: 600,
          fit: 'fill'
        }).then(res => {
          var img = new Image();
          img.src = res.img;
          let blob = convertBase64UrlToBlob(img.src);
          var filed = blobToFile(blob);
          const formData = new FormData();
          formData.append("file", filed, file.file.name);
          UploadImageAdd(formData)
          .then(res => {
            if (res.code == 200) {
              that.infoForm.thirdImg = res.data.fileName;
              file.status = "success";
              file.message = "上传成功";
            }
          })
          .catch(err => {
            file.status = "failed";
            file.message = "上传失败";
          });
        });
      };
    },

    beforeDeleteE(file, index) {
      this.certificateThree.splice(index.index, 1);
      this.infoForm.thirdImg = ''
    },

    afterReadF(file) {
      var that = this
      var files = file.file;
      var reads = new FileReader();
      reads.readAsDataURL(files);
      reads.onload = function() {
        pictureCompress({
          img: this.result,
          width: 500,
          height: 600,
          fit: 'fill'
        }).then(res => {
          var img = new Image();
          img.src = res.img;
          let blob = convertBase64UrlToBlob(img.src);
          var filed = blobToFile(blob);
          const formData = new FormData();
          formData.append("file", filed, file.file.name);
          UploadImageAdd(formData)
          .then(res => {
            if (res.code == 200) {
              that.infoForm.identityFrontPhoto = res.data.fileName;
              file.status = "success";
              file.message = "上传成功";
            }
          })
          .catch(err => {
            file.status = "failed";
            file.message = "上传失败";
          });
        });
      };
    },

    beforeDeleteF(file, index) {
      this.frontIDcard.splice(index.index, 1);
    },

    afterReadG(file) {
      var that = this
      var files = file.file;
      var reads = new FileReader();
      reads.readAsDataURL(files);
      reads.onload = function() {
        pictureCompress({
          img: this.result,
          width: 500,
          height: 600,
          fit: 'fill'
        }).then(res => {
          var img = new Image();
          img.src = res.img;
          let blob = convertBase64UrlToBlob(img.src);
          var filed = blobToFile(blob);
          const formData = new FormData();
          formData.append("file", filed, file.file.name);
          UploadImageAdd(formData)
          .then(res => {
            if (res.code == 200) {
              that.infoForm.identityBackPhoto = res.data.fileName;
              file.status = "success";
              file.message = "上传成功";
            }
          })
          .catch(err => {
            file.status = "failed";
            file.message = "上传失败";
          });
        });
      };
    },

    beforeDeleteG(file, index) {
      this.versoIDcard.splice(index.index, 1);
      //   this.deleteImgUrl();
    },

    //预览图片
    getImgUrl(val) {
      getImgInfo(val).then(res => {
        if (res.code == 200) {
          console.log(res.data);
        }
      });
    },
    onSubmit() {
      // console.log(this.infoForm);
      this.$refs.formThree
        .validate()
        .then(() => {
          businessreview(this.infoForm).then(res => {
            if (res.code == 200) {
              this.$message({
                // message: "注册成功，请登录店铺进行设置",
                dangerouslyUseHTMLString: true,
                message:'<h3>提交审核成功</h3>',
                type: "success"
              });
              setTimeout(this.$router.push({ path: "/login" }), 5000);
            }
          });
        })
        .catch({});
    },

    nextStep(val) {
      if (val == 1) {
        if (this.resCode == null) {
        this.$message({
          message: "验证码未发送或发送失败！",
          type: "warning"
        });
      } else {
        this.$refs.formZero.validate().then(() => {
          this.loading = true;
          let params = {
            phone: this.infoForm.phone,
            verifyCode: this.infoForm.code
          };
          if (this.checked == true) {
            register(params).then(res => {
              let data = res.data;
              if (res.code == 200) {
                this.active = val;
              }
            });
          } else {
            this.$message({
              message: "请阅读并勾选彩云点餐商家版用户协议",
              type: "warning"
            });
          }
          this.loading = false;
        });
      }
      }
      else if (val == 2) {
        this.$refs.formOne
          .validate()
          .then(() => {
            this.active = val;
            console.log(this.infoForm,'onfoff');
          })
          .catch({});
      } else if (val == 3) {
        this.$refs.formTwo
          .validate()
          .then(() => {
            // if (this.infoForm.certificatefirstType !='8' ) {
            //   if (!this.infoForm.businessImg) {
            //     this.$message.warning("请上传营业执照图片")
            //     return
            //   }
            // }
            // if (this.infoForm.certificatesecondType !='4' ) {
            //   if (!this.infoForm.secondtypeImg) {
            //     this.$message.warning("请上传经营许可证图片")
            //     return
            //   }
            // }
            // if (this.infoForm.specialQualification !='2' ) {
            //   if (!this.infoForm.thirdImg) {
            //     this.$message.warning("请上传其他证件图片")
            //     return
            //   }
            // }
            console.log(this.infoForm,'form');
            this.active = val;
          })
          .catch({});
      }
    },

    lastStep(val) {
      this.active = val;
    },

    // 地图选择回调
    callback(mapData) {
      this.showMap = false;
      this.infoForm.lng = mapData.latlng.lng;
      this.infoForm.lat = mapData.latlng.lat;
      this.infoForm.address = mapData.poiaddress;
      this.cityName = mapData.cityname
      
      //   var reg = /.+?(省|市|自治区|自治州|县|区)/g;
      //   var areaArr = mapData.poiaddress.match(reg) || []; // 匹配省市区，生成数组
      //   this.address_info.area_info = areaArr.join(" ");

      //   // 如果是直辖市，数组2需要补充一个
      //   if (areaArr.length < 3 && areaArr[0].indexOf("香港") === -1) {
      //     if (areaArr[0].indexOf("省")) {
      //       areaArr.push(areaArr[1]);
      //     } else if (areaArr[0].indexOf("市")) {
      //       // 直辖市处理
      //       areaArr.unshift(areaArr[0]);
      //     }
      //   }

      //   // 递归，获取对应的省市区ID
      //   let areaIds = this.locationGhosts(this.area_list, areaArr, 0);
      //   this.address_info.province_id = areaIds[0]; // 存储城市ID
      //   this.address_info.city_id = areaIds[1]; // 存储城市ID
      //   this.address_info.area_id = areaIds[2]; // 存储区域ID
      //   this.address_info.area_info_detail = mapData.poiname; // 存储地图选择的地址名称
      //   this.address_info.address_detail = mapData.poiname; // 存储地图选择的地址名称
    },

    /**
     * 递归方法，获取城市ID等
     * @param {Array} list 数据库中的地址列表（每次循环都会拿自己的child来匹配）
     * @param {Array} param 需要查找的省市区数组
     * @param {Number} level 当前遍历的深度
     * @param {Array} area_ids 当前已遍历找到的省市区ID数组
     * @return 对应的ID数组
     */
    locationGhosts(list, param, level = 0, areaIds = []) {
      let child = [];
      param[level] &&
        list.some(item => {
          if (param[level].indexOf(item.area_name) !== -1) {
            areaIds[level] = item.area_id; // 存储ID，已经找到一个
            child = item.child;
            return true;
          }
        });

      !param[level] && (areaIds[level] = 0); // 不存在默认给个0

      // 判断不要改三目运算符，详情查看尾递归相关描述
      if (level === 2) {
        return areaIds;
      } else {
        return this.locationGhosts(child, param, ++level, areaIds);
      }
    },

    // 左侧点击
			onNavClick(index) {
				this.mainActiveIndex = index;
				this.activeIds = []
			},
			// 右侧点击
			onItemClick(data) {

				// 深拷贝
				let activeArr = JSON.parse(JSON.stringify(this.activeIds))
				// 判断是否已经选中，如选中就取消选中
				if (activeArr.some(e => e == data.id)) {
					activeArr.forEach((el, index) => {
						if (el == data.id) {
							// 删除数组元素
							activeArr.splice(index, 1);
						}
					})
				} else {
					activeArr.push(data.id);
				}

				this.activeIds = activeArr
        this.infoForm.businessCategoryList = this.activeIds
			},
			// 确认
			onSubmitTree() {
        this.category = this.activeIds.join(',')
        this.showTree = false
        if(this.category){
          this.infoForm.businessCategory = this.category
        }
        let arr=[]
        this.typeList.forEach(el=>{
          if(el.children){
            // 合并所有二级分类数组
            arr = [...arr, ...el.children]
          }						
        })
        let textArr = []
        let categoryList = this.category ?  this.category.split(',') :	this.infoForm.businessCategory.split(',')
        
        arr.forEach(e=>{
          categoryList.forEach(t => {
            if(e.id == t){
              textArr.push(e.text)
            }
          })
          
        })
        // 选中分类显示
        if(textArr.length != 0){
          this.categoryText = textArr.join('/')
        }
			},
      changeFirst(val){
        // if (val == '8') {
        //   this.infoForm.businessImg = ''
        //   this.certificateOne = []
        // }
      },
      changeSecond(val){
        // if (val == '4') {
        //   this.infoForm.secondtypeImg = ''
        //   this.certificateTwo = []
        // }
      },
      changeThird(val){
        // if (val == '2') {
        //   this.infoForm.thirdImg = ''
        //   this.certificateThree = []
        // }
      },
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

.loginOut {
  margin: 0 auto;
  width: 90%;
  border-radius: 2.5rem;
}

.main {
  margin-bottom: 40px;
}
.button {
    padding: 3px 5px;
    background: #ff976a;
    border-radius: 5px;
    color: #ffffff;
  }
.bottom-btn {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  padding: 5px;
  text-align: center;
}
.mg-tp-50 {
		margin-top: 50px;
	}
</style>

<style scoped>
.theSteps {
  width: 100%;
  background: #fff;
}
/* 进行中状态：圈线 */
.theSteps >>> .el-step__head.is-process {
  color: #e00d01;
  border-color: #e00d01;
  font-size: 12px;
}
/* 进行中状态：圈内 */
.theSteps >>> .el-step__head.is-process > .el-step__icon {
  background: #e00d01;
  color: #fff;
  font-size: 16px;
}
/* 进行中状态：title（文字） */
.theSteps >>> .el-step__title.is-process {
  color: #e00d01;
  font-size: 16px;
}

/* 完成状态：圈线 */
.theSteps >>> .el-step__head.is-success {
  color: #26b068;
  border-color: #26b068;
  font-size: 16px;
}
/* 完成状态：title（文字） */
.theSteps >>> .el-step__title.is-success {
  color: #26b068;
  font-size: 16px;
}
/* 完成状态：line
 * 描述：第一步完成，第二步进行时，之间的进度条有颜色
 */
.theSteps
  >>> .el-step__head.is-success
  > .el-step__line
  > .el-step__line-inner {
  width: 100% !important;
  border-width: 1px !important;
  font-size: 16px;
}
.cellGroup ::v-deep .van-cell-group--inset {
    margin: 0 !important;
    overflow: hidden;
    border-radius: 8px;
}
::v-deep .van-tabs--line .van-tabs__wrap {
    height: 14px;
}
</style>