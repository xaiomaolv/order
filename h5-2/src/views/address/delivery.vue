<template>
	<div class="container">
		<div class="back_bth_lt fixed ft-se-13"  @click="goBack">
			<span class="flex-row"><van-icon name="revoke" class="mg-rt-5 ft-se-16" />返回</span>
		</div>
	  <!-- 商家地址 -->
	  <div class="content" v-if="deliveryAddress.length > 0">
	    <div class="cards pd-tp-15 pd-bt-15 bg-w pd-lr-10 mg-tb-10 ps-re" v-for="(item, index) in deliveryAddress" :key="index" @click="chooseAddress(item)">
	      <div class="flex-row flex-wrap">
	        <div class="flex-col-18">
	          <div class="flex-col">
	          </div>
	          <div class="ft-se-16">{{item}}</div>
	        </div>
					<div class="flex-col-6 tx-rt bd-lt "  @click.stop="chooseAddress(item)" >
						<van-button plain hairline round type="danger" style="height: 30px;">送到这</van-button>
					</div>
	      </div>
	    </div>
	  </div>
	</div>
</template>

<script>
	import { getLocal} from "@/utils/auth"
	export default {
		data(){
			return {
				deliveryAddress:[],
				storeInfo:{}
			}
		},
		created(){
			this.storeInfo =  this.$route.query ?   this.$route.query : {}
			this.deliveryAddress =  this.$route.query && this.$route.query.deliveryAddress ? this.$route.query.deliveryAddress.split(','):[]	
		},
		mounted() {
			
		},
		methods:{
			goBack(){
				this.$router.go(-1)
			},
			chooseAddress(item){
				let obj = JSON.parse(JSON.stringify(this.storeInfo))
				obj.deliveryAddress = item
				obj.mealNum = 0
				obj.userId = getLocal('userId')
				obj.orderType = '2' // orderType:2 送餐订单
			    
				this.$router.push({
					path:'/category',
					query:{
						...obj
					}
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
		height: calc(100% - 46px);
	}
	.tag{
		top: 0; left: 0; background: #ee0a24;color: #FFF; padding: 3px 10px; border-radius: 0 10px 10px 0;
	}
</style>