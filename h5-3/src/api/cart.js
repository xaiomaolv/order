import request from '@/utils/request'

//扫码进第一个页面获取商户和桌号信息 GET /order/businesses/info
export function getStoreInfo(tableId){
  return request({
    url:`/businesses/info?tableId=${tableId}`,
    method:'get'
  })
}

///获取商家菜品树 GET /order/product/list
export function getProductList(businessId){
  return request({
    url:'/product/list',
    method:'get',
    data:{
      "businessId": businessId
    }
  })
}

//查询购物车内信息
export function getCartInfo(params){
  return request({
    url:`/shop/cart/info`,
    method:'get',
		params
  })
}


//查询购物车 GET 
export function cart(params){
  return request({
    url:'/shop/cart',
    method:'get',
    params
  })
}

//新增购物车 POST /shop/cart
export function addCart(data) {
  return request({
    url: '/shop/cart',
    method: 'post',
    data
  })
}

//清空购物车 DELETE /shop/cart
export function delCart (params) {
  return request({
    url: '/shop/cart',
    method: 'DELETE',
    data:params
  })
}

//查询评价列表 GET /order/comment/list
export function getCommentList(businessId){
  return request({
    url:`/comment/info?businessId=${businessId}`,
    method:'get'
  })
}

//规格选择 
export function getFormatList(params){
  return request({
    url:'/data/info',
    method:'get',
    data:params
  })
}

// 规格选择中查询购物车 /shop/cart/view
export function getNormsList(params){
  return request({
    url:`/shop/cart/view?${params}`,
    method:'get'
  })
}

// 增加就餐人数 order/shop/cart/diningNum
export function addDiningNum(data){
  return request({
    url:'/shop/cart/diningNum',
    method:'post',
    data
  })
}

export function wxsend(data){
  return request({
    url:'/shop/cart/send',
    method:'post',
    data
  })
}
