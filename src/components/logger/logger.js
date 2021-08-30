/**
 * 自定义日志输出，主要是添加时间
 */
class Logger {
  /**
   * state级别日志，状态机专用
   * @param {*} data 
   */
  state(data) {
    console.info("%c" + this._getFormatter() + " " + data, "color: #FF6347");
  }

  /**
   * trace级别日志
   * @param {*} data 
   */
  trace(data) {
    console.info("%c" + this._getFormatter() + " " + data, "color: #008080");
    //console.info((new Error("backtrace")).stack);
  }

  /**
   * info级别日志
   * @param {*} data 
   */
  info(data) {
    console.info(this._getFormatter() + " " + data);
    //console.info((new Error("backtrace")).stack);
  }

  /**
   * warn级别日志
   * @param {*} data 
   */
  warn(data) {
    console.warn(this._getFormatter() + " " + data);
  }

  /**
   * error级别日志
   * @param {*} data 
   */
  error(data) {
    console.error(this._getFormatter() + " " + data);
  }

  /**
   * info级别日志别名
   * @param {*} data 
   */
  log(data) {
    this.info(data);
  }

  /**
   * 获取格式化时间
   */
  _getFormatter() {
    return this._dateFormat("[YY-MM-DD HH:mm:SS.sss]");
  }

  /**
   * 时间格式化
   * @param {*} fmt 
   */
  _dateFormat(fmt) {
    let date = new Date();
    const opt = {
      "Y+": date.getFullYear().toString(),        // 年
      "M+": (date.getMonth() + 1).toString(),     // 月
      "D+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "m+": date.getMinutes().toString(),         // 分
      "S+": date.getSeconds().toString(),         // 秒
      "s+": date.getMilliseconds().toString()     // 毫秒
    };
    for (let k in opt) {
        let regexp = new RegExp("(" + k + ")").exec(fmt);
        if (regexp) {
          fmt = fmt.replace(regexp[1], (regexp[1].length == 1) ? (opt[k]) : (opt[k].padStart(regexp[1].length, "0")))
        };
    };
    return fmt;
  }  
}

export default new Logger();