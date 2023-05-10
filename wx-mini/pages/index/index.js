// index.js
import {
  authUser,
  checkUser
} from '../../api/userInfo'
import {
  getTypeList,
  getNearStore
} from "../../api/store"
import {
  getActivityList
} from '../../api/activity'
// 获取应用实例
const app = getApp()
const chooseLocation = requirePlugin('chooseLocation') //地图选点结果插件实例

Page({
  data: {
    pagshow: false,
    userStatus: null, //是否登录 0否 1是
    ency: null,
    iv: null,
    errMsg: null,
    //图片访问地址
    imgUrl: app.globalData.imgUrl,
    activityList: null,
    storeList: [], //商家店铺列表
    localUrl: '',
    latitude: "",
    longitude: "",
    address: "",
    key: app.globalData.mapKey, //在腾讯位置服务申请的key(测试号)
    // key: 'HVKBZ-PBFKP-5WVDL-LTBN7-6D6Q6-B5BII', //在腾讯位置服务申请的key（恩捷小程序）
    referer: '彩云点餐小程序地图搜索', //调用腾讯位置服务相关插件的app的名称
    categoryId: '',
    categoryName: '全部美食',
    sxName: '筛选',
    option: [],
    searchVal: '', //搜索框输入内容
    show: false, // 搜索取消展示
    // 默认排序
    option1: [{
        text: '默认排序',
        value: 0
      },
      {
        text: '离我最近',
        value: 1
      },
    ],
    defaultSort: 0,
    screenList: [{
        id: 1,
        name: '堂食点餐'
      },
      {
        id: 2,
        name: '预约点餐'
      }
    ],
    active: '', //筛选按钮高亮显示
    reserveFlag: '', //筛选内容
    topHeight: '',
    swiperList: [{
        id: 0,
        activityImage: "81a5044b01b441f8ad855e630c02340520220907121217.png",
        eventLink: "https://www.baidu.com",
      },
      {
        id: 1,
        activityImage: "03edeaa26f16449c9850860558735e1d20221011164636.jpg",
        eventLink: "https://www.taobao.com",
      },
    ],
  },

  onLoad: function () {
    this.setData({
      storeList: [],
      latitude: "",
      longitude: "",
      address: "",
      userStatus: app.globalData.userStatus
    })
    // 当前位置
    this.getLocation();
    this.getCtegoryList();
    this.getActivity()

    this.calcHeight('top').then(res => {
      this.setData({
        topHeight: res
      })
    })
  },
  //活动
  getActivity() {
    let params = {
      // pageNum: 1,
      // pageSize: 9999,
      activityType: '1',
      activitySeat: '1'
    }

    getActivityList(params).then(res => {
      if (res.code == 200) {
        this.setData({
          activityList: res.data
        })
      }
    })
  },
  // 活动跳转
  handelActive(e) {
    let eventLink = this.data.activityList.eventLink
    // let eventLink = e.currentTarget.dataset.item.eventLink
    wx.navigateTo({
      url: `/pages/webview/webview?url=${eventLink}`,
    })
  },
  //获取分类树
  getCtegoryList() {
    getTypeList().then(res => {
      if (res.code == 200) {
        this.setData({
          option: res.data[0].children
        })
      }
    })
  },
  onClickNav({
    detail = {}
  }) {
    this.setData({
      mainActiveIndex: detail.index || 0,
    });
  },
  handleOpen(e) {
    this.setData({
      pagshow: true
    })
  },
  handleClose() {
    this.setData({
      pagshow: false
    })
  },
  // onClickItem(){
  //   let detail = {}
  //   const activeId = this.data.activeId === detail.id ? null : detail.id;
  //   this.setData({
  //     activeId,
  //     categoryId: activeId,
  //     categoryName: ''
  //   });
  // },
  onClickItem({
    detail = {}
  }) {
    const activeId = this.data.activeId === detail.id ? null : detail.id;
    this.setData({
      activeId,
      categoryId: activeId,
      categoryName: detail.text
    });
  },
  // 全部美食确认
  onConfirm() {
    this.getStoreList();
    this.selectComponent('#item').toggle();
  },
  // 全部美食重置
  onReset() {
    this.selectComponent('#item').toggle();
    this.setData({
      categoryId: '',
      activeId: '',
      categoryName: '全部美食'
    })
    this.getStoreList()
  },
  // 模糊位置
  getLocation() {
    wx.getLocation({
      type: 'wgs84', // 火星坐标 用于正确的定位
      success: (result) => {
        var {
          latitude,
          longitude
        } = result;
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/', // url是固定的
          data: {
            key: this.data.key, // key
            location: `${latitude},${longitude}`
          },
          method: 'get',
          success: (res) => {
            // 得到的逆地址信息
            this.setData({
              address: res.data.result.address,
              latitude: res.data.result.location.lat,
              longitude: res.data.result.location.lng
            })
            app.globalData.latitude = res.data.result.location.lat
            app.globalData.longitude = res.data.result.location.lng
            this.getStoreList();
          }
        })
      },
      fail: (err) => {
        console.log(err);
      }
    })
  },

  //获取商家列表 
  getStoreList() {
    this.setData({
      pagshow: false
    })
    let params = {
      lat: this.data.latitude, //位置经纬度
      lng: this.data.longitude, //位置经纬度
      searchValue: this.data.searchVal,
      reserveFlag: this.data.reserveFlag,
      categoryId: this.data.categoryId, //分类id
      pageNum: 1,
      pageSize: 9999
    }
    getNearStore(params).then(res => {
      if (res.code == 200) {
        this.setData({
          storeList: res.rows
        })
      }
    })
  },

  //打开详情页
  bindViewTap(e) {
    let item = JSON.stringify(e.currentTarget.dataset.value)
    let userInfo = app.globalData.userInfo
    if (this.data.userStatus == "1") {
      wx.navigateTo({
        url: '/pages/restaurant/restaurant?item=' + item,
      })
    } else {
      this.authorization.showDialog()
    }
  },

  handleTo(e) {
    let item = e.currentTarget.dataset.value
    let userInfo = app.globalData.userInfo
    if (this.data.userStatus == "1") {
      wx.navigateTo({
        url: item.page,
      })
    } else {
      this.authorization.showDialog()
    }
  },

  notice() {
    wx.showToast({
      title: '此功能暂不开放!',
      icon: 'error',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    let that = this
    that.authorization = that.selectComponent(".authorization");
    checkUser().then(res => {
      if (res.code == 200) {
        app.globalData.userInfo = res.data
        app.globalData.userStatus = res.data.userStatus
        if (res.data.userStatus == "1") {
          that.authorization.hideDialog()
        }
        that.setData({
          userStatus: res.data.userStatus
        })
      }
    })
    // 从地图选点插件返回后，在页面的onShow生命周期函数中能够调用插件接口，取得选点结果对象
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    if (location != null) {
      this.setData({
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.name
      })
      this.getStoreList()
    }
    this.setData({
      info: {},
      show: false,
      schedule: {}
    })
    app.globalData.isCertification = false
    app.globalData.phone = null
    app.globalData.user_name = null
  },

  //切换定位
  //腾讯位置服务地图选点
  clickMap() {
    let that = this
    //获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限
    wx.getSetting({
      success(res) {
        //console.log(res)
        //scope.userLocation 就是地理授权的标志：
        //res.authSetting['scope.userLocation'] == undefined 表示初始进入该页面
        //res.authSetting['scope.userLocation'] == false 表示非初始化进入该页面 且未授权
        //res.authSetting['scope.userLocation'] == true 表示地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          //表示非初始化进入该页面 且未授权：
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (result) => {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                });
              } else if (result.confirm) {
                //调起客户端小程序设置界面，返回用户设置的操作结果。 
                //设置界面只会出现小程序已经向用户请求过的权限
                wx.openSetting({
                  success: (dataAu) => {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      });
                      //再次授权之后，调用腾讯位置服务的地图选点插件API
                      that.callQQPlugin()
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      });
                    }
                  }
                });
              }
            }
          });
        } else if (res.authSetting['scope.userLocation'] == undefined) {

          //调用腾讯位置服务的地图选点插件API
          that.callQQPlugin()
        } else {
          //调用腾讯位置服务的地图选点插件API
          that.callQQPlugin()
        }
      }

    })
  },

  //调用腾讯位置服务的地图选点插件API
  callQQPlugin() {
    const key = this.data.key; //使用在腾讯位置服务申请的key
    const referer = this.data.referer; //调用插件的app的名称
    const latitude = this.data.latitude
    const longitude = this.data.longitude
    if (latitude != "" && longitude != "") {
      const location = JSON.stringify({
        latitude: latitude,
        longitude: longitude
      });
      wx.navigateTo({
        url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + location
      });
    } else {
      wx.navigateTo({
        url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer
      });
    }
  },
  // 活动
  goActivity() {
    wx.navigateTo({
      url: '/pages/activity/index'
    })
  },
  toCart() {
    let userInfo = app.globalData.userInfo
    if (this.data.userStatus == "1") {
      wx.navigateTo({
        url: '../cart/cart'
      })
    } else {
      this.authorization.showDialog()
    }
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
    this.getStoreList()
  },
  // 取消展示按钮
  inputFocus(e) {
    this.setData({
      show: true
    })
  },
  // 输入内容变化时触发
  onChange(e) {
    this.setData({
      searchVal: e.detail
    });
  },
  // 搜索
  handelSeach() {
    this.setData({
      storeList: []
    })
    this.getStoreList()
  },
  // 取消搜索
  handelCancel() {
    this.setData({
      show: false,
      searchVal: ''
    })
    this.getStoreList()
  },
  // 筛选选中
  sxBind(e) {
    let item = e.currentTarget.dataset.item
    console.log(item, 'item');
    var index = e.currentTarget.dataset['index']
    this.setData({
      active: index,
      reserveFlag: item.id,
      sxName: item.name
    })
  },
  // 筛选确认
  onConfirmSx() {
    this.selectComponent('#sxitem').toggle()
    this.getStoreList()
  },
  // 筛选重置
  onResetSx() {
    this.selectComponent('#sxitem').toggle()
    this.setData({
      reserveFlag: '',
      active: '',
      sxName: '筛选'
    })
    this.getStoreList()
  },
  // 最近距离
  changeRange({
    detail = {}
  }) {
    // console.log(detail,'wesdfgh');
    this.getStoreList()
    this.setData({
      pagshow: false
    })
  },
  // 获取元素的高度  id:元素id
  calcHeight(id) {
    return new Promise((resolve) => {
      let self = this;
      let height = ''
      let query = wx.createSelectorQuery().in(this)
      query.select('#' + id).boundingClientRect()
      query.exec(function (res) {
        height = res[0].height
        resolve(res[0].height);
      })
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})