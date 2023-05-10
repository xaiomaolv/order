<template>
  <div class="container">
    <van-nav-bar
      title="详情"
      left-text
      left-arrow
      class="van-nav-bar-top"
      @click-left="onClickLeft"
    ></van-nav-bar>

    <div class="pd-10 main">
      <!-- 0=-待支付，1，上菜，2，待付款，50-已支付，90-已退款 ,91 已取消 -->
      <van-row
        class="tp-card pd-20 bd-rd bg-w"
        v-if="orderInfo.orderStatus == '0'"
      >
        <van-icon name="clock-o" size="26" class="mg-rt-5" color="#FF9A35" />
        <span class="size-1-5">待处理</span>
      </van-row>
      <van-row
        class="tp-card pd-20 bd-rd bg-w"
        v-if="orderInfo.orderStatus == '1'"
      >
        <van-icon name="passed" size="26" class="mg-rt-5" color="#22A473" />
        <span class="size-1-5">上菜中</span>
      </van-row>
      <van-row
        class="tp-card pd-20 bd-rd bg-w"
        v-if="orderInfo.orderStatus == '2'"
      >
        <van-icon name="passed" size="26" class="mg-rt-5" color="#22A473" />
        <span class="size-1-5">待支付</span>
      </van-row>
      <van-row
        class="tp-card pd-20 bd-rd bg-w"
        v-if="orderInfo.orderStatus == '50'"
      >
        <van-icon name="passed" size="26" class="mg-rt-5" color="#22A473" />
        <span class="size-1-5">已完成</span>
      </van-row>

      <van-row class="bd-rd mg-tp-10 pd-10 bg-w">
        <van-cell>
          <!-- 使用 title 插槽来自定义标题 -->
          <template #title>
            <span class="custom-title ft-se-20">{{ orderInfo.tableName }}</span>
          </template>

          <template #label>
            <van-cell-group>
              <van-field
               v-if="orderInfo.orderNo"
                size="large"
                label="订单编号"
                input-align="right"
                colon
                v-model="orderInfo.orderNo"
                readonly
              />
              <van-field
                v-if="orderInfo.orderTime"
                size="large"
                label="下单时间"
                input-align="right"
                colon
                v-model="orderInfo.orderTime"
                readonly
              />
              <van-field
                v-if="orderInfo.payTime"
                size="large"
                label="支付时间"
                input-align="right"
                colon
                :value="orderInfo.payTime | formatPayTime"
                readonly
              />
              <!-- <van-cell v-if="orderInfo.remark">
                <template #title>
                  <span class="custom-title">备注:</span>
                </template>
              </van-cell> -->
              <van-field
                size="large"
                label="备注"
                colon
                v-if="orderInfo.remark"
                v-model="orderInfo.remark"
                type="textarea"
                readonly
                input-align="right"
              ></van-field>
              <van-divider
                :style="{ color: '#E60000', borderColor: '#E60000' }"
                class="mg-tp-13p"
              >
                菜品详情
              </van-divider>
            </van-cell-group>

            <van-row>
              <van-row style="margin-top: -13px" justify="center">
                <van-col span="12" class="pd-10-3">
                  <van-button
                    size="mini"
                    color="#C83C3C"
                    style="width: 100%"
                    @click="toAdd"
                    v-if="orderInfo.orderStatus < 50"
                    >加菜</van-button
                  >
                </van-col>
                <van-col span="12" class="pd-10-3">
                  <van-button
                    size="mini"
                    color="green"
                    style="width: 100%"
                    v-if="orderInfo.orderStatus < 50"
                    @click="moveFood"
                    >退菜</van-button
                  >
                </van-col>
              </van-row>
              <van-card
                v-for="(item, index) in showdetailList"
                :key="index"
                class="bg-w card-list ft-se-15"
                :centered="true"
              >
                <template #title>
                  <van-row class="">
                    <span style="font-size: 14px">{{ item.productName }}</span>
                    <van-button
                      size="mini"
                      color="#409eff"
                      v-if="item.productStatus == 0 && disabled == true"
                      style="float: right; width: 18%"
                      @click="serveFoodBtn(item)"
                      >上菜</van-button
                    >
                    <van-button
                      class="greyBtn"
                      size="mini"
                      disabled
                      v-if="item.productStatus == 1"
                      style="float: right; width: 18%"
                      >已上菜</van-button
                    >
                    <!-- <van-button size="mini" color="#409eff" v-if="item.productStatus == 0 && disabled==false && item.productNum == 1" style="float:right;width:18%" @click="moveFood(item)">退菜</van-button> -->
                    <van-stepper
                      style="float: right"
                      min="0"
                      disable-input
                      :disable-plus="addDisable"
                      v-if="item.productStatus == 0 && disabled == false"
                      :disabled="disabled"
                      v-model="item.productNum"
                    />
                  </van-row>
                </template>
                <template #desc>
                  <span>{{ item.attributesName || "" }}</span>
                </template>
                <template #price>
                  <span class="ft-se-15" style="font-size: 15px !important"
                    >x{{ item.productNum || "0" }}</span
                  >
                  <span
                    v-if="item.productPercentPrice == 0"
                    class="mg-lt-10 ft-se-12"
                    >￥{{ item.productPrice + item.addPrice || "" }}</span
                  >
                  <span v-else class="mg-lt-10 ft-se-12"
                    >￥{{ item.productPercentPrice + item.addPrice || "" }}</span
                  >
                </template>
              </van-card>
            </van-row>
            <!-- <div v-if="orderInfo.mealFee > 0" class="tx-rt ft-se-14 mg-tp-10 pd-rt-16">
              餐位费:
              <span
                >{{ orderInfo.mealFee }} X {{ orderInfo.diningNum }} = ￥{{
                  orderInfo.mealFeeTotal
                }}</span
              >
            </div> -->
            <van-field
              v-if="orderInfo.mealFee > 0 && orderInfo.orderStatus != '50'"
              size="mini"
              input-align="right"
              readonly
            >
              <template #input>
                <div class="flex-col">
                  <div class="mg-lt-5 ft-se-14 mg-rt-5">
                    餐位费：{{ orderInfo.mealFee }} x
                  </div>
                  <van-stepper
                    v-model="orderInfo.diningNum"
                    input-width="20px"
                    button-size="22"
                    disable-input
                    @change="onChange"
                  />
                </div>
              </template>
            </van-field>
            <van-field size="large" input-align="right" readonly>
              <template #input>
                <div
                  class="sq-btn"
                  size="small"
                  color="#409eff"
                  v-if="
                    (orderInfo.dealStatus == '0' && disabled) ||
                    checkAll == true
                  "
                  @click="saveFoodAll"
                >
                  菜已上齐
                </div>
                <div v-if="orderInfo.orderAmountTotal">
                  合计：<span class="ft-se-16"
                    >￥{{ orderInfo.orderAmountTotal }}</span
                  >
                </div>
              </template>
            </van-field>
          </template>
        </van-cell>

        <van-row class="pd-10-16 mg-bt-15" v-if="addRecords.length > 0">
          <div class="mg-bt-10">加菜记录</div>
          <div
            class="flex-col ft-se-12 flex-col-item li-hg-20"
            v-for="(item, index) in addRecords"
            :key="index"
          >
            <div class="flex-col-12">{{ item.createTime }}</div>
            <div class="flex-col-12 tx-rt">
              <div v-for="(child, index1) in item.list" :key="index1">
                <span>{{ child.productName }} x{{ child.productNum }}</span>
              </div>
            </div>
          </div>
        </van-row>
        <van-row class="mg-bt-15 pd-10-16" v-if="moveRecords.length > 0">
          <div class="mg-bt-10">退菜记录</div>
          <div
            class="flex-col ft-se-12 flex-col-item li-hg-20"
            v-for="(item, index) in moveRecords"
            :key="index"
          >
            <div class="flex-col-12">{{ item.createTime }}</div>
            <div class="flex-col-12 tx-rt">
              <div v-for="(child, index1) in item.list" :key="index1">
                <span>{{ child.productName }} x{{ child.productNum }}</span>
              </div>
            </div>
          </div>
        </van-row>
      </van-row>
    </div>

    <van-row class="bottom-btn" v-if="orderInfo.orderStatus">
      <van-button
        round
        v-if="orderInfo.orderStatus != '50' && disabled == false"
        style="width: 90%"
        color="#C83C3C"
        class="loginOut"
        @click="saveEdit"
        >确认退菜</van-button
      >
      <van-button
        round
        v-if="orderInfo.orderStatus != '50' && disabled == true"
        style="width: 90%"
        color="#C83C3C"
        class="loginOut"
        @click="confirmPayment"
        >确认支付</van-button
      >
    </van-row>
  </div>
