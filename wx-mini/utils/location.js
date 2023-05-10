// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');

// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'HVKBZ-PBFKP-5WVDL-LTBN7-6D6Q6-B5BII' // 必填
});

Page({
  data: {
    location: '定位我...', //显示定位的数据
  },
  async onShow(options) { //实现页面显示有授权则获取地标,没授权,只能通过用户点击获取按钮来获取
    let res = await wxAuthorize()
    if (res) {
      this.getLocation()
    } else {
      this.setData({
        location: '定位我...'
      })
    }
  },

  async getLocation() {
    // qqmapsdk = new QQMapWX({
    //   key: 'CBAJ-DUD-EURJ-JFFJD'
    // })
    const res = await new Promise((resolve) => {
      wx.getLocation({ //获取地址经纬度
        type: 'wgs84',
        success(res) {
          resolve(res);
        }
      })
    })
    const latitude = res.latitude
    const longitude = res.longitude

    const res2 = await new Promise(resolve => {
      qqmapsdk.reverseGeocoder({ //SDK调用这里只需要具体到城市,所以这两个就够,具体可根据业务需求获取
        location: {
          latitude,
          longitude
        },
        success: (res) => {
          resolve(res)
        }
      })
    })
    this.setData({
      location: res2.result.ad_info.city
    })
  },

  async getData() {
    const isAuth = await wxAuthorize();
    if (isAuth) {
      this.getLocation()
    } else {
      wx.showModal({
        title: '请授权当前位置',
        content: '需要获取您的地理位置,请授权!!!',
        showCancel: true,
        confirmText: '去授权',
        success: function (res) {
          if (res.confirm) {
            wx.openSetting({
              success(res) {
                console.log(res.authSetting, res, "答应授权")
                this.getLocation()
              }
            })
          }
        }
      });
    }
  },

  //工具函数,封装的Promise,判断是否授权,可以避免回调地狱
  async  wxAuthorize(scope = 'scope.userLocation') {
    return new Promise(resolve => {
      wx.authorize({
        scope, //发起定位授权
        success: () => {
          console.log('有定位授权')
          //授权成功，此处调用获取定位函数
          resolve(true)
        },
        fail() {
          console.log("没有同意授权定位")
          resolve(false)
        }
      })
    })
  }

})