<template>
	<div class="container" style="padding-bottom: 70px;">	
		<div class="back_bth_lt fixed ft-se-13"  @click="goBack">
			<span class="flex-row"><van-icon name="revoke" class="mg-rt-5 ft-se-16" />返回</span>
		</div>

		<div class="food-view bd-rd-8 bg-w of-hd pd-lr-10 mg-tp-10 mg-lr-10">
			<div class=" title pd-tb-10 bd-bt tx-lt flex-row flex-between ">
				<div class="t-lt ft-se-16 ft-bd">
					{{orderInfo.businessName }}
				</div>
				<div class="flex-row flex-right am" @click="toAddCart" v-if="orderInfo.orderStatus < 50">
					<div class="tx-ct">继续加菜</div>
					<van-icon name="arrow" />
				</div>
			</div>
	
			<div class="showmore" :class="{'hiddenmore': !showMore }">
				<div class="flex-row pd-rt-15 pd-tp-10 flex-row-item" v-for="(item, index) in orderInfo.children" :key="index"
					:class="{'more-item': index > 4 }">
					<div class="tx-lt pd-lr-10">
						<Img :src="`${item.productImage}`" class="food-pic" />
					</div>
					<div class="flex-1 tx-lt ft-se-13">
						<div class="t-lt">{{item.productName}}</div>
						<div>
							<div class="clr-999">{{item.attributesName || ""}} </div>
						</div>
						<div>
							<div>x{{item.productNum}}</div>
						</div>
					</div>
					<div class="flex-col-6 tx-rt ft-se-13">
						<div v-if="item.percentPriceAmount == 0">￥{{item.priceAmount}}</div>
						<div v-else>￥{{item.percentPriceAmount}}</div>
						<div>
							<div v-if="item.percentPriceAmount > 0" class="yuanjia">{{item.priceAmount}}</div>
						</div>
					</div>
				</div>
				
				<div v-if="orderInfo.children && orderInfo.children.length > 5">
					<div v-if="showMore" class='tx-ct clr-999 flex-row flex-center mg-tb-10 ft-se-14' @click='listToggle'>
						<span class="">收起</span>
						<van-icon name="arrow-up" />
					</div>
					<div v-else class='tx-ct clr-999 flex-row flex-center mg-tb-10 ft-se-14' @click='listToggle'>
						<div class="tx-ct">展开更多</div>
						<van-icon name="arrow-down" />
					</div>
				</div>
			</div>
	
			<div class="mg-tp-10 ft-se-13">
				<div class="total flex-row tx-lt pd-lr-10 pd-bt-15 " v-if="orderInfo.mealFee > 0 && orderInfo.orderType == '0'">餐位费： <span>{{orderInfo.mealFee}} X {{orderInfo.diningNum}} = ￥{{mealFeeTotal}}</span></div>
				<div class="total flex-row tx-lt pd-lr-10 pd-bt-15 ">订单编号：{{orderInfo.orderNo}}</div>
				<div class="total flex-row tx-lt pd-lr-10 pd-bt-15 ">下单时间：{{orderInfo.orderTime}}</div>
				<div class="total flex-row tx-lt pd-lr-10 pd-bt-15 " v-if="orderInfo.payTime">支付时间：{{orderInfo.payTime || ''}}</div>
				<div class="total flex-row tx-lt pd-lr-10 pd-bt-15 " v-if="orderInfo.remark">备注：{{orderInfo.remark || ''}}</div>
				
				<div class="total flex-row tx-lt pd-lr-10 pd-bt-15 " v-if="orderInfo.businessPhone">商家电话：{{orderInfo.businessPhone || ''}}</div>
				<div class="total flex-row tx-lt pd-lr-10 pd-bt-15 " v-if="orderInfo.deliveryAddress">配送地址：{{orderInfo.deliveryAddress || ''}}</div>
				<div class="total flex-row tx-lt pd-lr-10 pd-bt-15 " v-if="orderInfo.customerName">联系人：{{orderInfo.customerName || ''}} {{`(${orderInfo.customerPhone})`}}</div>
			</div>
		</div>
		
	
		<div class="fixed-bottom w-100 bg-w" style="bottom: 0;" v-if="orderInfo.orderStatus < 50">
			<div class="pd-lr-10 pd-tb-10 flex-row">
				<div class="total flex-col flex-col-12">
					<div class='totalPrice flex-col'>		
						<div class="flex-row ft-se-18">
							合计：
							<span class="am">￥{{orderInfo.orderAmountTotal || 0}} </span>
						</div>
						<div v-if="orderInfo.discountPrice > 0" class="youhui flex-row">
							(共优惠
							<div class="am">{{orderInfo.discountPrice || 0}}</div>元)
						</div>
					</div>
				</div>
				<div class="flex-col-2" >
					
				</div>
				<div class="flex-col-10" >
					<van-button color="#c83c3c" round  class="w-95" @click="callPay" v-if="orderInfo.orderType == '0'">联系商家付款</van-button>
					<van-button color="#c83c3c" round  class="w-95" @click="callPay" v-else>联系商家</van-button>
				</div>
				</div>
		</div>
		
	</div>
</template>

<script>
	import { getOrderDetail } from '@/api/order'
	import { Toast } from "vant"
	import { getLocal } from '@/utils/auth';
	export default {
		data() {
			return {
				isLogin: false,
				
				
				orderInfo:{},
				form:{remark:''},
				showMore: false,
				path: false
			}
		},
		created() {
			let { orderId } = this.$route.query
			 getOrderDetail(orderId).then(res => {
				if (res.code == 200) {
						this.orderInfo = res.data
				}
			})
		},
		mounted() {
			let path = getLocal('prevPath')
			this.path = path === '/addCart' || path === '/pay' ? true : false
			if(window.history && window.history.pushState){
        // 往历史记录里面添加一条新的当前页面的url
        history.pushState(null,null,document.URL);
        // 给 popstate 绑定一个方法 监听页面刷新
        window.addEventListener('popstate', this.goBack, false);
      }
		},
		destroyed() {	
			// websocket.onClose()
			window.removeEventListener('popstate', this.goBack, false);
			clearInterval(this.timerTask)
		},
		computed:{
			mealFeeTotal:function(){
				return  this.orderInfo.mealFee * this.orderInfo.diningNum
			}
		},
		methods: {
			
			goBack(){
				let path = getLocal('prevPath')
				if(path !== '/order'){
					this.$router.push({path:'/'})
				}else{
					this.$router.go(-1)
				}		
			},
		
			listToggle (){
				this.showMore = !this.showMore
			},
			
			toAddCart(){
				this.$router.push({
					path:'/addCart',
					query:{
						...this.orderInfo
					}
				})
			},
			
			callPay(){
				Toast.fail('请联系商家支付订单哦')
				if(this.orderInfo.orderType !== '0'){
					window.location.href = 'tel:' + this.orderInfo.businessPhone;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.shopName {
		display: inline;
		// padding-left: 36px;
	}
	.shopImg {
	  width: 70px;
	  height: 70px;
	  margin-right: 13px;
	  border-radius: 5px;
	  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	}
	.dianpu {
	  font-size: 17px;
	  font-family: PingFang SC;
	  font-weight: bold;
	  color: rgba(58, 58, 58, 1);
	}
	.food-pic{
		width: 56px;
		height: 56px;
		border-radius: 10px;
	}
	.yuanjia {
		text-decoration: line-through;
		color: rgba(150,150,150,1);
	}
	.hiddenmore .more-item {
	  display: none;
	}
  .am {
		color: #e4452a;
  }
	.youhui {
	    color: #a7a1a1;
	    font-size: 14px;
	}
</style>
