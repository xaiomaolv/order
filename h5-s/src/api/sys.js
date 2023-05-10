import request from '@/utils/request';
//商户短信验证码登录
export function login(data) {
    return request({
        url: '/login',
        // url: '/order/login',
        method: 'post',
        data
    });
}

//商户账号密码登录
export function pwdlogin(data) {
    return request({
        url: '/user/login/pwd',
        // url: '/order/user/login/pwd',
        method: 'post',
        data
    });
}

//登录发送验证码
export function loginSend(data) {
    return request({
        url: '/user/sendSms',
        // url: '/order/user/sendSms',
        method: 'post',
        data
    });
}

//商户注册
export function register(data) {
    return request({
        url: '/user/verify',
        // url: '/order//user/verify',
        method: 'post',
        data
    });
}

//注册发送验证码
export function registerSend(data) {
    return request({
        url: '/user/send',
        // url: '/order/user/send',
        method: 'post',
        data
    });
}

//获取用户信息
export function getUserInfo(id) {
    return request({
        url: "/businesses",
        method: 'get'
    });
}


/**
 *商户档案管理
 */
//新增商户信息
export function addBusiness(data) {
    return request({
        url:'/businesses/add',
        method: 'post',
        data
    });
}

//修改商户信息
export function updateBussiness(data) {
    return request({
        url: '/businesses',
        method: 'put',
        data: data
    });
}
export function updateBusinessSms(data) {
    return request({
        url: '/businesses/sms',
        method: 'put',
        data: data
    });
}
export function updateBusinessDelivery(data) {
    return request({
        url: '/businesses/delivery',
        method: 'put',
        data: data
    });
}

//图片上传公共接口
export function commonUpload(data) {
    return request({
        url: '/image',
        method: 'post',
        data
    });
}

//上传文件到服务器
export function Upload(data) {
    return request({
        url: '/image/upload',
        method: 'post',
        data
    });
}
//上传文件到服务器(注册时)
export function UploadImageAdd(data) {
    return request({
        url: '/image/add',
        method: 'post',
        data
    });
}
//上传文件到服务器（登录后）
export function uploadFile(data) {
    return request({
        // url: '/image',
        url: '/image/add',
        method: 'post',
        data
    });
}

//预览图片
export function getImgInfo(val) {
    // console.log("params+"+data)
    return request({
        url: '/image/preview?fileName=' + val,
        method: 'get',
    });
}

//删除已上传的图片
export function deleteImg(val) {
    return request({
        url: '/image/del?fileName=' + val,
        method: 'get',
    });
}

//查询经营分类树 /order/buscategory/tree
export function getTreeSelectList() {
    return request({
        url: '/buscategory/treeselect',
        method: 'get'
    });
}
//查询经营分类树 /order/buscategory/tree(注册时)
export function getTypeListTree() {
    return request({
        url: '/buscategory/tree',
        method: 'get'
    });
}

//查询经营分类树
export function getTypeTree() {
    return request({
        url: '/buscategory/tree',
        method: 'get'
    });
}

export function getInfo() {
    return request({
        url: '/wx/user/getInfo',
        method: 'get'
    });
}

export function getMenu() {
    return request({
        url: '/menu',
        method: 'get'
    });
}

// 退出方法
export function logout() {
    return request({
        url: '/logout',
        method: 'post'
    });
}
// 退出登录 /order/businesses/exit    post
export function logoutBuis(data) {
    return request({
        url: '/businesses/exit',
        method: 'post',
        data
    });
}

//修改密码短信验证
export function sendMsg(data) {
    return request({
        url: '/sms',
        method: 'post',
        data
    });
}

// 获取验证码
export function getCodeImg() {
    return request({
        url: '/captcha',
        method: 'get'
    });
}
//修改个人密码
export function password(data) {
    return request({
        url: '/password',
        method: 'post',
        data
    });
}

//获取个人资料
export function getLoginUser(data) {
    return request({
        url: '/sys/user/getLoginUser',
        method: 'post',
        data
    });
}


//修改个人资料
export function updateLoginUser(data, params) {
    return request({
        url: '/sys/user/updateLoginUser?' + params,
        method: 'post',
        data
    });
}

export function sendSms(params) {
    return request({
        url: '/sale/person/verification/code',
        method: 'post',
        params
    });
}

export function bindOpenid(data) {
    return request({
        url: '/sys/user/bindingOpenid',
        method: 'post',
        data
    });
}


export function removeOpenid(data) {
    return request({
        url: '/sys/user/removeOpenid',
        method: 'post',
        data
    });
}
//获取钱包from字符串
export function getWalletFrom(params) {
    return request({
        url: '/wxlogin/getwallethtml',
        method: 'get',
        params
    });
}

//查看钱包是否已经开通
export function walletIsOpen(params) {
    return request({
        url: '/wxlogin/walletisopen',
        method: 'get',
        params
    });
}


//
export function getWxOpenid(code) {
    let url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx8ac3091cf3b0282c&secret=dc31e1601da576d3ac108966ad899f94&code=' + code + '&grant_type=authorization_code';
    return axios.get(url).then(response => {
        //return response;
    });
}

// 销售端注册

export function newUserAdd(data) {
    return request({
        url: '/sale/person/newUserAdd?name=' + data.name + '&phone=' + data.phone,
        method: 'post'
    });
}
// 销售端注册

export function customer(params) {
    return request({
        url: '/el/customer/search',
        method: 'get',
        headers: {
            currentPage: params.currentPage,
            pageSize: params.pageSize
        },
        params: {
            keywords: params.keywords
        }
    });
}
// 店铺注销 商户注销接口   put   /order/businesses/logout
export function logOffBussiness() {
    return request({
        url: '/businesses/logout',
        method: 'put',
    });
}
//获取区域地址
export function getAreaList(dictType) {
    return request({
        url: "/area/" + dictType,
        method: 'get'
    });
}

//查询审核失败的商户信息-获取token
export function businessreviewLogin(params) {
    return request({
        url: '/businessreview/login',
        method: 'get',
        params
    });
}

//查询审核失败的商户信息
export function businessreviewInfo(params) {
    return request({
        url: '/businessreview/info',
        method: 'get',
        params
    });
}

// 修改信息，重新提交审核
export function businessreview(data) {
    return request({
        url: '/businessreview',
        method: 'post',
        data
    });
}
