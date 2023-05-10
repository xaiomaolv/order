<template>
	<div class="container">
		<div class="back_bth_lt fixed ft-se-13"  @click="goBack">
			<span class="flex-row"><van-icon name="revoke" class="mg-rt-5 ft-se-16" />返回</span>
		</div>
		<van-tabs v-model="active" @click="onClickTab">
			<van-tab title="全部"></van-tab>
			<van-tab title="评价"></van-tab>
		</van-tabs>
		<div class="content">
			<div class="scroll-col" style="height: 100%;" v-if="list.length > 0">
				<div class="scroll">
					<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
						<van-list v-model:loading="loading" :finished="finished" :finished-text="list.length == 0? '': '没有更多了'" @load="onLoad">
							<template v-if="active == 0">
								<div class="bd-rd-8 mg-tp-10 mg-lr-10 of-hd bg-w pd-tb-10 pd-lr-15"
									v-for="(item, index) in list" :key="index">
									<div class="" @click="bindViewTap(item)">
										<div class="flex-row flex-between mg-tp-10 title">
											<div class="t-lt ft-bd">
												{{item.businessName}}
											</div>
											<div class="t-rt ft-se-13">
												<span v-if="item.orderType == '2'">
													<span v-if="item.orderStatus == '0' || item.orderStatus == '1' || item.orderStatus == '2'">待处理</span>
												</span>
												<span v-if="item.orderType !== '2'">
													<span v-if="item.orderStatus == '0'">待处理</span>
													<span v-if="item.orderStatus == '1'">上菜中</span>
													<span v-if="item.orderStatus == '2'">待支付</span>
												</span>
												<span v-if="item.orderStatus == '50'">已完成</span>
											</div>
										</div>
										
										<div class="mg-tp-10 ft-se-14 li-hg-24">
											<div class="mg-5">下单时间： <span class="movie-score">{{item.orderTime}}</span>
											</div>
											<div class="mg-5">数量： <span> {{item.productNum}} </span></div>
											<div class="mg-5">金额：<span> {{item.orderAmountTotal}} </span></div>
											<div class="mg-5">类型：<span> {{item.orderType == "2" ? "外卖送餐" : "扫码点餐"}}
												</span></div>
										</div>
									</div>

									<div class="flex-row flex-right">
										<div class="flex-col-6" 
											v-if="item.lotteryStatus == '1' && item.orderStatus == '2'">
											<van-button color="#c83c3c" plain round size="small" class="w-95"
												@click="toDraw(item)">去抽奖</van-button>
										</div>
										<div class="flex-col-6"
											v-if="item.orderStatus == '50' && item.commentType == '0'">
											<van-button color="#c83c3c" plain round size="small" class="w-95"
												@click="toEvaluate(item)">评价</van-button>
										</div>
									</div>
								</div>

							</template>
							<template v-if="active == 1">
								<div class="bd-rd-8 mg-tp-10 mg-lr-10 of-hd bg-w pd-tb-10 pd-lr-15"
									v-for="(item, index) in list" :key="index">
									<div use-label-slot @click="bindViewComment(item)">
										<div class="flex-row flex-between mg-tp-10 title">
											<div class="t-lt">
												{{item.businessName}}
											</div>
											<div class="t-rt ft-se-13">
												<span v-if="item.commentType == '0'">待评价</span>
												<span v-if="item.commentType == '1'">已评价</span>
											</div>
										</div>
										<div class="mg-tp-10 ft-se-14 li-hg-24">
											<div class="mg-5">下单时间：<span class="movie-score">{{item.orderTime}}</span>
											</div>
						   		<div class="mg-5">数量：<span> {{item.productNum}} </span></div>
						   		<div class="mg-5">金额：<span> {{item.orderAmountTotal}} </span></div>
						  		</div>
									</div>
									<div class="flex-row flex-right">
						    <div class="flex-col-6">
						 				<van-button color="#c83c3c" plain round size="small" class="w-95"
												v-if="item.orderStatus == '50' && item.commentType == '0'"
												@click="toEvaluate(item)">评价</van-button>
										</div>
									</div>
								</div>

							</template>
						</van-list>
					</van-pull-refresh>

				</div>
			</div>

			<div v-if="list.length < 1" class="mg-tp-10">
				<van-empty description="暂无记录" />
			</div>
		</div>

	</div>
</template>

<script>
	import { searchOrder } from '@/api/order'
	import { getLocal } from '@/utils/auth'
	export default {
		data() {
			return {
				active: 0,
				list:[],
				loading: false,
				finished: false,
				refreshing: false,
				pageNum:1
			}
		},
		created() {

		},
		mounted() {
			this.init()
		},
		methods: {
			goBack(){
				this.$router.go(-1)
			},
			onClickTab(val){
				this.active = val
				this.onRefresh()
			},
			
			bindViewTap(item){
				this.$router.push({
					path: '/order-detail',
					query:{
						orderId: item.orderId
					}
				})
			},
			
			// 去抽奖
			toDraw(item){
				this.$router.push({
					path:'/luckydraw',
					query:{
						orderId:item.orderId,
						activitySeat:item.orderType == 1 ? 3 : 2
					}
				})
			},
			
			//去评价
			toEvaluate(item){
				
				const	{orderId, goodCount, businessId, businessesId, businessLogo, businessName}  = item				     
			
				this.$router.push({
					path:'/evaluate',
					query:{
						orderId, goodCount, businessId, businessLogo, businessName, businessesId
					}
				})
			},
			
			bindViewComment(item){
				
			},
			
			async init(){
				
				this.loading = true;
				
				let params = {
					orderStatus: this.active == 0 ? '' : 50,
					// userId: getLocal('userId'),
					pageNum: this.pageNum,
					pageSize: 10
				}
				let len = ''
				let res = await searchOrder(params)
				// this.list = Object.freeze(res.rows)
				.then(res => {
				
					len = res.rows.length
					
					this.list = this.list.concat(...res.rows)
					
					this.loading = false;
						
					if (len < 10) {
						this.finished = true;
					}else{
						this.pageNum++
					}
				})
				
			},
			
			onLoad(){
			
				if (this.refreshing) {
					this.list = [];
					this.refreshing = false;
				}
				
				this.init()
					
				
			},
				
			onRefresh (){
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
.content{
	height: calc(100vh - 45px);
}
</style>

