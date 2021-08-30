import logger from "../logger/logger"

/**
 * 对原生websocket的封装  暂不支持多个地址的断线重连
 */
class HstWebSocket {
  constructor(options) {
    this.socket = {};
    this.addrUrl = options.addrUrl;
    this.proxyIndex = 0;
    this.isShowLog = true;
    this.handler = options.handler;
    this.opened_hook = options.opened || function() {}; // socket握手成功钩子
    this.closed_hook = options.closed || function() {}; // socket链接断开钩子
    this.error_hook = options.error || function() {};
    this.loggerConfig = options.loggerConfig || {
      level: 'log',
      excludeList: [], // 排除打印协议号列表
      protocolAttr: 'id'
    };
    this.limitConnect = this.getTimer();
    this.connectStatus = true
    this.reconnectNum = 0
    this._createWebsocket();
    return this;
  }

  /**
   * 创建websocket
   */
  _createWebsocket() {
    if (!(this.addrUrl instanceof Array)) {
      throw new Error("value is not Array");
    }
    if (this.proxyIndex < this.addrUrl.length) {
      var serverUrl = this.addrUrl[this.proxyIndex];
      this.socket = new WebSocket(serverUrl);
      this.proxyIndex++
      this._eventBind(this.socket);
    } else {
      logger.error("Unexpected WssUrl!");
    }
  }

  /**
   * 绑定事件处理
   * @param {*} socket 
   */
  _eventBind(socket) {
    let _self = this;
    if (socket) {
      socket.onopen = function(event) {
        _self.opened_hook.apply(this, arguments);
      };
      socket.onmessage = event => {
        let msg = null
        try {
          msg = JSON.parse(event.data);
        } catch (er) {
          this.error_hook && this.error_hook({code: -1,reason: 'data parse error', data: msg})
          return
        }
        if (this.loggerConfig.excludeList.indexOf(msg[this.loggerConfig.protocolAttr]) === -1) { // 白板心跳消息太多了
          logger[this.loggerConfig.level]("===> Recv msg from " + this.addrUrl + ": " + event.data);
        }
        this.handler.onMessage(msg, _self);
      };
      socket.onclose = function(event) {
        logger.log("WebSocket closed: " + _self.addrUrl);
        if(_self.proxyIndex < _self.addrUrl.length) {
          // _self.proxyIndex++
          _self._createWebsocket();
        } else {
          _self.closed_hook.apply(this, arguments);
        }
      };
      socket.onerror = err => {
        logger.warn(err);
        _self.error_hook.apply(this, arguments);
        if (this.socket !== undefined) {
          this.socket.close();
        }
      }
    }
  }
  
  /**
   * 重连处理
   */
  reconnect () {
    if (!this.connectStatus) return
    this.reconnectNum ++
    this.proxyIndex = 0 // 重置
    this._createWebsocket()
  }

  /**
   * 获取原生websocket
   */
  getSocket() {
    if (this.socket && this.socket.readyState === 1) {
      return this.socket;
    }
    return null;
  }

  /**
   * 暂时没使用
   */
  getTimer() {
    var timerArray = [];
    return function(fn) {
      timerArray.push(new Date().getTime());
      var timer = new Date().getTime();
      if (timer - timerArray[0] > 5000) {
        timerArray = [];
        fn.apply(this, arguments);
      }
    };
  }
  connectStatus (value) {
    this.connectStatus = value
  }
  /**
   * 暂时没使用
   * @param {*} val 
   */
  setAddr(val) {
    if (!(val instanceof Array)) {
      throw new Error("value is not Array");
    }
    this.addrUrl = val;
    this.proxyIndex = 0;
    this.createWebsocket();
  }

  /**
   * 发送消息
   * @param {*} msg 
   */
  send(msg) {
    if (this.socket && this.socket.readyState === 1) {
      if (msg !== '{}') { // 心跳包不打印
        logger.log("<=== Send msg to " + this.addrUrl + ": " + msg);
      }
      this.socket.send(msg);
    } else {
      logger.log("Send msg failed! msg: ", msg);
    }
  }

  /**
   * 关闭websocket
   */
  close() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export default HstWebSocket;
