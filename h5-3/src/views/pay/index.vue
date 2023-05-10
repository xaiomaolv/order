<template>
	<div class="container" style="padding-bottom: 70px;">
		<div class="mg-tb-10  bd-rd-8 bg-w mg-lr-10" style="overflow: hidden;">
			<div class="shopName">
				<div class="row flex-row flex-wrap tx-ct">
					<div class="flex-row flex-col-24 bg-w pd-tb-10 bd-bt">
						<div class="flex-row flex-col-item flex-col-24">
							<div class="flex-col-6 tx-lt pd-lt-10">
								<img class="shopImg"  :src="`${imgUrl}${storeInfo.businessLogo}`" />								
							</div>
							<div class="flex-col-18 tx-rt flex-col">
								<div class="flex-row flex-col-24">
									<div class="flex-col-14 tx-lt dianpu">{{storeInfo.businessName}}</div>
									<div class="flex-col-10 tx-rt pd-rt-10 li-hg-18"></div>
								</div>
								<div class="flex-row flex-col-24 mg-tp-5">
									<div class="flex-col-14 tx-lt shuiang li-hg-20">{{storeInfo.address}}</div>
									<div class="flex-col-10 tx-rt pd-rt-10 ft-se-12">{{storeInfo.mealNum}}人</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<div class="food-view  bd-rd-8 bg-w vf-hd  mg-lr-10">
			
			<div class=" title pd-tb-8 pd-lr-15 bd-bt tx-lt">
				<div class="t-lt ft-se-16">
					{{storeInfo.tableName ? storeInfo.tableName : '预约菜品'}}
				</div>
			</div>

			<div class="showmore" :class="{'hiddenmore': !showMore }">
				<div class="flex-row pd-lr-15 pd-tp-10 flex-row-item" v-for="(item, index) in orderInfo.productInfo" :key="index"
					:class="{'more-item': index > 4 }" @click="toOrder">
					<div class="tx-lt pd-lr-10">
						<img :src="`${imgUrl}${item.productImage}`" class="food-pic" />
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
			</div>
			<div v-if="orderInfo.productInfo.length > 5">
				<div v-if="showMore" class='tx-ct clr-999 flex-row flex-center' @click='listToggle'>
					<span class="">收起</span>
					<!-- <div class="arrow-up"></div> -->
					<van-icon name="arrow-up" />
				</div>
				<div v-else class='tx-ct clr-999 flex-row flex-center' @click='listToggle'>
					<div class="tx-ct">展开更多</div>
					<van-icon name="arrow-down" />
					<!-- <div class="arrow-down"></div> -->
				</div>
			</div>
			<div v-if="storeInfo.mealFee > 0" class="takeFee clr-999 ft-se-14 tx-rt pd-lr-10">餐位费: <span>{{storeInfo.mealFee}} X {{storeInfo.mealNum}} = ￥{{mealFeeTotal}}</span></div>
			<div class="total flex-row flex-right pd-lr-10 pd-bt-15">合计：<div class="size-18">￥{{orderInfo.percentAmount || 0}}</div>
			</div>
			<!-- <div v-if="{{active == 2}}" class="takeFee clr-999">打包费：<div class="size-14">￥{{packFee || 0}}</div></div> -->
		</div>
		
		<!-- 备注 -->
		<div class="mg-tp-10 bd-rd-8 vf-hd  mg-lr-10">
			<van-cell-group >
				<van-field v-model="form.remark" rows="2" autosize label="备注" type="textarea" placeholder="请输入口味偏好等要求" />
			</van-cell-group>
		</div>
		
		
		<div class="section-bottom  fixed-bottom w-100 bg-w" style="bottom: 0;">
			<div class="pd-lr-10 pd-tb-10 flex-row">
				<div class="total flex-col flex-col-10">
					<div class='totalPrice flex-col'>		
						<div class="flex-row ft-se-18">
							合计：
							<span class="am">￥{{orderInfo.percentAmount == 0 ? orderInfo.priceAmount : orderInfo.percentAmount}} </span>
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
	import { reactive, onMounted,toRefs,nextTick, computed } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	import { cart } from '@/api/cart'
	import { addOrder, addResverse } from '@/api/order'
	export default {
		name:"",
		components: {

		},
		setup() {
			const route = useRoute()
			const router = useRouter()
			const state = reactive({
				isLogin: false,
				orderType: '', //是否提前点餐0否 1是
				imgUrl:'https://order.ynejkj.com/api/order/image/preview?fileName=',
				storeInfo:{
					address: "云南省昆明市官渡区广福路与云秀路交汇处1103号",
					businessId: "50",
					businessLogo: "ceb7a93b39dc4130b2ad693b28cdb84b20220803173040.png",
					businessName: "闲时蜗居小店",
					businessStatus: "1",
					children: null,
					mealNum: 5,
					orderSource: "2",
					tableId: "10",
					tableName: "十人大桌",
				},
				
				orderInfo:{
					children: null,
					discountAmount: 8.5,
					percentAmount: 82.5,
					priceAmount: 91,
					productNum: 6,
					tableId: "10",
					productInfo:[
						{
							addPrice: 0,
							addTime: "20221018145029",
							attributesName: null,
							businessId: null,
							categoryId: "18",
							child: null,
							children: null,
							data: null,
							dataId: null,
							format: null,
							formatFlag: "0",
							mealStatus: null,
							packFee: null,
							percentPriceAmount: 0,
							priceAmount: 10,
							productDescribe: "",
							productId: "159",
							productImage: "db9f5370733248bca1e8bf7088dcbb2420220808190643.jpg",
							productName: "冰水",
							productNum: 1,
							productPercentPrice: 0,
							productPrice: 10,
							recommend: null,
							soldOut: null,
							status: null,
						},
						{
							addPrice: 0,
							addTime: "20221018145027",
							attributesName: null,
							businessId: null,
							categoryId: "18",
							child: null,
							children: null,
							data: null,
							dataId: null,
							format: null,
							formatFlag: "0",
							mealStatus: null,
							packFee: null,
							percentPriceAmount: 5,
							priceAmount: 10,
							productDescribe: "",
							productId: "117",
							productImage: "7bd74e9eee904260a5d06d198f52ab5c20220705161941.jpg",
							productName: "绿豆糕",
							productNum: 1,
							productPercentPrice: 5,
							productPrice: 10,
							recommend: null,
							soldOut: null,
							status: null
						},
						{
							addPrice: 0,
							addTime: "20221018145023",
							attributesName: null,
							businessId: null,
							categoryId: "18",
							child: null,
							children: null,
							data: null,
							dataId: null,
							format: null,
							formatFlag: "0",
							mealStatus: null,
							packFee: null,
							percentPriceAmount: 0,
							priceAmount: 10,
							productDescribe: "",
							productId: "103",
							productImage: "2b8dcac63473430b842dca01a8f80bba20220920152521.png",
							productName: "柠檬汁",
							productNum: 1,
							productPercentPrice: 0,
							productPrice: 10,
							recommend: null,
							soldOut: null,
							status: null
						},
						{
							addPrice: 18,
							addTime: "20221018144957",
							attributesName: "加冰、超级杯",
							businessId: null,
							categoryId: "18",
							child: null,
							children: null,
							dataId: "23、25",
							format: null,
							formatFlag: "1",
							mealStatus: null,
							packFee: null,
							percentPriceAmount: 0,
							priceAmount: 18,
							productDescribe: "糯米茶+香水柠檬",
							productId: "91",
							productImage: "359df5c3f8ce417ea60c3fe07c2217df20220602235921.png",
							productName: "糯米香柠檬茶",
							productNum: 1,
							productPercentPrice: 0,
							productPrice: 0,
							recommend: null,
							soldOut: null,
							status: null,
							data:[
								{
									attributesName: "加冰",
									dataId: "23",
									productPrice: 0,
								},
								{
									attributesName: "超级杯",
									dataId: "25",
									productPrice: 18,
								}
							]
						},
						{
							addPrice: 1,
							addTime: "20221018144949",
							attributesName: "加冰",
							businessId: null,
							categoryId: "18",
							child: null,
							children: null,					
							dataId: "135",
							format: null,
							formatFlag: "1",
							mealStatus: null,
							packFee: null,
							percentPriceAmount: 19,
							priceAmount: 21,
							productDescribe: "大份米饭",
							productId: "27",
							productImage: "8301bef10fa141c0ae282c3d9641779620220523164836.png",
							productName: "百香柠檬",
							productNum: 1,
							productPercentPrice: 18,
							productPrice: 20,
							recommend: null,
							soldOut: null,
							status: null,
							data: [
								{
									attributesName: "加冰",
									dataId: "135",
									productPrice: 1
								}
							]
						},
						{
							addPrice: 2,
							addTime: "20221018144944",
							attributesName: "加冰、中份",
							businessId: null,
							categoryId: "18",
							child: null,
							children: null,						
							dataId: "146、144",
							format: null,
							formatFlag: "1",
							mealStatus: null,
							packFee: null,
							percentPriceAmount: 20.5,
							priceAmount: 22,
							productDescribe: "冰冰凉凉大西瓜",
							productId: "14",
							productImage: "d109a116376f462a99907ec2701173de20220610151625.jpg",
							productName: "冰镇西瓜",
							productNum: 1,
							productPercentPrice: 18.5,
							productPrice: 20,
							recommend: null,
							soldOut: null,
							status: null,
							data:[
								{
									attributesName: "加冰",
									dataId: "146",
									productPrice: 0
								},
								{
									attributesName: "中份",
									dataId: "144",
									productPrice: 2
								}
							]
						},
					]
				},
				form:{remark:''},
				showMore: false,
				mealFeeTotal:0
			})
			onMounted(async () => {
				
				state.storeInfo = route.query
				// console.log(route.query,3333)
				let params = {
					tableId: state.storeInfo.tableId,
					userId: state.storeInfo.userId,
				}
				console.log(params,999)
				let tt = JSON.parse(JSON.stringify(params))
				await cart(tt).then(res => {
					if (res.code == 200) {				
						state.orderInfo = res.data
						// state.productInfo = res.data.productInfo		
					}
				})

			})
			nextTick(() => {
				
			})

			const mealFeeTotal = computed(() => {
        return  state.storeInfo.mealFee * state.storeInfo.mealNum
      })
			const listToggle = () =>{
				state.showMore = !state.showMore
			}
			
			const toCar = ()=>{
				router.go(-1)
			}
			const goPay = async ()=>{
				let params = {
					"tableId": state.storeInfo.tableId,
					"userId": state.userId,
					"businessId": state.storeInfo.businessId,
					"diningNum": state.storeInfo.mealNum,
					"orderSource": state.storeInfo.orderSource,
					"remark": state.form.remark
				}
				if (state.storeInfo.orderType == 1) {
					storeInfo.mealPerson = state.storeInfo.mealNum
					storeInfo.remark = state.form.remark
				}
				let res = state.storeInfo.orderType == 1 ? await addResverse(state.storeInfo) : await addOrder(params)
				let orderId = res.data.orderId
				let activityFlag = res.data.activityFlag
				Toast(state.storeInfo.orderType == 1? '预约成功':'下单成功');
				setTimeout(function() { //注意function这里不能缺少
					if (activityFlag == "1") {
						router.push({
							path: '/luckDraw',
							query: {
								orderId: orderId,
								activitySeat: state.storeInfo.orderType == 1 ? 3 : 2
							}
						})			
					} else {
						router.push({
							path: '/order-detail',
							query: {
								orderId: orderId
							}
						})
				
					}
				}, 1500)
				
				// router.push({
				// 	path:'/order-detail'
				// })
			}
			return {
				...toRefs(state),
				listToggle,
				toCar,
				goPay,
				mealFeeTotal
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
</style>
