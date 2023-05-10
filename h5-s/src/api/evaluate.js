import request from '@/utils/request'
//查询评价列表 
export function getCommentList(query) {
    return request({
        url: '/comment/info',
        method: 'get',
        params:query
    })
}
// 商家回复点餐用户   /order/comment/replyuser   
//  {
//         "commentReplyId": null,
//         "userId": "",
//         "userName": "",
//         "toUserId": "",
//         "content": "炸鸡汉堡店欢迎你的下次光临！欢迎再来哈！",
//         "toUserName": "",
//         "businessId":"50",
//         "commentId":"165535025005600"
//     } 
export function replyUser(data) {
    return request({
        url: '/comment/replyuser',
        method: 'post',
        data
    })
}