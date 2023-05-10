<template>
	<div class="container flex-col flex-row" style="min-height: 100%;padding-top: 40%;">
		<div class="flex-col flex-center w-90 bg-w" style="padding: 40px 0; margin: 40% 10% 0 10%; border-radius: 12px;">
			<div class="flex-col-12 mg-bt-30 ft-bd">登录方式</div>
			<div class="flex-row flex-center w-100 tx-ct">
				<div class="flex-col-8 flex-col flex-center" v-for="(item, index) in list" :key="item.id" @click="handleItem(item)">
						<img :src="item.src" alt="" class="img" >
						<div class="ft-se-14 mg-tp-10">{{item.name}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

	export default {
		data() {
			return {
				list:[
					{
						id:'1',
						name:'微信',
						src:require('@/assets/login/wx.png') 
					},
					{
						id:'2',
						name:'手机银行',
						src:require('@/assets/login/icbc.png') 
					}
				]
			}
		},
		created() {
			
		},
		mounted() {
			
		},
		methods:{
			handleItem(item){
				let params = this.paramsSpliter()
				if(item.id == '1'){
					this.$router.push({
						path:'/',
						query:{
							... this.paramsSpliter()
						}
					})
				}else{
					window.location.href=`${ process.env.VUE_APP_ICBC_URL}${params.remark}`
				}
			},
			paramsSpliter() {
				let url = decodeURI(window.location.href)
				// let pramObj = {}
				if (url.indexOf("?") != -1) {
					let temp1 = url.split('?');
					let pram = temp1[1];
					let keyValue = pram.split('&');
					let pramObj = {};
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
	.container {
		height: calc(100vh - 55px);
		overflow: hidden;
		overflow-y: scroll; 
	}
	.van-tabbar--fixed{
		z-index: 999;
	}

	
	:deep .van-tabbar{
		height: 55px!important;
	}
	.img{
		width: 40px; height: 40px;
		// border-radius: 50%;
	}
</style>
