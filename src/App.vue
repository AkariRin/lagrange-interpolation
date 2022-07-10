<template>
  <v-app>
    <v-app-bar app flat>
      <v-app-bar-title>恶臭函数生成器</v-app-bar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="2" offset="2">
            <v-btn @click="add">添加</v-btn>
            <v-btn @click="clear">清空</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8" offset="2">
            <Fx v-for="kv in kv" :key="kv[0]" :kv="kv"></Fx>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8" offset="2">
            <div id="latex"></div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer padless>
      <v-col cols="12" class="text-center">homo-functions - 梦清 </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import homo from "./homo";
import Fx from "./components/Fx";
import katex from "katex";
import "katex/dist/katex.min.css";

export default {
  name: "App",
  data: () => ({
    kv: [
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
      [5, 114514],
    ],
    latex: String,
  }),
  components: {
    Fx,
  },
  watch: {
    kv: {
      handler(newValue) {
        localStorage.setItem("kv", JSON.stringify(newValue));
        //同步更改Latex渲染内容
        let _latex = new homo(newValue);
        this.latex = _latex.createLatex();
        //katex渲染出错
        katex.render(this.latex, document.getElementById("latex"), {
          displayMode: true,
        });
      },
      deep: true,
      //immediate无效，localstorage无效
      immediate: true,
    },
  },
  methods: {
    add() {},
    clear() {
      this.kv = [[1, 1]];
    },
  },
  beforeCreate() {
    //从本地加载kv数据
    localStorage.getItem("kv") == null
      ? localStorage.setItem("kv", JSON.stringify(this.kv))
      : (this.kv = localStorage.getItem("kv"));
  },
};
</script>
