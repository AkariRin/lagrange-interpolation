<template>
  <v-app>
    <v-app-bar app flat color="red" dark>
      <v-app-bar-title>恶臭函数生成器</v-app-bar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-snackbar
          v-model="copySuccess"
          timeout="2000"
          top
          absolute
          color="success"
          transition="scroll-y-transition"
        >
          已复制Latex公式
        </v-snackbar>
        <v-snackbar
          v-model="copyErr"
          timeout="2000"
          top
          absolute
          color="error"
          transition="scroll-y-transition"
        >
          出现错误,无法复制公式
        </v-snackbar>
        <v-dialog v-model="showLatex" max-width="700" scrollable>
          <v-card>
            <v-card-title>Latex公式</v-card-title>
            <v-card-text>
              <v-textarea :value="latex"></v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue" @click="copy" dark>
                <v-icon left>mdi-clipboard-text</v-icon>
                复制公式
              </v-btn>
              <v-btn @click="showLatex = false" color="red" dark>
                <v-icon left>mdi-close</v-icon>
                关闭
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-row v-if="errorTip">
          <v-col cols="8" offset="2">
            <v-alert border="left" type="error">
              检测到函数数据结构出现问题，请检查数据中是否有重复值或空值
            </v-alert>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1" offset="2">
            <v-btn @click="add" color="blue" block dark>
              <v-icon left>mdi-plus</v-icon>
              添加
            </v-btn>
          </v-col>
          <v-col cols="1">
            <v-btn @click="clear" color="red" block dark>
              <v-icon left>mdi-delete</v-icon>
              清空
            </v-btn>
          </v-col>
          <v-col cols="2" offset="4">
            <v-btn @click="showLatex = true" color="purple" block dark>
              <v-icon left>mdi-function-variant</v-icon>
              查看Latex公式
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8" offset="2">
            <!--
            <v-card tile>
              <v-card-title>编辑函数</v-card-title>
              <v-card-text>
                <Fx v-for="kv in kv" :key="kv[0]" :init_kv="kv"></Fx>
              </v-card-text>
            </v-card>
            -->
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8" offset="2">
            <v-card class="overflow-auto" max-height="500px" tile>
              <v-card-text>
                <div id="latex"></div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer padless>
      <v-col cols="12" class="text-center">homo-functions - 梦清</v-col>
    </v-footer>
  </v-app>
</template>

<script>
import _ from "lodash";
import homo from "./homo";
//import Fx from "./components/Fx";
import katex from "katex";
import "katex/dist/katex.min.css";

export default {
  name: "App",
  data: () => ({
    errorTip: false,
    copySuccess: false,
    copyErr: false,
    showLatex: false,
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
    //Fx,
  },
  watch: {
    kv: {
      handler(newValue) {
        localStorage.setItem("kv", JSON.stringify(newValue));
        //同步更改Latex渲染内容
        let _latex = new homo(newValue);
        this.latex = _latex.createLatex();
        katex.render(this.latex, document.getElementById("latex"), {
          displayMode: true,
        });
      },
      deep: true,
      //td:immediate无效,localstorage无效
      immediate: true,
    },
  },
  methods: {
    //添加
    add() {
      let _last = _.last(this.kv);
      this.kv.push([_last[0] + 1, _last[1] + 1]);
    },
    //清除
    clear() {
      this.kv = [_.head(this.kv)];
    },
    //复制公式到剪贴板
    async copy() {
      try {
        await navigator.clipboard.writeText(this.latex);
        this.showLatex = false;
        this.copySuccess = true;
      } catch (e) {
        this.copyErr = true;
      }
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
