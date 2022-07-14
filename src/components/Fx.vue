<template>
  <div>
    <v-divider></v-divider>
    {{ kv[0] }} - {{ kv[1] }}
  </div>
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
