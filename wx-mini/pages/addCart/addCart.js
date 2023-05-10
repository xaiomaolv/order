import {
  getCommentList,
  getCartInfo,
  addCart,
  delCart
} from '../../api/addCart'
import {
  addToOrder
} from '../../api/order'
import {
  getFormatList,
  getNormsList,
  addDiningNum
} from '../../api/cart'

import debounce from "../../utils/debounce.js"
let oldActiveKey = 0
// 右侧每一类的 bar 的高度（固定）
const RIGHT_BAR_HEIGHT = 24;
// 右侧每个子类的高度（固定）
const RIGHT_ITEM_HEIGHT = 110;
// 左侧每个类的高度（固定）
const LEFT_ITEM_HEIGHT = 50

let timerTask = null //定时器

const app = getApp()
Page({
  data: {
    imgUrl: app.globalData.imgUrl, //图片访问地址
    orderInfo: null, //接收的信息
    dialogShow: false,
    isTrue: false,
    constants: null,
    storeInfo: null,
    constants1: [],
    //是否显示下面的购物车
    HZL_isCat: 0,
    //购物车的商品
    HZL_my_cat: [],
    // 购物车的数量
    HZL_num: 0,
    //分类的数组
    HZL_categories: [
      '点单',
      '评论'
    ],
    diningNum:0, //就餐人数
    total: 0, //合计
    priceAmount: 0,
    discountAmount: 0, //优惠
    //swiper滑动的数组
    HZL_swiper_ID: 0,
    dibuche: '',
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
    // showGoodsDetailPOP:false , //显示商品详情popup
    curGoodsMap: null, //弹窗菜品信息
    flag: true, //规格弹窗
    hasChose: null,
    hasproductPercentPrice: null, //规格购物车优惠价
    hasproductPrice: null, //规格购物车原价
    dataNorms: [], //规格选择数据
    selectArr: [], //存放被选中的值
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
    hide_good_box: true,

    // 滚动区域
    scrollLeftHeight: 0, // scroller-left 的高
    activeKey: 0, // sidebar activeKey
    scrollLeftTop: 0, // 分类 scrollTop
    // 锚点定位 与 滚动定位相应 sidebar-menu
    scrollLocationId: null, // 滚动定位Id
    scrollRightTop: 0, // 商品 scrollTop
    productChunkRects: [], // class product-body__chunk 的 rects
    scrollTopList: [], // class product-body__chunk 的每个开始的 scrollTop
    contentHeight: 0, // 内容高度
    paddingBottom: 0, // 补充滚动需要的padding值

  },

  onShow: function () {
    var that = this
    // that.getCartList();
    that.getComment();

    // 将定时器赋值给data中的timerTask变量，便于关闭定时器调用
    timerTask = setInterval(function () {
      that.getCartList();
    }, 3000)
  },

  onLoad: function (option) {
    var a = this;
    a.setData({
      orderInfo: JSON.parse(option.item)
    })
    //导航栏的文字
    wx.setNavigationBarTitle({
        title: '加菜',
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
      a.getCartList();
    }, 1000)

  },

  //加入/删除购物车 operType 操作类型 1-新增 2-减少
  addOrDelete(operType, product, isNorm) {
    let params = {
      "orderId": this.data.orderInfo.orderId,
      "productId": product.productId,
      "businessId": this.data.orderInfo.businessesId,
      "productName": product.productName,
      "productImage": product.productImage,
      "productPrice": product.productPrice,
      "productPercentPrice": product.productPercentPrice,
      "productDescribe": product.productDescribe,
      "operType": operType,
      "categoryId": product.categoryId,
      "formatFlag": product.formatFlag,
      "data": product.data,
      "userId": app.globalData.userInfo.userId,
      "diningNum": this.data.diningNum,
    }
    if(this.data.orderInfo.orderType == 0){
      delete params.userId
    }
    if(this.data.orderInfo.orderType == 2){
      delete params.orderId
    }
    addCart(params).then(res => {
      if (res.code == 200) {

        this.setData({
          constants: res.data.children,
          HZL_my_cat: res.data.productInfo,
          total: res.data.priceAmount,
          HZL_num: res.data.productNum,
          discountAmount: res.data.discountAmount,
          priceAmount: res.data.priceAmount,
          diningNum:res.data.diningNum
        })
        if (isNorm == 1) {
          this.getNormsList(2)
        }
      }
    })
  },

  //清空
  HZL_zero: function (e) {
    let params = {
      orderId: this.data.orderInfo.orderId,
      userId: app.globalData.userInfo.userId,
    }
    if(this.data.orderInfo.orderType == 0){
      delete params.userId
    }
    if(this.data.orderInfo.orderType == 2){
      delete params.orderId
    }
    console.log(params,999)
    delCart(params).then(res => {
      if (res.code == 200) {
        this.getCartList();
      }
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
  //加菜
  addDishes() {
    let that = this
    let orderId = that.data.orderInfo.orderId
    addToOrder(orderId).then(res => {
      if (res.code == 200) {
        clearInterval(timerTask);
        wx.showToast({
          title: '添加成功！',
          icon: 'success',
          duration: 1000
        })
        setTimeout(
          function () { //注意function这里不能缺少
            wx.redirectTo({
              url: '/pages/order/detail/index?orderId=' + orderId,
            })
          }, 2000)
      }
    })
  },


  //查询购物车
  getCartList() {
    let params = {
      "orderId": this.data.orderInfo.orderId,
      "businessId": this.data.orderInfo.businessesId,
      "userId": app.globalData.userInfo.userId,
    }
    // 扫码点餐 不需要userId
    if(this.data.orderInfo.orderType == 0){
      delete params.userId
    }
    // 外卖送餐
    if(this.data.orderInfo.orderType == 2){
      delete params.orderId
    }
    getCartInfo(params).then(res => {
      if (res.code == 200) {
        this.setData({
          constants: res.data.children,
          HZL_my_cat: res.data.productInfo,
          total: res.data.priceAmount,
          HZL_num: res.data.productNum,
          discountAmount: res.data.discountAmount,
          priceAmount: res.data.priceAmount,
          diningNum:res.data.diningNum
        })
      }
    })
  },

  //查询评论列表
  getComment() {
    let param = {
      "businessId": this.data.orderInfo.businessesId,
      // "pageNum": 1,
      // "pageSize": 9999
    }
    getCommentList(param).then(res => {
      if (res.code == 200) {
        this.setData({
          commont: res.rows
        })
      }
    })
  },

  //打开规则提示
  showRule: function (e) {
    var index = e.currentTarget.dataset.index; //当前下标
    var parentIndex = e.currentTarget.dataset.parentindex; //左侧下标
    this.setData({
      isRuleTrue: true,
      myindex: e.currentTarget.dataset.index,
      myparentIndex: e.currentTarget.dataset.parentindex,
      myuunum: this.data.constants[parentIndex].children[index].productNum,
      myCover_pic: this.data.constants[parentIndex].children[index].productlImage,
      myxianjia: this.data.constants[parentIndex].children[index].productPercentPrice,
      myyuanjia: this.data.constants[parentIndex].children[index].productPrice,

    })
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

  //是否显示下面的购物车
  HZL_isCat: function (e) {
    var that = this;
    if (that.data.HZL_isCat == 0 && that.data.HZL_num > 0) {
      that.setData({
        HZL_isCat: 1
      })
    } else if (that.data.HZL_isCat == 1 && that.data.HZL_num > 0) {
      that.setData({
        HZL_isCat: 0
      })
    }
  },

  //关闭
  HZL_isCat_close: function (e) {
    this.setData({
      HZL_isCat: 0
    })
  },


  // 增加
  HZL_jia: function (e) {
    var that = this
    var product = e.currentTarget.dataset.item; //当前id
    let operType = 1
    // that.addOrDelete(operType, product)
    // 抛物线动画
    this.parabolic_anima(e)
    this.startAnimation(e, product, 0);
  },

  //减少
  HZL_jian: function (e) {
    var product = e.currentTarget.dataset.item;
    let operType = 2
    this.addOrDelete(operType, product, 0)

    if (this.data.HZL_num == 0) {
      this.data.HZL_isCat = 0;
    } else {
      this.data.HZL_isCat = 1;
    }
  },

  // 下面购物车增加
  HZL_jia1: function (e) {
    var product = e.currentTarget.dataset.item;
    let operType = 1
    this.addOrDelete(operType, product, 0)
  },

  //下面购物车减少
  HZL_jian1: function (e) {
    var product = e.currentTarget.dataset.item;
    let operType = 2
    this.addOrDelete(operType, product, 0)
    if (this.data.HZL_num == 0) {
      this.data.HZL_isCat = 0;
    } else {
      this.data.HZL_isCat = 1;
    }
  },
  // 规格选择
  ChooseSpecification(e) {
    this.setData({
      flag: !this.data.flag
    })
    var productInfo = e.currentTarget.dataset.item;
    productInfo.formatTypeList = productInfo.format.children
    this.setData({
      curGoodsMap: productInfo,
      hasproductPercentPrice: productInfo.productPercentPrice,
      hasproductPrice: productInfo.productPrice
    })
  },
  // 规格弹窗
  choseColor: function (e) {
    var n = e.currentTarget.dataset.n
    var index = e.currentTarget.dataset.index
    var childitem = e.currentTarget.dataset.childitem
    var item = e.currentTarget.dataset.childitem.attributesName
    var dataId = e.currentTarget.dataset.childitem.dataId
    var self = this;
    var selectArr = self.data.selectArr
    var dataIds = self.data.dataIds
    var dataNorms = self.data.dataNorms
    var subIndex = self.data.subIndex
    var boxArr = self.data.boxArr

    if (selectArr[n] != item) {
      selectArr[n] = item;
      dataIds[n] = dataId;
      dataNorms[n] = childitem;
      subIndex[n] = index;
    } else {
      self.selectArr[n] = "";
      self.subIndex[n] = -1; //去掉选中的颜色
    }
    self.checkItem();
    // var arr = selectArr;
    // console.log(arr,'arr');
    // if (arr) {
    //   boxArr.attributesName = arr.attributesName;
    //   boxArr.productPrice = arr.productPrice;
    //   boxArr.dataId = arr.dataId;
    // }
    self.setData({
      selectArr: selectArr,
      subIndex: subIndex,
      dataNorms: dataNorms,
      dataIds: dataIds,
    })
    this.getNormsList(2)
  },
  checkItem() {
    var self = this;
    var curGoodsMap = self.data.curGoodsMap
    var option = self.data.curGoodsMap.formatTypeList;
    var result = []; //定义数组存储被选中的值
    for (var i in option) {
      result[i] = self.data.selectArr[i] ? self.data.selectArr[i] : "";
    }
    for (var i in option) {
      var last = result[i]; //把选中的值存放到字符串last去
      for (var k in option[i].item) {
        result[i] = option[i].item[k].attributesName; //赋值，存在直接覆盖，不存在往里面添加name值
        option[i].item[k].isShow = self.isMay(result); //在数据里面添加字段isShow来判断是否可以选择
      }
      result[i] = last; //还原，目的是记录点下去那个值，避免下一次执行循环时避免被覆盖
    }
  },

  isMay(result) {
    for (var i in result) {
      if (result[i] == "") {
        return true; //如果数组里有为空的值，那直接返回true
      }
    }
    return !this.data.shopItemInfo[result] ?
      false :
      this.data.shopItemInfo[result].stock == 0 ?
      false :
      true; //匹配选中的数据的库存，若不为空返回true反之返回false
  },
  // 加入购物车
  joinCar(e) {
    let product = this.data.curGoodsMap
    // 是否是规格购物车 0 否，1 是
    let isNorm = 0
    // 抛物线动画
    this.parabolic_anima(e)
    this.startAnimation(e, product, isNorm);
  },
  // 规格-购物车-加
  HZL_jiaG(e) {
    console.log(this.data.dataNorms, 'this.data.dataNorms');
    if (this.data.dataNorms.length > 0) {
      let norms = []
      this.data.dataNorms.forEach(el => {
        norms.push({
          attributesName: el.attributesName,
          productPrice: el.productPrice,
          dataId: el.dataId
        })
      })
      this.data.curGoodsMap.data = norms
      let product = this.data.curGoodsMap
      // 是否是规格购物车 0 否，1 是
      let isNorm = 1
      // 抛物线动画
      this.parabolic_anima(e)
      this.startAnimation(e, product, isNorm);
      this.setData({
        guigeCarNum: this.data.guigeCarNum + 1
      })
    } else {
      wx.showToast({
        title: '请先选择规格！',
        icon: 'none',
      })
    }
  },
  // 规格-购物车-减
  HZL_jianG: function (e) {
    if (this.data.dataNorms) {
      let norms = []
      this.data.dataNorms.forEach(el => {
        norms.push({
          attributesName: el.attributesName,
          productPrice: el.productPrice,
          dataId: el.dataId
        })
      })
      this.data.curGoodsMap.data = norms
      let product = this.data.curGoodsMap
      this.addOrDelete(2, product, 1)
      this.setData({
        guigeCarNum: this.data.guigeCarNum - 1
      })
    }
  },
  // 根据规格查询购物车 type:1 查询  2： 加价
  getNormsList(type) {
    let that = this
    let dataIds = []
    if (type == 1) {
      this.data.dataNorms.forEach(el => {
        dataIds.push({
          attributesName: el.attributesName,
          productPrice: 0,
          dataId: el.dataId
        })
      })
    } else {
      this.data.dataNorms.forEach(el => {
        dataIds.push({
          attributesName: el.attributesName,
          productPrice: el.productPrice,
          dataId: el.dataId
        })
      })
    }

    let params = {
      orderId: that.data.orderInfo.orderId,
      productId: that.data.curGoodsMap.productId,
      productPercentPrice: that.data.curGoodsMap.productPercentPrice,
      productPrice: that.data.curGoodsMap.productPrice,
      data: dataIds
    }
    let json = {
      json: JSON.stringify(params)
    }
    console.log(params, 'json');
    getNormsList(json).then(res => {
      if (res.code == 200) {
        if (res.data && Object.keys(res.data).length !== 0) {
          that.setData({
            guigeCarNum: res.data.productNum,
            hasproductPercentPrice: res.data.productPercentPrice,
            hasproductPrice: res.data.productPrice
          })
        } else {
          that.setData({
            guigeCarNum: 0,
            hasproductPercentPrice: this.data.curGoodsMap.productPercentPrice,
            hasproductPrice: this.data.curGoodsMap.productPrice
          })
        }
      }
    })
    console.log(this.data.guigeCarNum, 'guigeCarNum');
  },
  //取消事件
  _close() {
    // this.popup.hidePopup();
    this.setData({
      flag: !this.data.flag,
      hasChose: null,
      hasproductPercentPrice: null,
      hasproductPrice: null,
      selectArr: [],
      subIndex: [],
      guigeCarNum: 0,
      dataNorms: []
    })
  },
  // 计算高度
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
  // 抛物线动画
  parabolic_anima: function (e) {
    // 抛物线动画
    this.finger = {};
    var topPoint = {};
    // 点击点的坐标
    this.finger['x'] = e.touches["0"].clientX; //点击的位置
    this.finger['y'] = e.touches["0"].clientY;
    // 控制点的y的值在低的点的上方150处
    if (this.finger['y'] < this.busPos['y']) {
      topPoint['y'] = this.finger['y'] - 150;
    } else {
      topPoint['y'] = this.busPos['y'] - 150;
    }
    topPoint['x'] = Math.abs(this.finger['x'] - this.busPos['x']) / 2;
    // 控制点确保x在点击点和购物车之间
    if (this.finger['x'] > this.busPos['x']) {
      topPoint['x'] = (this.finger['x'] - this.busPos['x']) / 2 + this.busPos['x'];
    } else { //
      topPoint['x'] = (this.busPos['x'] - this.finger['x']) / 2 + this.finger['x'];
    }
    this.linePos = app.bezier([this.busPos, topPoint, this.finger], 30);
  },
  startAnimation: function (e, product, isNorm) {
    var index = 0,
      that = this,
      bezier_points = that.linePos['bezier_points'];
    // 设置球的初始位置
    this.setData({
      hide_good_box: false,
      bus_x: that.finger['x'],
      bus_y: that.finger['y']
    })
    var len = bezier_points.length;
    index = len
    this.timer = setInterval(function () {
      for (let i = index - 1; i > -1; i--) {
        that.setData({
          bus_x: bezier_points[i]['x'],
          bus_y: bezier_points[i]['y']
        })
        // 到最后一个点的时候，开始购物车的一系列变化，并删掉定时器 隐藏小球
        if (i < 1) {
          clearInterval(that.timer);
          that.addOrDelete(1, product, isNorm);
          that.setData({
            hide_good_box: true
          })
        }
      }
    }, 25);
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
  onUnload: function () {
    clearInterval(timerTask);
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(timerTask);
  },

  // 就餐人数
  onChange(event) {
    let item = event.currentTarget.dataset.item
    this.setData({
     diningNum: event.detail
    })
    this.setData(this.data)
    let params = {
      tableId: item.tableId,
      diningNum: event.detail,
      orderId: item.orderId
    }
    addDiningNum(params).then(res => {
      if (res.code == 200) {
        this.getCartList()
      }
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
    // wx.showLoading({
    //   title: '加载中...',
    //   mask: true
    // })
    wx.createSelectorQuery().in(this).selectAll('.product-body__chunk').boundingClientRect((rects) => {
      wx.hideLoading()
      let scrollTopList = []
      let acc = rects.map(item => item.height).reduce(function (accumulator, currentValue) {
        scrollTopList.push(accumulator)
        return accumulator + currentValue
      }, 0)
      scrollTopList.push(acc)
      // console.log('scrollTopList', scrollTopList)
      // console.log('getProductChunkRectsAndScrollTop', rects)
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
