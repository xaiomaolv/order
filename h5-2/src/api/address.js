import request from '@/utils/request'

// 地址列表查询
export function getAddressList(params) {
  return request({
    url: '/address/' + params,
    method: 'get',
    // data: params
  })
}

//新增
export function addAddress(data) {
  return request({
    url: '/address',
    method: 'post',
    data
  })
}
// 删除
export function delAddress(params) {
  return request({
    url: '/address/'+ params,
    method: 'DELETE',
    // data: params
  })
}

// 修改
export function putAddress(params) {
  return request({
    url: '/address',
    method: 'PUT',
    data: params
  })
}