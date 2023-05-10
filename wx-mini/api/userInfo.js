const request = getApp().request

//POST /property/wxUserInfo/ 保存微信用户信息
export function saveWxUserInfo (params) {
  return request({
    url: '/wxUserInfo/',
    method: 'post',
    data: params
  })
}
// DELETE /property/wxUserInfo/ 删除微信用户信息
export function delWxUserInfo (params) {
  return request({
    url: '/wxUserInfo/',
    method: 'DELETE'
  })
}
// GET /property/wxUserInfo/ 查询微信用户信息
export function seachWxUserInfo (params) {
  return request({
    url: '/wxUserInfo/' + '?type='+ (params != undefined &&  params.type != undefined ?params.type:"0"),
    method: 'GET'
  })
}

// 授权登录 GET /order/wxuser/info
export function authUser(params){
  return request({
    url: '/wx/user/info',
    method: 'get',
    data: params
  })
}
// /order/wx/user/checkUser 校验登录
export function checkUser(params){
  return request({
    url: '/wx/user/checkUser',
    method: 'get',
    data: params
  })
}