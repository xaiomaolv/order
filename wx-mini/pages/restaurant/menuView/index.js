// pages/restaurant/menuView/index.js
import {
  getCommentList,
  getCartInfo,
  addCart,
  delCart,
  getFormatList,
  getNormsList
} from '../../../api/cart'

import debounce from "../../../utils/debounce.js"
let oldActiveKey = 0
// 右侧每一类的 bar 的高度（固定）
const RIGHT_BAR_HEIGHT = 20;
// 右侧每个子类的高度（固定）
const RIGHT_ITEM_HEIGHT = 94;
// 左侧每个类的高度（固定）
const LEFT_ITEM_HEIGHT = 56

let innerTask = null //定时器

const app = getApp()
Page({
  data: {
    imgUrl: app.globalData.imgUrl, //图片访问地址
    resCode: null, //接收的信息
    //用餐人数
    mealNum: 0,
    // 餐位费
    mealFee: 0,
    //用餐时间
    mealTime: '',
    dialogShow: false,
    isTrue: false,
    //购物车的商品
    HZL_my_cat: [],
    // 购物车的数量
    HZL_num: 0,
    //分类的数组
    HZL_categories: [
      '点单',
      '评论'
    ],
    total: 0, //合计
    priceAmount: 0,
    discountAmount: 0, //优惠
    //swiper滑动的数组
    HZL_swiper_ID: 0,
    dibuche: '',
    myaddress: '',
    mchId: '',
    latitude: '',
    longitude: '',
    mch_id: '',
    mch: {},
    commont: [{
      virtual_avatar: '/src/car/header.png',
      virtual_user: '羊咩咩ader',
      addtime: '2022-01-12',
      content: '菜品丰富，食材新鲜，非常好吃！！！',
      pic_list: [],
      reply_content: '感谢您的优质评价！欢迎下次光临~~~'
    }],
    myparentIndex: '0',
    myindex: '0',
    second: 10,
    constants: [],
    isFirst: true,
    formatFlag: '', //规格标识 1：有； 0：无
    showGoodsDetailPOP: false, //显示商品详情popup
    curGoodsMap: null, //弹窗菜品信息
    active: '',
    flag: true, //规格弹窗
    hasChose: null,
    hasproductPercentPrice: null, //规格购物车优惠价
    hasproductPrice: null, //规格购物车原价
    dataNorms: [], //规格选择数据
    selectArr: [], //存放被选中的值
    shopItemInfo: {}, //存放要和选中的值进行匹配的数据
    subIndex: [], //是否选中 因为不确定是多规格还是但规格，所以这里定义数组来判断
    content: "",
    formatTypeList: '',
    boxArr: {},
    guigeCarNum: 0, //规格购物车数量
    showSelectSpec: '', //展示选中的值
    dataIds: [],
    topHeight: '',
    bottomHeight: '',
    // 菜品详情弹窗
    showFoodList: false,
    foodDetail: {},

    // 滚动区域
    scrollLeftHeight: 0, // scroller-left 的高
    activeKey: 0, // sidebar activeKey
    scrollLeftTop: 0, // 分类 scrollTop
    // 锚点定位 与 滚动定位相应 sidebar-menu
    scrollLocationId: null, // 滚动定位Id
    scrollRightTop: 0, // 商品 scrollTop
    productChunkRects: [], // class product-body__chunk 的 rects
    scrollTopList: [], // class product-body__chunk 的每个开始的 scrollTop
    
    contentHeight: 0,
    paddingBottom: 0
  },

  onShow: function () {
    var that = this
    that.getCartList();
    that.getComment();

    //将定时器赋值给data中的timerTask变量，便于关闭定时器调用
    // innerTask = setInterval(function () {
    //   that.getCartList();
    // }, 5000)
  },

  onLoad: function (option) {
    var a = this;
    // let storeInfo = JSON.parse(option.storeInfo)
    a.setData({
      resCode: JSON.parse(option.storeInfo),
    })

    //导航栏的文字
    wx.setNavigationBarTitle({
        title: '点餐菜单',
      }),
      // 导航栏的文字颜色和背景的颜色
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#E13B33',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })

    this.calcHeight('bottom').then(res => {
      this.setData({
        bottomHeight: res
      })
    })

    this.calcHeight('top').then(res => {
      this.setData({
        topHeight: res
      })
    })

    setTimeout(() => {
      //高度大小 //40+60+90
      wx.getSystemInfo({
        success: function (res) {
          let num = Number(a.data.topHeight) + Number(a.data.bottomHeight)
          var HZL_height = res.windowHeight - num
          var HZL_height1 = res.windowHeight - num
          console.log(a.data.topHeight,a.data.bottomHeight,HZL_height1, res.windowHeight,999)
          a.setData({
            HZL_height: HZL_height,
            HZL_height1: HZL_height1,
            contentHeight:  HZL_height1
          })
          a.busPos = {};
          a.busPos['x'] = 50; //购物车的位置
          a.busPos['y'] = res.windowHeight - 60;
        }
      });
      a.setData({
        HZL_eachRightItemToTop: a.HZL_getEachRightItemToTop()
      })
    }, 1000)

  },

  //预览图片，放大预览
  preview(e) {
    let currentUrl = e.currentTarget.dataset.current
    var imglist = e.currentTarget.dataset.urls
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: imglist // 需要预览的图片http链接列表
    })
  },


  //记录swiper滚动的
  HZL_swiperchange: function (e) {
    var that = this;
    that.setData({
      HZL_swiper_ID: e.detail.current,
    })
  },
  //点击分类栏
  HZL_categories: function (e) {
    var that = this;
    that.setData({
      HZL_swiper_ID: e.currentTarget.dataset.index
    })
  },

  // 获取每个右侧的 bar 到顶部的距离，用来做后面的计算。
  HZL_getEachRightItemToTop: function () {
    var obj = {};
    var totop = 0;
    var constants = this.data.constants
    if (constants.length == 0) {
      return false;
    }
    // 右侧第一类肯定是到顶部的距离为 0
    obj[constants[0].categoryId] = totop
    // 循环来计算每个子类到顶部的高度
    for (let i = 1; i < (constants.length + 1); i++) {
      totop += (RIGHT_BAR_HEIGHT + constants[i - 1].children.length * RIGHT_ITEM_HEIGHT)
      // 这个的目的是 例如有两类，最后需要 0-1 1-2 2-3 的数据，所以需要一个不存在的 'last' 项，此项即为第一类加上第二类的高度。
      obj[constants[i] ? constants[i].categoryId : 'last'] = totop
    }
    return obj
  },
  // 监听右侧的滚动事件与 HZL_eachRightItemToTop 的循环作对比 从而判断当前可视区域为第几类，从而渲染左侧的对应类。
  right: function (e) {
    for (let i = 0; i < this.data.constants.length; i++) {
      let left = this.data.HZL_eachRightItemToTop[this.data.constants[i].categoryId]
      let right = this.data.HZL_eachRightItemToTop[this.data.constants[i + 1] ? this.data.constants[i + 1].categoryId : 'last']
      if (e.detail.scrollTop < right && e.detail.scrollTop >= left) {
        this.setData({
          HZL_currentLeftSelect: this.data.constants[i].categoryId,
          HZL_leftToTop: LEFT_ITEM_HEIGHT * i
        })
      }
    }
  },

  // 左侧类的点击事件，点击时，右侧会滚动到对应分类
  left: function (e) {
    var id = e.currentTarget.dataset.id
    var ids = 'id' + id
    this.setData({
      HZL_toView: ids,
      HZL_currentLeftSelect: id
    })
  },
  //预约点餐
  gotoAppoint(e) {
    if (this.data.resCode.businessStatus == "1") {
      let item = JSON.stringify(e.currentTarget.dataset.value)
      wx.navigateTo({
        url: '/pages/appointment/index?item=' + item,
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '该商家暂不营业',
      })
    }
  },

  //查询购物车
  getCartList() {
    let params = {
      "tableId": this.data.resCode.tableId,
      "businessId": this.data.resCode.businessId,
      "userId": this.data.resCode.userId,
      // "tableId": '10',
      // "businessId": '50',
      // "userId": "282",
      // "tableId": '82',
      // "businessId": '76',
    }
    let tt = JSON.parse(JSON.stringify(params))
    getCartInfo(tt).then(res => {
      if (res.code == 200) {
        this.setData({
          constants: res.data.children,
          HZL_my_cat: res.data.productInfo,
          total: res.data.percentAmount,
          HZL_num: res.data.productNum,
          discountAmount: res.data.discountAmount,
          priceAmount: res.data.priceAmount
          // HZL_currentLeftSelect: res.data.children[0].categoryId
        })
      }
      this.setData({
        HZL_currentLeftSelect: this.data.constants[0].categoryId,
        HZL_eachRightItemToTop: this.HZL_getEachRightItemToTop()
      })
    })
  },

  //查询评论列表
  getComment() {
    let params = {
      businessId: this.data.resCode.businessId,
      // businessId: '50',
    }
    getCommentList(params).then(res => {
      if (res.code == 200) {
        this.setData({
          commont: res.rows
        })
      }
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
  // 查看详情
  lookDetail(e) {
    this.setData({
      showFoodList: true,
      foodDetail: e.currentTarget.dataset.item
    })
  },
  // 关闭菜单详情
  onClose() {
    this.setData({
      showFoodList: false
    })
  },
  onUnload: function () {
    clearInterval(innerTask);
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(innerTask);
  },
  // 图片预览
  previewImage: function (e) {
    let src = e.currentTarget.dataset.src; //获取data-src
    let list = e.currentTarget.dataset.list; //获取data-list
    let imgList = []
    list.forEach(item => {
      imgList.push(this.data.imgUrl + item)
    })
    //图片预览
    wx.previewImage({
      current: this.data.imgUrl + src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  // scroll --------------------------------------------------------
  // 商品 scroll-view 滚动事件
  onScrollRightEvent(event) {
    // console.log('onScrollEvent', event, event.detail)
    const {
      scrollTop
    } = event.detail
    this.setData({
      scrollRightTop: scrollTop
    })
    debounce(500, () => {
      this.computeCurrSidebarActiveByScrollTop(scrollTop)
    })()
  },
  // scroll --------------------------------------------------------
  // 锚点定位 --------------------------------------------------------
  // 切换 sidebar
  handleSidebarChange(event) {
    // console.log('handleSidebarChange', event)
    let activeKey = event.currentTarget.dataset.index
    this.setData({
      activeKey
    })
    // 锚点定位
    this.gotoAnchorPointLocation(`anchor-point-title-${activeKey}`)
  },
  // 锚点定位与scrollTop
  gotoAnchorPointLocation(scrollLocationId) {
    // console.log('gotoAnchorPointLocation', scrollLocationId)
    this.setData({
      scrollLocationId
    })
  },
  // 锚点定位 --------------------------------------------------------
  // 滚动定位相应 sidebar-menu ----------------------------------------
  // 获取产品块的rects
  getProductChunkRectsAndScrollTop() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    wx.createSelectorQuery().in(this).selectAll('.product-body__chunk').boundingClientRect((rects) => {
      wx.hideLoading()
      let scrollTopList = []
      let acc = rects.map(item => item.height).reduce(function (accumulator, currentValue) {
        scrollTopList.push(accumulator)
        return accumulator + currentValue
      }, 0)
      scrollTopList.push(acc)
      // console.log('scrollTopList', scrollTopList)

      // 为了解决滚动区域滚动距离不够的问题需要动态设置adding-bottom值  
      // 获取最后一个分类的高度 用内容高度 - 最后一个分类的高度  得到需要补充的padding-bottom的值
      let itemHg = []
      let acch = rects.map(item => item.height)
      itemHg.push(acch)
      let len =  itemHg[0].length
      let lastHg = itemHg[0][len -1]
      let paddingBottom = 0
      if(lastHg < this.data.contentHeight){
         paddingBottom =  this.data.contentHeight - lastHg
      }
      this.setData({
        productChunkRects: rects,
        scrollTopList,
        paddingBottom: paddingBottom
      })
    }).exec()
  },
  // 通过当前滚动位置计算当前 Sidebar 的 Active
  computeCurrSidebarActiveByScrollTop(scrollTop) {
    if (this.data.productChunkRects.length !== 0) {
      let currScrollTopList = this.data.scrollTopList.filter(item => item <= scrollTop)
      let activeKey = currScrollTopList.length - 1 >= 0 ? currScrollTopList.length - 1 : 0
      // console.log(currScrollTopList, scrollTop, activeKey, oldActiveKey)
      // 不直接复制通过 this.setData({ activeKey })，为了加快渲染速度
      if (oldActiveKey !== activeKey) {
        oldActiveKey = activeKey
        this.setData({
          activeKey
        }, () => {
          // 动态显示 Sidebar 的 activeKey 处在一个合理的位置
          let scrollLeftTop = Math.floor((activeKey + 1) * 50 / this.data.scrollLeftHeight) * this.data.scrollLeftHeight - 50
          // console.log(scrollLeftTop, this.data.scrollLeftHeight)
          this.setData({
            scrollLeftTop: scrollLeftTop > 0 ? scrollLeftTop : 0
          })
        })
      }
      // console.log('----', currScrollTopList, activeKey, oldActiveKey)
    } else {
      this.getProductChunkRectsAndScrollTop()
    }
  },
  // 锚点定位 ----------------------------------------

})