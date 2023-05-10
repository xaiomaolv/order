import { login, logout, logoutBuis,getInfo} from '@/api/sys'
import { getToken, setToken, removeToken, removeCode, getCode, setCode, getBussinessId, setBussinessId, removeBussinessId } from '@/utils/auth'

const state = {
    token: getToken(),
    code: getCode(),
    // businessId: getBussinessId(),
    category:'',
    categoryIndex:0,
    categoryTreeData:[]
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    // SET_BUSSINESSID: (state, businessId) => {
    //     state.businessId = businessId
    // },
    SET_CODE: (state, code) => {
        state.code = code
    },
    SET_CATEGORY: (state, category) => {
        state.category = category
    },
    SET_CATEGORYINDEX: (state, categoryIndex) => {
        state.categoryIndex = categoryIndex
    },
    SET_CATEGORYTREEDATA: (state, categoryTreeData) => {
        state.categoryTreeData = categoryTreeData
    },
}

const actions = {
    // user login
    Login({ commit }, userInfo) {
        const { username, verifyCode, userType, wxCode, code } = userInfo
        return new Promise((resolve, reject) => {
            login({ username: username, verifyCode: verifyCode, userType: userType, wxCode: wxCode, code: code }).then(res => {
                setToken(res.token);
                commit('SET_TOKEN', res.token)
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    pwdLogin({ commit }, userInfo) {
        const { username, password, userType, wxCode, code ,captCode} = userInfo
        return new Promise((resolve, reject) => {
            login({ username: username, password: password, userType: userType, wxCode: wxCode, code: code,captCode:captCode }).then(res => {
                if(res.token){
                    setToken(res.token);
                    commit('SET_TOKEN', res.token)
                }
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo().then(res => {
                // setBussinessId(res.data.businessId);
                // commit("SET_BUSSINESSID", res.data.businessId);
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logoutlogout
    LogOut({ commit }, wxCode) {
        return new Promise((resolve, reject) => {
            let params = {
                "wxCode":wxCode
            }
            logoutBuis(params).then(() => {
                commit('SET_TOKEN', '')
                removeToken()
                commit("SET_CODE", '');
                removeCode()
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            removeToken()
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
