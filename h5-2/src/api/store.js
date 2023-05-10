import request from '@/utils/request'

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
    url:`/collect/${params.businessesId}`,
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
    params
  })
}

// 搜索附近商家分页 GET /order/businesses/near
export function getNearStore(params) {
  return request({
    url: '/businesses/near?' + params,
    method: 'get'
  })
}

//查询商户档案 GET /order/businesses/{id}
export function getStoreDetail(params){
  return request({
    url:`/businesses/busInfo?${params}`,
    method:'get',
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

// 获取微信配置
export function getWeiXinSdk() {
  return request({
    url:"/buscategory/tree",
    method: 'get'
  })
}

