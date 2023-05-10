import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = [
    '/login', '/merchantLogin', '/merchantRegister', '/merchantRegisterAgain','/orderDetail','/appointment','/homeDy'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
    NProgress.start()
    const hasToken = getToken()
    
    if (hasToken) {
        if (to.path === '/login') {
            next({ path: '/index' })
            NProgress.done()
        } 
        next()
        // else {
        //     const hasGetUserInfo = store.getters.businessId
        //     if (hasGetUserInfo) {
        //         next()
        //     } else {
        //         try {
        //             // get user info
        //             await store.dispatch('sys/GetInfo')
        //             // get menu
        //             next()
        //         } catch (error) {
        //             // remove token and go to login page to re-login
        //             await store.dispatch('sys/resetToken')
        //             Notify({ type: 'error', duration: 3000, message: error || 'Has Error' })
        //             // next(`/login?redirect=${to.path}`)
        //             // next(`/login`)
        //             NProgress.done()
        //         }
        //     }
        // }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            // 在免登录白名单，直接进入
            next()
        } else {
            next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})
