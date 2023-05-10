<template>
  <div class="container">
    <van-nav-bar
      title="评价列表"
      left-text
      left-arrow
      class="van-nav-bar-top"
      @click-left="onClickLeft"
    ></van-nav-bar>

    <van-row class="bg-w van-content">
      <van-row class="mg-tp-10 ft-16">
        <van-tabs :v-model:active="active">
          <van-tab title="未回复">
            <van-row class="pd-10">
              <van-row v-if="orderList.length == 0">
                <van-empty description="暂无数据" />
              </van-row>
              <template v-else>
                <!-- <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="- 没有更多了 -"
                    @load="onLoad"
                    :offset="130"
                  > -->
                <van-row
                  class="mg-bt-10 bx-sd bg-w pd-10 bd-rd comList"
                  v-for="(order, index) in orderList"
                  :key="index"
                  @click="detail(order)"
                >
                <div class="flex-col flex-wrap ft-se-14">
                  <div class="flex-col-4 listLeft">
                    <img v-if="order.avatar" class="myimage" :src="order.avatar"></img>
                    <img v-else class="myimage" :src="imgUser"></img>
                  </div>
                  <div class="flex-col-20">
                    <div class="flex-col-24">
                      <div>{{order.userName}}</div>
                      <div class="fl-rt clr-999">{{order.commentCreateTime}}</div>
                    </div>
                    <div class="flex-col-24">
                      <van-rate
                        size="14"
                        gutter="1"
                        :value="order.star"
                        readonly
                      />
                    </div>
                  </div>
                </div>
                <div class="mg-tp-5">
                  <div>{{ order.content }}</div>
                </div>
                </van-row>
                
                <!-- <van-row
                  class="mg-bt-10 bx-sd bg-w pd-10 bd-rd comList"
                  v-for="(order, index) in orderList"
                  :key="index"
                  @click="detail(order)"
                >
                <div class="">
                  <div class="flex-col flex-wrap">
                    <div class="flex-col-4 listLeft">
                      <img class="myimage" :src="order.avatar"></img>
                    </div>
                    <div class="flex-col-20">
                      <div class="flex-col-24">
                        <div>{{order.userName}}</div>
                        <div class="fl-rt clr-999">{{order.commentCreateTime}}</div>
                      </div>
                      <div class="flex-col-24">
                        <van-rate size="14" gutter="1" :value="order.star" readonly />
                      </div>
                    </div>
                  </div>
                  <div class="mg-tp-10">
                    <div>{{ order.content }}</div>
                  </div>
                  <div class="flex-col flex-wrap">
                    <div class="flex-col-8" v-if="order.commentImages.length >0" v-for="(imgUrl, index) in order.commentImages" :key="index">
                      <img class="com-img" :src='IMG_BASR_URL+imgUrl'></image>
                    </div>
                  </div>
                </div>
                </van-row> -->
                <!-- </van-list> -->
              </template>
            </van-row>
          </van-tab>

          <van-tab title="已回复" class="pd-10">
            <van-row v-if="reservationList.length == 0">
              <van-empty description="暂无数据" />
            </van-row>
            <template v-else>
            <van-row
              class="mg-bt-10 bx-sd pd-10 bd-rd bg-w"
              v-for="(info, index) in reservationList"
              :key="index"
              @click="detail(info)"
            >
                <div class="flex-col flex-wrap ft-se-14">
                  <div class="flex-col-4 listLeft">
                    <img v-if="info.avatar" class="myimage" :src="info.avatar"></img>
                    <img v-else class="myimage" :src="imgUser"></img>
                  </div>
                  <div class="flex-col-20">
                    <div class="flex-col-24">
                      <div>{{info.userName}}</div>
                      <div class="fl-rt clr-999">{{info.commentCreateTime}}</div>
                    </div>
                    <div class="flex-col-24">
                      <van-rate
                        size="14"
                        gutter="1"
                        :value="info.star"
                        readonly
                      />
                    </div>
                  </div>
                </div>
                <div class="mg-tp-5">
                  <div>{{ info.content }}</div>
                </div>
                <div v-if="info.replyFlag == '0'">
                  <div class="pd-tp-15 ft-se-12" v-for="(replay, index) in info.children" :key="index">商家回应:
                      <div>{{replay.replyContent}}</div>
                  </div>
                </div>
            </van-row>
            </template>
          </van-tab>
        </van-tabs>
      </van-row>
    </van-row>
    </van-popup>
  </div>
