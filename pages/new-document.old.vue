<template>
    <v-layout column>
        <v-text-field textarea label="Text" v-model="text" required></v-text-field>
        <no-ssr>
            <load-key v-on:key="updateKey" />
        </no-ssr>
        <v-btn type="button" @click="signData" :disabled="!prvKey || !text">Sign</v-btn>
    </v-layout>
</template>

<script>
import LoadKey from "../components/LoadKey";

export default {
  layout: "vuetify",
  data: () => ({
    text: "",
    prvKey: null
  }),
  methods: {
    signData() {},
    updateKey(key) {
      this.prvKey = key;
    }
  },
  components: { LoadKey }
};
</script>

<style>

</style>
