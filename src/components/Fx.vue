<template>
  <v-card>{{ kv[0] }} - {{ kv[1] }}</v-card>
</template>

<script>
export default {
  name: "Fx",
  data: () => ({
    //td:组件内部修改props等待处理
    k_v: Array,
  }),
  props: ["kv"],
};
</script>

<style scoped></style>
