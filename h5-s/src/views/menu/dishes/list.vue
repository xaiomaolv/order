<template>
  <div class="container">
    <van-nav-bar
      title="菜品上传"
      left-text
      left-arrow
      class="van-nav-bar-top"
      @click-left="onClickLeft"
    ></van-nav-bar>

    <van-row class="main">
      <van-col span="5">
        <van-sidebar v-model="activeKey" @change="onChange">
          <van-sidebar-item
          class="ft-se-14"
            v-for="(type,index) in typeList"
            :key="index"
            :title="type.categoryName"
            :badge="type.prodNum"
          />
        </van-sidebar>
      </van-col>
      <van-col span="19">
          <van-card
            v-for="(item,index) in productList"
            :key="item.productId"
            class="bg-w mg-bt-10 bd-rd ft-se-15"
            :title="item.productName"
            :centered="true"
          >
            <template slot="thumb">
              <auth-img :authSrc="IMG_BASR_URL+item.productImage" v-if="flag" style="width:88px;height:88px"></auth-img>
            </template>
            <template #desc>
              <van-col class="mg-rt-5">{{item.productDescribe}}</van-col>
            </template>
            <!-- 原价 划线-->
            <template #origin-price>
              <span class="ft-se-10" v-if="item.productPercentPrice > 0">{{item.productPrice}}</span>
            </template>
            <!-- 优惠价 -->
            <template slot="price">
              <span class="ft-se-10" v-if="item.productPercentPrice == 0">￥<span class="ft-se-16">{{item.productPrice}}</span></span>
              <span class="ft-se-10" v-else>￥<span class="ft-se-16">{{item.productPercentPrice}}</span></span>
            </template>
            <template slot="footer" class="mg-tp-10">
              <van-button class="mg-rt-5 mg-tb-10" round size="mini" @click="toRecommend(item)" type="danger">
                <span v-if="item.recommend==0">未推荐</span>
                <span v-if="item.recommend==1">已推荐</span>
              </van-button>
              <!-- 0  未售罄 1 已售罄-->
              <van-button class="mg-rt-5 mg-tb-10" round size="mini" @click="toSoldOut(item)" type="danger">
                <span v-if="item.soldOut==0">未售罄</span>
                <span v-if="item.soldOut==1">已售罄</span>
              </van-button>
              <van-button round size="mini" @click="toEdit(item)" type="warning">编辑</van-button>
              <!-- <van-button class="mg-rt-5 mg-tb-10" round v-if="item.formatFlag==1" size="mini" @click="toFormat(item)" type="info">规格</van-button> -->
              <van-button class="mg-rt-5 mg-tb-10" round @click="blockOrStart(item)" size="mini" type="primary">
                <span v-if="item.status==0">上架中</span>
                <span v-if="item.status==1">下架中</span>
              </van-button>
              <!-- <van-button class="mg-rt-5" round size="mini" @click="toDelete(item)" type="danger">热卖中</van-button> -->
              <van-button class="mg-rt-5 mg-tb-10" round size="mini" @click="toDelete(item)" type="danger">删除</van-button>
            </template>
            <!-- 推荐 -->
            <template #tag>
              <van-tag type="danger" round v-if="item.recommend==1">推荐</van-tag>
            </template>
            <!-- 售罄 -->
            <template #num>
              <!-- <van-button type="danger" round plain v-if="item.soldOut==1">已售罄</van-button> -->
              <span class="ft-se-18 red" type="danger" round plain v-if="item.soldOut==1">已售罄</span>
            </template>
          </van-card>

          <van-row v-if="productList.length==0">
            <van-empty description="可根据经营情况上传具体菜品，如小炒肉、米线、米饭等"/>
          </van-row>
      </van-col>
    </van-row>

    <van-row class="bottom-btn">
      <van-button round style="width:90%;" color="#C83C3C" class="loginOut" @click="toAdd">+ 添加菜品</van-button>
    </van-row>
  </div>
</template>

