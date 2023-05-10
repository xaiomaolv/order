<template>
	<div class="container">
		<van-tabs v-model:active="active" @click-tab="onClickTab">
		  <van-tab title="全部"></van-tab>
		  <van-tab title="评价"></van-tab>
		</van-tabs>
		<div class="content">
			<div class="scroll-col" style="height: 100%;" v-if="list.length > 0">
				<div class="scroll">
					<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
					  <van-list
					    v-model:loading="loading"
					    :finished="finished"
					    finished-text="没有更多了"
					    @load="onLoad"
					  >
						<template v-if="active == 0">
					   <div class="bd-rd-8 mg-tp-10 mg-lr-10 of-hd bg-w pd-tb-10 pd-lr-15" v-for="(item, index) in list" :key="index">
					      <div class=""  @click="bindViewTap(item)">
					        <div  class="flex-row flex-between mg-tp-10 title" >
					          <div class="t-lt">
					            {{item.businessName}}
					          </div>
					          <div class="t-rt">
					            <span v-if="item.orderStatus == '0'">待支付</span>
					            <span v-if="item.orderStatus == '1'">已完成</span>
					          </div>
					        </div>
					        <div class="mg-tp-10 ft-se-14 li-hg-24">
					          <div class="mg-5">下单时间： <span class="movie-score">{{item.orderTime}}</span></div>
					          <div class="mg-5">数量： <span> {{item.productNum}} </span></div>
					          <div class="mg-5">金额：<span> {{item.orderAmountTotal}} </span></div>
					          <div class="mg-5">类型：<span> {{item.orderType == "1" ? "预约点餐" : "扫码点餐"}} </span></div>
					        </div>
					      </div>
					    
					    	<div class="flex-row flex-right">
					    		<div class="flex-col-6"  v-if="item.lotteryStatus == '1' && item.orderStatus == '0'">
					    			<van-button color="#c83c3c" plain  round size="small"  class="w-95" @click="toDraw(item)">去抽奖</van-button>
					    		</div>
					    	  <div class="flex-col-6" v-if="item.orderStatus == '1' && item.commentType == '0'">
					    			<van-button color="#c83c3c" plain  round size="small"  class="w-95"  @click="toEvaluate(item)">评价</van-button>
					    	  </div>
					    	</div>
					    </div>
							 <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
						</template>
						<template v-if="active == 1">
						  <div class="bd-rd-8 mg-tp-10 mg-lr-10 of-hd bg-w pd-tb-10 pd-lr-15" v-for="(item, index) in list" :key="index">
						    <div use-label-slot  @click="bindViewComment(item)">
						      <div  class="flex-row flex-between mg-tp-10 title">
						        <div class="t-lt">
						          {{item.businessName}}
						        </div>
						        <div class="t-rt">
						          <span v-if="item.commentType == '0'">待评价</span>
						          <span v-if="item.commentType == '1'">已评价</span>
						        </div>
						      </div>
						      <div class="mg-tp-10 ft-se-14 li-hg-24">
						        <div class="mg-5">下单时间：<span class="movie-score">{{item.orderTime}}</span></div>
						        <div class="mg-5">数量：<span> {{item.productNum}} </span></div>
						        <div class="mg-5">金额：<span> {{item.orderAmountTotal}} </span></div>
						      </div>
						    </div>
						    <div class="flex-row flex-right">
						      <div class="flex-col-6">
						  			<van-button color="#c83c3c" plain  round size="small"  class="w-95" v-if="item.orderStatus == '1' && item.commentType == '0'" @click="toEvaluate(item)">评价</van-button>
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
	import { reactive, onMounted,toRefs,nextTick } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	import { searchOrder } from '@/api/order'
	export default {
		name:"",
		components: {

		},
		setup() {
			const route = useRoute()
			const router = useRouter()
			const state = reactive({
				active: 0,
				list:[
					{
						businessId: "50",
						businessLogo: "ceb7a93b39dc4130b2ad693b28cdb84b20220803173040.png",
						businessName: "闲时蜗居小店",
						children: null,
						commentType: "0",
						diningNum: null,
						discountPrice: 1.5,
						lotteryStatus: "1",
						orderAmountTotal: 37,
						orderId: "1482334670241763585",
						orderNo: "202210181723081895",
						orderStatus: "0",
						orderTime: "2022-10-18 17:23:09",
						orderType: "0",
						payTime: null,
						productAmountTotal: 20,
						productNum: 1,
						remark: null,
						reserveStatus: null,
						tableId: "10",
						tableName: "十人大桌"
					},
					{
						businessId: "50",
						businessLogo: "ceb7a93b39dc4130b2ad693b28cdb84b20220803173040.png",
						businessName: "闲时蜗居小店",
						children: null,
						commentType: "0",
						diningNum: null,
						discountPrice: 3,
						lotteryStatus: "1",
						orderAmountTotal: 41,
						orderId: "1482334670241763584",
						orderNo: "202210181649017117",
						orderStatus: "1",
						orderTime: "2022-10-18 16:49:01",
						orderType: "0",
						payTime: null,
						productAmountTotal: 44,
						productNum: 2,
						remark: null,
						reserveStatus: null,
						tableId: "10",
						tableName: "十人大桌"
					}		
				],
			  loading: false,
				finished: false,
				refreshing: false,
				pageNum:1

			})
			onMounted(async () => {
				// onLoad()
			})
			nextTick(() => {
				
			})

			const onClickTab = (val) => {
				state.active = val.name
			}
			
			const bindViewTap = (item) => {
				router.push({
					path: '/order-detail',
					query:{
						orderId: item.orderId
					}
				})
			}
			
			// 去抽奖
			const toDraw = (item) => {
				router.push({
					path:'/luckydraw',
					query:{
						orderId:item.orderId,
						activitySeat:item.orderType == 1 ? 3 : 2
					}
				})
			}
			//去评价
			const toEvaluate = (item) => {
			const	{orderId, goodCount, businessId, businessLogo, businessName}  = item				     

				router.push({
					path:'/evaluate',
					query:{
						orderId, goodCount, businessId, businessLogo, businessName
					}
				})
			}
			
			const bindViewComment = (item) => {
				
			}
			
			const init = async () => {
				
				state.loading = true;
				
				let params = {
					orderStatus: state.active !== 0 ? state.active : '',
					userId:"",
					businessesId: '',
					pageNum: state.pageNum
				}
				let len = ''
				await searchOrder(params).then(res => {
					
					len = res.rows.length
					
					state.list = state.list.concat(...res.rows)
					
					state.loading = false;
						
					if (len <= 10) {
						state.finished = true;
					}else{
						state.pageNum++
					}
				})
				
			}
			
			const onLoad = () => {

					// if (state.refreshing) {
					// 	state.list = [];
					// 	state.refreshing = false;
					// }
					
					// init()
					
				
			};
	
			const onRefresh = () => {
				// 清空列表数据
				state.finished = false;
				state.list = []
				state.pageNum = 1
				// 重新加载数据
				// 将 loading 设置为 true，表示处于加载状态
				state.loading = true;
				onLoad();
			};

			return {
				...toRefs(state),
				onLoad,
				onRefresh,
				// refreshing,
				onClickTab,
				bindViewTap,
				toDraw,
				toEvaluate,
				bindViewComment,
				
			}
		}
	}
</script>

<style lang="scss" scoped>
.content{
	height: calc(100vh - 100px);
}
</style>
