import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// ie兼容
import "babel-polyfill"

// import "core-js/stable"
// import 'regenerator-runtime/runtime'

import { setLocal } from '@/utils/auth';

import Vant,{Lazyload} from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant)
Vue.use(Lazyload);

import qs from 'qs'
Vue.prototype.$qs = qs

import '@/style/flex-move.css' 

router.beforeEach((to, from, next) => {
	setLocal('prevPath', from.path)
	next()
})



// icbc key: 7JVBZ-D3CK2-AZGUA-CTKAM-BQW7Q-P7BP7
// ej key: 7QZBZ-CL5LK-GINJ3-AP26H-CT7S6-6ABRH
console.log( process.env.NODE_ENV,' process.env.NODE_ENV')

Vue.prototype.mapKey =  process.env.NODE_ENV === "production" ? '7JVBZ-D3CK2-AZGUA-CTKAM-BQW7Q-P7BP7' : '7QZBZ-CL5LK-GINJ3-AP26H-CT7S6-6ABRH' 

Vue.prototype.imgUrl =  process.env.NODE_ENV === "production" ? process.env.VUE_APP_BASE_API + "/image/view?fileName=" : "http://10.3.7.228:8080/order/image/view?fileName=" 

// 引入
import authImg from '@/components/authImg'
// 注册为全局组件
Vue.component('Img', authImg)


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
