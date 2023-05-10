//app.js
import locales from './i18n/i18n'
import {
  initPage,
  onPageLoad
} from './utils/page'
import request from './utils/request'
import util from './utils/util'

App({
  onLaunch: function () {
    // 获取语言
    const locale = wx.getStorageSync('rKey',"990a516aea1cf6ef1549de9766e30702")
    if (locale) {
      this.T = locales[locale]
    } else { // 默认语言为中文
      this.T = locales.zh
    }
    // 重构Page对象
    initPage(this)
  },
  // 设置语言
  setLocale(locale) {
    // 保存语言到本地存储，以后打开不需要重新设置
    wx.setStorageSync('locale', locale)
    this.T = locales[locale]
    // 重新设置title和T
    onPageLoad(this)
  },
  // 获取当前语言
  getLocale() {
    return wx.getStorageSync('locale') || 'zh'
  },
  // 挂载全局request，使用app.request 替代wx.request
  ...request,
  // 挂载全局工具类
  ...util,
  // api: [...api],
  setToken(token) {
    wx.setStorageSync('token', token)
  },
  getToken() {
    return wx.getStorageSync('token')
  },
  setCode(code) {
    wx.setStorageSync('code', code)
  },
  getCode() {
    return wx.getStorageSync('code')
  },
  setUserInfo(userInfo){
    wx.setStorageSync('userInfo', userInfo)
  },
  getUserInfo(){
    return wx.getStorageSync('userInfo')
  },
  /**
 * 获取小球运动的轨迹点
 * @param {Object} pots   三个控制点
 * @param {Number} amount 选中点的个数
 * @returns
 */
  bezier: function (pots, amount) {
    var pot;
    var lines;
    var ret = [];
    var points;
    for (var i = 0; i <= amount; i++) {
      points = pots.slice(0);
      lines = [];
      while (pot = points.shift()) {
        if (points.length) {
          lines.push(pointLine([pot, points[0]], i / amount));
        } else if (lines.length > 1) {
          points = lines;
          lines = [];
        } else {
          break;
        }
      }
      ret.push(lines[0]);
    }
    function pointLine(points, rate) {
      var pointA, pointB, pointDistance, xDistance, yDistance, tan, radian, tmpPointDistance;
      var ret = [];
      pointA = points[0];//点击
      pointB = points[1];//中间
      xDistance = pointB.x - pointA.x;
      yDistance = pointB.y - pointA.y;
      pointDistance = Math.pow(Math.pow(xDistance, 2) + Math.pow(yDistance, 2), 1 / 2);
      tan = yDistance / xDistance;
      radian = Math.atan(tan);
      tmpPointDistance = pointDistance * rate;
      ret = {
        x: pointA.x + tmpPointDistance * Math.cos(radian),
        y: pointA.y + tmpPointDistance * Math.sin(radian)
      };
      return ret;
    }
    return {
      'bezier_points': ret
    };
  },
  // 是否开启logger
  loggerEnable: true,
  // 是否开启加密
  encryption: false,
  // 非加密是否验签
  sign: false,
  // 加密握手url
  encryptionHandUrl: '/encryptionHandUrl',
  globalData: {
    userStatus:null, //是否登录 0否 1是
    userInfo: null,
    storeInfo: null, //商店信息
    openid: null,
    root: null,
    roleName: null,
    isCertification: false,
    phone: null,
    user_name: null,
    isAccredit: false,
    communityId: '',
    // prem:['service:repair:list','cost:bills:list'],
    // mapKey: 'SKZBZ-2L26W-YWMRQ-R4VBO-N3LFF-3OBJD', // ejak: pvf34ZOLtbmScvCokIbBlvAGR4fRzHEI  icbcak: MpABadeAAeuGSPtPhhg303DAcVNEQH7x
    // mapKey:'Q4SBZ-HR3E6-E7HS3-ETQXZ-PLGIO-BIF7O',
    mapKey:'7JVBZ-D3CK2-AZGUA-CTKAM-BQW7Q-P7BP7', //工行
    latitude:null,
    longitude:null,
    //图片访问地址
    // imgUrl:'https://icbc.nyaqlove.cn/minio/order/'
    // imgUrl: 'https://order.ynejkj.com/api/order/image/preview?fileName=',
    // 工行
    imgUrl: 'https://yn.icbc.com.cn/corp/api2/redc/image/preview?fileName=',
    // 图片上传地址
    // imgUpload: 'https://order.ynejkj.com/api/order/image/upload'
    // 工行
    imgUpload: 'https://yn.icbc.com.cn/corp/api2/redc/image/upload'
  }
})

// api需要等待app初始化完成
getApp().api = require('./api/api').default
