<template>
	<div class="container">
		<div class="back_bth_lt fixed ft-se-13"  @click="goBack">
			<span class="flex-row"><van-icon name="revoke" class="mg-rt-5 ft-se-16" />返回</span>
		</div>
		<div class="top-view">
		    <div class="top-card bg-w">
		      <div class="cd-tp size-20 flex-row">
		        <div class="flex-col-4">
		          <Img class='item_image' v-if="storeInfo.businessLogo" :src="storeInfo.businessLogo" />
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
		
		  <div class="medium-card flex-row flex-wrap  bd-box">
				<!-- <div class="flex-col-12 bd-rt mg-bt-15" @click="scanner">
		      <div class="card-img">
		        <img class='item_image' src='@/assets/order/order1.png' />
		      </div>
		      <div class="size-18 mg-5">开始点餐</div>
		      <div class="remark">已落座，扫码点餐</div>
		    </div>
				 -->
		    <div class="flex-col-12 mg-bt-15" @click="subscribe(storeInfo)" v-if="storeInfo.reserveFlag == 1">
		      <div class="card-img">
		        <img class='item_image' src='@/assets/order/order2.png' />
		      </div>
					
					<div class="" v-if="storeInfo.mealTime && !isShow">
						<div class="size-18 mg-5">已预约</div>
						<div class="remark li-hg-18">
							<div>{{storeInfo.mealTime}} </div>
							<div>{{storeInfo.reserveName}}</div>
						</div>
					</div>
					
					<div class="" v-else>
						<div class="size-18 mg-5">预约订位</div>
						<div class="remark li-hg-18">未到店，预约点餐</div>
					</div>
		    </div>
				
				<div class="flex-col-12  mg-bt-15" :class="{ 'bd-lt': storeInfo.reserveFlag == 1 && storeInfo.enableDelivery }"  @click="homeService(storeInfo)" v-if="storeInfo.enableDelivery">
				  <div class="card-img">
				    <img class='item_image' src='@/assets/order/sc.png' />
				  </div>
				  <div class="size-18 mg-5">送餐上门</div>
				  <div class="remark li-hg-18">已点餐，送餐上门</div>
				</div>
				
		  </div>
		
		  <div class="food-list">
		    <div class="card_dz ">
					<div class="flex-row">							
						<div v-if="storeInfo.children && storeInfo.children.length > 0" class="flex-col-12 ft-se-20 ft-bd  tx-lt flex-row"><img src="@/assets/index/zan.png" alt="" srcset="" /> 店长推荐</div>
						<div v-if="storeInfo.children && storeInfo.children.length > 0" class="flex-col-12 ft-se-15  tx-rt flex-row flex-right "  @click="menuView(storeInfo)"><span class="clr-dz ft-se-12">更多菜单</span></div>
						<div  v-else class="flex-col-24 ft-se-15  tx-rt flex-row flex-right"  @click="menuView(storeInfo)"><span class="clr-dz ft-se-12">更多菜单</span></div>
					</div>
					<div class="goods mg-tp-10" v-if="storeInfo.children && storeInfo.children.length > 0">
					  <div class="flex-row flex-wrap" >
					    <div class="banner_Item flex-col-8  mg-bt-10" v-for="(item,index) in storeInfo.children" :key="item.id">
								
					      <div class="mg-2 bg-w bd-rd tx-ct ft_box  ps-re of-hd">	
									<div class="cornorMark ps-ab" v-if="index === 0">推荐</div>
									<Img class="img" v-if="item.productImage" :src="`${item.productImage}`" />	 
					        <div class="name ft-se-14 tx-ot li-hg-20" style="height: 40px;" v-if="item.productName">{{item.productName}}</div>
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
	import { collect, deleteCollect, getStoreDetail, getWeiXinSdk } from "@/api/store"
	import { getLocal } from '@/utils/auth'
	import { Toast } from 'vant'
	export default {
		data(){
			return {
				storeInfo:{},
				colleStatus:'',
				businessId: null,
				userId: null,
				isShow: null
			}
		},
		async created(){
			if(this.$route.query){
				this.businessId = this.$route.query.businessId
			}
			let params = {
					"businessId": this.businessId,
					"userId": getLocal('userId')
				}
			
			let res = await	getStoreDetail(this.$qs.stringify(params))
			if (res.code == 200) {
				this.storeInfo = res.data
				this.colleStatus = res.data.colleStatus 
				// 判断是否是今天
				if(this.storeInfo.mealTime){
					this.isShow = this.CompareDate(this.getDateTime(), this.storeInfo.mealTime.split(' ')[0])
				}

			}
			
			// isWechat()
			// this.scanQRJssdk()
		},
		 mounted() {
			
		},
		methods:{
			goBack(){
				this.$router.go(-1)
			},
			async collect(){
				let params = {
					"businessesId": this.businessId,
					"userId": getLocal('userId')
				}
				const res = await this.colleStatus == 0 ?   collect(params) :  deleteCollect(params)
				this.colleStatus = this.colleStatus == 0 ? 1 : 0
				Toast.success(this.colleStatus == 1 ? '已收藏' : '取消收藏')
			},
			
			callPhone(phonenumber){
				window.location.href = 'tel:' + phonenumber;
			},
			
			scanner(){
				this.$router.push({
					path:'/orderMeal',
					query:{
						tableId: 10
					}
				})
			},
			
			// scanner(){	// 点击的时候调起扫一扫功能呢
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
			// },
			
			subscribe(){
				// if(this.storeInfo.mealTime) return
				this.$router.push({
					path:'/appointment',
					query:{
						...this.storeInfo
					}
				})
				
			},
			
			menuView(){
				this.$router.push({
					path:'/menuView',
					query:{
						...this.storeInfo
					}
				})
			},
			
			  // 送餐上门
			  // flag 进入地址管理 1:送餐上门  2:个人中心
			homeService(storeInfo) {
				if (storeInfo.businessStatus == "1") {
					// this.$store.commit('SET_STOREINFO', storeInfo)
					let str = storeInfo.deliveryAddress
					// 店家设置地址
					if (str) {
						this.$router.push({
							path:'./addressDelivery',
							query:{
								...storeInfo
							}
						})
					}else{
						this.$router.push({
							path:'/addressList',
							query:{
								...storeInfo
							}
						})
					} 			
				} else {
					Toast.fail('该商家暂不营业')
				}
			},
			
			isWechat(){
				const ua = window.navigator.userAgent.toLowerCase();
				if (ua.match(/micromessenger/i) == 'micromessenger') {
					// return true;
					console.log('微信浏览器');
					scanQRJssdk();
				} else {
					console.log('普通浏览器,请在手机微信浏览器打开此页面');
					return false;
				}
			},
			
			// 初始化sdk配置
			async scanQRJssdk(){
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
			},
			
			check(str, m, n) {
				//参数str判断的字符串 m最小值 n最大值
				var re = /(\d+)/g;
				while (re.exec(str)) {
					var int = parseInt(RegExp.$1);
					if (int < m || int > n) return false;
				}
				return true;
			},

			/**
			 * 获取当前日期
			 * @param {*}  
			 * @param {*}   
			 */
			getDateTime() {
				let d = new Date()
				let month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
				let date = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
				var datetime = d.getFullYear() + '-' + month + '-' + date
				return datetime
			},
			/**
			 * 日期比较大小
			 * @param {*}  需将日期格式格式化：yyyy-MM-dd
			 * @param {*}   
			 */
			CompareDate(stratTime, endTime) {
				return ((new Date(stratTime)) > (new Date(endTime)));
			}	
		},
		

	}
