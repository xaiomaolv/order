import axios from 'axios'
import { Notify, Toast, Dialog } from 'vant'
import { getToken, removeToken, getCode, removeCode } from '@/utils/auth'
import store from "@/store"
import router from '@/router'
import encrypt from '@/utils/soil-encrypt'

// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        // do something before request is sent
        const ignoreLoadingUrl = ['/wx/user/check']
        if (ignoreLoadingUrl.indexOf(config.url.split('?')[0]) > 0) {
            Toast.loading({
                message: '数据加载中...',
                duration: 10000,
                forbidClick: true,
                loadingType: 'spinner',
            });
        }

        // 是否需要设置 token
        const isToken = (config.headers || {}).isToken === false
        const ignoreTokenUrl = ['/user/sendSms','/captcha','/login']
        const thisToken = getToken()
        if (getToken() && !isToken && ignoreTokenUrl.indexOf(config.url.split('?')[0]) < 0) {
            // if (getToken() && !isToken) {
            config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        if (getCode()) {
            config.headers['code'] = getCode()
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
        const ignoreUrl = ['/image/upload','/image/add','/captcha']
        if (config.data && process.env.VUE_APP_ENCRYPTION == 'true' && ignoreUrl.indexOf(config.url.split('?')[0]) < 0) {
            // if (config.data && process.env.VUE_APP_ENCRYPTION == 'true') {
            encrypt.encryptData(config)
          }else if (config.data && process.env.VUE_APP_ENCRYPTION != 'true'){
            encrypt.sign(config)
          }
        return config
    },
    error => {
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

const ignoreUrl = ['/captcha','/image/upload','/merchantLogin','/merchantRegister','/image/add']

// response interceptor
// 响应拦截器
service.interceptors.response.use(
    response => {
        // 全部解密
        if (response.data && process.env.VUE_APP_ENCRYPTION == 'true' && ignoreUrl.indexOf(response.config.url.split('?')[0]) < 0) {
            encrypt.decryptData(response)
        }else if (process.env.VUE_APP_ENCRYPTION != 'true' && process.env.VUE_APP_SIGN == 'true' && response.data.code == 200 && ignoreUrl.indexOf(response.config.url.split('?')[0]) < 0){
            encrypt.verifySign(response)
        }
        let res = response.data

        // 关闭等待
        Toast.clear();
        // if the custom code is not 20000, it is judged as an error.
        if (res.code === 0 || res.errcode === 0 || res.return_code == 0 || res.code === 200 || (res.code > 200 && res.code < 300)) {
            return res
        }
        if (res.code == 401) {
           Dialog.alert({
                title: '系统提示',
                message: '会话已失效,请重新登录！',
                theme: 'round-button',
            }).then(() => {
                store.commit('SET_TOKEN', '')
                removeToken()
                router.push('/');
            })
            return
        }
        
        Notify({
            message: res.msg || res.message || res.message_detail || res.return_msg, // res.msg || 'error',
            type: 'warning'
        })

        return Promise.reject(res.msg || res.message || res.message_detail || res.return_msg || 'error')
    },
    error => {
        // 关闭等待
        Toast.clear();
        Notify({
            message: '服务器错误请联系管理员', // error.message,
            type: 'danger'
        })
        return Promise.reject(error)
    }
)


export default service
