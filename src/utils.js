/**
 * 打印函数跟踪日志的装饰器
 * @param {*} target 
 * @param {*} name 
 * @param {*} descriptor 
 */
 export function tracelog(target, name, descriptor) {
  var oldValue = descriptor.value;
  descriptor.value = function() {
    let argString = "";
    for (let i = 0; i < arguments.length; i++) {
      if (argString) {
        argString += ", " + JSON.stringify(arguments[i])
      } else {
        argString += JSON.stringify(arguments[i])
      }
    }

    if (argString) {
      logger.trace(`${name}: ` + argString);
    } else {
      logger.trace(`"${name}"`);
    }
    
    return oldValue.apply(this, arguments);
  };

  return descriptor;
}