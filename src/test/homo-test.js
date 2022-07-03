const homo = require("./homo-lib");

const kv = [
  [1, 1],
  [2, 2],
  [3, 3],
  [4, 4],
  [5, 114514],
];

const Homo = new homo(kv);
console.log(Homo.createLatex());
