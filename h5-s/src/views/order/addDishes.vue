<template>
  <div class="container">
    <van-nav-bar
      title="加菜"
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
            v-for="(type, index) in typelist"
            :key="index"
            :title="type.categoryName"
            :badge="type.prodNum"
          />
        </van-sidebar>
      </van-col>
      <van-col span="19">
        <van-card
          v-for="(item, index) in productList"
          :key="index"
          class="bg-w card-list ft-se-15"
          :desc="item.productDescribe"
          :centered="true"
        >
          <template slot="thumb">
            <auth-img
              :authSrc="IMG_BASR_URL + item.productImage"
              v-if="flag"
              style="width: 88px; height: 88px"
            ></auth-img>
          </template>
          <template #price>
            <span v-if="item.productPercentPrice == 0">{{
              item.productPrice || ""
            }}</span>
            <span v-else>{{ item.productPercentPrice || "" }}</span>
          </template>
          <template #title>
            <van-row class="mg-bt-5">{{ item.productName }}</van-row>
          </template>
          <template #num>
            <van-stepper
              v-if="item.formatFlag == 0"
              v-model="item.productNum"
              min="0"
              @change="countNum"
            />
            <van-button
              round
              v-if="item.formatFlag == 1"
              type="primary"
              color="#C83C3C"
              @click="showDetailPOP(item, index)"
              size="small"
              >选规格</van-button
            >
          </template>
        </van-card>
      </van-col>
    </van-row>

    <!-- 规格 -->
    <van-popup v-model="show" class="popupW">
      <van-row class="pop-div">
        <van-row class="pd-20 ft-se-16">{{ productInfo.productName }}</van-row>
        <van-row
          class="subItem pd-lt-20 pd-tp-10"
          v-for="(item, index) in curGoodsMap"
          :key="index"
        >
          <van-row span="24" class="itemTitle mg-5">{{
            item.formatName
          }}</van-row>
          <van-row class="itemContent pd-tp-10">
            <van-col
              span="6"
              class="mg-tp-10"
              v-for="(res, resIndex) in item.child"
              :key="resIndex"
              @click="selectItem(res, index, $event, resIndex)"
              :class="subIndex[index] == resIndex ? 'selectActive' : 'itemLi'"
            >
              {{ res.attributesName }}
              <span v-if="res.productPrice > 0">￥{{ res.productPrice }}</span>
            </van-col>
          </van-row>
        </van-row>

        <van-row class="pd-20 tx-rt">
          <van-stepper v-model="selectNum" min="0" />
        </van-row>

        <van-row class="pop-btn pd-5 mg-lt-5">
          <van-col span="24">已选规格:{{ showSelectSpec }}</van-col>
          <van-col span="12" class="tx-lt pd-10 ft-se-20"
            >合计:{{ totalPrice }}</van-col
          >
          <van-col span="12" class="tx-rt pd-10">
            <van-button round color="#C83C3C" @click="addCart"
              >加入购物车</van-button
            >
          </van-col>
        </van-row>
      </van-row>
    </van-popup>

    <van-row class="bottom-btn">
      <van-button
        round
        style="width: 90%"
        color="#C83C3C"
        class="loginOut"
        @click="saveAdd"
        >加入</van-button
      >
    </van-row>
  </div>
</template>

