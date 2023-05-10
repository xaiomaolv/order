import request from '@/utils/request'

//查询绑定用户的订单列表
export function searchOrder(params) {
  return request({
    url: '/details/list',
    method: 'get',
    params 
  })
}

//查询订单详情
export function getOrderDetail(id) {
  return request({
    url: '/details/' + id,
    method: 'get'
  })
}

//给订单增加菜品
export function addToOrder(params) {
  return request({
    url: '/details/add',
    method: 'put',
    data: params
  })
}

//新增订单
export function addOrder(params) {
  return request({
    url: '/details',
    method: 'post',
    data: params
  })
}

//查询点餐预约列表 GET /order/resverse/list
export function searchResverse(params) {
  return request({
    url: '/resverse/list',
    method: 'get',
    params
  })
}

//新增预约 POST 
export function addResverse(params) {
  return request({
    url: '/resverse',
    method: 'post',
    data: params
  })
}

//新增评价 POST /order/evaluate
export function addEvaluate(params) {
  return request({
    url: '/comment',
    method: 'post',
    data: params
  })
}

//上传评价图片 POST /order/image/upload
export function uploadImg(data) {
  return request({
    url: '/image/add',
    method: 'POST',
		headers: {
		  'Content-Type': 'multipart/form-data'
		},
    data
  })
}
//订单评价查询 /order/comment/{userId}/{orderId}  用户编号 订单编号  
// 查询某个商户下的所有评论回复   /order/comment/info  传入参数/order/comment/info?businessId=50
export function searchComment(params) {
  return request({
    url: '/comment/commentinfo',
    method: 'get',
    data: params
  })
}
// 用户回复商家order/comment/replybusiness
export function replybusinessComment(params) {
  return request({
    url: '/comment/replybusiness',
    method: 'post',
    data: params
  })
}
// /order/comment/queryReply/{commentId}   查询当前评论对应的商家回复信息
export function getQueryReply(commentId) {
  return request({
    url: '/comment/queryReply/' + commentId,
    method: 'get'
  })
}