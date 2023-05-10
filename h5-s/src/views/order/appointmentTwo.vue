<template>
  <div class="container">
    <van-nav-bar title="预约详情" left-text left-arrow class="van-nav-bar-top" @click-left="onClickLeft"></van-nav-bar>

    <div class="pd-10 main">
      <van-row class="tp-card pd-20 bd-rd bg-w" v-if="orderInfo.reserveStatus==0">
        <van-icon name="clock-o" size="26" class="mg-rt-5" color="#FF9A35"/>
        <span class="size-1-5">待处理</span>
      </van-row>
      <van-row class="tp-card pd-20 bd-rd bg-w" v-if="orderInfo.reserveStatus==1">
        <van-icon name="passed" size="26" class="mg-rt-5" color="#22A473"/>
        <span class="size-1-5">已确认</span>
      </van-row>
      <van-row class="tp-card pd-20 bd-rd bg-w" v-if="orderInfo.reserveStatus == 2">
        <van-icon name="passed" size="26" class="mg-rt-5" color="#22A473"/>
        <span class="size-1-5">已取消</span>
      </van-row>

      <van-row class="bd-rd mg-tp-10 pd-10 bg-w">
        <van-cell v-if="orderInfo.orderType == 0">
            <van-cell-group>
              <van-field
                size="large"
                label="到店时间"
                input-align="right"
                colon
                :value="orderInfo.mealTime"
                readonly
              />
              <van-field
                size="large"
                label="预约人"
                input-align="right"
                colon
                :value="orderInfo.reserveName"
                readonly
              />
              <van-field
                size="large"
                label="联系电话"
                input-align="right"
                colon
                :value="orderInfo.userPhone"
                readonly
              />
              <van-field
                size="large"
                label="用餐人数"
                input-align="right"
                colon
                :value="orderInfo.mealPerson+'人'"
                readonly
              />
              <!-- <van-field
                size="large"
                label="是否点餐"
                input-align="right"
                colon
                :value="orderInfo.orderType == '1' ? '是' : '否'"
                readonly
              /> -->
            </van-cell-group>
        </van-cell>
        <van-cell v-if="orderInfo.orderType == 1">
          <!-- 使用 title 插槽来自定义标题 -->
          <template #title>
            <span class="custom-title ft-se-20">预约菜品</span>
          </template>

          <template #label>
            <van-cell-group>
              <van-field
                size="large"
                label="订单编号"
                input-align="right"
                colon
                v-model="orderInfo.orderNo"
                readonly
              />
              <van-field
                size="large"
                label="下单时间"
                input-align="right"
                colon
                v-model="orderInfo.orderTime"
                readonly
              />
              <van-field
              size="large"
              label="支付时间"
              input-align="right"
              colon
              v-model="orderInfo.payTime"
              readonly
            />
            <van-field
                label="备注"
                input-align="right"
                colon
                v-model="orderInfo.remark"
                readonly
              />
              <van-field size="large" input-align="right" readonly>
                <template #label>
                  <div>{{orderInfo.productNum}}件菜品</div>
                </template>
                <template #input>
                  <div>
                    预计收入
                    <span class="total">￥{{orderInfo.orderAmountTotal}}</span>
                  </div>
                </template>
              </van-field>
              <van-divider :style="{ color: '#E60000', borderColor: '#E60000'}">
                菜品详情
                <van-icon name="edit" size="18" class="mg-lt-10" @click="edit"/>
              </van-divider>
            </van-cell-group>

            <van-row>
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
                :disabled="orderInfo.orderStatus == 1?true:false"
              >全选</el-checkbox>
              <el-checkbox-group
                text-color="#E00D01"
                fill="#E00D01"
                v-model="checkedFoods"
                @change="handleCheckedFoodsChange"
              >
                <van-card
                  v-for="(item,index) in showdetailList"
                  :key="index"
                  class="bg-w card-list ft-se-15"
                  :price="item.price"
                  :centered="true"
                >
                  <template thumb-class="food-img" #thumb>
                    <van-image :src="IMG_BASR_URL+item.productImage" class="food-pic"></van-image>
                  </template>
                  <template #title>
                    <van-row class="mg-bt-5">
                      {{item.productName}}
                      <el-checkbox
                        :label="item.productOrderId"
                        v-if="item.productStatus == 0"
                        style="float:right;"
                      >待上菜</el-checkbox>
                      <el-checkbox
                        :label="item.productOrderId"
                        v-if="item.productStatus == 1"
                        :disabled="true"
                        style="float:right;"
                      >已上菜</el-checkbox>
                    </van-row>
                  </template>
                  <template #desc>
                    {{item.attributesName || ''}}
                  </template>
                  <template #num>
                    <van-stepper min="0" :disabled="disabled " v-model="item.productNum"/>
                  </template>
                </van-card>

                <van-row v-if="orderInfo.children.length > 3" class="tx-ct mg-10">
                  <el-button
                    type="default"
                    size="mini"
                    @click="changeFoldState"
                  >{{showMore?'查看更多':'收起'}}</el-button>
                </van-row>
              </el-checkbox-group>
              <van-row
                class="pd-10 mg-tp-10 tx-ct bx-sd"
                @click="toAdd"
                v-if="orderInfo.orderStatus != 1"
              >
                <span class="ft-se-14" style="color:#E60000;">+ 加菜</span>
              </van-row>
            </van-row>
          </template>
        </van-cell>
      </van-row>
    </div>

    <van-row class="bottom-btn">
      <van-button
        round
        v-if="disabled == false"
        style="width:90%;"
        color="#C83C3C"
        class="loginOut"
        @click="saveEdit"
      >保存</van-button>
      <van-button
        round
        v-if="orderInfo.reserveStatus != 50 && orderInfo.orderStatus == 0 && disabled==true"
        style="width:90%;"
        color="#C83C3C"
        class="loginOut"
        @click="confirmPayment"
      >确认支付</van-button>
      <van-button
        round
        v-if="orderInfo.reserveStatus == 0 && disabled==true"
        style="width:40%;"
        color="#C83C3C"
        class="loginOut mg-rt-10"
        @click="confirmOrder"
      >确认</van-button>
      <van-button
        round
        v-if="orderInfo.reserveStatus == 0 && disabled==true"
        style="width:40%;"
        color="#C83C3C"
        class="loginOut mg-lt-10"
        @click="cancelOrder"
      >取消</van-button>
    </van-row>
  </div>
