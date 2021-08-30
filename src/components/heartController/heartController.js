var HeartController = function () {
  this.singleTimer = null
  this.intervalTimer = null
  return this
}
HeartController.prototype = {
  heartInterval: function (num, socket, fn, interval) {
    var that = this
    return function () {
      // 心跳超时处理
      if (num === 0) {
        if (socket.readyState === 1) {
          socket.close()
        }
      } else {
        if (socket.readyState === 1) {
          that.intervalTimer = setTimeout(that.heartInterval(num - 1, socket, fn, interval), interval)
          fn(socket)
        }
      }
    }
  },
  startHeartBeat: function (socket, fn, interval, immediately = false) {
    if (immediately) {
      fn(socket)
      return
    }
    if (!this.singleTimer) {
      // 30s 超时
      this.singleTimer = setTimeout(this.heartInterval(2, socket, fn, interval), interval)
      return this
    }
  },
  resetHeartBeat: function () {
    clearTimeout(this.singleTimer)
    clearTimeout(this.intervalTimer)
    this.singleTimer = null
    this.intervalTimer = null
    return this
  }
}
export default HeartController
