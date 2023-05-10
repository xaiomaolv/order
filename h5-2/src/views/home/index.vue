<template>
	<div class="container">
		<div class="img-box">
			<img class="img-box-item" style="width:100%;height:30vh;margin:0" src="@/assets/home/sy.jpg" />
		</div>
		
		<div class="card_name flex-row flex-center tx-ct mg-lr-10 bg-w bd-rd-5 pd-tb-10" style="margin-top: -30px;">
			<div class="flex-col-12 flex-row">
				<img class='item_image mg-lt-20' src="@/assets/home/he.png" />
				<div class="ft-se-12 mg-lt-8">{{nowTime}}</div>
			</div>
			
				
			<div class="flex-col-12 flex-row flex-right pd-rt-20 tx-rt">
				<img class='' style="height: 25px;width:25px;" src="@/assets/home/dc.png" />
				<span class="ft-se-14 ft-bd" style="color: #F89D9E; line-height: 25px;">彩云点餐</span>
			</div>
		</div>
		
	<!-- 	<div class="card_dian tx-ct size-12 mg-lr-10 bg-w bd-rd-5 mg-tp-10">
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
		</div> -->
		<!-- style="padding-top: 2.5rem; padding-bottom: 2.5rem;" -->
		<div class="card_shop flex-row flex-between mg-lr-10 bg-w bd-rd-5 mg-tp-15 pd-tb-20"   @click="toShop">
			<div class='flex-col-5 mg-lt-20'>
				<img src="@/assets/home/shop.png" class="shop_img" style="width: 3.75rem; height: 3.75rem;" />
			</div>
			<div class='flex-1 tx-lt'>
				<span class="p-title ft-se-18 ft-bd">商家浏览</span>
				<div class="clr-999 ft-se-14 mg-tp-8">一日三餐，今天你吃好了吗？</div>
			</div>
		</div>
		
		<div class="card_order tx-ct mg-lr-10 bg-w bd-rd-5 mg-tp-15 pd-tb-15">
			<div class="flex-row flex-wrap">
				<div class="flex-col-12  bd-rt" @click="toOrder">
					<div class="p-title">
						<img class='dian_img' src="@/assets/home/order.png" />
					</div>
					<div class="ft-bd mg-tp-5">我的订单</div>
				</div>
				<div class="flex-col-12 " @click="toRecord">
					<div class="p-title">
						<img class='dian_img' src="@/assets/home/record.png" />
					</div>
					<div class="ft-bd  mg-tp-5">预约记录</div>
				</div>
			</div>
		</div>
		
		<div class="card_order tx-ct mg-lr-10 bg-w bd-rd-5 mg-tp-15 pd-tb-15">
			<div class="flex-row flex-wrap">
				<div class="flex-col-12 bd-rt" @click="toCollect">
					<div class="p-title">
						<img class='dian_img' src="@/assets/home/sc.png" />
					</div>
					<div class="ft-bd  mg-tp-5">店铺收藏</div>
				</div>
				<div class="flex-col-12" @click="toCoupon">
					<div class="p-title">
						<img class='dian_img' src="@/assets/home/yhq.png" />
					</div>
					<div class="ft-bd  mg-tp-5">优惠券</div>
				</div>
			</div>
		</div>
		
		<div class="di_img mg-lr-10 bg-w bd-rd-5 mg-tp-15">
			<img style="width:100%;height:60px" src="@/assets/home/di.png" />
		</div>

		<van-tabbar v-model="active" active-color="#f43c48" inactive-color="#666" @change="onChange">
			<van-tabbar-item class="nav-list-item tx-ct" icon="home-o" >
				<div class="ft-se-14">首页</div>
			</van-tabbar-item>
			<van-tabbar-item class="nav-list-item tx-ct" icon="contact">
				<div class="ft-se-14">个人中心</div>
			</van-tabbar-item>
		</van-tabbar>

		<!-- <van-share-sheet
			v-model="showShare"
			title="登录方式"
			cancel-text=""
			:close-on-click-overlay='false'
			:options="options"
			@select="onSelect"
		/> -->
	</div>
