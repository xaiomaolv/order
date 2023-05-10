<template>
  <div class="container">
    <van-nav-bar
      :title="pageTitle"
      left-text
      left-arrow
      class="van-nav-bar-top"
      @click-left="onClickLeft"
    ></van-nav-bar>
    <van-row class="main">
      <van-form ref="form">
        <!-- <van-field
          size="large"
          required
          :rules="mealStatusRules"
          clickable
          name="mealStatus"
          v-model="foodInfo.mealStatus"
          label="是否是套餐"
          :readonly="true"
        >
          <template #input>
            <van-radio-group
              v-model="foodInfo.mealStatus"
              direction="horizontal"
              @change="mStatusChange"
              :disabled="true"
            >
              <van-radio name="0" checked-color="#C83C3C">否</van-radio>
              <van-radio name="1" checked-color="#C83C3C">是</van-radio>
            </van-radio-group>
          </template>
        </van-field> -->
        <van-field
          size="large"
          required
          clickable
          v-model="foodInfo.categoryId"
          name="categoryId"
          label="菜品分类"
          :rules="[{ required: true, message: '必选' }]"
        >
          <template #input>
            <el-select
              v-model="foodInfo.categoryId"
              placeholder="请选择菜品分类"
              style="margin-top: -8px; width: 100%"
              disabled
            >
              <el-option
                v-for="item in typeList"
                :key="item.categoryId"
                :label="item.categoryName"
                :value="item.categoryId"
              ></el-option>
            </el-select>
          </template>
        </van-field>

        <van-row :hidden="hidden">
          <van-field
            size="large"
            required
            clickable
            :readonly="readOnly"
            label="套餐内产品"
          >
            <template #input>
              <el-select
                v-model="selectValue"
                multiple
                placeholder="请选择菜品"
                @change="setName"
                style="margin-top: -8px"
              >
                <el-option-group
                  v-for="group in productList"
                  :key="group.categoryId"
                  :label="group.categoryName"
                >
                  <el-option
                    v-for="item in group.children"
                    :key="item.productId"
                    :label="item.productName"
                    :value="item.productId"
                  ></el-option>
                </el-option-group>
              </el-select>
            </template>
          </van-field>
        </van-row>

        <van-field
          size="large"
          required
          name="productName"
          v-model="foodInfo.productName"
          label="菜品名称"
          clearable
          placeholder="请输入菜品名称"
          :rules="nameRules"
        />

        <van-field
          size="large"
          required
          name="productImage"
          label="菜品图片"
          v-model="foodInfo.productImage"
          :rules="imageRules"
        >
          <template #input>
            <van-uploader
              upload-text="上传菜品图片"
              :after-read="afterReadS"
              multiple
              :max-count="1"
              :before-delete="beforeDeleteS"
              v-model="fileList"
            />
          </template>
        </van-field>

        <van-field
          size="large"
          required
          type="number"
          name="productPrice"
          v-model="foodInfo.productPrice"
          label="售卖价"
          clearable
          placeholder="请输入售卖价"
          :rules="priceRules"
        />

        <van-field
          size="large"
          type="number"
          name="productPercentPrice"
          v-model="foodInfo.productPercentPrice"
          label="优惠价"
          clearable
          placeholder="请输入优惠价"
          :rules="[{ validatorPrice }]"
        />
        <!-- <van-field
          size="large"
          name="inventory"
          v-model="foodInfo.inventory"
          label="库存"
          clearable
          type="number"
          placeholder="请输入库存份量"
        >
          <template #button>份</template>
        </van-field> -->

        <!-- <van-field
          size="large"
          name="packFee"
          v-model="foodInfo.packFee"
          label="打包费"
          clearable
          type="number"
          required
          placeholder="请输入打包费价格"
          :rules="FeeRules"
        >
        </van-field> -->

        <van-field
          size="large"
          name="productDescribe"
          v-model="foodInfo.productDescribe"
          type="textarea"
          autosize
          label="菜品描述"
          clearable
          placeholder="请输入描述"
          maxlength="50"
          show-word-limit
        />

        <van-field
          size="large"
          required
          :rules="formatRules"
          clickable
          name="formatFlag"
          v-model="foodInfo.formatFlag"
          label="是否设置规格"
          :readonly="isTrue"
        >
          <template #input>
            <van-radio-group
              v-model="foodInfo.formatFlag"
              direction="horizontal"
              @change="changeFormat"
            >
              <van-radio name="0" checked-color="#C83C3C">否</van-radio>
              <van-radio name="1" checked-color="#C83C3C">是</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <div v-if="foodInfo.formatFlag == '1'">
          <div
            v-for="(item, index) in formatTypeList"
            :key="index"
            class="box mg-5 mg-tp-10"
          >
            <van-row class="bx-bt">
              <van-col span="18">
                <van-field
                  size="large"
                  required
                  label="规格类别:"
                  v-model="item.formatName"
                  name="formatName"
                  clearable
                  :rules="[
                    {
                      required: true,
                      message: '请输入规格类别',
                      trigger: 'onBlur',
                    },
                  ]"
                  placeholder="请输入规格类别"
                >
                </van-field>
              </van-col>
              <van-col span="3" class="mg-tp-10 tx-rt pd-5">
                <van-button
                  round
                  size="mini"
                  plain
                  type="primary"
                  native-type="button"
                  v-if="index + 1 == formatTypeList.length"
                  @click="addParentFormat(index)"
                  >增加</van-button
                >
              </van-col>
              <van-col span="3" class="mg-tp-10 tx-rt pd-5">
                <van-button
                  round
                  size="mini"
                  plain
                  type="danger"
                  v-if="index !== 0"
                  @click="deleteParentFormat(item)"
                  >删除</van-button
                >
              </van-col>
            </van-row>
            <van-row
              v-for="(format, index1) in item.child"
              :key="index1"
              class="mg-5 bx-sd"
            >
              <van-col span="20">
                <van-field
                  size="large"
                  required
                  name="attributesName"
                  v-model="format.attributesName"
                  label="规格名称:"
                  clearable
                  :rules="[
                    {
                      required: true,
                      message: '请输入规格名称',
                      trigger: 'onBlur',
                    },
                  ]"
                  placeholder="请输入规格名称"
                />
                <van-field
                  size="large"
                  name="productPrice"
                  v-model="format.productPrice"
                  label="加价:"
                  clearable
                  type="number"
                  placeholder="填0不加价"
                />
              </van-col>
              <van-col span="4" class="pd-5 mg-tp-10 tx-rt">
                <van-icon
                  name="cross"
                  color="red"
                  size="12"
                  @click="deleteSubFormat(index, format)"
                />
                <span class="ft-se-12 red">删除</span>
              </van-col>
            </van-row>
            <van-row class="tx-ct pd-5 cl-add" @click="addSubFormat(index)"
              ><span class="ft-se-16">+</span
              ><span class="ft-se-14">增加规格</span></van-row
            >
          </div>
        </div>
        <div class="pd-10 mg-10">
          <van-button round block color="#C83C3C" @click="onSubmit"
            >提交</van-button
          >
        </div>
      </van-form>
    </van-row>
  </div>
