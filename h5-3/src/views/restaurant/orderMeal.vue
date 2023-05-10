<template>
	<div class="container ps-re">
		 <img class="bg-img" src='@/assets/order/bg1.jpg' />
		   <div v-if="!showOrder">
		     <div class="title-view">
		       <div class="size-20">欢迎光临</div>
		       <div>{{storeInfo.businessName}}</div>
		     </div>
		     <div class="main">
		       <div class=" card-view bg-w mg-lr-10">
		         <van-cell title="你好，请选择用餐人数" use-label-slot>
		           <div slot="">桌号:{{storeInfo.tableName}}</div>
		         </van-cell>
		         <div class="flex-row pd-tb-10 flex-between">
							 <div class="flex-row">
							 	<div class="title" style="width: 80px;"> 人数：</div>
							 	<van-stepper  v-model="mealNum" input-width="40px" @change="onChange" button-size="28px" />
							 </div>
		           
		           <div class="clr-666 mg-lt-10 flex-row flex-row-item" v-if="storeInfo.mealFee > 0">餐位费：{{storeInfo.mealFee}} 元/位</div>
		         </div>
		         <div class="mg-tb-15">
							 <van-button color="#c83c3c" round  class="w-100" @click="toOrder">开始点餐</van-button>
		         </div>
		       </div>
		     </div>
		   </div>
		
		   <van-popup v-model:show="showTime" position="bottom" @close="onClose">
		     <van-datetime-picker v-model="currentDate" :min-date="minDate" :max-date="maxDate" @cancel="onCancelDate" @confirm="onConfirmDate" @change="onInput" />
		   </van-popup>
		 
		  <!-- <van-popup v-model:show="showPopup" round position="bottom" :style="{ height: '40%' }" @close="onClose">
		     <div class="isLogin">
		       <div class="loginTitle">微信授权登录</div>
		       <div class="loginshopImg">
		         <div>您还未登录，请授权登录</div>
		         <div>(如未授权，可能无法正常使用该小程序)</div>
		       </div>
		       <div class="isAgary">
		         <div>•</div>
		         <div>获取你的手机号及公开信息(昵称、头像等)</div>
		       </div>
		       <div class="isLoginBtn mg-tp-10">        
		         <van-button :class="{{flag?'show':'hide'}}" @click="getUserProfile">{{AuthorizedLogin}}</van-button>
		         <button class="{{flag?'hide':'show'}}"  @click="getPhoneNumber">{{UserPhone}}</button>
		       </div>
		     </div>
		   </van-popup> -->
	</div>
</template>

<script>
	import { Toast } from 'vant'
	import { reactive, onMounted,toRefs,nextTick } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	import { getStoreInfo, addDiningNum} from '@/api/cart'
	export default {
		name:"",
		components: {

		},
		setup() {
			const route = useRoute()
			const router = useRouter()
			const state = reactive({
				showOrder: false,
				mealNum:'',
				storeInfo:{
					address: "云南省昆明市官渡区广福路与云秀路交汇处1103号",
					businessId: "149",
					businessLogo: "ceb7a93b39dc4130b2ad693b28cdb84b20220803173040.png",
					businessName: "闲时蜗居小店",
					businessStatus: "1",
					children: null,
					tableId: "10",
					tableName: "十人大桌",
					mealFee: 3
				}
			})
			onMounted( () => {
				console.log(8888)
				// let tableId = route.query.tableId
				// const res = await getStoreInfo(tableId)
				// if (res.code == 200 && res.data == 100) {
				// 	// data是100 商家未营业				
				// 	state.showOrder = !state.showOrder

				// 	Dialog.confirm({
				// 		title: '提示',
				// 		message: res.msg,
				// 	})
				// 		.then(() => {
				// 			// on confirm
				// 			router.push({
				// 				path:'/home'
				// 			})
				// 		})
				// 		.catch(() => {
				// 			// on cancel
				// 		});

				// } else {						
				// 	state.showOrder = !state.showOrder
				// 	storeInfo: res.data							
				// }
		
			})
			nextTick(() => {
				
			})
			
			const onChange = (val) => {
				state.mealNum =  val
			}
			const toOrder = () => {
				if (state.mealNum < 1) {
					Toast.fail('请选择用餐人数');		   
					} else {
						state.storeInfo.mealNum = state.mealNum
						state.storeInfo.orderSource = '2'
						// let { businessId, tableId,tableName, mealNum, orderSource } = state.storeInfo
						
						
						let params = {
							tableId: state.storeInfo.tableId,
							diningNum: state.mealNum
						}
						// await addDiningNum(params).then(res => {})
						
						router.push({
							path:'/category',
							query:{
								...state.storeInfo
							}
						})
					}
			}

			return {
				...toRefs(state),
				toOrder,
				onChange
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bg-img {
	  position: absolute;
	  left: 0;
	  bottom: 0;
	  display: block;
	  height: 100%;
	  width: 100%;
	  // z-index: -999;
	}
	
	.page-container {
	  min-height: 100%;
	  position: relative;
	}
	
	.main {
	  position: absolute;
	  bottom: 120px;
	  left: 0;
	  right: 0;
	}
	
	.title-view {
	  text-align: center;
	  font-size: 2rem;
	  color: white;
	  position: relative;
	  padding-top: 70px;
	}
	
	.card-view {
	  padding: 10px 15px;
	  border-radius: 10px;
	}
	
	.cell-btn {
	  padding: 10px 20px;
	  background: #C83C3C;
	  text-align: center;
	  color: rgb(255, 255, 255);
	  margin: 10px;
	  border-radius: 10px;
	}
	
	.hide {
	  border-radius: 40px;
	  margin: 10px 25px;
	  font-size:17px;
	  display: none;
	}
	
	.show {
	  display: block;
	  border-radius: 40px;
	  margin: 10px 25px;
	  font-size: 17px;
	}
	.title::before {
		content: '*';
		width: 20rpx;
		height: 100%;
		margin-right: 3px;
		font-size: 36rpx;
		color: #F00;
	}
</style>