</template>

<script>
import { setToken } from "@/utils/auth";
import {
  getOrderInfo,
  getOrderInfoReserve,
  addAndSubtractProduct,
  updateProductStatus,
  updateOrderStatus,
  updateReserve
} from "@/api/order.js";

export default {
  data() {
    return {
      orderId: "",
      checkAll: false,
      isIndeterminate: true,
      checkedFoods: [],
      disabled: true,
      activeNames: ["1"],
      orderInfo: {},
      orderType:'', //是否提前点餐
      reserveId:'',
      showMore: true //显示更多--热门产品
    };
  },

  created() {
    // this.appointment = JSON.parse(this.$route.query.appointment);
    // this.orderType = this.appointment.orderType
    this.reserveId = this.$route.query.reserveId
    this.orderId = this.$route.query.orderId
    if (this.orderId) {
      this.getOrderInfo(this.orderId);
    } else {
      this.getOrderInfoR(this.reserveId);
    }

  },

  computed: {
    showdetailList: {
      get: function() {
        let dataList = this.orderInfo.children;
        if (this.showMore) {
          if (dataList.length < 4) {
            return dataList;
          }
          let newArr = [];
          for (var i = 0; i < 3; i++) {
            let item = dataList[i];
            newArr.push(item);
          }
          return newArr;
        }
        return dataList;
      },

      set: function(val) {
        this.showdetailList = val;
      }
    }
  },

  methods: {
    changeFoldState() {
      this.showMore = !this.showMore;
    },

    onClickLeft() {
      //   this.$router.go(-1);
      this.$router.push({ path: "/orderList" });
    },

    //获取订单详细信息
    getOrderInfo(orderId) {
      getOrderInfo(orderId).then(res => {
        if (res.code == 200) {
          this.orderInfo = res.data;
        }
      });
    },
    //获取预约未点餐详细信息
    getOrderInfoR(reserveId) {
      getOrderInfoReserve(reserveId).then(res => {
        if (res.code == 200) {
          this.orderInfo = res.data;
        }
      });
    },
    //商家加减菜品数量
    edit() {
      this.disabled = false;
      let params = {
        orderId: this.orderInfo.orderId,
        productId: "1",
        orderStatus: "2",
        selectAll: this.checkAll,
        single: true
      };
    },

    saveEdit() {
      let params = this.orderInfo;
      addAndSubtractProduct(params).then(res => {
        if (res.code == 200) {
          this.$message({
            message: "已保存修改",
            type: "success"
          });
          this.disabled = true;
          this.getOrderInfo(this.orderInfo.orderId);
        }
      });
    },

    //上菜操作
    //全选
    handleCheckAllChange(val) {
      let arr = this.orderInfo.children;
      let checkedList = [];
      arr.forEach((e, index) => {
        checkedList.push(e.productOrderId);
      });
      this.checkedFoods = val ? checkedList : [];
      this.isIndeterminate = false;
      let param = {
        orderId: this.orderId,
        productOrderId: null,
        selectAll: true,
        single: false
      };
      this.serveFood(param);
    },
    handleCheckedFoodsChange(value) {
      let productId = value[value.length - 1];
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.orderInfo.children.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.orderInfo.children.length;
      let param = {
        orderId: this.orderId,
        productOrderId: productId,
        selectAll: false,
        single: true,
        orderType: this.orderInfo.orderType,
      };
      this.serveFood(param);
    },
    //上菜
    serveFood(param) {
      updateProductStatus(param).then(res => {
        if (res.code == 200) {
          this.getOrderInfo(this.orderId);
        }
      });
    },

    //确认操作
    confirmOrder() {
      let params = {
        orderId: this.orderId,
        reserveId : this.reserveId,
        reserveStatus: "1"
      };
      let tt = JSON.parse(JSON.stringify(params))
      if (this.orderId) {
        updateReserve(tt).then(res => {
          if (res.code == 200) {
            this.getOrderInfo(this.orderId);
          }
        });
      }else {
        updateReserve(tt).then(res => {
          if (res.code == 200) {
            this.getOrderInfoR(this.reserveId);
          }
        });
      }
    },
    // 取消
    cancelOrder(){
      let params = {
        orderId: this.orderId,
        reserveId : this.reserveId,
        reserveStatus: "2"
      };
      let tt = JSON.parse(JSON.stringify(params))
      if (this.orderId) {
        updateReserve(tt).then(res => {
          if (res.code == 200) {
            this.getOrderInfo(this.orderId);
          }
        });
      }else {
        updateReserve(tt).then(res => {
          if (res.code == 200) {
            this.getOrderInfoR(this.reserveId);
          }
        });
      }
    },
    // 确认支付
    confirmPayment(){
      let params = {
        orderType: this.orderInfo.orderType,
        orderId: this.orderId,
        orderStatus: "50"
      };
      let tt = JSON.parse(JSON.stringify(params))
      if (this.orderId) {
        updateOrderStatus(tt).then(res => {
          if (res.code == 200) {
            this.getOrderInfo(this.orderId);
          }
        });
      }else {
        updateReserve(tt).then(res => {
          if (res.code == 200) {
            this.getOrderInfoR(this.reserveId);
          }
        });
      }
    },

    //去加菜
    toAdd() {
      let resData = {
        orderId: this.orderId
      };
      this.$router.push({
        path: "/addDishes",
        query: { param: JSON.stringify(resData) }
      });
    }
  }
};
</script>

<style scoped>
.container {
  height: 100%;
  font-size: 0.875rem;
  position: relative;
  overflow: auto;
}
.size-1-5 {
  font-size: 1.3rem;
}
.tp-card {
  display: flex;
  justify-content: center;
  text-align: center;
  box-shadow: 0 -5px 5px #f5f2f2, 2px 2px 2px #f5f2f2, 0 5px 5px #f5f2f2,
    2px 2px 2px #f5f2f2;
}
.card-list {
  height: 110px;
  border-bottom: 1px dashed #c4c4c4;
}

.main {
  margin-bottom: 50px;
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
.food-pic {
  width: 100%;
  height: 70px;
}
</style>
