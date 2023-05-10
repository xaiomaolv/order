<template>
	<div class="container">
		<div class="top-view">
		    <div class="top-card bg-w">
		      <div class="cd-tp size-20 flex-row">
		        <div class="flex-col-4">
		          <img class='item_image' :src="`${imgUrl}${storeInfo.businessLogo}`" />
		        </div>
		        <div class="flex-col-12 tx-jt mg-lt-10">
		          <div class="ft-se-17 ft-bd">{{storeInfo.businessName}}</div>
		        </div>
		        <div class="flex-col-8" style="margin-bottom: 30px;">
		          <van-icon v-if="colleStatus == 0"  class="rt-btn" name="star-o" size="22"
		            @click="collect" />
		          <van-icon v-if="colleStatus == 1"  color="#F9CE5E" class="rt-btn" name="star" size="22"
		            @click="collect" />
		        </div>
		      </div>
		      <van-cell icon="bulb-o">
		        <div slot="title">         
		          <div>{{storeInfo.businessTime || ''}}</div>
		        </div>
		        <div @click="callPhone(storeInfo.chargePhone)" >
		          <van-icon class="rt-btn" name="phone-o" size="18" />        
		        </div>
		      </van-cell>
		      <van-cell :title="storeInfo.address" icon="location-o">
		      </van-cell>
		    </div>
		  </div>
		
		  <div class="medium-card flex-row">
		    <div class="flex-col-12 bd-rt" @click="scanner">
		      <div class="card-img">
		        <img class='item_image' src='@/assets/order/order1.png' />
		      </div>
		      <div class="size-18 mg-5">点餐</div>
		      <div class="remark">已落座，扫码点餐</div>
		    </div>
		    <div class="flex-col-12" @click="subscribe(storeInfo)" v-if="storeInfo.reserveFlag == 1">
		      <div class="card-img">
		        <img class='item_image' src='@/assets/order/order2.png' />
		      </div>
		      <div class="size-18 mg-5">预约</div>
		      <div class="remark">未到店，预约点餐</div>
		    </div>
		  </div>
		
		  <div class="food-list">
		    <div class="card_dz ">
					<div class="flex-row">										
						<div v-if="storeInfo.children.length > 0" class="flex-col-12 ft-se-20 ft-bd clr-dz tx-lt">店长推荐</div>
						<div v-if="storeInfo.children.length > 0" class="flex-col-12 ft-se-15 clr-dz tx-rt flex-row flex-right"  @click="menuView(storeInfo)">看看菜单<van-icon name="arrow" /><van-icon name="arrow" /></div>
						<div v-else class="flex-col-24 ft-se-15 clr-dz tx-rt flex-row flex-right"  @click="menuView(storeInfo)">看看菜单<van-icon name="arrow" /><van-icon name="arrow" /></div>
					</div>
					<div class="goods mg-tp-10">
					  <div class="banner scrollx" >
					    <div class="banner_Item flex-col-8" v-for="item in storeInfo.children" :key="item.id">
					      <div class="mg-2 pd-5 bg-w bd-rd tx-ct ft_box ps-re">
					        <div class="cornorMark ps-ab">店长推荐</div>
					        <img class="img" v-if="item.productImage" :src="`${imgUrl}${item.productImage}`" />	           
					        <div class="name ft-se-12" v-if="item.productName">{{item.productName}}</div>
					      </div>
					    </div>
					  </div>
					</div>
				</div>

		  </div>
	</div>
</template>

