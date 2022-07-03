import _ from "lodash";

module.exports = class homo {
  key = [];
  value = [];
  constructor(_kv) {
    this.key = _.map(_kv, (_arr) => _arr[0]);
    this.value = _.map(_kv, (_arr) => _arr[1]);
  }
  //生成Latex公式
  createLatex() {
    let _result = "";
    let that = this;
    _(this.value).forEach((value) => {
      _result = `${_result}+ ${value} \\cdot \\frac{${that.frac(
        true,
        value
      )}}{${that.frac(false, value)}} \\\\ \n`;
    });
    _result = _result.replace("+", "f(x) =");
    _result = `\\begin{align} \n ${_result}\\end{align}`;
    return _result;
  }
  //分母与分子的生成函数
  //bool=true时为分子，反之为分母
  frac(bool, _except_value) {
    let _result = "";
    let _except_key = this.key[_.indexOf(this.value, _except_value)];
    let _key = _.without(this.key, _except_key);
    _(_key).forEach((value) => {
      bool
        ? (_result = `${_result}(x-${value})`)
        : (_result = `${_result}(${_except_key}-${value})`);
    });
    return _result;
  }
  //检查数组是否符合处理规范
};
