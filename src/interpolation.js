export default class interpolation {
  kv = [];
  key = [];
  value = [];
  constructor(_kv) {
    //将Vue数据进行初步处理
    this.kv = _kv.map((_arr) => [_arr.k, _arr.v]);
  }
  //生成Latex公式
  createLatex() {
    //当数组为空的情况
    if (this.kv.length === 0) {
      return "No \\quad data \\quad inputs";
    }
    //当数组只有一个值的情况
    if (this.kv.length === 1) {
      return `\\begin{align*} \n f(x) = ${this.kv[0][1]} \n \\end{align*}`;
    }
    let _result = "";
    this.key = this.kv.map((_arr) => _arr[0]);
    this.value = this.kv.map((_arr) => _arr[1]);
    let that = this;
    this.value.forEach((value) => {
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
    let _except_key = this.key[this.value.indexOf(_except_value)];
    let _key = this.key.filter((k) => k !== _except_key);
    _key.forEach((value) => {
      value < 0 ? (value = `+${-value}`) : (value = `-${value}`);
      bool
        ? (_result = `${_result}(x${value})`)
        : (_result = `${_result}(${_except_key}${value})`);
    });
    return _result;
  }
  //检查数组是否符合处理规范
  validate() {
    return !Array.isArray(this.kv)
      ? false
      : !this.validatorFx()
      ? false
      : this.validatorDiff();
  }
  //检测子数组数据类型是否为有限数字
  validatorFx() {
    return this.kv.every((value) => {
      return Number.isFinite(value[0]) && Number.isFinite(value[1]);
    });
  }
  //检测key的值是否有重复
  validatorDiff() {
    let _key = this.kv.map((_arr) => _arr[0]);
    let uniqueKey = [...new Set(_key)];
    return _key.length === uniqueKey.length && _key.every((k, i) => k === uniqueKey[i]);
  }
}
