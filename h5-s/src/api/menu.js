import request from '@/utils/request'

/**
 * 菜品分类管理
 */
//添加
export function addType(data) {
    return request({
        url: '/category',
        method: 'post',
        data
    })
}
//删除
export function deleteType(id) {
    return request({
        url: '/category/' + id,
        method: 'delete'
    })
}
//修改
export function updateType(data) {
    return request({
        url: '/category',
        method: 'put',
        data: data
    })
}
//查询
export function getTypelist(query) {
    return request({
        url: '/category/list',
        method: 'get',
        params: query
    })
}

/**
 * 菜品管理
 */
//添加
export function addProduct(data) {
    return request({
        url: '/product',
        method: 'post',
        data
    })
}

//菜品上架下架 
export function upOrDown(data) {
    return request({
        url: '/product/edit',
        method: 'put',
        data: data
    })
}

//菜品规格选择 GET /order/data/info
export function getFormatInfo(params) {
    return request({
        url: '/data/info',
        method: 'get',
        params: params
    })
}

//删除
export function deleteProduct(id) {
    return request({
        url: '/product/' + id,
        method: 'delete'
    })
}
//修改
export function updateProduct(data) {
    return request({
        url: '/product',
        method: 'put',
        data: data
    })
}
//根据id查询
export function getProductInfo(query) {
    return request({
        url: '/product',
        method: 'get',
        params: query
    })
}
//查询
export function getProductlist(query) {
    return request({
        url: '/product/info',
        method: 'get',
        params: query
    })
}

//根据分类id查询菜品
export function getProductByTypeid(typeId) {
    return request({
        url: '/product/info/' + typeId,
        method: 'get'
    })
}

//根据分类删选菜品
export function getProductData(query) {
    return request({
        url: '/product/category',
        method: 'get',
        params: {
            // businessId:query.businessId,
            categoryId:query.categoryId
        }
    })
}

//添加桌号信息
export function addTableInfo(data) {
    return request({
        url: '/tables',
        method: 'post',
        data
    })
}

//查询餐桌列表 
export function getTableList(query) {
    return request({
        url: '/tables/list',
        method: 'get',
        params: query
    })
}

//查询餐桌详情 {id}
export function getTableById(id) {
    return request({
        url: '/tables/' + id,
        method: 'get'
    })
}

//删除餐桌信息
export function deleteTable(id) {
    return request({
        url: '/tables/' + id,
        method: 'delete'
    })
}
//修改餐桌信息
export function updateTble(data) {
    return request({
        url: '/tables',
        method: 'put',
        data: data
    })
}

//生成二维码 生成二维码并将其存放于本地目录 POST 
export function getCodeImg(data) {
    return request({
        url: '/generate/v1',
        method: 'post',
        data
    })
}

//查询规格分类/order/type/list  查询规格  查询参数businessId 50
export function getFormatList(query) {
    return request({
        url: '/type/list',
        method: 'get',
        params: query
    })
}