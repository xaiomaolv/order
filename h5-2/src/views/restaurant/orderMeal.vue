<template>
	<div class="container ps-re">
		<div class="back_bth_lt fixed ft-se-13"  @click="goBack">
			<span class="flex-row"><van-icon name="revoke" class="mg-rt-5 ft-se-16" />返回</span>
		</div>
		 <img class="bg-img" src='@/assets/order/bg1.jpg' />
		   <div v-if="!showOrder">
		     <div class="title-view">
		       <div class="size-20">欢迎光临</div>
		       <div>{{storeInfo.businessName}}</div>
		     </div>
		     <div class="main">
		       <div class=" card-view bg-w mg-lr-10">
		         <!-- <van-cell title="你好，请选择用餐人数" use-label-slot>
		           <div slot="">桌号:{{storeInfo.tableName}}</div>
		         </van-cell> -->
						 <div class="flex-row flex-between pd-tb-10 bd-bt">
								<div class="flex-1 ft-se-14" style="color: #323333;">
									你好，请选择用餐人数
								</div>
								<div class="flex-1 ft-se-14 tx-rt" style="color: #969799;">
									桌号:{{storeInfo.tableName}}
								</div>
						 </div>
		         <div class="flex-row pd-tb-10 flex-between">
							 <div class="flex-row">
							 	<div class="title ft-se-14" style="width: 80px;"> 人数：</div>
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
		 
	</div>
</template>

<script>
	import { getStoreInfo, addDiningNum} from '@/api/cart'
	import { Dialog } from 'vant';
	export default {
		data(){
			return {
				currentDate:'',
				minDate:'',
				showOrder: false,
				maxDate:'',
				showTime:false,
				mealNum:'',	
				storeInfo:{}
			}
		},
		async created(){
			let tableId = this.$route.query.tableId
			const res = await getStoreInfo(tableId)
			if (res.code == 200) {
				if(res.data == 100){
					// data是100 商家未营业
					this.showOrder = true
						Dialog.alert({
							title: '提示',
							message: res.msg,
						})
							.then(() => {
								// on confirm
								this.$router.push({
									path:'/home'
								})
							})	
					
				}else{
					this.showOrder = false
					this.storeInfo = res.data		
					this.storeInfo.mealNum = res.data.diningNum
					if(res.data.tableFlag == '1'){
						this.$router.push({
							path:'/category',
							query:{
								... this.storeInfo
							}
						})

					}
					
					if(res.data.tableFlag == '2'){
						Dialog.confirm({
							title: '提示',
							message: res.msg,
						})
							.then(() => {
								// on confirm
								this.$router.push({
									path:'/addCart',
									query:{
										... this.storeInfo
									}
								})
							})
							.catch(() => {
								// on cancel
								this.$router.push({
									path:'/'
								})
							});		
					}
					
					if(res.data.tableFlag == '3'){
						Dialog.alert({
							title: '提示',
							message: res.msg,
						})
						.then(() => {
							// on confirm
							this.$router.push({
								path:'/'
							})
						})
						
					}
				}
			} 
					
		},
		mounted() {
		
		},
		methods:{
			goBack(){
				this.$router.go(-1)
			},
			onClose(){
				
			},
			onChange(val){
				this.mealNum =  val
			},
			
			onCancelDate(val){
				
			},
			onConfirmDate(){
				
			},
			onInput(val){
				
			},
			toOrder(){
				if (this.mealNum < 1) {
					Toast.fail('请选择用餐人数');		   
					} else {
						this.storeInfo.mealNum = this.mealNum
						this.storeInfo.orderSource = '2'
						// let { businessId, tableId,tableName, mealNum, orderSource } = this.storeInfo
						
						let params = {
							tableId: this.storeInfo.tableId,
							diningNum: this.mealNum
						}
						addDiningNum(params).then(res => {
							if(res.code == 200){
								let obj = JSON.parse(JSON.stringify(this.storeInfo))
								obj.mealNum = res.data.diningNum
								this.$router.push({
									path:'/category',
									query:{
										...this.storeInfo
									}
								})
							}
							
						})
						
					}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		height: 100%;
	}
	:deep .van-nav-bar{
		background: rgba(0,0,0,0);
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
