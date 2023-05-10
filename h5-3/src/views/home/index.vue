<template>
	<div class="container">
		<div class="img-box">
			<img class="img-box-item" style="width:100%;height:30vh;margin:0" src="@/assets/home/sy.jpg" />
		</div>
		
		<div class="card_name flex-row flex-center tx-ct mg-lr-10 bg-w bd-rd-5" style="margin-top: -30px;">
			<div class='flex-col-3 mg-lt-20 mg-tp-10'>
				<img class='item_image' src="@/assets/home/he.png" />
			</div>
			<div class='flex-col-11 tx-lt mg-tp-5 ft-se-12 flex-row'>
				<div>{{nowTime}}，</div>
				<div v-if="userInfo.nickName">{{userInfo.nickName}}</div>
				<div v-else>微信用户</div>
			</div>
			<div class="flex-col-12 flex-row">
				<div class="flex-col-12 tx-rt">
					<img class='mg-tp-5' style="height: 25px;width:25px;" src="@/assets/home/dc.png" />
				</div>
				<div class="flex-col-12 tx-lt"><span class="ft-se-14 ft-bd" style="color: #F89D9E;">彩云点餐</span></div>
			</div>
		</div>
		
		<div class="card_dian tx-ct size-12 mg-lr-10 bg-w bd-rd-5 mg-tp-10">
			<div class="flex-row pd-tb-20">
				<div class="flex-col-12 bd-rt" @click="toScan"> 
					<div class="p-title">
						<img class='dian_img' src="@/assets/home/sm.png" />
					</div>
					<div class="ft-bd ft-se-18">扫码点餐</div>
				</div>
				<div class="flex-col-12" @click="toCoupon">
					<div class="p-title">
						<img class='dian_img' src="@/assets/home/quan.png" />
					</div>
					<div class="ft-bd ft-se-18">优惠券</div>
				</div>
			</div>
		</div>
		
		<div class="card_shop flex-row mg-lr-10 bg-w bd-rd-5 mg-tp-10 pd-tb-20" @click="toShop">
			<div class='flex-col-4 mg-lt-20'>
				<img src="@/assets/home/shop.png" class="shop_img" />
			</div>
			<div class='flex-col-12 tx-lt'>
				<span class="p-title ft-se-18">商家浏览</span>
				<div class="clr-999 ft-se-12">一日三餐，今天你吃好了吗？</div>
			</div>
		</div>
		
		<div class="card_order tx-ct mg-lr-10 bg-w bd-rd-5 mg-tp-10 pd-tb-20">
			<div class="flex-row">
				<div class="flex-col-8" @click="toOrder">
					<div class="p-title">
						<img class='dian_img' src="@/assets/home/order.png" />
					</div>
					<div class="ft-bd">我的订单</div>
				</div>
				<div class="flex-col-8" @click="toRecord">
					<div class="p-title">
						<img class='dian_img' src="@/assets/home/record.png" />
					</div>
					<div class="ft-bd">预约记录</div>
				</div>
				<div class="flex-col-8" @click="toCollect">
					<div class="p-title">
						<img class='dian_img' src="@/assets/home/sc.png" />
					</div>
					<div class="ft-bd">店铺收藏</div>
				</div>
			</div>
		</div>
		
		<div class="di_img mg-lr-10 bg-w bd-rd-5 mg-tp-10">
			<img style="width:100%;height:60px" src="@/assets/home/di.png" />
		</div>
	</div>
</template>

<script>
	import {
		Toast
	} from 'vant';
	import {
		jsonp
	} from 'vue-jsonp'
	import {
		reactive,
		onMounted,
		toRefs,
		nextTick,
		ref
	} from 'vue'
	import {
		useRoute,
		useRouter
	} from 'vue-router'
	import {
		login
	} from '@/api/login'
	import {
		getTypeList,
		getNearStore
	} from "@/api/store"
	import {
		CMap
	} from '@/utils/CMap'
	const mapKey = '7QZBZ-CL5LK-GINJ3-AP26H-CT7S6-6ABRH'
	
	import { useStore } from 'vuex' 
	
	import { getToken } from '@/utils/auth'
	export default {
		name: "",
		components: {

		},
		setup() {
			const item = ref(null);
			const sxitem = ref(null);
			const route = useRoute()
			const router = useRouter()
			const store = useStore() 
			const state = reactive({
				nowTime: '',
				userStatus: null,
				userInfo: {
					nickName:'潇潇'
				}
			})
			onMounted(() => {
				state.nowTime = getTime()
				
				if(!getToken()){
					let params = {
						userType:'2',
						token:'44961+62136194+6131',
						'wx-code':'785522222'
					}
					store.dispatch("Login", params).then(() => {
						
					})
				} 
				
			})
			nextTick(() => {

			})
			const init = () => {
				
			}
			const toScan = () => {
				router.push({
					path: '/orderMeal', 
					query: {
						tableId: ''
					}
				})
			}
			const toCoupon = () => {
				router.push({
					path: '/coupon', 
				})
			}
			const toShop = () => {
				router.push({
					path: '/index', 
				})
			} 
			const toOrder = () => {
				router.push({
					path: '/order', 
				})
			} 
			const toRecord = () => {
				router.push({
					path: '/appointList', 
				})
				
			} 
			const toCollect = () => {
				router.push({
					path: '/coltRestaurant', 
				})
			}

			const getTime = () => {
				// 获取当前时间
				let timeNow = new Date();
				// 获取当前小时
				let hours = timeNow.getHours();
				// 设置默认文字
				let text = ``;
				// 判断当前时间段
				if (hours >= 0 && hours <= 10) {
					text = `早上好`;
				} else if (hours > 10 && hours <= 14) {
					text = `中午好`;
				} else if (hours > 14 && hours <= 18) {
					text = `下午好`;
				} else if (hours > 18 && hours <= 24) {
					text = `晚上好`;
				}

				return text

			}
			const bindViewTap = (item) => {
				router.push({
					path: '/restaurant',
					query: {
						businessId: item.businessId
					}
				})
			}


			return {
				...toRefs(state),
				bindViewTap,
				getTime,
				toScan, toCoupon, toShop, toOrder, toRecord, toCollect
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