</template>

<script>
import DateClass from "@/utils/date.js";
import { getCommentList, replyUser } from "@/api/evaluate.js";

export default {
  data() {
    return {
      imgUser:require("@/assets/login/user1.png"),
      active: 0,
      loading: false,
      finished: true,

      orderList: [],
      reservationList: [],

      page: 1,
      loading: false, // 当loading为true时，转圈圈
      finished: false, // 数据是否请求结束，结束会先显示- 没有更多了 -
      myList: [],
      noData: false, // 如果没有数据，显示暂无数据
      isLoading: false, // 下拉的加载图案
      smsReplay:'', //商家回复内容
    };
  },

  created() {
    this.startTimeShow = DateClass.dealTime(6);
    this.endTimeShow = DateClass.dealTime(6);
    this.getCommentList();
    this.getReservationOrder();
  },

  methods: {
    // 详情
    detail(order){
      // console.log(order,'order');
      this.$router.push({ name: "evaluateDetail", params: order });
    },
    getInfo() {
      getCommentList()
        .then((res) => {
          // 当请求成功
          if (res.code == 200) {
            this.loading = false;
            this.myList = this.myList.concat(res.rows);
            this.page++;
            // 如果没有数据，显示暂无数据
            if (this.myList.length === 0 && this.page === 1) {
              this.noData = true;
            }
            // 如果加载完毕，显示没有更多了
            if (res.data.length === 0) {
              this.finished = true;
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 列表加载
    onLoad() {
      //   setTimeout(() => {
      //    this.getInfo();
      //    this.loading = true;
      //   }, 500);
    },
    onRefresh() {
      setTimeout(() => {
        // 重新初始化这些属性
        this.isLoading = false;
        this.myList = [];
        this.page = 1;
        this.loading = false;
        this.finished = false;
        this.noData = false;
        // 请求信息
        // this.getInfo();
      }, 500);
    },

    onSubmit() {},

    //商家未回复
    getCommentList() {
      let param = {
        replyFlag: "1",
      };
      getCommentList(param).then((res) => {
        this.orderList = res.rows;
      });
    },

    //商家已回复
    getReservationOrder() {
      let param = {
        replyFlag: "0",
      };
      getCommentList(param).then((res) => {
        if (res.code == 200) {
          this.reservationList = res.rows;
        }
      });
    },
    onClickLeft() {
      //   this.$router.go(-1);
      this.$router.push({ path: "/index" });
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  font-size: 0.875rem;
  position: relative;
  overflow: auto;
}
.van-content {
  margin-bottom: 40px;
}
.comList {
  padding-bottom: 10px;
  padding-right: 8px;
  padding-left: 7px;
  margin-bottom: 15px;
  border-bottom: 1px solid #ececec;
}

.fl-rt {
  float: right;
}

.listLeft {
  width: 50px;
  height: 50px;
  margin-right: 5px;
}

.myimage {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
/* 评论图片 */
.com-img {
  display: block;
  width: 80px;
  height: 80px;
  margin: 10px;
}
.clr-999{
  color: #999;
}
.cells {
  max-width: 100%;
  background-color: #FFF;
  /* padding: 20rpx 30rpx 20rpx 30rpx; */
  padding-top: 20rpx;
  /* border-bottom: 0.0625rem solid var(--border-color); */

  display: -webkit-box;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -webkit-box-pack: start;
  -webkit-box-align: center;

  display: -ms-flexbox;
  -ms-flex-wrap: nowrap;
  -ms-flex-direction: row;
  -ms-flex-pack: start;
  -ms-flex-align: center;
  -ms-flex-line-pack: center;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
}
.ft-16 ::v-deep .van-tab {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 0 4px;
    color: #646566;
    font-size: 1rem;
    line-height: 20px;
    cursor: pointer;
}
</style>
