import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
  	path: '/',
  	name: 'Layout',
  	component: () => import('@/views/layout.vue'),
  	redirect: '/home',
  	children: [{
  			path: '/home',
  			name: 'home',
  			component: () => import('@/views/home/index.vue'),
  			meta: {
  				title:'' //'彩云点餐'
  			}
  		},
  		
  		{
  			path: '/mine',
  			name: 'Mine',
  			component: () => import('@/views/mine/index.vue'),
  			meta: {
  					title:'' //'个人中心'
  			}
  		},
  	]
  },
	{
		path: '/login',
		name: 'Login',
		component: () => import('@/views/login/index.vue'),
	},
	{
		path: '/index',
		name: 'Index',
		component: () => import('@/views/index/index.vue'),
		meta: {
				title:'' //''
		}
	},
	{
		path: '/order',
		name: 'Order',
		component: () => import('@/views/order/index.vue'),
		meta: {
				title:'' //'订单列表'
		}
	},		
	{
		path: '/category',
		name: 'category',
		component: () => import( '@/views/category/index.vue'),
		meta: {
				title:'' //'点餐'
		}
	},
	{
		path: '/cart',
		name: 'cart',
		component: () => import('@/views/cart/index.vue'),
		meta: {
				title:'' //'购物车'
		}
	},
	{
		path: '/addCart',
		name: 'addCart',
		component: () => import('@/views/cart/add.vue'),
		meta: {
				title:'' //'加菜'
		}
	},
	{
		path: '/restaurant',
		name: 'restaurant',
		component: () => import('@/views/restaurant/index.vue'),
		meta: {
				title:'' //'点餐'
		}
	},
	{
		path: '/orderMeal',
		name: 'orderMeal',
		component: () => import('@/views/restaurant/orderMeal.vue'),
		meta: {
				title:'' //'开始点餐'
		}
	},
	// 查看菜单
	{
		path: '/menuView',
		name: 'menuView',
		component: () => import('@/views/restaurant/menuView/menuView.vue'),
		meta: {
				title:'' //'点餐菜单'
		}
	},
	{
		path: '/appointment',
		name: 'appointment',
		component: () => import('@/views/restaurant/appointment.vue'),
		meta: {
				title:'' //'预约用餐'
		}
	},
	{
		path: '/order-detail',
		name: 'orderDetail',
		component: () => import('@/views/order/detail.vue'),
		meta: {
				title:'' //'订单详情'
		}
	},
	{
		path: '/pay',
		name: 'Pay',
		component: () => import('@/views/pay/index.vue'),
		meta: {
				title:'' //'订单结算'
		}
	},
	{
		path: '/map',
		name: 'map',
		component: () => import('@/components/Qmap.vue'),
		meta: {
			title:'' //'地图'
		}
	},
	// 个人中心-预约记录
	{
		path: '/appointList',
		name: 'appointList',
		component: () => import('@/views/mine/appointList.vue'),
		meta: {
			title:'' // '预约记录'
		}
	},
	{
		path: '/luckydraw',
		name: 'luckydraw',
		component: () => import('@/views/luckydraw/index.vue'),
		meta: {
			title:'' // '抽奖'
		}
	},
	// 个人中心-优惠券
	{
		path: '/coupon',
		name: 'coupon',
		component: () => import('@/views/mine/coupon.vue'),
		meta: {
			title:'' // '优惠券'
		}
	},
	{
		path: '/evaluate',
		name: 'evaluate',
		component: () => import('@/views/evaluate/index.vue'),
		meta: {
			title:'' // '评价'
		}
	},
	// 个人中心-我的收藏
	{
		path: '/coltRestaurant',
		name: 'coltRestaurant',
		component: () => import('@/views/mine/coltRestaurant.vue'),
		meta: {
			title:'' // '店铺收藏'
		}
	},
	{
		path: '/addressList',
		name: 'addressList',
		component: () => import('@/views/address/list.vue'),
		meta: {
			title:'' // '地址管理'
		}
	},
	{
		path: '/addAddress',
		name: 'addAddress',
		component: () => import('@/views/address/add.vue'),
		meta: {
			title:'' // '新增地址'
		}
	},
	{
		path: '/addressDelivery',
		name: 'addressDelivery',
		component: () => import('@/views/address/delivery.vue'),
		meta: {
			title:'' // '地址管理'
		}
	}
]

const router = new VueRouter({
  routes
})

export default router
