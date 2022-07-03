<template>
  <v-app>
    <v-main> </v-main>
  </v-app>
</template>

<script>
import homo from "./homo";

import "katex/dist/katex.min.css";

export default {
  name: "App",
  data: () => ({
    kv: Array,
    latex: String,
  }),
  watch: {
    kv: {
      handler(newValue) {
        localStorage.setItem("kv", JSON.stringify(newValue));
        //同步更改Latex渲染内容
        let _latex = new homo(this.kv);
        this.latex = _latex.createLatex();
      },
      deep: true,
    },
  },
  beforeMount() {
    //从本地加载kv数据
    if (localStorage.getItem("kv") != null) {
      localStorage.setItem("kv", JSON.stringify(this.kv));
    }
  },
};
</script>
