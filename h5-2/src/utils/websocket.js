// 提示信息
import { Toast } from 'vant';
import { getToken } from '@/utils/auth'
let url = `${process.env.VUE_APP_SOCKET_API}`

let token = getToken()

let ws
let tt
let lockReconnect = false //避免重复连接
let tableId = '' //cookies中获取token值
let type = ''

let websocket = {
    // 建立连接
    Init: function (id,type) {
        tableId = id
        type = type
        let urlStr = `${url}${tableId}/${type}` //?Authorization=${token} /${type}
        if ('WebSocket' in window) {
            ws = new WebSocket(urlStr,[token])
6        } else if ('MozWebSocket' in window) {
            ws = new MozWebSocket(urlStr)
        } else {
            console.log('您的浏览器不支持 WebSocket!')
            return
        }
        // websocket 生命周期根据websocket状态自己会执行
        // websocket 成功 失败 错误 断开 这里会自动执行
        // 这个方法后端通过send调用 这个方法会执行和接收参数
        ws.onmessage = function (e) {
            // console.log('接收消息:' + e.data)
            // heartCheck.start()
            if (e.data == 'ok') {
            //心跳消息不做处理
            return
            }

        }
        ws.onclose = function () {
            console.log('连接已关闭')
            // Toast({
            //     message: '连接已关闭',
            //     type: 'error'
            // })
            // reconnect(tableId)
        }
        ws.onopen = function () {
            console.log('连接成功')
            // Toast({
            //     message: '连接成功',
            //     type: 'success'
            // })
            // heartCheck.start()
        }

        ws.onerror = function (e) {
            console.log('数据传输发生错误')
            reconnect(tableId, type)
        }
    },
    // 我们单独写了一个方法 调用ws的关闭方法，这样就可以在退出登录的时候主动关闭连接
    //关闭连接
    onClose: function () {
        console.log('主动关闭连接！')
        //关闭websocket连接和关闭断开重连机制
        lockReconnect = true
        // 调用 上面的websocket关闭方法
        ws.close()
    },
    // 前端的send给后端发信息
    Send: function (data) {
        let msg = JSON.stringify(data)
        // console.log('发送消息：' + msg)
        ws.send(msg)
    },
    // 返回ws对象
    getWebSocket () {
        return ws
    },
    // websocket 自带的状态码意思提示
    getStatus () {
        if (ws.readyState == 0) {
            return '未连接'
        } else if (ws.readyState == 1) {
            return '已连接'
        } else if (ws.readyState == 2) {
            return '连接正在关闭'
        } else if (ws.readyState == 3) {
            return '连接已关闭'
        }
    }
}

// 刷新页面后需要重连 
// if (window.performance.navigation.type == 1 && tableId != null) {
//     //刷新后重连
//     // reconnect(tableId);
//     console.log(11111111)
//     websocket.Init(tableId, type)
//     //如果websocket没连接成功，则开始延迟连接
//     if (ws == null) {
//         console.log(3333333)
//         reconnect(tableId, type)
//     }
// }

export default websocket

// 重连方法 刷新页面 连接错误 连接关闭时调用
function reconnect (tableId, type){
    if (lockReconnect) {
        return
    }
    console.log(111)
    lockReconnect = true
    //没连接上会一直重连，设置延迟避免请求过多
    tt && clearTimeout(tt)
    tt = setTimeout(function () {
        // console.log('执行断线重连...')
        websocket.Init(tableId, type)
        lockReconnect = false
    }, 3000)
}

//心跳检测 跟后端是对应的 会进行处理
// 连接成功 和后端推消息时调用
// let heartCheck = {
//   timeout: 1000 * 60 * 3,
//   timeoutObj: null,
//   serverTimeoutObj: null,
//   start: function () {
//    // console.log('开始心跳检测')
//   let self = this
//    this.timeoutObj && clearTimeout(this.timeoutObj)
//    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
//    this.timeoutObj = setTimeout(function () {
//  //这里发送一个心跳，后端收到后，返回一个心跳消息，
//  //onmessage拿到返回的心跳就说明连接正常
//   // console.log('心跳检测...')
//  ws.send('HeartBeat:' + tableId)
//   self.serverTimeoutObj = setTimeout(function () {
//   if (ws.readyState != 1) {
//   ws.close()
//   }
//   // createWebSocket();
//   }, self.timeout)
//    }, this.timeout)
//   }
// }
