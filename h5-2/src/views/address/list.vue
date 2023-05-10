<template>
	<div class="container">
		<div class="back_bth_lt fixed ft-se-13"  @click="goBack">
			<span class="flex-row"><van-icon name="revoke" class="mg-rt-5 ft-se-16" />返回</span>
		</div>
		<!-- 用户地址 -->
		<div class="content">
			<van-radio-group v-model="userAddressId" v-for="item in addressList":key="item.userAddressId" @change="setAddress">
			<div class="cards pd-tp-30 pd-bt-15 bg-w pd-lr-10 mg-tb-10 ps-re" @click="chooseAddress(item)" >
				<div class="tag ps-ab ft-se-10" v-if="item.defFlag == '1'" >
					当前地址
				</div>
				<div>
					<div class="flex-row flex-wrap mg-bt-10" >
						<div class="flex-col-18">
							<div class="flex-row">
								<div class="ft-se-16">{{item.userName}}</div>
								<div class="ft-se-16  mg-lt-10">{{item.phone}}</div>
							</div>
							<div class="clr-999 mg-tp-10">{{item.list[0]}}{{item.list[1]}}{{item.list[2]}}{{item.address}}</div>
						</div>
						<div class="flex-col-6 tx-rt bd-lt "  @click.stop="chooseAddress(item)"  v-if="isShow">
							<van-button plain hairline round type="danger" style="height: 30px;">送到这</van-button>
						</div>
					</div>
				</div>
				<div class="bd-bt mg-tp-10 mg-bt-10"></div>
				<div class="flex-row clr-999">
					<div class="flex-col-12 tx-lt">
						<div class="flex-row" v-if="item.defFlag == '0' || item.defFlag == null">				
							<van-radio :name="item.userAddressId" label-disabled>设为默认</van-radio>		
						</div>
						<div v-if="item.defFlag == '1'">默认地址</div>
					</div>
					<div class="flex-col-12 flex-row flex-right tx-rt">
						<div @click="editAddress(item)">编辑</div>
						<div @click="deleteAddress(item)" class="mg-lt-20">删除</div>
					</div>
				</div>
			</div>
		</van-radio-group>
		</div>
		<!-- 底部提交 -->
		<div class="fixed-bottom w-100 tx-ct pd-tb-15" >
			<van-button type="danger" @click="addAddress" class="w-90" round>新增地址</van-button>
		</div>
	</div>
</template>

<script>
	import {
	  getAddressList,
	  addAddress,
	  putAddress,
	  delAddress
	} from "@/api/address"
	
	import { getLocal} from "@/utils/auth"
	import { Toast} from "vant"
	import { debounce } from '@/utils/debounce';
	export default {
		data(){
			return {
				addressList:[],
				userAddressId:'',
				storeInfo:{},
				isShow: false
			}
		},
		created(){
			this.storeInfo = this.$route.query ?  this.$route.query : {}
			this.isShow = Object.keys(this.$route.query).length !== 0 ?  true : false
		},
		mounted() {
			this.init()
		},
		methods:{
			goBack(){
				this.$router.go(-1)
			},
			async	init(){
				let res = await getAddressList(getLocal('userId'))
				this.addressList = res.rows
			},
			chooseAddress(item){
				if(!this.isShow) return
				let o = Object.assign(item, this.storeInfo)
				let obj = JSON.parse(JSON.stringify(o)) ;
				let province = item.list[0]
				let city = item.list[1]
				let area = item.list[2]
				let address = item.address
				//送餐地址
				obj.deliveryAddress = province + city + area + address
				// 联系电话
				obj.customerPhone = item.phone
				obj.customerName = item.userName
				obj.mealNum = 1
				obj.userId = getLocal('userId')
				obj.orderType = '2' // orderType:2 送餐订单
				
				delete obj.list
				this.$router.push({
					path:'/category',
					query:{
						...obj
					}
				})
			},
			setAddress:debounce(function(val){
				let params = {
					defFlag: "1",
					userAddressId: val,
					userId: getLocal('userId')
				}
				putAddress(params).then(res => {
					if (res.code == 200) {
						Toast.success('设置成功')
						this.init()
					}
				})
			},500),
			editAddress(item){
				let obj = JSON.parse(JSON.stringify(item))
				obj.list = obj.list.join('/')
				this.$router.push({
					path:'/addAddress',
					query:{
						addressListFlag: 1,
						...obj
					}
				})
			},
			deleteAddress(item){
				delAddress(item.userAddressId).then(res => {
					if (res.code == 200) {
					 Toast.success('删除成功')
						this.init()
					}
				})
			},
			
			addAddress(){
				this.$router.push({
					path:'/addAddress'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		width: 100%;
		height: 100%;
	}
	.content{
		height: calc(100% - 121px);
	}
	.tag{
		top: 0; left: 10px; background: #ee0a24;color: #FFF; padding: 3px 10px; border-radius: 0 10px 10px 0;
	}
</style>