<script>
import {
  getTypelist,
  upOrDown,
  deleteProduct,
  getProductData,
  getFormatList,
  updateProduct,
  getProductlist
} from "@/api/menu.js";
import { Dialog, Notify } from "vant";
import authImg from '../../../components/authImg.vue';
export default {
  components: { authImg },
  name: "dishesList",
  data() {
    return {
      foodList: [],
      typeList: [],
      formatList: [],
      searchValue: '',
      param: {},

      activeKey: 0,
      productList: [],
      flag:false
    };
  },

  created() {
    if (this.$route.params && Object.keys(this.$route.params).length !== 0) {
      this.getTypelist(this.$route.params.categoryId);
    } else {
      this.getTypelist()
    }
    
    // this.getFormatList();
  },
  methods: {
    getTypelist(val) {
      let param = {
        status: 0
      };
      getTypelist(param).then(res => {
        this.typeList = res.data;
        if (val) {
          this.searchValue = val
          res.data.some((item,index) =>{
            if (item.categoryId == val) {
              this.activeKey = index;
            }
          })
        }else {
          this.searchValue = this.typeList[0].categoryId;
        }
        this.mealStatus = this.typeList[0].mealStatus
        this.onCheck();
      });
    },

    onCheck() {
      // this.productList = []
      let param = {
        categoryId: this.searchValue
      };
      getProductData(param).then(res => {
        // this.foodList = res.data;
        this.flag = true
        this.productList = res.data;
      });
    },

    //返回上一页
    onClickLeft() {
    //   this.$router.go(-1);
    this.$router.push("/index");
    },
    // 推荐
    toRecommend(item){
      let recommend = item.recommend;
      let params = {}
      params.productId = item.productId;
      // params.mealStatus = item.mealStatus;
      if (recommend == 0) {
        params.recommend = 1;
      } else {
        params.recommend = 0;
      }
      upOrDown(params).then(res => {
        if (res.code == 200) {
          // this.$message({
          //   message: "修改成功！",
          //   type: "success"
          // });
          this.onCheck();
        }
      });
    },
    // 售罄
    toSoldOut(item){
      let soldOut = item.soldOut;
      let params = {}
      params.productId = item.productId;
      // params.mealStatus = item.mealStatus;
      if (soldOut == 0) {
        params.soldOut = 1;
      } else {
        params.soldOut = 0;
      }
      upOrDown(params).then(res => {
        if (res.code == 200) {
          // this.$message({
          //   message: "修改成功！",
          //   type: "success"
          // });
          this.onCheck();
        }
      });
    },
    //添加菜品
    toAdd() {
      let param = {
        type: "add",
        categoryId: this.searchValue,
        mealStatus: this.mealStatus,
      };
      this.$router.push({
        path: "/dishesAdd",
        query: { param: JSON.stringify(param) }
      });
    },

    //编辑规格
    toFormat(item) {
      getFormatList().then(res => {
        if (res.code == 200 && res.data.length < 1) {
          this.$message({
            message: "还没有添加规格分类！",
            type: "error"
          });
        } else {
          let param = item;
          this.$router.push({
            path: "/formatEdit",
            query: {
              param: JSON.stringify(item)
            }
          });
        }
      });
    },

    //修改菜品
    toEdit(item) {
      let param = item;
      param.type = "edit";
      this.$router.push({
        path: "/dishesAdd",
        query: {
          param: JSON.stringify(item)
        }
      });
    },

    //上架下架 upOrDown
    blockOrStart(item) {
      let status = item.status;
      this.param.productId = item.productId;
      if (status == 0) {
        this.param.status = 1;
      } else {
        this.param.status = 0;
      }
      upOrDown(this.param).then(res => {
        this.onCheck();
      });
    },
    // 删除菜品
    toDelete(item){
      Dialog.confirm({
        title: "",
        message: "确定删除该菜品吗？"
      })
        .then(() => {
          deleteProduct(item.productId).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: res.msg,
              });
              // this.activeKey = 0
              this.getTypelist(item.categoryId);
            } else {
              this.$message({
                type: "warning",
                message: res.msg,
              });
            }
          });
        })
        .catch(() => {
          
        });
    },
    onChange(index) {
      this.activeKey = index
      this.searchValue = this.typeList[index].categoryId
      this.mealStatus = this.typeList[index].mealStatus
      this.onCheck()
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
.van-card__thumb {
  position: relative;
  -webkit-box-flex: 0;
  -webkit-flex: none;
  flex: none;
  width: 88px;
  height: 88px;
  margin-right: 8px;
}
.van-card__footer {
  -webkit-box-flex: 0;
  -webkit-flex: none;
  flex: none;
  text-align: right !important;
  padding: 10px 0 0 0 !important;
}
.ft-se-10{
  font-size: 10px;
}
</style>