</template>


<script>
	import {
		jsonp
	} from 'vue-jsonp'
	import { getToken, getLocal, setToken } from '@/utils/auth'
	import { ImagePreview } from 'vant';
	import { img_prveview } from "@/utils/imgbase"
	export default {
		data() {
			return {
				nowTime: '',
				userStatus: null,
				userInfo: {
					nickName:''
				},
				active: 0,
				showShare: true,
				options: [
					{ name: '微信', icon: 'wechat' },
					{ name: '手机银行', icon: 'weibo' },
				],
			}
		},
		created(){

			this.nowTime = this.getTime()
			let obj = this.paramsSpliter()
			let len = Object.keys(obj).length
			
			console.log('授权返回',obj)
			// 未登录
			if(!getToken()){
				// 没code 且 没token 微信公众号进入
				if(!obj.code && !obj.token){
					// 去授权
					this.wxLogin()
				}
				// 已静默授权
				if(obj.code && !obj.token){
					let params = {
						url: decodeURI(window.location.href),
						userType:'3',
						wxCode: obj.code
					}
					this.login(params)
				}
				
				// 手机银行登录
				if(!obj.code && obj.token){
					let params = {
						url: decodeURI(window.location.href),
						userType:'2',
						... obj
					}
					this.login(params)
				}
			}
			
		},
		mounted() {
		
		},
		methods:{
			onSelect(val){
				console.log(val)
			},
			login(params){
				
				this.$store.dispatch("Login", params).then(()=>{
					if(params.tableId){
						this.$router.push({
							path: '/orderMeal',
							query: {
								tableId: params.tableId
							}
						})
					}
				})
			},
			wxLogin() {
				let local = window.location.href;
				const appid = process.env.VUE_APP_APP_ID
				//不存在就打开上面的地址进行授权
				window.location.href =
					"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
					appid +
					"&redirect_uri=" +
					encodeURIComponent(local) +
					"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
			},
		
			onChange(val){
				if(val == 1){
					this.$router.push({
						path:'/mine'
					})
				}
			},
			toScan() {
				// let storeInfo = {
				// 	address: "云南省昆明市呈贡区广博路与广发路交叉口西260米1103号",
				// 	businessId: "50",
				// 	businessLogo: "74e1a647463744fb9cd61398e0fb92c420230216170853.png",
				// 	businessName: "闲时蜗居小1店",
				// 	businessStatus: "1",
				// 	children: null,
				// 	mealFee: 3,
				// 	tableId: "111",
				// 	tableName: "test1"
				// }
				this.$router.push({
					path: '/orderMeal', 
					query: {
						tableId: '143'
					}
				})
			},
			toCoupon () {
				this.$router.push({
					path: '/coupon', 
				})
			},
			toShop(){
				this.$router.push({
					path: '/index', 
				})
			} ,
			toOrder(){
				this.$router.push({
					path: '/order', 
				})
			}, 
			toRecord(){
				this.$router.push({
					path: '/appointList', 
				})		
			},
			toCollect(){
				this.$router.push({
					path: '/coltRestaurant', 
				})
			},
			
			getTime(){
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
			
			},
			bindViewTap(item){
				this.$router.push({
					path: '/restaurant',
					query: {
						businessId: item.businessId
					}
				})
			},
			paramsSpliter() {
				let url = decodeURI(window.location.href)
				let pramObj = {}
				if (url.indexOf("?") != -1) {
					let temp1 = url.split('?');
					let pram = temp1[1];
					let table = temp1[2] ? temp1[2].split('&') : []
					let keyValue = temp1[2] ? [...pram.split('&'), ...table] : pram.split('&');
					for (let i = 0; i < keyValue.length; i++) {
						let item = keyValue[i].split('=');
						let key = item[0];
						let value = item[1];
						pramObj[key] = decodeURI(value);
					}
					return pramObj
				}
				return {}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.p-title{
		
		
		img{
			width: 3.125rem;
			height: 3.125rem;
			border-radius: 50%;
		}
	}
</style>