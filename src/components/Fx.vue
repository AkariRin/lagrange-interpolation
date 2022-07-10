<template>
  <v-card>{{ kv[0] }} - {{ kv[1] }}</v-card>
</template>

<script>
export default {
  name: "Fx",
  data: () => ({
    k: 0,
    v: 0,
  }),
  props: ["kv"],
};
</script>

<style scoped></style>
