import Cookies from 'js-cookie'

const TokenKey = process.env.VUE_APP_KEY + '-' + 'token'
const RKey = process.env.VUE_APP_KEY + '-' + 'rKey'


export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getRKey() {
  return Cookies.get(RKey)
}

export function setRKey(rKey) {
  return Cookies.set(RKey, rKey)
}

export function removeRKey() {
  return Cookies.remove(RKey)
}

export function getLocal(name) {
  return Cookies.get(name)
}

export function setLocal(name, value) {
  return Cookies.set(name, value)
}

export function removeLocal(name) {
  return Cookies.remove(name)
}

