import { login } from 'util'
import { encryptData, decryptData, verifySign, sign } from 'soil-encrypt'
import {setRKey} from 'auth'
import {miniConfig} from 'config'


// 授权域名网络接口基础路径
export const baseUrl = 'http://localhost/'
// export const baseUrl = 'http://10.3.7.101:8080/order' 
// export const baseUrl = 'https://order.ynejkj.com/api/order'
// export const baseUrl = 'https://yn.icbc.com.cn/corp/api2/redc'
// wx8d90b6b21ef1f3a5 工行appid
// wxb0b1d0df8005b291 恩捷appid
// --------------------以下为网络请求-------------------------

/**
 * 通用请求
 * 使用data为 表单 提交
 * 使用params 为 json提交
 * @param {url , method, header, data, params, responseType, local, cancleAuth} query
 */
const request = query => {
  let { url, method, header, data, params, responseType, local, cancleAuth } = query

  // 需要form与data 绑定
  query.data = Object.assign({}, data)

  if("get" != method) {
     // 加密 包含签名
     if (miniConfig.APP_ENCRYPTION && data) {
      encryptData(query)
    }

    // 签名
    if (!miniConfig.APP_ENCRYPTION  && miniConfig.APP_SIGN && data) {
      sign(query)
    }
  }
  // const token = getApp().getToken()
  const code = getApp().getCode()

  // const formHeader = { 'content-type': 'application/x-www-form-urlencoded', 'X-Token': token }
  const formHeader = { 'content-type': 'application/x-www-form-urlencoded', 'wx-code': code }
  // const jsonHeader = { 'content-type': 'application/json', 'X-Token': token }
  const jsonHeader = { 'content-type': 'application/json','wx-code': code }
  const ignoreUrl = ['/shop/cart/info','/businesses/near','/wx/user/checkUser','/shop/cart/diningNum']
  if (ignoreUrl.indexOf(url.split('?')[0]) < 0) {
    wx.showLoading({
      title: getApp().T.common ? getApp().T.common.loading : '加载中...',
      mask: true
    })
  }
  // 微信不支持await Promise，先定义
  const req = () => {
    return new Promise((resolve, reject) => {
      getApp().log('request', query)
      wx.request({
        url: local ? url : baseUrl + url,
        method: method,
        header: params ? { ...formHeader, ...header } : { ...jsonHeader, ...header },
        data: params || query.data,
        responseType: responseType,
        success: res => {      
          // 加密握手url
          res.data.rKey ? setRKey('rKey', res.data.rKey): null;
          // 解密包含验签
          if (miniConfig.APP_ENCRYPTION) {
            decryptData(res)
          }
          // 验签
          if (!miniConfig.APP_ENCRYPTION && miniConfig.APP_SIGN && res.code == 200) {
            verifySign(res)
          }
          resolve(res.data)
        },
        fail: err => reject(err),
        complete: () => wx.hideLoading()
      })
    })
  }

  // 权限验证
  if (!cancleAuth) {
    return new Promise((resolve, reject) => {
      getApp().login().then(loginRes => {
        header = {
          'wx-code': loginRes.code,
          ...header
        }
        req().then(res => resolve(res)).catch(err => reject(err))
      })
    })
  }
  return req()
}

/**
 * 获取本地buffer
 * @param {url} url
 */
const getLocalBuffer = url => {
  return request({
    url: url,
    method: 'get',
    responseType: 'arraybuffer',
    local: true
  })
}

export default { baseUrl, request, getLocalBuffer }
