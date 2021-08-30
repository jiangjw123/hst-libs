
import logger from "../logger/logger";

/**
 * 消息分发器
 */
class MsgDispatcher {
  constructor({protocolAtrr}) {
    this.protocolAtrr = protocolAtrr || 'id'
    this.handlerMap = new Map();
  }

  /**
   * 添加消息处理器
   * @param {*} msgId 
   * @param {*} handler 
   */
  addMsgHandler(msgId, handler) {
    if (!this.handlerMap[msgId]) {
      this.handlerMap[msgId] = handler;
    } else {
      logger.error("Message: " + msgId + " handler already exists!");
    }
  }

  /**
   * 移除消息处理器
   * @param {*} msgId 
   */
  removeMsgHandler(msgId) {
    if (this.handlerMap[msgId]) {
      this.handlerMap.delete(msgId);
    } else {
      logger.error("Cannot find message handler: " + msgId);
    }
  }

  /**
   * 移除所有处理器
   */
  clearMsgHandler() {
    this.handlerMap = new Map();
  }

  /**
   * 消息处理
   * @param {*} data 
   * @param {*} socket 
   */
  onMessage(msg, socket) {
    try {
      if (msg[this.protocolAtrr]) {
        if (this.handlerMap[msg[this.protocolAtrr]]) {
          this.handlerMap[msg[this.protocolAtrr]](msg, socket);
        } else {
          logger.warn("No handler for msg: " + msg.id);
        }
      } else {
        logger.error("Unexpected!!!");
      }
    } catch (e) {
     console.error(e) 
    }
  }
}

export default MsgDispatcher;