<script>
import { getTypelist, getProductlist, getFormatInfo } from "@/api/menu.js";
import { addProduct } from "@/api/order.js";
import { Toast } from "vant";
import authImg from "../../components/authImg.vue";
export default {
  components: { authImg },
  data() {
    return {
      productInfo: {},
      show: false,
      curGoodsMap: "",
      activeKey: 0,
      orderId: "",
      typelist: [],
      productList: [],
      addList: [],
      showSelectSpec: "",
      active: null,

      productIndex: null,
      selectArr: [], // 存放被选中的值
      subIndex: [], // 是否选中 因为不确定是多规格还是但规格，所以这里定义数组来判断
      nameList: [], //选中规格名
      selectNum: 0,
      dataList: [],
      totalPrice: 0,

      cartList: [], //规格已选购物车
      opType: null, //0:正常订单，1：送餐订单
      flag: false,
    };
  },
  created() {
    let info = JSON.parse(this.$route.query.param);
    this.orderId = info.orderId;
    this.opType = info.opType;
    this.getListData();
  },
  methods: {
    selectItem(res, index, enevt, resIndex) {
      let t = this;
      if (t.selectArr[index] !== res) {
        t.selectArr[index] = res;
        t.subIndex[index] = resIndex;
        t.nameList[index] = res.attributesName;
      } else {
        t.selectArr[index] = null;
        t.subIndex[index] = -1; // 去掉选中的颜色
        t.nameList[index] = null;
      }
      t.checkItem();
    },

    checkItem: function () {
      var self = this;
      var option = self.curGoodsMap;
      var result = []; // 定义数组存储被选中的值
      for (let i in option) {
        result[i] = self.selectArr[i] ? self.selectArr[i] : null;
      }
      for (let i in option) {
        var last = result[i]; // 把选中的值存放到字符串last去
        for (let k in option[i].item) {
          result[i] = option[i].item[k].name; // 赋值，存在直接覆盖，不存在往里面添加name值
        }
        result[i] = last; // 还原，目的是记录点下去那个值，避免下一次执行循环时避免被覆盖
      }
      self.$forceUpdate(); // 重绘
      self.showSelectSpec = self.nameList.join("、");
      // console.log(self.showSelectSpec);
      self.calculateGoodsPrice();
    },

    async calculateGoodsPrice() {
      // 计算最终的商品价格
      let price = this.productInfo.productPrice;
      let originalPrice = this.productInfo.productPercentPrice;

      // 计算 sku 价格
      var total = 0;
      let str = "";
      this.selectArr.forEach((p) => {
        total += p.productPrice;
        str += p.attributesName + "、";
      });
      // 判断截取最后一个逗号
      if (str.length > 0) {
        str = str.substr(0, str.length - 1);
      }
      this.showSelectSpec = str;
      if (originalPrice == null || originalPrice == "") {
        this.totalPrice = total + price;
      } else {
        this.totalPrice = total + originalPrice;
      }
    },

    onClickLeft() {
      if (this.opType == 0) {
        this.$router.push({ path: "/orderDetailTwo?orderId=" + this.orderId });
      } else {
        this.$router.push({ path: "/homeDyTwo?orderId=" + this.orderId });
      }
    },

    //获取分类下的菜品列表
    getListData() {
      getProductlist().then((res) => {
        if (res.code == 200) {
          this.flag = true;
          let resData = res.data;
          this.typelist = resData;
          this.productList = resData[this.activeKey].children;
        }
      });
    },

    //点击选规格显示popup
    showDetailPOP(item, index) {
      this.productIndex = index;
      this.subIndex = [];
      this.selectArr = [];
      this.selectNum = 0;
      this.showSelectSpec = null;
      this.productInfo = item; //当前id
      let param = {
        productId: item.productId,
      };
      getFormatInfo(param).then((res) => {
        if (res.code == 200) {
          this.curGoodsMap = res.data.children;
          this.show = true;
          this.totalPrice = this.productInfo.productPercentPrice;
        }
      });
    },

    onChange(index) {
      this.productList = [];
      // this.productList[index].prodNum = 0;

      setTimeout(() => {
        this.productList = this.typelist[index].children;
      }, 300);
    },

    addCart() {
      if (this.selectArr.length < this.curGoodsMap.length) {
        Toast("请选择规格！");
      } else if (this.selectNum < 1) {
        Toast("请选择数量！");
      } else {
        let index = this.productIndex;
        let res = this.productInfo;
        res.data = this.selectArr;
        res.productNumG = this.selectNum;
        this.cartList.push(JSON.parse(JSON.stringify(res)));
        // this.cartList.push(res);
        this.productList[index].productNum =
          this.productList[index].productNum + this.selectNum;
        this.countNum();
        this.show = false;
      }
    },

    //合计已点数量
    countNum() {
      let sum = 0;
      this.productList.forEach((ele) => {
        sum += ele.productNum;
      });
      if (sum > 0) {
        this.typelist[this.activeKey].prodNum = sum;
      } else {
        this.typelist[this.activeKey].prodNum = null;
      }
    },

    //添加菜品到订单
    saveAdd() {
      this.addList = [];
      this.typelist.forEach((ele) => {
        if (ele.prodNum > 0) {
          ele.children.forEach((item) => {
            if (item.productNum > 0 && item.formatFlag == 0) {
              let info = {
                productId: item.productId,
                productPrice: item.productPrice,
                productNum: item.productNum,
                productPercentPrice: item.productPercentPrice,
                formatFlag: item.formatFlag,
                data: null,
              };
              this.addList.push(info);
            }
          });
        }
      });
      this.cartList.forEach((ele) => {
        let info = {
          productId: ele.productId,
          productPrice: ele.productPrice,
          productNum: ele.productNumG,
          productPercentPrice: ele.productPercentPrice,
          formatFlag: ele.formatFlag,
          data: ele.data,
        };
        this.addList.push(info);
      });

      if (this.addList.length > 0) {
        let params = {
          orderId: this.orderId,
          channel: "1",
          children: this.addList,
          opType: 1, //加菜日志1 增加 2:减少
        };

        // console.log("添加时的数据:" ,params);
        addProduct(params).then((res) => {
          if (res.code == 200) {
            this.$message({
              message: "菜品添加成功！",
              type: "success",
            });

            // this.$router.push({
            //   path: "/orderDetailTwo?orderId=" + this.orderId
            // });
            if (this.opType == 0) {
              this.$router.push({
                path: "/orderDetailTwo?orderId=" + this.orderId,
              });
            } else {
              this.$router.push({ path: "/homeDyTwo?orderId=" + this.orderId });
            }
          }
        });
      }
    },
  },
};
</script>

<style scoped>
.container {
  height: 100%;
  font-size: 0.875rem;
  position: relative;
  overflow: auto;
}
.main {
  margin-bottom: 40px;
}

.bottom-btn {
  height: 45px;
  position: fixed;
  bottom: 5px;
  left: 0;
  right: 0;
  padding: 5px;
  text-align: center;
}

.selectActive {
  background: #c83c3c;
  padding: 8px;
  text-align: center;
  border-radius: 10px;
  color: white;
  margin-right: 8px;
}
.itemLi {
  background: #f2f3f5;
  padding: 8px 3px;
  text-align: center;
  border-radius: 10px;
  margin-right: 8px;
}
.food-img {
  width: 120rpx !important;
  height: 120rpx !important;
  border-radius: 10px;
}
.food-pic {
  width: 120rpx !important;
  height: 120rpx !important;
  border-radius: 10px;
}

.pop-div {
  /* position: relative; */
  width: 100%;
  /* height: 100%; */
  margin: 0 auto;
}

.pop-btn {
  width: 95%;
  /* position: absolute; */
  bottom: 5px;
}
.van-card__thumb {
  position: relative;
  -webkit-box-flex: 0;
  -webkit-flex: none;
  flex: none;
  width: 88px;
  height: 60px;
  margin-right: 8px;
}
.popupW{
	width: 90% ;
	margin: 0 auto;
}
</style>
