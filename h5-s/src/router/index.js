import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRoutes = [
    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/init',
        name: 'init',
        component: () => import('@/views/init')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index')
    },
    {
        path: '/merchantLogin',
        name: 'merchantLogin',
        component: () => import('@/views/sale/login/index')
    },
    {
        path: '/merchantRegister',
        name: 'merchantRegister',
        component: () => import('@/views/register/index')
    },
    // 注册信息修改
    {
        path: '/merchantRegisterAgain',
        name: 'merchantRegisterAgain',
        component: () => import('@/views/register/again')
    },
    {
        path: '/index',
        name: 'index',
        component: () => import('@/views/index/index'),
        hidden: true
    },

    {
        path: '/tableCode',
        name: 'tableCode',
        component: () => import('@/views/tableCode/index')
    },
    {
        path: '/tableAdd',
        name: 'tableAdd',
        component: () => import('@/views/tableCode/add')
    },
    //门店信息   
    {
        path: '/storeSetting',
        name: 'storeSetting',
        component: () => import('@/views/configSetting/index')
    },
    {
        path: '/basicInfo',
        name: 'basicInfo',
        component: () => import('@/views/configSetting/basicInfo')
    },
    {
        path: '/businessInfo',
        name: 'businessInfo',
        component: () => import('@/views/configSetting/businessInfo')
    },
    {
        path: '/certification',
        name: 'certification',
        component: () => import('@/views/configSetting/certification')
    },
    {
        path: '/decoration',
        name: 'decoration',
        component: () => import('@/views/configSetting/decoration')
    },
    {
        path: "/managerInfo",
        name: 'managerInfo',
        component: () => import('@/views/configSetting/managerInfo')
    },
    {
        path: "/storeInfo",
        name: 'storeInfo',
        component: () => import('@/views/configSetting/storeInfo')
    }, 
    // 经营品类选择
    {
        path: "/busCategory",
        name: 'busCategory',
        component: () => import('@/views/configSetting/businessCategory')
    },

    {
        path: '/orderList',
        name: 'orderList',
        component: () => import('@/views/order/list')
    },
    {
        path: '/addDishes',
        name: 'addDishes',
        component: () => import('@/views/order/addDishes')
    },
    {
        path: '/appointment',
        name: 'appointment',
        component: () => import('@/views/order/appointment')
    },
    {
        path: '/appointmentTwo',
        name: 'appointmentTwo',
        component: () => import('@/views/order/appointmentTwo')
    },
    {
        path: '/orderDetail',
        name: 'orderDetail',
        component: () => import('@/views/order/detailTwo')
    },
    {
        path: '/orderDetailTwo',
        name: 'orderDetailTwo',
        component: () => import('@/views/order/detail')
    },
    // 送餐
    // 公众号推送
    {
        path: '/homeDy',
        name: 'homeDy',
        component: () => import('@/views/order/homeDyTwo')
    },
    // 正常打开
    {
        path: '/homeDyTwo',
        name: 'homeDyTwo',
        component: () => import('@/views/order/homeDy')
    },

    //菜单设置
    {
        path: '/dishesAdd',
        name: 'dishesAdd',
        component: () => import('@/views/menu/dishes/add')
    },
    {
        path: '/dishesList',
        name: 'dishesList',
        component: () => import('@/views/menu/dishes/list')
    },
    {
        path:'/formatEdit',
        name:'formatEdit',
        component:() => import('@/views/menu/dishes/addFormat')
    },
    {
        path: '/foodTypeAdd',
        name: 'foodTypeAdd',
        component: () => import('@/views/menu/foodType/add')
    },
    {
        path: '/foodTypeList',
        name: 'foodTypeList',
        component: () => import('@/views/menu/foodType/list')
    },
    {
        path:'/specification',
        name:'specification',
        component:()=>import('@/views/specification/index')
    },
    {
        path:'/specificAdd',
        name:'specificAdd',
        component:()=>import('@/views/specification/add')
    },
    // 评价管理
    {
        path:'/evaluateList',
        name:'evaluateList',
        component:()=>import('@/views/evaluate/list')
    },
    // 评价管理详情
    {
        path:'/evaluateDetail',
        name:'evaluateDetail',
        component:()=>import('@/views/evaluate/detail')
    },
    // 隐私协议
    {
        path:'/agreement',
        name:'agreement',
        component:()=>import('@/views/agreement/index')
    }

]
export default new Router({
    //mode: 'history', // 去掉url中的#
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })
  
