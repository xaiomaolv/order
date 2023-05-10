// pages/restaurant/addressDelivery/addressDelivery.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeInfo: {},
    userId: '',
    addressList: {
      shopList: [{
          id: 1,
          name: "测试",
          tel: "16632593535",
          address: "云南省昆明市五华区金碧支行",
          isCurrent: '0',
          isDelivery: '0',
        },
        {
          id: 2,
          name: "都督",
          tel: "13632535395",
          address: "云南省昆明市五华区金碧支行",
          isCurrent: '1',
          isDelivery: '1',
        }
      ],
      userList: [{
          id: 3,
          name: "郑成功",
          tel: "19074369325",
          address: "云南省昆明市五华区金碧支行",
          isCurrent: '0',
          isDelivery: '0',
        },
        {
          id: 4,
          name: "毛不易",
          tel: "19074369325",
          address: "云南省昆明市五华区金碧支行",
          isCurrent: '0',
          isDelivery: '0',
        },
      ]
    },
    deliveryAddress: [], //店家设置送餐上门地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options, 'options');
    if (Object.keys(options).length != 0) {
      this.setData({
        storeInfo: JSON.parse(options.item)
      })
    }
    let str = this.data.storeInfo.deliveryAddress
    this.setData({
      userId: app.globalData.userInfo.userId,
    })
    if (str) {
      this.setData({
        deliveryAddress: str.split(',')
      })
    }
    console.log(this.data.deliveryAddress, 'dellll');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  // 送到地址选择
  chooseAddress(e) {
    // orderType:2 送餐订单
    let item1 = e.currentTarget.dataset.value
    // let obj = Object.assign(item1, this.data.storeInfo);
    let obj = this.data.storeInfo
    obj.deliveryAddress = item1
    obj.mealNum = 0
    obj.userId = app.globalData.userInfo.userId
    obj.orderType = '2' // orderType:2 送餐订单
    let item = JSON.stringify(obj)
    console.log(obj, '送到地址');
    wx.navigateTo({
      url: '/pages/cart/cart?storeInfo=' + item,
    })
  },
})