const request = getApp().request

///获取商家菜品树 GET /order/product/list
export function getProductList(params){
  return request({
    url:'/product/list',
    method:'get',
    data:params
  })
}

//查询购物车内信息
export function getCartInfo(params){
  return request({
    url:'/shop/cart/info',
    method:'get',
    data:params
  })
}

//查询购物车 GET 
export function cart(params){
  return request({
    url:'/shop/cart',
    method:'get',
    data:params
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
export function getCommentList(params){
  return request({
    url:'/comment/info',
    method:'get',
    data:params
  })
}