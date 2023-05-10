// import JSEncrypt from 'jsencrypt' //rsa
import CryptoJS from 'crypto-js' //aes
import store from '@/store';
import JSEncrypt from '@/utils/encrypt'

// sm4 加密
function sm4Encrypt(content) {
  let key = process.env.VUE_APP_SM4_KEY
  // 不存在rsaKey直接返回
  if (!key) {
    return content
  }
  const SM4 = require('sm-crypto').sm4
  return SM4.encrypt(content,key);
}

// sm4 解密
function sm4Decrypt(content) {
  let key = process.env.VUE_APP_SM4_KEY
  if (!key) {
    return content
  }
  const SM4 = require('sm-crypto').sm4
  return SM4.decrypt(content,key);
}

// sm3签名
function sm2Sign(word) {
  let prikey = process.env.VUE_APP_PRI_KEY
  if (!prikey) {
    return word
  }
  const SM2 = require('sm-crypto').sm2

  return SM2.doSignature(word,prikey);
}

// sm3验签
function sm2VerifySign(word, signStr) {
  let pubKey = process.env.VUE_APP_SERVER_PUB_KEY
  // 不存在rsaKey直接返回
  if (!pubKey) {
    return word
  }
  const SM2 = require('sm-crypto').sm2
  return SM2.doVerifySignature(word,signStr,pubKey);
}

// 解密响应
function decryptData(res,) {
  console.log("进行解密-------",res.data)
  let data = res.data.data || Object.assign({}, res.data)

  let datade = data.enData ? JSON.parse(sm4Decrypt(data.enData)) : data
  //配置签名情况下，若返回失败信息可以不验签
  if (process.env.VUE_APP_SIGN == 'true' && datade.code==200 && (!data.sign || !sm2VerifySign(JSON.stringify(datade), data.sign))) {
    console.error('decryptData', res, "验签失败！")
    res.data = {msg:"验签失败！"}
    return
  }
  res.data = datade
  console.log("完成解密-------",res.data)
}

function verifySign(res) {
  console.log("进行验签-------")
  // debugger
  let data =  Object.assign({}, res.data)
  if (!data.sign) {
    console.error('verifySign', res, "验签失败！")
    res.data = {msg:"验签失败！"}
  }

  let sign = data.sign
  delete data.sign
  if (sm2VerifySign(JSON.stringify(data), sign)) {
    res.data = data
    return
  }
  data =  Object.assign({}, res.data)
  data.sign = null
  if (sm2VerifySign(JSON.stringify(data), sign)) {
    res.data = res.data
    return
  }
  console.error('verifySign', res, "验签失败！")
  res.data = {msg:"验签失败！"}
}

function sign(config,paramDataStr) {
  let dataStr = paramDataStr || JSON.stringify(config.data)
  console.log("正在签名-------",dataStr)
  let sign = sm2Sign(dataStr)
  config.data.sign = sign
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
  let enData = sm4Encrypt(orStr)
  config.data = {
    enData: enData,
  }
  sign(config,orStr)
  // console.log(config)
}

//解密验签方法
function decryptVerifySign(res){
  let data = Object.assign({}, res)

  let datade = (process.env.VUE_APP_ENCRYPTION == 'true' && data.enData) ? JSON.parse(sm4Decrypt(data.enData)) : data
  //配置签名情况下，若返回失败信息可以不验签
  if (process.env.VUE_APP_SIGN == 'true' && datade.code==200 && (!data.sign || !sm2VerifySign(JSON.stringify(datade), data.sign))) {
    console.error('decryptData', res, "验签失败！")
    return {code: 500,msg:"验签失败！"}
  }
  return datade
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


// rsa 加密
function rsaEncrypt(content) {
  let key = store.state.user.rKey
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
  let key = store.state.user.rKey
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


export default { encryptData, decryptData, verifySign, sign, decryptVerifySign }
