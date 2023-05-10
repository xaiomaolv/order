<template>
  <div class="container bg-w">
    <van-nav-bar
      title="规格设置"
      left-text
      left-arrow
      class="van-nav-bar-top"
      @click-left="onClickLeft"
    ></van-nav-bar>

    <van-row class="main">
      <!-- <van-cell title inset>
        <template #default>
          <van-button size="small" @click="addParentFormat" type="primary">新增</van-button>
        </template>
      </van-cell>-->
      <div v-for="(item ,index) in formatTypeList" :key="index" class="box mg-5 mg-tp-10">
        <van-row class="bx-bt">
          <van-col span="20">
            <van-field
              size="large"
              readonly
              required
              v-model="item.formatName"
              name="formatName"
              :rules="[{ required: true, message: '必选'}]"
            >
              <!-- <template #input>
                <el-select
                  v-model="item.formatId"
                  placeholder="请选择菜品分类"
                  @change="valueChange(index)"
                >
                  <el-option
                    v-for="type in formatList"
                    :key="type.formatId"
                    :label="type.formatName"
                    :value="type.formatId"
                  ></el-option>
                </el-select>
              </template>-->
            </van-field>
          </van-col>
          <van-col span="4" class="mg-tp-5 tx-rt pd-5">
            <van-button round size="mini" plain type="danger" @click="deleteParentFormat(item)">删除</van-button>
          </van-col>
        </van-row>
        <van-row v-for="(format ,index1) in item.child" :key="index1" class="mg-5 bx-sd">
          <van-col span="20">
            <van-field
              size="large"
              required
              name="attributesName"
              v-model="format.attributesName"
              label="规格名称:"
              clearable
              placeholder="请输入规格名称"
            />
            <!-- <van-field name="attributesSort" label="排序">
              <template #input>
                <van-stepper v-model="format.attributesSort"/>
              </template>
            </van-field>-->
            <van-field
              size="large"
              v-if="item.formatMoney==1"
              name="productPrice"
              v-model="format.productPrice"
              label="加价:"
              clearable
              type="number"
              placeholder="请输入加价金额"
            />
          </van-col>
          <van-col span="4" class="pd-5 tx-rt">
            <van-icon name="cross" color="red" @click="deleteSubFormat(index,format)"/>
            <!-- <van-button size="mini" icon="cross" plain  type="danger"/> -->
          </van-col>
        </van-row>
        <van-row class="tx-ct pd-5 cl-add" @click="addSubFormat(index)">+</van-row>
      </div>
    </van-row>

    <van-row class="bottom-btn">
      <van-button round style="width:90%;" color="#C83C3C" class="loginOut" @click="saveFormat">保存</van-button>
    </van-row>
  </div>
</template>

<script>
import { getProductInfo, updateProduct, getFormatList } from "@/api/menu.js";

export default {
  data() {
    return {
      productInfo: {},
      formatList: [],
      formatTypeList: [],
      selectformatId: null
    };
  },

  created() {
    this.productInfo = JSON.parse(this.$route.query.param);
    this.getProductDetail();
    // this.getFormatList();
  },

  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    //获取菜品详情
    getProductDetail() {
      let param = {
        productId: this.productInfo.productId,
        mealStatus: this.productInfo.mealStatus,
        formatFlag: this.productInfo.formatFlag,
      };
      getProductInfo(param).then(res => {
        this.formatTypeList = res.data.child;
      });
    },

    //规格分类选项改变
    valueChange(index) {
      console.log("index+" + index);
      this.formatList.forEach(ele => {
        if (this.formatTypeList[index].formatId == ele.formatId) {
          this.formatTypeList[index].formatId = ele.formatId;
          this.formatTypeList[index].formatName = ele.formatName;
          this.formatTypeList[index].formatMoney = ele.formatMoney;
          this.formatTypeList[index].formatSort = ele.formatSort;
        }
      });
    },

    addParentFormat() {
      this.formatTypeList.push({
        formatId: null,
        formatName: null,
        formatMoney: null,
        formatSort: null,
        child: []
      });
    },
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
        productPercentPrice: null
      });
    },

    deleteSubFormat(val, item) {
      let index = this.formatTypeList[val].child.indexOf(item);
      if (index !== -1) {
        //当没有多余tab时就不再删除
        this.formatTypeList[val].child.splice(index, 1);
      }
    },

    //保存规格信息
    saveFormat() {
      let formatInfo = JSON.stringify(this.formatTypeList);
      console.log("保存的规格信息数据：" + formatInfo);
      this.productInfo.formatTypeList = this.formatTypeList;
      updateProduct(this.productInfo).then(res => {
        if (res.code == 200) {
          this.$message({
            message: "操作成功！",
            type: "success"
          });
          this.$router.push("/dishesList");
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  /* border: 1px; */
  /* border-style: dashed; */
  /* border-color: #ad2a18; */
  /* background-color: white; */
  background-color: #FFF;
  border-radius: 10px;
  margin: 5px 10px 20px 10px;
  padding: 0 15px 0px 15px;
  box-shadow: 0 -5px 5px #f5f2f2, 2px 2px 2px #f5f2f2, 0 5px 5px #f5f2f2, 2px 2px 2px #f5f2f2;
}
.bx-bt {
  /* border-bottom: 1px solid #999; */
  /* margin-bottom: 3px; */
}
.cl-add {
  color: #2eb386;
  font-size: 20px;
}

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
</style>