</template>

<script>
import {
  compressImage,
  convertBase64UrlToBlob,
  blobToFile,
  requestImage,
} from "@/utils/imgbase.js";
import { uploadFile } from "@/api/sys.js";
import { Notify } from "vant";
import pictureCompress from "picture-compressor-plus";
import {
  getProductInfo,
  addProduct,
  updateProduct,
  getTypelist,
  getProductlist,
  getFormatList,
} from "@/api/menu.js";

export default {
  name: "dishesAdd",
  data() {
    return {
      mealStatus: "0",
      hidden: true,
      isTrue: false,
      readOnly: false,
      pageTitle: null,
      actionType: null,
      info: {},
      foodInfo: {
        formatFlag: 0,
        mealStatus: "0",
        // packFee:0
      },
      fileList: [],
      typeList: [], //类型集
      productList: [], //产品集
      selectValue: [], //勾选集
      stateList: [
        { label: "爆", value: 0 },
        { label: "售罄", value: 1 },
        { label: "其他", value: 2 },
      ], //状态集
      productName: "",
      selectList: [],
      rules: {},
      mealStatusRules: [{ required: true, message: "必选", trigger: "onBlur" }],
      categoryRules: [{ required: true, message: "必选", trigger: "onBlur" }],
      nameRules: [{ required: true, message: "必填" }],
      imageRules: [{ required: true, message: "必传" }],
      priceRules: [{ required: true, message: "必填" }],
      // FeeRules: [{ required: true, message: "必填" }],
      describeRules: [{ required: true, message: "必填" }],
      formatRules: [{ required: true, message: "必选", trigger: "onBlur" }],
      show: false, //展示规格操作面板

      formatForm: {},
      formatRules: [],
      // 规格管理
      productInfo: {},
      formatList: [],
      formatTypeList: [
        {
          formatName: null,
          child: [
            {
              attributesName: null,
              attributesSort: 0,
              productPrice: 0,
              productPercentPrice: null,
            },
          ],
        },
      ],
    };
  },

  created() {
    this.info = JSON.parse(this.$route.query.param);
    this.foodInfo.categoryId = this.info.categoryId;
    this.foodInfo.mealStatus = this.info.mealStatus;
    this.actionType = this.info.type;
    if (this.foodInfo.mealStatus == "1") {
      this.getProductList();
      this.hidden = false;
      this.readOnly = true;
    } else {
      this.hidden = true;
      this.readOnly = false;
    }
    if (this.actionType == "add") {
      this.pageTitle = "添加菜品";
    }
    if (this.actionType == "edit") {
      if (this.info.mealStatus == "1") {
        this.isTrue = true;
      }
      this.pageTitle = "编辑菜品";
      this.getProductDetail();
    }
    this.getTypelist();
  },

  methods: {
    validatorPrice(rule, value, callback) {
      if (!value) return callback(new Error("请输入金额"));
      if (!Number(value)) return callback(new Error("请输入数字值"));
      let reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})$/g; //小数限制0-2位
      if (!reg.test(value)) return callback(new Error("请输入正确价格"));
      callback();
    },

    onClickLeft() {
      history.back();
      //   this.$router.go(-1);
    },

    getProductDetail() {
      let param = {
        productId: this.info.productId,
        mealStatus: this.info.mealStatus,
        formatFlag: this.info.formatFlag,
      };
      getProductInfo(param).then((res) => {
        this.foodInfo = res.data;
        if (res.data.child) {
          if (res.data.child.length > 0) this.formatTypeList = res.data.child;
          else
            this.formatTypeList = [
              {
                formatName: null,
                child: [
                  {
                    attributesName: null,
                    attributesSort: 0,
                    productPrice: 0,
                    productPercentPrice: null,
                  },
                ],
              },
            ];
        }
        if (res.data.productPercentPrice == 0) {
          this.foodInfo.productPercentPrice = "";
        }
        if (res.data.productImage) {
          // let imgUrl = { url: this.IMG_BASR_URL + res.data.productImage };
          // this.fileList.push(imgUrl);
          requestImage(this.IMG_BASR_URL + res.data.productImage).then(
            (result) => {
              let str = {
                content: result,
              };
              this.fileList.push(str);
            }
          );
        }

        if (res.data.mealStatus == "1") {
          this.isTrue = true;
          this.selectValue = res.data.children;
          //   res.data.children.forEach(ele => {
          //     this.selectValue.push(ele.productId);
          //   });
        }

        // this.productName = res.data.productName
      });
    },

    getTypelist() {
      let param = {
        status: "0",
      };
      getTypelist(param).then((res) => {
        this.typeList = res.data;
      });
    },

    //获取菜品列表
    getProductList() {
      getProductlist().then((res) => {
        this.productList = res.data;
      });
    },

    //是否是套餐
    mStatusChange() {
      if (this.foodInfo.mealStatus == "1") {
        this.getProductList();
        this.hidden = false;
        this.readOnly = true;
      } else {
        this.hidden = true;
        this.readOnly = false;
      }
    },

    //选好后生成菜品名
    setName() {
      let listData = [];
      let pdName = "";
      //   this.productList.forEach(ele => {
      //     ele.children.forEach(b => {
      //       listData.push(b);
      //     });
      //   });
      // console.log("selectValue" + JSON.stringify(this.selectValue));
      // this.foodInfo.children = this.selectValue
      //   listData.forEach(ele => {
      //     this.selectValue.forEach(a => {
      //       if (ele.productId == a) {
      //         pdName += ele.productName + "-";
      //       }
      //     });
      //   });
      //   var length = pdName.length - 1;
      //   this.productName = pdName.substr(0, length);

      //   this.selectValue.forEach(a => {
      //     this.selectList.push(a);
      //   });
    },

    onSubmit() {
      if (this.foodInfo.mealStatus == "1") {
        if (this.selectValue.length <= 0) {
          Notify({ type: "warning", message: "请选择套餐内菜品" });
          return;
        }
      }
      this.$refs.form.validate().then(() => {
        if (this.actionType == "add") {
          if (this.foodInfo.mealStatus == "1") {
            let selist = [];
            this.selectValue.forEach((ele) => {
              selist.push(JSON.parse(JSON.stringify(ele)));
            });
            this.foodInfo.children = selist;
            // this.foodInfo.children = this.selectValue;
          } else {
            this.foodInfo.children = [];
          }
          // this.foodInfo.productName = this.productName;
          // if (this.foodInfo.inventory) {
          //   if (this.foodInfo.inventory <= 0) {
          //     Notify({ type: "warning", message: "库存量必须大于0" });
          //     return;
          //   }
          // }
          this.foodInfo.formatTypeList = this.formatTypeList;
          console.log(this.foodInfo, "提交：this.foodInfo");
          addProduct(this.foodInfo).then((res) => {
            if (res.code == 200) {
              this.$message({
                message: "菜品添加成功！",
                type: "success",
              });
              // this.$router.push("/dishesList");
              this.$router.push({
                name: "dishesList",
                params: { categoryId: this.foodInfo.categoryId },
              });
            }
          });
        } else {
          if (this.foodInfo.mealStatus == "1") {
            let selist = [];
            this.selectValue.forEach((ele) => {
              //   this.cartList.push(JSON.parse(JSON.stringify(res)))
              selist.push(JSON.parse(JSON.stringify(ele)));
            });
            this.foodInfo.children = selist;
            // this.foodInfo.children = this.selectValue;
          } else {
            this.foodInfo.children = [];
          }
          // if (this.foodInfo.inventory) {
          //   if (this.foodInfo.inventory <= 0) {
          //     Notify({ type: "warning", message: "库存量必须大于0" });
          //     return;
          //   }
          // }
          this.foodInfo.formatTypeList = this.formatTypeList;
          console.log(this.foodInfo, "修改参数this.foodInfo");
          updateProduct(this.foodInfo).then((res) => {
            if (res.code == 200) {
              this.$message({
                message: "菜品修改成功！",
                type: "success",
              });
              // this.$router.push("/dishesList");
              this.$router.push({
                name: "dishesList",
                params: { categoryId: this.foodInfo.categoryId },
              });
            }
          });
        }
      });
    },

    //图片上传
    afterReadS(file) {
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
          uploadFile(formData)
            .then((res) => {
              if (res.code == 200) {
                that.foodInfo.productImage = res.data.fileName;
                file.status = "success";
                file.message = "上传成功";
              }
            })
            .catch((err) => {
              file.status = "failed";
              file.message = "上传失败";
            });
        });
      };
    },
    beforeDeleteS(file, index) {
      this.fileList.splice(index.index, 1);
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 规格切换
    changeFormat(val) {
      this.foodInfo.formatFlag = val;
      // this.formatTypeList = this.formatTypeList
    },
    // 增加
    addParentFormat(index) {
      this.formatTypeList.push({
        formatName: null,
        child: [
          {
            attributesName: null,
            attributesSort: 0,
            productPrice: 0,
            productPercentPrice: null,
          },
        ],
      });
    },
    // 删除
    deleteParentFormat(item) {
      let index = this.formatTypeList.indexOf(item);
      if (index !== -1) {
        //当没有多余tab时就不再删除
        this.formatTypeList.splice(index, 1);
      }
    },
    addSubFormat(index) {
      this.formatTypeList[index].child.push({
        attributesName: null,
        attributesSort: 0,
        productPrice: 0,
        productPercentPrice: null,
      });
    },

    deleteSubFormat(val, item) {
      let index = this.formatTypeList[val].child.indexOf(item);
      if (index !== -1) {
        //当没有多余tab时就不再删除
        this.formatTypeList[val].child.splice(index, 1);
      }
    },
  },
};
</script>
<style scoped>
.cl-grow {
  color: #9ea5a9;
}

.addBtn {
  color: #1989fa;
}

.main {
  margin-bottom: 40px;
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
.mg-lt-40 {
  margin-left: 35px;
}
/* 规格 */
.box {
  background-color: #fff;
  border-radius: 10px;
  margin: 5px 10px 20px 10px;
  padding: 0 15px 0px 15px;
  box-shadow: 0 -5px 5px #f5f2f2, 2px 2px 2px #f5f2f2, 0 5px 5px #f5f2f2,
    2px 2px 2px #f5f2f2;
}
.bx-bt {
  /* border-bottom: 1px solid #999; */
  /* margin-bottom: 3px; */
}
.cl-add {
  color: #2eb386;
  font-size: 20px;
}
:deep .el-input__inner {
  outline: none;
  border: 0;
  padding-left: 0;
  background: none;
}
:deep .el-input.is-disabled .el-input__inner {
  background: none;
  border: none;
  color: #646566;
  cursor: not-allowed;
}
</style>
