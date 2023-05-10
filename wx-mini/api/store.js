const request = getApp().request
//添加收藏  /order/collect post
export function collect(params){
return request({
  url: '/collect/add',
  method: 'post',
  data: params
})
}

//取消收藏  /order/collect delete  
export function deleteCollect(params){
  return request({
    url:'/collect/'+params.userId+'/'+params.businessesId,
    method:'delete',
    // data:{
    //   "businessId":params.businessId,
    //   "userId":params.userId
    // }
  })
  }

//  获取用户收藏 POST /order/collect/list
export function getCollectList(params){
  return request({
    url:'/collect/list',
    method:'get',
    data:params
  })
}

// 搜索附近商家分页 GET /order/businesses/near
export function getNearStore(params) {
  return request({
    url: '/businesses/near',
    method: 'get',
    data: params
  })
}

//查询商户档案 GET /order/businesses/{id}
export function getStoreDetail(params){
  return request({
    url:'/businesses/busInfo',
    method:'get',
    data:params
  })
}

//查询分类树
export function getTypeList() {
  return request({
    // url: '/order/buscategory/treeselect',
    url:"/buscategory/tree",
    method: 'get'
  })
}
