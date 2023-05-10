// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import echarts from 'echarts'
import router from './router'
import store from './store'
// import i18n from './i18n/i18n'
import Vant from 'vant'
import 'vant/lib/index.css'
import Cookies from 'js-cookie'
import './css/flex.css'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

Vue.prototype.$cookies = Cookies
// Vue.prototype.$echarts = echarts
// 引入 ECharts 主模块(体积过大，按需引入)
 let echarts = require('echarts/lib/echarts');
  // 引入折线图组件
  require('echarts/lib/chart/line')
  // 引入提示框和title组件，图例

  require('echarts/lib/component/toolbox')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
  require('echarts/lib/component/legend')
//本地
Vue.prototype.$echarts = echarts
// Vue.prototype.IMG_BASR_URL = 'http://el.ynejkj.com'

//文件预览
// Vue.prototype.IMG_BASR_URL = 'https://icbc.nyaqlove.cn/minio/order/'
Vue.prototype.IMG_BASR_URL = process.env.VUE_APP_BASE_API + "/image/view?fileName="
Vue.prototype.IMG_BASR_URL_NOTOKEN = process.env.VUE_APP_BASE_API + "/image/preview?fileName="

import { Lazyload } from 'vant';

Vue.use(Lazyload);
Vue.use(Lazyload, {
  lazyComponent: true,
});

import VueDPlayer from 'vue-dplayer';
import 'vue-dplayer/dist/vue-dplayer.css';

Vue.use(VueDPlayer);


import '@/permission' // permission control
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(Vant)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBk4nadwBtmy_HffERqKVQBMWs-BOdnFzo',
    libraries: 'places' // necessary for places input
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
