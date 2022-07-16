<template>
  <v-row>
    <v-col cols="4">
      <v-text-field
        v-model="kv[0]"
        filled
        prepend-icon="mdi-function-variant"
      ></v-text-field>
    </v-col>
    <v-col cols="4">
      <v-text-field
        v-model="kv[1]"
        filled
        prepend-icon="mdi-function"
      ></v-text-field>
    </v-col>
    <v-spacer></v-spacer>
    <v-col cols="1">
      <v-btn icon @click="deleteFx"><v-icon>mdi-delete</v-icon></v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "Fx",
  data: () => ({
    kv: Array,
  }),
  methods: {
    deleteFx() {},
  },
  props: ["init_kv"],
  beforeMount() {
    this.kv = this.init_kv;
  },
};
</script>

<style scoped></style>
