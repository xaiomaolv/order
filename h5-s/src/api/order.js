import request from '@/utils/request'
/*
*商户管理订单
*/

//商家查询订单列表（订单状态）
export function getOrderList(query) {
    return request({
        url: '/details/list',
        method: 'get',
        params:query
    })
}

//查询预约列表
export function getResverseList(query) {
    return request({
        url: '/resverse/list',
        method: 'get',
        params:query
    })
}

//商家修改预约信息
export function updateReserve(data) {
    return request({
        url: '/resverse',
        method: 'put',
        data: data
    })
}

//根据订单id获取详细信息
export function getOrderInfo(orderId) {
    return request({
        url: '/details/'+orderId,
        method: 'get'
    })
}
//根据reserveId获取预约未点餐详细信息 /order/resverse/{reserveId}   get
export function getOrderInfoReserve(reserveId) {
    return request({
        url: '/resverse/'+reserveId,
        method: 'get'
    })
}
//用户openid验证是否有权限查看订单详情
export function authOrderInfo(params) {
    return request({
        url: '/wx/user/check',
        method: 'get',
        params:params
    })
}

//用户openid验证是否有权限查看预约订单详情
export function authReserveInfo(params) {
    return request({
        url: '/wx/user/checkRes',
        method: 'get',
        params:params
    })
}

//商家加菜
export function addProduct(data) {
    return request({
        url: '/details/add',
        method: 'put',
        data: data
    })
}

//商家对订单中的菜进行增减
export function addAndSubtractProduct(data) {
    return request({
        url: '/details/oper?op=2',
        method: 'put',
        data: data
    })
}

//商户修改菜品状态
export function updateProductStatus(data) {
    return request({
        url: '/details',
        method: 'put',
        data: data
    })
}

//商户修改订单状态
export function updateOrderStatus(data) {
    return request({
        url: '/details',
        method: 'put',
        data: data
    })
}

// 增加就餐人数 order/details/diningNum
export function addDiningNum(data){
    return request({
        url:'/details/diningNum',
        method:'post',
        data
    })
}
