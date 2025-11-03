<template>
  <v-app>
    <v-app-bar flat color="red" dark>
      <v-app-bar-title>拉格朗日插值函数生成器</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-tooltip location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn
            href="https://github.com/AkariRin/lagrange-interpolation"
            target="_blank"
            icon
            v-bind="props"
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
          :timeout="2000"
          location="top"
          color="success"
        >
          已复制Latex公式
        </v-snackbar>
        <v-snackbar
          v-model="copyErr"
          :timeout="2000"
          location="top"
          color="error"
        >
          出现错误,无法复制公式
        </v-snackbar>
        <v-dialog v-model="showLatex" max-width="700" scrollable>
          <v-card>
            <v-card-title>Latex公式</v-card-title>
            <v-card-text>
              <v-textarea :value="latex" readonly></v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue" @click="copy" dark>
                <v-icon start>mdi-clipboard-text</v-icon>
                复制公式
              </v-btn>
              <v-btn @click="showLatex = false" color="red" dark>
                <v-icon start>mdi-close</v-icon>
                关闭
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-row>
          <v-col cols="12" md="10" offset-md="1">
            <v-alert border="start" type="info">
              这是一个用于生成拉格朗日插值函数的Latex公式的工具
              <br />
              点击数据即可编辑公式
            </v-alert>
          </v-col>
        </v-row>
        <v-row v-if="errorTip">
          <v-col cols="12" md="10" offset-md="1">
            <v-alert border="start" type="error">
              检测到函数数据结构出现问题，请检查数据中是否有重复值或空值
            </v-alert>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="6" md="1" offset-md="1">
            <v-btn @click="add" color="blue" block>
              <v-icon start>mdi-plus</v-icon>
              添加
            </v-btn>
          </v-col>
          <v-col cols="6" md="1">
            <v-btn @click="clear" color="red" block>
              <v-icon start>mdi-delete</v-icon>
              清空
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" md="2">
            <v-btn @click="showLatex = true" color="purple" block>
              <v-icon start>mdi-function-variant</v-icon>
              查看Latex公式
            </v-btn>
          </v-col>
          <v-col cols="0" md="1"></v-col>
        </v-row>
        <v-dialog v-model="editDialog" max-width="500">
          <v-card>
            <v-card-title>编辑数据</v-card-title>
            <v-card-text>
              <v-text-field
                v-model.number="editingItem.k"
                label="输入值"
                type="number"
              ></v-text-field>
              <v-text-field
                v-model.number="editingItem.v"
                label="函数值"
                type="number"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="editDialog = false">取消</v-btn>
              <v-btn color="blue" @click="saveEdit">保存</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-row>
          <v-col cols="12" md="10" offset-md="1">
            <v-data-table
              :headers="headers"
              :items="kv"
              :items-per-page="10"
              class="elevation-1"
            >
              <template #[`item.k`]="{ item }">
                <span @click="editItem(item)" style="cursor: pointer" class="text-blue">
                  {{ item.k }}
                </span>
              </template>
              <template #[`item.v`]="{ item }">
                <span @click="editItem(item)" style="cursor: pointer" class="text-blue">
                  {{ item.v }}
                </span>
              </template>
              <template #[`item.actions`]="{ item }">
                <v-btn @click="deleteItem(item)" icon size="small">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <template #no-data>
                <v-btn @click="reset">生成模板数据</v-btn>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="10" offset-md="1">
            <v-card class="overflow-auto" max-height="500px">
              <v-card-title>公式预览</v-card-title>
              <v-card-text>
                <div id="latex"></div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer>
      <v-col cols="12" class="text-center">lagrange-interpolation | 梦清</v-col>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import interpolation from './interpolation';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const errorTip = ref(false);
const copySuccess = ref(false);
const copyErr = ref(false);
const showLatex = ref(false);
const latex = ref('');
const editDialog = ref(false);
const editingItem = ref({ k: 0, v: 0 });
const editingIndex = ref(-1);

const kv = ref([
  { k: 1, v: 1 },
  { k: 2, v: 2 },
  { k: 3, v: 3 },
  { k: 4, v: 4 },
  { k: 5, v: 114514 },
]);

const headers = [
  {
    title: '输入值',
    key: 'k',
  },
  {
    title: '函数值',
    key: 'v',
  },
  {
    title: '操作',
    key: 'actions',
    sortable: false,
  },
];

// 渲染公式
const render = (x) => {
  let _latex = new interpolation(x);
  // 验证
  if (!_latex.validate()) {
    errorTip.value = true;
    latex.value =
      'An \\quad error \\quad occurred \\quad in \\quad rendering \\quad equation';
  } else {
    errorTip.value = false;
    latex.value = _latex.createLatex();
  }
  katex.render(latex.value, document.getElementById('latex'), {
    displayMode: true,
  });
};

// 添加
const add = () => {
  if (kv.value.length === 0) {
    kv.value.push({ k: 1, v: 1 });
  } else {
    let _last = kv.value[kv.value.length - 1];
    kv.value.push({ k: _last.k + 1, v: _last.v + 1 });
  }
};

// 清空
const clear = () => {
  kv.value = [];
};

// 删除项
const deleteItem = (item) => {
  kv.value.splice(kv.value.indexOf(item), 1);
};

// 编辑项
const editItem = (item) => {
  editingIndex.value = kv.value.indexOf(item);
  editingItem.value = { ...item };
  editDialog.value = true;
};

// 保存编辑
const saveEdit = () => {
  if (editingIndex.value !== -1) {
    kv.value[editingIndex.value] = { ...editingItem.value };
  }
  editDialog.value = false;
};

// 复制公式到剪贴板
const copy = async () => {
  try {
    await navigator.clipboard.writeText(latex.value);
    showLatex.value = false;
    copySuccess.value = true;
  } catch {
    copyErr.value = true;
  }
};

// 无数据时的重置方法
const reset = () => {
  kv.value = [
    { k: 1, v: 1 },
    { k: 2, v: 2 },
    { k: 3, v: 3 },
    { k: 4, v: 4 },
    { k: 5, v: 114514 },
  ];
};

// 监听kv变化
watch(
  kv,
  (newValue) => {
    localStorage.setItem('kv', JSON.stringify(newValue));
    render(newValue);
  },
  { deep: true }
);

// 挂载时从本地加载kv数据
onMounted(() => {
  const storedKv = localStorage.getItem('kv');
  if (storedKv === null) {
    render(kv.value);
  } else {
    kv.value = JSON.parse(storedKv);
  }
});
</script>

<style scoped></style>
