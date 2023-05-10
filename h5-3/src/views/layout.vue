<template>
	<div class="container" style="min-height: 100%;">
		<router-view />
		<van-tabbar v-model="active" active-color="#f43c48" inactive-color="#666" @change="onChange">
			<van-tabbar-item class="nav-list-item tx-ct" icon="home-o" >
		
				<div class="ft-se-14">首页</div>
			</van-tabbar-item>
		<!-- 	<van-tabbar-item class="nav-list-item tx-ct" icon="orders-o">
				<i class="nbicon nbfenlei"></i>
				<div class="ft-se-14">订单</div>
			</van-tabbar-item> -->
			<van-tabbar-item class="nav-list-item tx-ct" icon="contact">
				<div class="ft-se-14">我的</div>
			</van-tabbar-item>
		</van-tabbar>
	
	</div>
</template>

<script>
	import {
		onMounted,
		computed,
		ref,
		reactive,
		toRefs
	} from 'vue'
	import {
		useRoute,
		useRouter
	} from 'vue-router'
	import {
		useStore
	} from 'vuex'
	import {
		getLocal,setLocal
	} from '@/utils/auth'
	export default {
		setup() {
			const route = useRoute()
			const router = useRouter()
			const store = useStore()

			const state = reactive({
			    active: ''
			})
			const pathes = ['/home', '/mine']

			state.active = parseInt(getLocal('tabrActive')) || 0
			onMounted(() => {
				const token = getLocal('token')
				const path = route.path
				state.active = pathes.indexOf(path)
				if (token && !['/home'].includes(path)) {
					store.dispatch('updateCart')
				}
			})

			const count = computed(() => {
				return store.state.cartCount
			})
			const onChange = (index) => {
				setLocal('tabrActive',index)
				let path = ''
				if (index == 0) {
					path = '/home'
				}
				if (index == 1) {
					path = '/mine'
				}
				// if (index == 2) {
				// 	path = '/mine'
				// }
				router.push({
					path: path
				})
			}
			return {
				// state,
				...toRefs(state),
				count,
				onChange
			}
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

	// .nav-list-item {
	// 	display: flex;
	// 	flex: 1;
	// 	flex-direction: column;
	// 	text-align: center;
	// 	color: #666;

	// 	&.router-link-active {
	// 		color: #d81e06;
	// 	}

	// 	i {
	// 		text-align: center;
	// 		font-size: 22px;
	// 		margin-bottom: 5px;
	// 	}

	// 	span {
	// 		font-size: 12px;
	// 	}

	// 	.van-icon-shopping-cart-o {
	// 		margin: 0 auto;
	// 		margin-bottom: 2px;
	// 	}
	// }
	:deep .van-tabbar{
		height: 55px!important;
	}
</style>
