import _ from "lodash";

export default class homo {
  kv = [];
  key = [];
  value = [];
  constructor(_kv) {
    this.kv = _kv;
  }
  //生成Latex公式
  createLatex() {
    this.key = _.map(this.kv, (_arr) => _arr[0]);
    this.value = _.map(this.kv, (_arr) => _arr[1]);
    let _result = "";
    let that = this;
    _(this.value).forEach((value) => {
      _result = `${_result}+ ${value} \\cdot \\frac{${that.frac(
        true,
        value
      )}}{${that.frac(false, value)}} \\\\ \n`;
    });
    _result = _result.replace("+", "f(x) =");
    _result = `\\begin{align*} \n ${_result}\\end{align*}`;
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
  validate() {
    return !Array.isArray(this.kv)
      ? false
      : _.isEmpty(this.kv)
      ? false
      : !this.validatorFx()
      ? false
      : this.validatorDiff();
  }
  //检测子数组是否含有两个元素
  validatorFx() {
    return _.every(this.kv, (value) => {
      return _.size(value) == 2;
    });
  }
  //检测key的值是否有重复
  validatorDiff() {
    let _key = _.map(this.kv, (_arr) => _arr[0]);
    return _.isEqual(_key, _.uniq(_key));
  }
}
