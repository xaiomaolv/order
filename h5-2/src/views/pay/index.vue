<template>
	<div class="container" style="padding-bottom: 70px;">
		<!-- <van-nav-bar :title="$route.meta.title" left-arrow @click-left="goBack" /> -->
		<div class="back_bth_lt fixed ft-se-13"  @click="goBack">
			<span class="flex-row"><van-icon name="revoke" class="mg-rt-5 ft-se-16" />返回</span>
		</div>
		<div class="mg-tb-10  bd-rd-8 bg-w mg-lr-10" style="overflow: hidden;">
			<div class="shopName">
				<div class="row flex-row flex-wrap tx-ct">
					<div class="flex-row flex-col-24 bg-w pd-tb-10 bd-bt">
						<div class="flex-row flex-col-item flex-col-24">
							<div class="flex-col-6 tx-lt pd-lt-10">
								<Img class="shopImg"  :src="`${storeInfo.businessLogo}`" />								
							</div>
							<div class="flex-col-18 tx-rt flex-col">
								<div class="flex-row flex-col-24">
									<div class="flex-col-14 tx-lt dianpu">{{storeInfo.businessName}}</div>
									<div class="flex-col-10 tx-rt pd-rt-10 li-hg-18"></div>
								</div>
								<div class="flex-row flex-col-24 mg-tp-5">
									<div class="flex-col-20 tx-lt shuiang li-hg-20">{{storeInfo.address}}</div>
									<div class="flex-col-4 tx-rt pd-rt-10 ft-se-12" v-if="storeInfo.orderType !== '2'" >{{storeInfo.mealNum}}人</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<div class="food-view  bd-rd-8 bg-w of-hd  mg-lr-10" v-if="productInfo.length > 0">
			
			<div class=" title pd-tb-8 pd-lr-15 bd-bt tx-lt">
				<div class="t-lt ft-se-16 ft-bd">
					{{storeInfo.tableName ? storeInfo.tableName : '外送订单'}}
				</div>
			</div>

			<div class="showmore" :class="{'hiddenmore': !showMore }">
				<template >
					<div class="flex-row pd-lr-15 pd-tp-10 flex-row-item" v-for="(item, index) in productInfo" :key="item.productId"
						:class="{'more-item': index > 4 }" >
							<div class="tx-lt pd-lr-10" v-if="item.productImage" >
								<Img v-if="item.productImage" :src="`${item.productImage}`" class="food-pic" />
							</div>
							<div class="flex-1 tx-lt ft-se-13">
								<div class="t-lt">{{item.productName}}</div>
								<div>
									<div class="clr-999">{{item.attributesName || ""}} </div>
								</div>
								<div>
									<div>x{{item.productNum}} </div>
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
				</template>
			</div>
			<div v-if="productInfo && productInfo.length > 5">
				<div v-if="showMore" class='tx-ct clr-999 flex-row flex-center mg-tb-10 ft-se-14' @click='listToggle'>
					<span class="">收起</span>
					<van-icon name="arrow-up" />
				</div>
				<div v-else class='tx-ct clr-999 flex-row flex-center mg-tb-10 ft-se-14' @click='listToggle'>
					<div class="tx-ct">展开更多</div>
					<van-icon name="arrow-down" />
				</div>
			</div>
			<div v-if="storeInfo.mealFee > 0" class="takeFee clr-999 ft-se-14 tx-rt pd-lr-10">餐位费: <span>{{storeInfo.mealFee}} X {{storeInfo.mealNum}} = ￥{{mealFeeTotal}}</span></div>
			<div class="total flex-row flex-right pd-lr-10 pd-bt-15 mg-tp-5 ft-se-14">合计：<div class="size-18">￥{{orderInfo.priceAmount || 0}}</div>
			</div>
			<!-- <div v-if="{{active == 2}}" class="takeFee clr-999">打包费：<div class="size-14">￥{{packFee || 0}}</div></div> -->
		</div>
		
		<!-- 备注 -->
		<div class="mg-tp-10 bd-rd-8 of-hd  mg-lr-10">
			<van-cell-group >
				<van-field v-model="form.remark" rows="2" autosize label="备注" type="textarea" placeholder="请输入口味偏好等要求" />
			</van-cell-group>
		</div>
		
		<!-- 外送地址 --> <!-- v-if="!!storeInfo.deliveryAddress" -->
		<div class="mg-tp-10 bd-rd-8 of-hd  mg-lr-10" v-if="!!storeInfo.deliveryAddress">
			<van-cell-group >
				<van-field v-model="form.customerName" label="联系人" type="text" placeholder="请输入联系人" />
				<van-field v-model="form.customerPhone" label="联系电话" type="tel" placeholder="请输入联系电话" />
				<van-field v-model="form.deliveryAddress" rows="2" autosize label="外送地址" type="textarea" readonly placeholder="请输入外送地址" />
			</van-cell-group>
		</div>
		
		
		<div class="section-bottom  fixed-bottom w-100 bg-w" style="bottom: 0;">
			<div class="pd-lr-10 pd-tb-10 flex-row">
				<div class="total flex-col flex-col-10">
					<div class='totalPrice flex-col'>		
						<div class="flex-row ft-se-18">
							合计：
							<span class="am">￥{{ orderInfo.priceAmount }} </span>
						</div>
						<div v-if="orderInfo.discountAmount != 0" class="youhui flex-row">
							(共优惠
							<div class="am">{{orderInfo.discountAmount || 0}}</div>元)
						</div>
					</div>
				</div>
				<div class="flex-col-7" >
					<van-button color="#c83c3c" plain  round  class="w-95" @click="toCar">继续点餐</van-button>
				</div>
				<div class="flex-col-7" >
					<van-button color="#c83c3c" round  class="w-95" @click="goPay">确认下单</van-button>
				</div>
				</div>
		</div>
		
	</div>
