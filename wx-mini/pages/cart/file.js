Page({
  data: {
    timer : '',
  },
  /**
   * 启动定时器
   */
  startTimer : function(){
    var that = this;
    that.data.timer = setTimeout(
        function () {
            // TODO 你需要执行的任务
            console.log('startTimer  500毫秒后执行一次任务')
        }, 500);    
  },
  /**
   * 结束定时器
   */
  endTimer: function(){
    var that = this;
    clearTimeout(that.data.timer)
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.endTimer()
  },
})