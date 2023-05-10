import axios from 'axios'
import { Notify, Dialog , Toast } from 'vant'


import store from '@/store'
import { getToken,removeToken , removeLocal } from '@/utils/auth'
import encrypt from '@/utils/soil-encrypt'
import router from '@/router'

// axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 10000,
  withCredentials: true
})

// request拦截器
service.interceptors.request.use(config => {
  // 是否需要设置 token

  const isToken = (config.headers || {}).isToken === false
	if(config.headers && !config.headers['Content-Type']){
	  config.headers['Content-Type'] ='application/json;charset=utf-8'
	}
  if (getToken() && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?';
    for (const propName of Object.keys(config.params)) {
      const value = config.params[propName];
      var part = encodeURIComponent(propName) + "=";
      if (value !== null && typeof (value) !== "undefined") {
        if (typeof value === 'object') {
          for (const key of Object.keys(value)) {
            let params = propName + '[' + key + ']';
            var subPart = encodeURIComponent(params) + "=";
            url += subPart + encodeURIComponent(value[key]) + "&";
          }
        } else {
          url += part + encodeURIComponent(value) + "&";
        }
      }
    }
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
  }
	
  if (config.data && process.env.VUE_APP_ENCRYPTION == 'true') {
    encrypt.encryptData(config)
  }
	// else if (config.data && process.env.VUE_APP_ENCRYPTION != 'true'){
	//   encrypt.sign(config)
	// }

  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

// 接口白名单
const ignoreUrl = []
// 响应拦截器
service.interceptors.response.use(res => {
	if (res.data.code === 401) {
		Dialog.confirm({
		  title: '系统提示',
		  message:'登录状态已过期，您可以继续留在该页面，或者重新登录',
		})
		.then(() => {
			removeLocal('tabrActive')
			removeLocal('userId')
			removeToken()
			store.commit('SET_TOKEN', '')
			store.commit('SET_USERID', '')
			router.push({
				path:'/'
			})
		})
		.catch(() => {
			// on cancel
		});
	}  
  // 全部解密
  if (res.data && process.env.VUE_APP_ENCRYPTION == 'true') {
    encrypt.decryptData(res)
  }
	// else if (process.env.VUE_APP_ENCRYPTION != 'true' && process.env.VUE_APP_SIGN == 'true' && res.data.code == 200 && ignoreUrl.indexOf(res.config.url.split('?')[0]) < 0){
	//   encrypt.verifySign(res)
	// }
	
  // 未设置状态码则默认成功状态
  const code = res.data.code || 200;
  // 获取错误信息
  const msg =  res.data.msg 
  if (code === 500) {
		Notify({ type: 'warning', message: msg }); 
    return Promise.reject(new Error(msg))
  } else if (code !== 200) {
		Notify({ type: 'warning', message: msg }); 
    return Promise.reject('error')
  } else {
    return res.data
  }
},
  error => {
    console.log('err' + error)
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    }
    else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    }
    else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
  
		Notify({ type: 'warning', message: message,duration: 5 * 1000 }); 
    return Promise.reject(error)
  }
)

export default service