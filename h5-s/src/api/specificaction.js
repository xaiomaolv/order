import request from '@/utils/request'
/*
*商户管理订单
*/
//查询规格列表 GET 
export function getSpecificList(query) {
    return request({
        url: '/type/list',
        method: 'get',
        params:query
    })
}

//新增菜单商品规格属性 POST /order/type
export function addSpecific(data) {
    return request({
        url: '/type',
        method: 'post',
        data
    })
}


//修改菜单商品规格属性 PUT /order/type
export function updateSpecific(data) {
    return request({
        url: '/type',
        method: 'put',
        data: data
    })
}

//删除菜单商品规格属性 DELETE /order/type/{formatIds}
export function deleteSpecific(formatIds) {
    return request({
        url: '/type/' + formatIds,
        method: 'delete'
    })
}