</template>

<script>
import { setToken } from "@/utils/auth";
import {
  getOrderInfo,
  addAndSubtractProduct,
  updateProductStatus,
  updateOrderStatus,
  addDiningNum,
} from "@/api/order.js";
import DateClass from "@/utils/date";

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
      orderInfoOld: {},
      showMore: true, //显示更多--热门产品
      addDisable: true, //禁止加号点击
      //加菜记录
      addRecords: [],
      moveRecords: [],
      intervalId:null, //计时器
    };
  },
  filters: {
    formatPayTime: (nowTimer) => {
      return DateClass.timestampToTime(nowTimer);
    },
  },

  created() {
    this.orderId = this.$route.query.orderId;
    this.getOrderInfo(this.orderId);
    this.dataRefreh();
  },
  destroyed(){
    // 在页面销毁后，清除计时器
    this.clear();
  },
  computed: {
    showdetailList: {
      get: function () {
        let dataList = this.orderInfo.children;
        // if (this.showMore) {
        //   if (dataList.length < 4) {
        //     return dataList;
        //   }
        //   let newArr = [];
        //   for (var i = 0; i < 3; i++) {
        //     let item = dataList[i];
        //     newArr.push(item);
        //   }
        //   return newArr;
        // }
        return dataList;
      },

      set: function (val) {
        this.showdetailList = val;
      },
    },
  },

  methods: {
    // 定时刷新数据函数
    dataRefreh() {
      // 计时器正在进行中，退出函数
      if (this.intervalId != null) {
        return;
      }
      // 计时器为空，操作
      this.intervalId = setInterval(() => {
        console.log("刷新" + new Date());
        this.getOrderInfo(this.orderId);
      }, 5000);
    },
    // 停止定时器
    clear() {
      clearInterval(this.intervalId); //清除计时器
      this.intervalId = null; //设置为null
    },
    // 时间去重
    solution(arr, key) {
      let newArr = [];
      let newObj = {};
      let temp = {}; // 利用对象的key值不允许重复的特性

      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (temp.hasOwnProperty(item[key])) {
          newObj.list.push(item);
        } else {
          newObj = {
            [key]: item[key],
            list: [item],
          };
          temp[item[key]] = item[key];
          newArr.push(newObj);
        }
      }
      return newArr;
    },
    changeFoldState() {
      this.showMore = !this.showMore;
    },

    onClickLeft() {
      //   this.$router.go(-1);
      this.$router.push({ path: "/orderList" });
    },

    //获取订单详细信息
    getOrderInfo(orderId) {
      getOrderInfo(orderId).then((res) => {
        if (res.code == 200) {
          if (res.data.mealFee > 0) {
            res.data.mealFeeTotal = res.data.mealFee * res.data.diningNum;
          }
          this.orderInfo = res.data;
          this.orderInfoOld = JSON.stringify(res.data);
          // 加菜
          res.data.addOpLogs.forEach((item) => {
            item.createTime = DateClass.timestampToTime(item.createTime);
          });
          this.addRecords = this.solution(res.data.addOpLogs, "createTime");
          // 退菜
          res.data.subOpLogs.forEach((item) => {
            item.createTime = DateClass.timestampToTime(item.createTime);
          });
          this.moveRecords = this.solution(res.data.subOpLogs, "createTime");
          if (res.data.orderStatus == '50') {
            this.disabled = true
            this.clear()
          }
          this.disabled = true
        }
      });
    },
    // 退菜
    moveFood(val) {
      this.disabled = false;
      this.clear();
    },
    saveEdit() {
      // opType: //加菜日志1 增加 2:减少
      let params = this.orderInfo;
      if (JSON.stringify(params) !== this.orderInfoOld) {
        params.opType = 2;
        addAndSubtractProduct(params).then((res) => {
          if (res.code == 200) {
            this.$message({
              message: "已保存修改",
              type: "success",
            });
            this.disabled = true;
            this.getOrderInfo(this.orderId);
            this.dataRefreh();
          }
        });
      } else {
        this.$message.warning("数据没有修改，请先修改数据再提交！");
      }
    },

    //上菜操作
    serveFoodBtn(val) {
      let param = {
        orderId: this.orderId,
        productOrderId: val.productOrderId,
        selectAll: false,
        single: true,
        orderType: this.orderInfo.orderType,
      };
      this.serveFood(param);
    },
    // 菜已上齐
    saveFoodAll() {
      let param = {
        orderId: this.orderId,
        productOrderId: null,
        selectAll: true,
        single: false,
        orderType: this.orderInfo.orderType,
      };
      this.serveFood(param);
    },
    //上菜
    serveFood(param) {
      updateProductStatus(param).then((res) => {
        if (res.code == 200) {
          this.getOrderInfo(this.orderId);
        }
      });
    },

    //确认支付操作
    confirmPayment() {
      let params = {
        orderId: this.orderId,
        orderStatus: "50",
        orderType: this.orderInfo.orderType,
      };
      updateOrderStatus(params).then((res) => {
        if (res.code == 200) {
          this.getOrderInfo(this.orderId);
          this.clear();
        }
      });
    },

    //去加菜
    toAdd() {
      // opType 0:正常订单，1：送餐订单
      let resData = {
        orderId: this.orderId,
        opType:0
      };
      this.$router.push({
        path: "/addDishes",
        query: { param: JSON.stringify(resData) },
      });
    },
    // 就餐人数变化
    onChange(e) {
      let params = {
        tableId: this.orderInfo.tableId,
        diningNum: e,
        orderId: this.orderInfo.orderId,
      };
      addDiningNum(params).then((res) => {
        if (res.code == 200) {
          this.getOrderInfo(this.orderId);
        }
      });
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
  /* height: 110px; */
  border-bottom: 1px dashed #c4c4c4;
}

.main {
  margin-bottom: 40px;
}

.bottom-btn {
  z-index: 1111;
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
.pd-10-3 {
  padding: 0.3rem;
}
.pd-rt-16 {
  padding-right: 16px;
}
.mg-tp-13p {
  margin-top: -3px;
}
.greyBtn.van-button--default {
  color: #323233;
  background-color: #c0c4cc;
  border: 1px solid #ebedf0;
}
.sq-btn {
  border: 1px solid #409eff;
  background: #409eff;
  width: 40%;
  text-align: center;
  border-radius: 5px;
  color: white;
  margin-right: 10px;
}
.pd-10-16 {
  padding: 10px 16px;
}
.van-card {
  position: relative;
  box-sizing: border-box;
  padding: 0px 16px;
  color: #323233;
  font-size: 12px;
  background-color: #fafafa;
}
.van-card__content {
  position: relative;
  display: flex;
  -webkit-box-flex: 1;
  flex: 1;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  min-width: 0;
  min-height: 74px;
}
</style>
