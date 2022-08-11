<template>
  <v-app>
    <v-app-bar app flat color="red" dark>
      <v-app-bar-title>拉格朗日插值函数生成器</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            href="https://github.com/AkariRin/lagrange-interpolation"
            target="_blank"
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-github</v-icon>
          </v-btn>
        </template>
        <span>在GitHub查看源代码</span>
      </v-tooltip>
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
        <v-row>
          <v-col cols="8" offset="2">
            <v-alert border="left" type="info">
              这是一个用于生成拉格朗日插值函数的Latex公式的工具
              <br />
              点击数据即可编辑公式
            </v-alert>
          </v-col>
        </v-row>
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
            <v-data-table
              :headers="headers"
              :items="kv"
              :items-per-page="10"
              class="elevation-1"
            >
              <!--编辑用对话框-->
              <template v-slot:item.k="props">
                <v-edit-dialog :return-value="props.item.k">
                  {{ props.item.k }}
                  <template v-slot:input>
                    <v-text-field
                      v-model.number="props.item.k"
                      label="Edit"
                      single-line
                      autofocus
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </template>
              <template v-slot:item.v="props">
                <v-edit-dialog :return-value="props.item.v">
                  {{ props.item.v }}
                  <template v-slot:input>
                    <v-text-field
                      v-model.number="props.item.v"
                      label="Edit"
                      single-line
                      autofocus
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </template>
              <!--编辑用对话框 结束-->
              <template v-slot:item.actions="{ item }">
                <v-btn @click="deleteItem(item)" icon>
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </template>
              <template v-slot:no-data>
                <v-btn @click="reset">生成模板数据</v-btn>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8" offset="2">
            <v-card class="overflow-auto" max-height="500px" tile>
              <v-card-title>公式预览</v-card-title>
              <v-card-text>
                <div id="latex"></div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer padless>
      <v-col cols="12" class="text-center">lagrange-interpolation | 梦清</v-col>
    </v-footer>
  </v-app>
</template>

<script>
import _ from "lodash";
import interpolation from "./interpolation";
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
      { k: 1, v: 1 },
      { k: 2, v: 2 },
      { k: 3, v: 3 },
      { k: 4, v: 4 },
      { k: 5, v: 114514 },
    ],
    headers: [
      {
        text: "输入值",
        value: "k",
      },
      {
        text: "函数值",
        value: "v",
      },
      {
        text: "操作",
        value: "actions",
        sortable: false,
      },
    ],
    latex: String,
  }),
  watch: {
    kv: {
      handler(newValue) {
        localStorage.setItem("kv", JSON.stringify(newValue));
        this.render(newValue);
      },
      deep: true,
    },
  },
  methods: {
    //渲染公式
    render(x) {
      let _latex = new interpolation(x);
      //验证
      if (!_latex.validate()) {
        this.errorTip = true;
        this.latex =
          "An \\quad error \\quad occurred \\quad in \\quad rendering \\quad equation";
      } else {
        this.errorTip = false;
        this.latex = _latex.createLatex();
      }
      katex.render(this.latex, document.getElementById("latex"), {
        displayMode: true,
      });
    },
    //添加
    add() {
      if (_.isEmpty(this.kv)) {
        this.kv.push({ k: 1, v: 1 });
      } else {
        let _last = _.last(this.kv);
        this.kv.push({ k: _last.k + 1, v: _last.v + 1 });
      }
    },
    //清空
    clear() {
      this.kv = [];
    },
    //删除项
    deleteItem(item) {
      this.kv.splice(this.kv.indexOf(item), 1);
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
    //无数据时的重置方法
    reset() {
      this.kv = [
        { k: 1, v: 1 },
        { k: 2, v: 2 },
        { k: 3, v: 3 },
        { k: 4, v: 4 },
        { k: 5, v: 114514 },
      ];
    },
  },
  mounted() {
    //从本地加载kv数据
    localStorage.getItem("kv") == null
      ? this.render(this.kv)
      : (this.kv = JSON.parse(localStorage.getItem("kv")));
  },
};
</script>
