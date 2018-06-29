<template>
  <v-layout column>
    <v-alert :value="documentSuccess" type="success">
      Document is created successfully
    </v-alert>
    <form @submit.prevent="submit">
      <v-text-field label="Title" v-model="title" required></v-text-field>
      <v-text-field multi-line label="Text" v-model="text" required></v-text-field>
      <v-btn type="submit" :disabled="!text">Submit</v-btn>
    </form>
  </v-layout>
</template>

<script>
export default {
  layout: "vuetify",
  data: () => ({
    title: "",
    text: "",
    documentSuccess: false
  }),
  methods: {
    submit() {
      this.$axios
        .post("/api/docs", {
          title: this.title,
          text: this.text
        })
        .then(res => {
          this.$router.push(`/documents/${res.data.id}`);
        })
        .catch(res => {
          alert(res.response.data);
        });
    }
  }
};
</script>
