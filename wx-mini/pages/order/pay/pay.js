// pages/order/pay/pay.js
import {
  cart,
} from '../../../api/cart'
import {
  addOrder,
  addResverse
} from '../../../api/order'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //图片访问地址
    imgUrl: app.globalData.imgUrl,
    storeInfo: null,
    tableId: null,
    userId: null,
    mealNum: 0, //用餐人数
    orderInfo: {},
    showMore: false, //展开收缩
    orderType: '', //是否提前点餐0否 1是
    form: {
      remark: '',
      customerPhone: '',
      customerName: '',
    },
    productInfo: null, //已选菜品信息
    mealFeeTotal: null, //餐位费
  },
  listToggle: function () {
    this.setData({
      showMore: !this.data.showMore
    })
  },
  //查询数据
  getCart: function () {
    let params = {
      tableId: this.data.storeInfo.tableId,
      userId: this.data.storeInfo.userId,
    }
    let tt = JSON.parse(JSON.stringify(params))
    cart(tt).then(res => {
      if (res.code == 200) {
        this.setData({
          orderInfo: res.data,
          productInfo: res.data.productInfo
        })
      }
    })
  },
  inputChange: function (e) {
    let dataset = e.currentTarget.dataset;
    let value = e.detail.value;
    if (dataset.value) {
      this.data[dataset.obj] = dataset.value
    } else {
      this.data[dataset.obj] = value
    }
    this.setData(this.data)
  },
  // 继续点餐
  toCar() {
    let item = JSON.stringify(this.data.storeInfo)
    wx.redirectTo({
      url: '/pages/cart/cart?storeInfo=' + item
    })
  },
  // 下单
  goPay: function () {
    let params = {
      "tableId": this.data.storeInfo.tableId,
      "userId": this.data.userId,
      "businessId": this.data.storeInfo.businessId,
      "diningNum": this.data.storeInfo.mealNum,
      "orderSource": this.data.storeInfo.orderSource,
      "remark": this.data.form.remark,
      // "customerName": this.data.form.customerName,
      // "customerPhone": this.data.form.customerPhone,
      // "deliveryAddress": this.data.storeInfo.deliveryAddress,
    }
    // 预约点餐
    if (this.data.orderType == 1) {
      this.setData({
        ['storeInfo.mealPerson']: this.data.storeInfo.mealNum,
        ['storeInfo.remark']: this.data.form.remark
      })
      console.log(this.data.storeInfo, 'paypay预约');
      addResverse(this.data.storeInfo).then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: '预约成功',
            icon: 'success',
            duration: 2000
          });
          let orderId = res.data.orderId
          let activityFlag = res.data.activityFlag
          setTimeout(
            function () { //注意function这里不能缺少
              if (activityFlag == "1") {
                wx.reLaunch({
                  url: '/pages/luckDraw/index?orderId=' + orderId + "&activitySeat=" + "3"
                })
              } else {
                wx.reLaunch({
                  url: '/pages/order/detail/index?orderId=' + orderId
                })
              }
            }, 1500)
        }
      })
    } else {
      // 正常扫码点餐
      let that = this
      console.log(params, '下单 点单');
      // 外送订单
      // if (that.data.storeInfo.deliveryAddress) {
      //   if (!that.data.form.customerName) {
      //     this.showModal('请输入联系人')
      //     return;
      //   }
      //   if (!that.data.form.customerPhone) {
      //     this.showModal('请输入联系电话')
      //     return;
      //   }
      //   if (!/^1[3456789]\d{9}$/.test(that.data.form.customerPhone)) {
      //     that.showModal('请填写正确的电话号码')
      //     return;
      //   }
      // }
      let tt = JSON.parse(JSON.stringify(params))
      addOrder(tt).then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: '下单成功！',
            icon: 'success',
            duration: 1000
          })
          // 返回活动标识   activityFlag  0-否，1-是
          let orderId = res.data.orderId
          let activityFlag = res.data.activityFlag
          console.log('订单id' + orderId)
          setTimeout(
            function () { //注意function这里不能缺少
              if (activityFlag == "1") {
                wx.reLaunch({
                  url: '/pages/luckDraw/index?orderId=' + orderId + "&activitySeat=" + "2"
                })
              } else {
                wx.reLaunch({
                  url: '/pages/order/detail/index?orderId=' + orderId
                })
              }
            }, 1500)

        }
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("----:" + JSON.stringify(options))
    this.setData({
      storeInfo: JSON.parse(options.storeInfo),
      userId: app.globalData.userInfo.userId,
    })
    if (this.data.storeInfo.mealFee > 0) {
      this.setData({
        mealFeeTotal: this.data.storeInfo.mealFee * this.data.storeInfo.mealNum
      })
    }
    this.setData({
      orderType: this.data.storeInfo.orderType
    })
    // if (this.data.storeInfo.customerPhone || this.data.customerName) {
    //   this.setData({
    //     ['form.customerName']: this.data.storeInfo.customerName,
    //     ['form.customerPhone']: this.data.storeInfo.customerPhone
    //   })
    // }
    console.log(this.data.storeInfo, 'storeInfo');
  },

  goBack() {
    wx.navigateBack({
      changed: true
    });
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
    this.setData({
      orderInfo: {}
    })
    this.getCart();
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

  },
  showModal(msg) {
    wx.showModal({
      title: '',
      content: msg,
      showCancel: false,
      success(res) {
        if (res.confirm) {

        }
      }
    })
  },
})