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
    let _x;
    for (_x in this.value) {
      _result = `${_result}+ ${_x} \\cdot \\frac{${this.frac()}}{${this.frac()}} \\\\`;
    }
    _result = _result.replace("+", "f(x) =");
    _result = `\\begin{align}${_result}\\end{align}`;
    return _result;
  }
  //分母与分子的生成函数
  //bool=true时为分子，反之为分母
  frac(bool, n) {
    let _result = "";
    let _key = _.without(this.key, n);
    let _x;
    for (_x in _key) {
      if (bool) {
        _result = `${_result}(x-${_x})`;
      } else {
        _result = `${_result}(${n}-${_x})`;
      }
    }
    return _result;
  }
  //检查函数值是否重复
};
