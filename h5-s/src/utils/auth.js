import Cookies from 'js-cookie'

const TokenKey = 'Authorization'

const code = 'code'

// const businessId  = 'bussinessId'


export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

export function getCode() {
    return Cookies.get(code)
}

export function setCode(value) {
    return Cookies.set(code, value)
}

export function removeCode() {
    return Cookies.remove(code)
}

// export function getBussinessId() {
//     return Cookies.get(businessId)
// }

// export function setBussinessId(value) {
//     return Cookies.set(businessId, value)
// }

// export function removeBussinessId() {
//     return Cookies.remove(businessId)
// }