<script>
	import wx from 'jweixin-module'; 
	import { reactive, onMounted,toRefs,nextTick } from 'vue'
	import { useRoute, useRouter } from 'vue-router'

	import { collect, deleteCollect, getStoreDetail, getWeiXinSdk } from "@/api/store"
	import { Toast } from 'vant'
	export default {
		name:"",
		components: {

		},
		setup() {
			const route = useRoute()
			const router = useRouter()
			const state = reactive({
				isLogin: false,
				storeInfo:{
					address: "云南省昆明市五华区人民中路95号8号",
					businessId: "58",
					businessLogo: "84e8258932e345e1932b2c349357ab0120220606173115.png",
					businessName: "测试门店",
					businessStatus: "1",
					businessTime: "",
					chargePhone: "17788996655",
					children: null,
					colleStatus: "0",
					doorPlate: null,
					reserveFlag: "1",
					reserverDeposit: null,
					userId: null,
					children:[
						{productName: "蒜蓉白菜", productImage: "43ab23b4bc624133ad83206c47b2018220220518151209.jpg"},
						{productName: "炒牛肉", productImage: "421f463c538e467eb5e1951e8f68aee820220520204823.jpg"},
						{productName: "炒时蔬", productImage: "443e7143909749a19dd0bc8f1e52ddf920220523164517.jpg"},
						{productName: "炒山药", productImage: "158c1e4b251d43dfab4babc288ff6fdc20220523164602.jpg"},
						{productName: "纯素减肥餐", productImage: "d3c7a47a72e24e16b9a03036e6c7e5d220220527174224.jpg"},
						{productName: "猪肉", productImage: "c2b1a9c9b4fd4287a4073482fb00873220220705164833.jpg"},
					]
				},
				colleStatus:'',
				businessId: null,
				userId: null,
				//图片访问地址
				imgUrl:'https://order.ynejkj.com/api/order/image/preview?fileName=',
				
			})
			onMounted(async () => {
				if(route.query){
					state.businessId = route.query.businessId
				}
				let params = {
						"businessId": state.businessId,
						"userId": state.userId
					}
				// let res = await	getStoreDetail(params)
				// if (res.code == 200) {
				// 	state.storeInfo = res.data
				// 	state.colleStatus = res.data.colleStatus				
				// }
				
				// isWechat()
				scanQRJssdk()
			})
			nextTick(() => {
				
			})

			const collect = async () => {
				let params = {
					"businessesId": state.businessId,
					"userId": state.userId
				}
				const res = await state.colleStatus == 0 ?   collect(params) :  deleteCollect(params)
				state.colleStatus = state.colleStatus == 0 ? 1 : 0
				Toast.success(res.msg)
			}
			const callPhone = (phonenumber) => {
				window.location.href = 'tel:' + phonenumber;
			}
			
			const scanner = () => {
				router.push({
					path:'/orderMeal',
					query:{
						tableId: 10
					}
				})
			}
			// const  scanner = () => {	// 点击的时候调起扫一扫功能呢
			// 	// const that = this;
			// 	console.log('1');
			// 	wx.scanQRCode({
			// 		needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
			// 		scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
			// 		success(res) {
			// 			const resultStrArr = res.resultStr.split(',');		
			// 			// 转为数组时为了避免扫描一维码是返回CODE_128,20180528前面会添加一个CODE_128所以转为数组获		取最后一条就行了
			// 			console.log(resultStrArr[resultStrArr.length - 1]); // 输出扫码信息
					 
			// 		},
			// 		fail(res) {
			// 			console.log('err', res);
			// 		}
			// 	});
			// }
			const subscribe = () => {
				router.push({
					path:'/appointment',
					query:{
						businessId: state.storeInfo.businessId
					}
				})
				
			}
			const menuView = () => {
				router.push({
					path:'/menuView'
				})
			}
			
			const isWechat = () => {
				const ua = window.navigator.userAgent.toLowerCase();
				if (ua.match(/micromessenger/i) == 'micromessenger') {
					// return true;
					console.log('微信浏览器');
					scanQRJssdk();
				} else {
					console.log('普通浏览器,请在手机微信浏览器打开此页面');
					return false;
				}
			}
			// 初始化sdk配置
			const  scanQRJssdk = async () =>{
				// alert(`url链接:${window.location.href}`);
				// const u = navigator.userAgent;
				// const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; // Android
				// const isIOS = navigator.platform.indexOf('iPhone') != -1;//ios
				//  let url = '';
				// if (isAndroid) {
				// 	url = location.href;
				// }
				// if (isIOS) {
				// 	url = location.href.split('#')[0]; // hash模式下,#后面的部分如果带上ios中config会不对
				// }
				// const api = [];
				// // 'qrCode','barCode'
				// api.push('qrCode');
				// api.push('barCode');
				const resData = await getWeiXinSdk();	// 根据接口返回appId，timestamp等数据
				console.log('获取微信配置结果', resData);
				if (resData) {
					// alert(JSON.stringify(resData));
					wx.config({
						// beta: true,
						debug: false,
						appId: resData.data.result.appId,
						timestamp: resData.data.result.timestamp,
						nonceStr: resData.data.result.nonceStr,
						signature: resData.data.result.signature,
						jsApiList: ['checkJsApi', 'scanQRCode']
					});
					wx.ready(() => {
						wx.checkJsApi({
							jsApiList: ['scanQRCode'],
							success(res) {
								console.log('aaaa', res);
							}
						});
					});
					wx.error((res) => {
						alert(`出错了：${res.errMsg}`);// 这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然		后根据微信文档查询即可。
					});
				}
			}
			
		
			return {
				...toRefs(state),
				collect,
				callPhone,
				scanner,
				subscribe,
				menuView,
				scanQRJssdk,
				isWechat
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top-view {
	  height: 10.9375rem;
	  background: #8d2230;
	  position: relative;
	}
	
	.rt-btn {
	  float: right;
	  display: initial;
	}
	
	.top-card {
	  position: absolute;
	  top: 75px;
	  left: 10px;
	  right: 10px;
	  height: 175px;
	  border-radius: 10px;
	}
	
	.top-card .cd-tp {
	  margin: 10px 15px;
	}
	
	.medium-card {
	  margin: 10px;
	  margin-top: 65px;
	  border-radius: 10px;
	  padding: 20px;
	  background: white;
	  text-align: center;
	}
	
	.medium-card card-img {
	  width: 50px;
	  height: 50px;
	}
	
	.item_image {
	  width: 50px;
	  height: 50px;
	  border-radius: 10px;
	}
	
	.ft-se-17 {
	  font-size: 17px;
	}
	
	.medium-card .remark {
	  color: rgb(184, 185, 185);
	}
	
	.food-list {
	  margin: 10px;
	
	}
	
	.food-list .img {
	  border-top-right-radius: 10px;
	  border-top-left-radius: 10px;
	  width: 100%;
	  height: 75px;
	}
	
	.food-list .ft_box {
	  /* border-top-right-radius: 10px;
	  border-top-left-radius: 10px; */
	  height: 130px;
	  border-radius: 10px;
	}
	.goods{
		width: 100%;
		overflow: hidden;
	}
	.banner {
	  height: 140px;
	  width: 100%;
	  display: flex;
	  display: -webkit-box;
	  flex-direction: column;
		overflow-x: scroll;
	}
	
	.banner_Item {
	  /* width: 150rpx; */
	  height: 75px;
	  margin-right: 5px;
	}
	
	.cornorMark {
	  z-index: 999;
	  /* right: 0; */
	  top: 0;
	  /* background: #e64340; */
	  background-image: linear-gradient(to left, #e64340, #f0b593);
	  border-top-left-radius: 10px;
	  /* border-top-right-radius: 10px; */
	  width: 50%;
	  /* height: 35rpx; */
	  color: #fff;
	  font-size: 12px;
	  text-align: center;
	  padding: 0 10rpx;
	}
	
	/* 菜品推荐盒子 */
	.card_dz {
	  border-radius: 10px;
	  padding: 10px 5px;
	  background: white;
	}
	.clr-dz{
	  color: #8d2230;
	}
	.fl-rt{
	  float: right;
	}
</style>
