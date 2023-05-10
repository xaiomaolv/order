// pages/order/comment/comment.js
import {
  searchComment,
  replybusinessComment,
  getQueryReply
} from '../../../api/order.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    orderId: '',
    imgUrl: app.globalData.imgUrl, //图片访问地址
    commentInfo: null,
    sendVal: '', //发布输入内容
    // 发布按钮
    showSend: false,
    // 商家回复
    replyList:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      // userId: options.userId,
      orderId: options.orderId,
    })
    let params = {
      // userId: "182",
      // orderId: "1482334670241763516",
      orderId: this.data.orderId,
    }
    searchComment(params).then(res => {
      if (res.code == 200) {
        that.setData({
          commentInfo: res.data
        })
        let commentId = res.data.commentId
        getQueryReply(commentId).then(res=>{
          if (res.code == 200) {
            that.setData({
              replyList:res.data
            })
          }
        })
      }
    })
    // let commentId = that.data.commentInfo.commentId
    
    
  },
  inputChange: function (e) {
    let dataset = e.currentTarget.dataset;
    let value = e.detail.value;
    if (dataset.value) {
      this.data[dataset.obj] = dataset.value
    } else {
      this.data[dataset.obj] = value
    }
    // 用set才会触发页面刷新
    this.setData(this.data)
  },
  // 发布展示按钮
  inputFocus(e) {
    this.setData({
      showSend: true
    })
  },
  // 回复商家 torr 0：用户回复商家 1：商家回复用户  
  handelSend(e) {
    let params = {
      torr:'0',
      content: this.data.sendVal,
      userId:this.data.commentInfo.userId,
      businessId:this.data.commentInfo.businessId,
      commentId:this.data.commentInfo.commentId,
      commentReplyId:this.data.replyList.commentReplyId, // 回复id
      userName:this.data.commentInfo.userName,
      toUserId:this.data.replyList.userId,
      toUserName:this.data.replyList.userName,
    }
    replybusinessComment(params).then(res=>{
      if (res.code == 200) {
        console.log(res,'replybusinessComment');
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})