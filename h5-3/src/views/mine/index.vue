<template>
  <div class="container">
    <div>
      <div class="userinfo">
        <!-- <img
          bindtap="bindViewTap"
          class="userinfo-avatar"
          src="{{userInfo.avatarUrl}}"
          mode="cover"
          v-if="{{userInfo.avatarUrl}}"
        ></img> -->
        <img class="userinfo-avatar" src="@/assets/mine/head.png" />
        <div>
          <!-- <span class="userinfo-nickname" v-if="{{userInfo.nickName}}">{{
            userInfo.nickName
          }}</span> -->
          <span class="userinfo-nickname">微信用户</span>
        </div>
      </div>
      <div v-for="(item, index) in userListInfo" :key="index">
        <van-cell is-link size="large" :to="item.path">
          <!-- 使用 title 插槽来自定义标题 -->
          <template #icon>
			<img class="cell_icon" :src="item.icon"/>
          </template>
		  <template #title>
			<span>{{item.span}}</span>
          </template>
        </van-cell>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, toRefs, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "",
  components: {},
  setup() {
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      isLogin: false,
    });
    onMounted(async () => {});
    nextTick(() => {});

    // const goBack = () => {
    // 	router.go(-1)
    // }
    const userListInfo = [
      {
        icon: require("@/assets/mine/order3.png"),
        span: "预约记录",
        path: "/appointList",
      },
      {
        icon: require("@/assets/mine/coupon.png"),
        span: "我的代金券",
        path: "/coupon",
      },
      {
        icon: require("@/assets/mine/collection.png"),
        span: "我的收藏",
        path: "/coltRestaurant",
      },
    ];
    return {
      ...toRefs(state),
      userListInfo,
    };
  },
};
</script>

<style lang="scss" scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  padding: 30px 0;
  align-items: center;
  background: #c83c3c;
}
.userinfo-avatar {
  width: 74px;
  height: 74px;
  margin: 10px;
  border-radius: 50%;
}
.userinfo-nickname {
  color: #333;
}
.cell_icon{
  display: inline-block;
  width:25px;
  margin-right: 5px;
  margin-top: -1px;
}
.cell_icon image{
  width: 25px;
  vertical-align: -2px;
}
</style>