</template>

<script>
	import { Toast, Dialog } from 'vant'
	import { cart } from '@/api/cart'
	import { addOrder, addResverse } from '@/api/order'
	import { getLocal } from "@/utils/auth"
	// import websocket from '@/utils/websocket'
	import { mapGetters } from 'vuex'
	export default {
		data(){
			return {
				orderType: '', //是否提前点餐0否 1是
				
				storeInfo:{},
				orderInfo:{},
				productInfo:[],
				form:{
					remark:'',
					customerName:'',
					customerPhone:'',
					deliveryAddress:''
				},
				showMore: false,
				// mealFeeTotal:0
				timerTask:null,
				show: false
			}
		},
		computed: {
			mealFeeTotal:function(){
				return  this.storeInfo.mealFee * this.storeInfo.mealNum
			}
		},
		created(){
			this.storeInfo = this.$route.query
			this.form.customerName  = this.storeInfo.customerName
			this.form.customerPhone = this.storeInfo.customerPhone
			this.form.deliveryAddress =  this.storeInfo.deliveryAddress
			
			
			this.init()

		
			// 轮询
			this.timer()
			
		},
		beforeMount() {
			
		
		},
		beforeDestroy(){
			this.clear()
		},
		destroyed(){
			
		},
		methods:{
			timer(){
				let _this = this
				this.timerTask = setInterval(function () {
					setTimeout(()=>{
						_this.init();
					},0)
				}, 5000)
			},
			clear(){
				clearInterval(this.timerTask)
				this.timerTask = null
			},
			init(){
				let params = {
					tableId: this.storeInfo.tableId,
					mealFee: this.storeInfo.mealFee,
					businessId: this.storeInfo.businessId
				}
				
				if(this.storeInfo.orderType && this.storeInfo.orderType == 2){
					params.userId = this.storeInfo.userId
				}
				let tt = JSON.parse(JSON.stringify(params))
				
				cart(tt).then(res => {
					if (res.code == 200) {				
						// 点餐
						
						setTimeout(()=>{

							if(res.data.tableFlag == '2') {
								this.$router.push({
									path: '/order-detail',
									query: {
										orderId: res.data.orderId
									}
								})
						
							}
							
							if(res.data.tableFlag == '3'){
								this.clear()
								Dialog.alert({
									title: '提示',
									message: res.msg,
								})
									.then(() => {
										this.$router.push({
											path:'/'
										})
									})
							}
						},1000)
						

						if(!res.data.productInfo) return
						
						this.orderInfo = Object.freeze(res.data)
						
						this.$nextTick(()=>{
							this.productInfo = this.orderInfo.productInfo
						})

						this.storeInfo.mealFee =  res.data.mealFee
						this.storeInfo.mealNum = res.data.diningNum 
						let obj = {
							...this.storeInfo,
							orderId:this.orderInfo.orderId
						}
					}
				})
			},
			goBack(){
				this.$router.go(-1)
			
			},		
			
			toCar(){
				this.$router.go(-1)
			},
			listToggle(){
				this.showMore = !this.showMore
			},
			async goPay(){
				let params = JSON.parse(JSON.stringify(this.storeInfo))
				// 外送订单
				if (params.deliveryAddress) {
					if (!this.form.customerName) {
						Toast.fail('请输入联系人')
						return;
					}
					if (!this.form.customerPhone) {
						Toast.fail('请输入联系电话')
						return;
					}
					if (!/^1[3456789]\d{9}$/.test(this.form.customerPhone)) {
						Toast.fail('请填写正确的电话号码')
						return;
					}
				}
				
				let paramObj = {
					"channel":1,  
					"tableId": params.tableId,
					"userId": this.storeInfo.userId,
					"businessId": params.businessId,
					"diningNum": params.mealNum,
					"orderSource": params.orderSource,
					...this.form
				}
				// orderType:1 预约点餐 0正常点餐 2外送订单
				if (params.orderType == 1) {
					params.mealPerson = this.storeInfo.mealNum
					params.remark = this.form.remark
					params.channel = 1
				}
				
				let res = params.orderType == 1 ? await addResverse(params) : await addOrder(paramObj)
				let orderId = res.data.orderId
				let activityFlag = res.data.activityFlag

				Toast.success(params.orderType == 1? '预约成功':'下单成功');
			
				
				// if(params.orderType !== '2') return
				setTimeout(() => { 
					if (activityFlag && activityFlag == "1") {
						this.$router.push({
							path: '/luckDraw',
							query: {
								orderId: orderId,
								activitySeat: params.orderType == 1 ? 3 : 2
							}
						})			
					} 

					this.$router.push({
						path: '/order-detail',
						query: {
							orderId: orderId
						}
					})
					
				}, 1500)
				
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
	.shuiang {
	  font-size: 14px;
	  font-family: PingFang SC;
	  /* font-weight:bold; */
	  color: rgba(149, 149, 149, 1);
	}
	.youhui {
	    color: #a7a1a1;
	    font-size: 14px;
	}
</style>
