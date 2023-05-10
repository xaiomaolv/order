// import JSEncrypt from 'jsencrypt' //rsa
import CryptoJS from 'crypto-js' //aes
import store from '@/store';
import JSEncrypt from '@/utils/encrypt'

const RKey = process.env.VUE_APP_KEY + '-' + 'rKey'
// rsa 加密
function rsaEncrypt(content) {
  let key = RKey
  // 不存在rsaKey直接返回
  if (!key) {
    return content
  }
  let jsencrypt = new JSEncrypt()
  jsencrypt.setPublicKey(key)
  return jsencrypt.encrypt(content)
}

// rsa 解密
function rsaDecrypt(content) {
  let key = RKey
  if (!key) {
    return content
  }
  let decrypt = new JSEncrypt()
  decrypt.setPublicKey(key)
  return decrypt.decrypt(content)
}

// aes加密
function aesEncrypt(word, key) {
  key = CryptoJS.enc.Utf8.parse(key)
  let encrypted = CryptoJS.AES.encrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.toString();
}

// aes解密
function aesDecrypt(word, key) {
  key = CryptoJS.enc.Utf8.parse(key)
  let decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

// 解密响应
function decryptData(res) {
  let data = res.data
  if (data.aKey) {
    let aKey = rsaDecrypt(data.aKey)
    let dataStr = aesDecrypt(data.enData, aKey)
    if (data.sign != CryptoJS.SHA256(dataStr).toString()) {
      console.error(res, "验签失败！")
      res.data = {}
    }
    res.data = JSON.parse(dataStr)
  }
  // 此处，处理表格数据
  if (data.data && data.data.aKey) {
    let aKey = rsaDecrypt(data.data.aKey)
    let dataStr = aesDecrypt(data.data.enData, aKey)
    if (data.data.sign != CryptoJS.SHA256(dataStr).toString()) {
      console.error(res, "验签失败！")
      res.data = {}
    }
    res.data = JSON.parse(dataStr)
  }
}

// 加密请求
function encryptData(config) {
  // 测试代码
  // let aKey = "1234567890123456"
  // let originStr = "hello soil!"
  // let enStr = "Y/b+1kNLSxoHyAp+xwaH2w==";
  // let enDataStr = aesDecrypt(enStr, aKey)
  // let deDataStr = aesEncrypt(originStr, aKey)
  // console.log(enStr, enDataStr)
  // console.log(originStr, deDataStr)

  let orStr = JSON.stringify(config.data)
  let aKey = randomAesKey()
  let enData = aesEncrypt(orStr, aKey)
  config.data = {
    aKey: aKey,
    enData: enData,
    sign: CryptoJS.SHA256(orStr).toString()
  }
  console.log(config)
}


// 随机aeskey
function randomAesKey() {
  let len = 16
  //默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
  let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  let tempLen = chars.length, tempStr = '';
  for (var i = 0; i < len; ++i) {
    tempStr += chars.charAt(Math.floor(Math.random() * tempLen));
  }
  return tempStr;
}


export default { encryptData, decryptData }