import { createRouter, createWebHashHistory } from 'vue-router'

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
 				index: 1
 			}
 		},
 		
 		{
 			path: '/mine',
 			name: 'Mine',
 			component: () => import('@/views/mine/index.vue'),
 			meta: {
 				index: 3
 			}
 		},
 	]
 },
 {
 	path: '/index',
 	name: 'Index',
 	component: () => import('@/views/index/index.vue')
 },
 {
 	path: '/order',
 	name: 'Order',
 	component: () => import('@/views/order/index.vue')
 },		
 {
 	path: '/category',
 	name: 'category',
 	component: () => import( '@/views/category/index.vue'),
 	meta: {
 		index: 1
 	}
 },
 {
 	path: '/cart',
 	name: 'cart',
 	component: () => import('@/views/cart/index.vue'),
 	meta: {
 		index: 1
 	}
 },
 {
 	path: '/restaurant',
 	name: 'restaurant',
 	component: () => import('@/views/restaurant/index.vue'),
 	meta: {
 		index: 1
 	}
 },
 {
 	path: '/orderMeal',
 	name: 'orderMeal',
 	component: () => import('@/views/restaurant/orderMeal.vue'),
 	meta: {
 		index: 1
 	}
 },
 // 查看菜单
 {
 	path: '/menuView',
 	name: 'menuView',
 	component: () => import('@/views/restaurant/menuView/menuView.vue'),
 	meta: {
 		index: 1
 	}
 },
 {
 	path: '/appointment',
 	name: 'appointment',
 	component: () => import('@/views/restaurant/appointment.vue'),
 	meta: {
 		index: 1
 	}
 },
 {
 	path: '/order-detail',
 	name: 'orderDetail',
 	component: () => import('@/views/order/detail.vue'),
 	meta: {
 		index: 1
 	}
 },
 {
 	path: '/pay',
 	name: 'Pay',
 	component: () => import('@/views/pay/index.vue'),
 	meta: {
 		index: 1
 	}
 },
 {
 	path: '/map',
 	name: 'map',
 	component: () => import('@/components/Qmap.vue'),
 	meta: {
 		index: 1
 	}
 },
 // 个人中心-预约记录
 {
 	path: '/appointList',
 	name: 'appointList',
 	component: () => import('@/views/mine/appointList.vue'),
 	meta: {
 		index: 1
 	}
 },
 {
 	path: '/luckydraw',
 	name: 'luckydraw',
 	component: () => import('@/views/luckydraw/index.vue'),
 	meta: {
 		index: 1
 	}
 },
 // 个人中心-优惠券
 {
 	path: '/coupon',
 	name: 'coupon',
 	component: () => import('@/views/mine/coupon.vue'),
 	meta: {
 		index: 1
 	}
 },
 {
 	path: '/evaluate',
 	name: 'evaluate',
 	component: () => import('@/views/evaluate/index.vue'),
 	meta: {
 		index: 1
 	}
 },
 // 个人中心-我的收藏
 {
 	path: '/coltRestaurant',
 	name: 'coltRestaurant',
 	component: () => import('@/views/mine/coltRestaurant.vue'),
 	meta: {
 		index: 1
 	}
 },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
