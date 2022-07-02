<template>
  <v-app>
    <v-main> </v-main>
  </v-app>
</template>

<script>
import "katex/dist/katex.min.css";

export default {
  name: "App",
  data: () => ({
    kv: Array,
  }),
  computed: {
    //自动生成Latex公式
    latex: {},
  },
  watch: {
    kv: {
      handler(newValue) {
        localStorage.setItem("kv", JSON.stringify(newValue));
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