</script>

<style lang="scss" scoped>
	.top-view {
	  height: 10.9375rem;
	  background: #8d2230;
	  position: relative;
		margin-top: -1px;
	}
	:deep .van-nav-bar{
		background: #8d2230;
	}
	:deep .van-hairline--bottom::after {
			border-bottom-width: 0px;
	}
	:deep .van-nav-bar .van-icon{
		color: #fff !important;
	}
	:deep .van-nav-bar__title{
		color: #fff;
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
	  margin-top: 95px;
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
		margin-top: 3px;
	  color: rgb(184, 185, 185);
		font-size: 13px;
	}
	
	.food-list {
	  margin: 10px;
	
	}
	
	.food-list .img {
	  border-radius: 10px;
	  width: 100%;
		height: 6.25rem;
	}
	
	.food-list .ft_box {
	  /* border-top-right-radius: 10px;
	  border-top-left-radius: 10px; */
	  // height: 130px;
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
	  // height: 75px;
	  // margin-right: 5px;
		padding: 5px;
		box-sizing: border-box;
		// height: 6.25rem;
		overflow: hidden;
	}

	.cornorMark {
	  z-index: 999;
	  /* right: 0; */
	  top: 5px;
		left: -30px;
	  /* background: #e64340; */
	  background-image: linear-gradient(to left, #e64340, #f0b593);
	  border-top-left-radius: 10px;
	  /* border-top-right-radius: 10px; */
	  width: 80%;
	  /* height: 35rpx; */
		background: #e06513;
	  color: #fff;
	  font-size: 10px;
	  text-align: center;
	  padding: 5px;
		transform: rotate(-45deg);
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
	.clr-dz {
		color: white;
		background: #FB9780;
		border-radius: 22px;
		// width: 60px;
		padding: 3px 10px;
	}
</style>