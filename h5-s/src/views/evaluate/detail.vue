<template>
  <div class="container">
    <van-nav-bar
      title="评价详情"
      left-text
      left-arrow
      class="van-nav-bar-top"
      @click-left="onClickLeft"
    ></van-nav-bar>

    <van-row
        class="mg-bt-10 bx-sd pd-10 bd-rd van-content"
    >
        <div class="flex-wrap">
            <div class="flex-col flex-wrap">
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
                <van-rate size="14" gutter="1" :value="info.star" readonly />
                </div>
            </div>
            </div>
            <div class="mg-tp-10">
            <div>{{ info.content }}</div>
            </div>
            <div class="flex-col flex-wrap">
            <div class="flex-col-8" v-if="info.commentImages.length >0" v-for="(imgUrl, index) in info.commentImages" :key="index">
                <!-- <img class="com-img" :src='IMG_BASR_URL+imgUrl'></image> -->
                <auth-img class="com-img" :authSrc="IMG_BASR_URL+imgUrl"></auth-img>
            </div>
            </div>
        </div>
        <!-- 商家回应 -->
        <div v-if="info.replyFlag == '0'">
            <div class="pd-tp-15 ft-se-12 li-hg-18" v-for="(replay, index) in info.children" :key="index">商家回应:
                <div class="clr-999">{{replay.replyCreateTime}}</div>
                <div>{{replay.replyContent}}</div>
            </div>
        </div>
        <!-- 回复用户 -->
        <van-cell-group inset v-if="info.replyFlag == '1'" class="mg-tp-20" style="margin: 20px 0px;">
        <van-field
            v-model="smsReplay"
            clearable
            type="textarea"
            placeholder="说点什么吧..."
        >
            <template #button>
            <van-button size="small" type="primary" color="#C83C3C" @click="replayUser()">回复</van-button>
            </template>
        </van-field>
        </van-cell-group>
    </van-row>
  </div>
</template>

<script>
import DateClass from "@/utils/date.js";
import { replyUser } from "@/api/evaluate.js";
import { Toast } from "vant";
import authImg from '../../components/authImg.vue';

export default {
  components: { authImg },
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
      isLoading: false, // 下拉的加载图案,
      info:this.$route.params,
      smsReplay:''
    };
  },

  created() {
    console.log(this.$route.params,'params');
  },

  methods: {
    replayUser(val){
			if (!this.smsReplay) {
				Toast.fail('请输入回复内容');
				return
			}
			let params = {
				content : this.smsReplay,
				commentId: this.info.commentId
			}
			replyUser(params).then(res=>{
				if (res.code == 200) {
					Toast.success('回复成功');
					this.$router.go(-1);
				}
			})
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
    onClickLeft() {
        this.$router.go(-1);
    //   this.$router.push({ path: "/evaluateList" });
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
</style>
