### 使用说明
1. HstWebsocket MsgDispatcher
```js
import { HstWebSocket, MsgDispatcher } from 'hst-utils'
let msgDispatcher = new MsgDispatcher({protocolAttr: 'id'}) // 协议id
msgDispatcher.addMsgHandler(10001, () => {});
msgDispatcher.addMsgHandler(10002, () => {});
let options = {
  addrUrl: ['ws://******'],
  handler: store.msgDispatcher, //触发消息回调 onMessage
  opened() { self.onWebSocketOpened(); },
  closed() { self.onWebSocketClosed(); },
  error() { self.loginFailed("Websocket error!"); }
};
store.websocket = new HstWebSocket(options);

```
2. logger 根据时间点打印日志
```js
  logger.log
  logger.trace
  logger.warn
  logger.error
```
3. tracelog class函数打印装饰器
4. HeartController 心跳控制器
```js
const heartController = new HeartController()
  // 发送心跳
  /**
   * parmas: {
   * websocket: websocket实例
   * callback: 发送心跳消息回调
   * timer: 心跳间隔时间
   * immediately: 是否立即发送 false 
   * }
   **/
  heartController.resetHeartBeat().startHeartBeat(store.websocket.socket, () => {
    protocolSender.sendHeartPacket();
  }, 10000); //收到心跳回复消息后 重启启动心跳 

  // 重置上一次心跳 
  heartController.resetHeartBeat()
```
