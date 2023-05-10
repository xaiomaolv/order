import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { login } from '@/api/login'
// import { countOfCart } from '@/api/cart'
import { getToken, setToken, setLocal } from '@/utils/auth'
export default new Vuex.Store({
  state: {
		token: getToken(),
		userId:'',
		storeInfo:'',
		cartData:''
  },
  mutations: {
		SET_TOKEN: (state, token) => {
		  state.token = token
		},
		SET_USERID: (state, userId) => {
		  state.userId = userId
		},
		SET_STOREINFO: (state, storeInfo) => {
		  state.storeInfo = storeInfo
		},
		SET_CARTDATA: (state, cartData) => {
		  state.cartData = cartData
		},
		// addCart(state, payload) {
		// 	state.cartCount = payload.count
		// },
		// tabrActive(state, active) {
		// 	state.tabrActive = active
		// }
  },
  actions: {
		// 登录
		Login({ commit }, userInfo) {
		  return new Promise((resolve, reject) => {
		    login(userInfo).then(res => {
		      setToken(res.data.token)
		      commit('SET_TOKEN', res.data.token)
					commit('SET_USERID', res.data.userId)
					setLocal('userId', res.data.userId || '')
		      resolve()
		    }).catch(error => {
		      reject(error)
		    })
		  })
		},
		// async updateCart(ctx) {
		// 	const token = checkLogin()
		// 	if (token) {
		// 		await countOfCart({}).then(res => {
		// 			if (res.code == '200') {
		// 				ctx.commit('addCart', {
		// 					count: res.result || 0
		// 				})
		// 			}
		// 		})
		// 	}
		// 	if (!token) {
		// 		ctx.commit('addCart', {
		// 			count: 0
		// 		})
		// 	}
		
		// }
	
  },
  modules: {
  }
})
