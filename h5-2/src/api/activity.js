import request from '@/utils/request'

//查询活动 GET /order/activity/info
export function getActivityList(params) {
  return request({
    url: '/activity/info',
    method: 'get',
    params
  })
}
// 抽奖
export function redempDraw(data) {
  return request({
    url: '/redemp/draw',
    method: 'post',
    data
  })
}
// 用户抽奖记录查询/order/receive/list
export function getReceiveList(params) {
  return request({
    url: '/receive/list',
    method: 'get',
    params
  })
}

// 查询领取记录详情/order/receive/{exchangeId}
export function getReceiveDetail(exchangeId) {
  return request({
    url: '/receive/' + exchangeId,
    method: 'get',
  })
}
//新增兑换码领取记录 
export function addReceive(data) {
  return request({
    url: '/receive',
    method: 'post',
    data
  })
}