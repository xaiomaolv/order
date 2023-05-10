<template>
  <div class="container pd-tp-10">
    <van-cell-group inset class="mg-tp-5 mg-bt-5" v-for="(item, index) in appoinList" :key="index">
      <div class="pd-10 bd-rd" >
        <van-cell use-label-slot>
          <div slot="title" class="mg-tp-10 title">
            <div class="t-lt ft-se-16">
              {{ item.mealTime }}
            </div>
            <div class="t-rt">
              <span v-if="item.reserveStatus == '0'">待确认</span>
              <span v-if="item.reserveStatus == '1'">已确认</span>
              <span v-if="item.reserveStatus == '2'">已取消</span>
            </div>
          </div>
          <div slot="label" class="clr-999">
            <div class="mg-5">
              到店时间: <span>{{ item.mealTime }}</span>
            </div>
            <div class="mg-5">
              预约人： <span> {{ item.reserveName || "" }} </span>
            </div>
            <div class="mg-5">
              联系电话:<span> {{ item.userPhone }} </span>
            </div>
            <div class="mg-5">
              用餐人数:<span> {{ item.mealPerson }} </span>
            </div>
          </div>
        </van-cell>
      </div>
      <div v-if="appoinList.length < 1" class="mg-tp-10">
        <van-empty description="暂无记录" />
      </div>
    </van-cell-group>
  </div>
</template>
<script>
import { reactive, onMounted, toRefs, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { searchResverse } from '@/api/order'

export default {
  name: "",
  components: {},
  setup() {
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      isLogin: false,
			appoinList:[
				{
					businessId: "52",
					mealPerson: 1,
					mealTime: "2022-10-18 18:00",
					reserveFlag: "0",
					reserveId: 270,
					reserveName: "刘先生",
					reserveStatus: "0",
					reserveTime: "2022-10-18 18:50",
					userPhone: "15223097156",
				},
				{
					businessId: "52",
					mealPerson: 1,
					mealTime: "2022-10-18 18:00",
					reserveFlag: "0",
					reserveId: 270,
					reserveName: "刘先生",
					reserveStatus: "1",
					reserveTime: "2022-10-18 18:50",
					userPhone: "15223097156",
				},
				{
					businessId: "52",
					mealPerson: 1,
					mealTime: "2022-10-18 18:00",
					reserveFlag: "0",
					reserveId: 270,
					reserveName: "刘先生",
					reserveStatus: "1",
					reserveTime: "2022-10-18 18:50",
					userPhone: "15223097156",
				},
			]
    });
    onMounted(async () => {
			let userId = '';
			await	searchResverse(userId).then(res => {
				if (res.code == 200) {
					
					state.appoinList = res.rows
					
				}
			})
		});
    nextTick(() => {});

    // const goBack = () => {
    // 	router.go(-1)
    // }
  
    return {
      ...toRefs(state),
      
    };
  },
};
</script>

<style lang="scss" scoped>
.title {
  display: inline;
}

.title .t-lt {
  /* float: left; */
  /* font-size: 1.05rem; */
  display: inline;
}

.title .t-rt {
  float: right;
  display: inline;
}
</style>
