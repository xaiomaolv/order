<template>
  <div class="container">
		<div class="back_bth_lt fixed ft-se-13"  @click="goBack">
			<span class="flex-row"><van-icon name="revoke" class="mg-rt-5 ft-se-16" />返回</span>
		</div>
		<div class="content">
			<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
				<van-list v-model:loading="loading" :finished="finished" :finished-text="list.length == 0? '': '没有更多了'" @load="onLoad">
				<van-cell-group inset class="mg-tp-5 mg-bt-5" v-for="(item, index) in list" :key="index">
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
				
				</van-cell-group>
				
			</van-list>
			</van-pull-refresh>
			
			<div v-if="list.length < 1" class="mg-tp-10">
				<van-empty description="暂无记录" />
			</div>
		</div>

	</div>
</template>
<script>
	import { searchResverse } from '@/api/order'
	import { getLocal } from "@/utils/auth"
	export default {
		data(){
			return {
				isLogin: false,
				list:[
					// {
					// 	businessId: "52",
					// 	mealPerson: 1,
					// 	mealTime: "2022-10-18 18:00",
					// 	reserveFlag: "0",
					// 	reserveId: 270,
					// 	reserveName: "刘先生",
					// 	reserveStatus: "0",
					// 	reserveTime: "2022-10-18 18:50",
					// 	userPhone: "15223097156",
					// },
					// {
					// 	businessId: "52",
					// 	mealPerson: 1,
					// 	mealTime: "2022-10-18 18:00",
					// 	reserveFlag: "0",
					// 	reserveId: 270,
					// 	reserveName: "刘先生",
					// 	reserveStatus: "1",
					// 	reserveTime: "2022-10-18 18:50",
					// 	userPhone: "15223097156",
					// },
					// {
					// 	businessId: "52",
					// 	mealPerson: 1,
					// 	mealTime: "2022-10-18 18:00",
					// 	reserveFlag: "0",
					// 	reserveId: 270,
					// 	reserveName: "刘先生",
					// 	reserveStatus: "1",
					// 	reserveTime: "2022-10-18 18:50",
					// 	userPhone: "15223097156",
					// },
				],
				loading: false,
				finished: false,
				refreshing: false,
				pageNum: 1
			}
		},
		created(){
			
		},
		mounted() {
			this.init()
		},
		methods:{
			goBack(){
				this.$router.go(-1)
			},
			async init(){
			
				this.loading = true;
			
				let params = {
					"userId": getLocal("userId"),
					"pageNum": this.pageNum,
					"pageSize": 10
				}
				let len = ''
				await searchResverse(params)
				// this.list = res.rows
				
				.then(res => {
			
					len = res.rows.length
			
					this.list = this.list.concat(...res.rows)
			
					this.loading = false;
			
					if (len <= 10) {
						this.finished = true;
					} else {
						this.pageNum++
					}
				})
			
			},
			
			onLoad (){
			
				if (this.refreshing) {
					this.list = [];
					this.refreshing = false;
				}
			
				this.init()
			
			
			},
			
			onRefresh(){
				// 清空列表数据
				this.finished = false;
				this.list = []
				this.pageNum = 1
				// 重新加载数据
				// 将 loading 设置为 true，表示处于加载状态
				this.loading = true;
				this.onLoad();
			}
		}
	}
</script>

<style lang="scss" scoped>
.container {
	height: 100%;
}
.content{
	height: calc(100% - 0px);
}
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
