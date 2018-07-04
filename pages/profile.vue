<template>
    <v-container fluid column>
        <profile title="My Profile" :user="$auth.user" />
        <new-key-dialog v-model="newKeyDialog" v-on:newKey="updateKey"></new-key-dialog>
        <v-toolbar color="pink" v-if="$auth.user.scope === 'operator'">
            <v-toolbar-title class="white--text">{{keyTitle}}</v-toolbar-title>
            <v-spacer />
            <v-btn @click="newKeyDialog=true">Add new key</v-btn>
        </v-toolbar>
    </v-container>
</template>

<script>
import NewKeyDialog from "../components/NewKeyDialog";
import Profile from "../components/Profile";
export default {
  layout: "vuetify",
  data() {
    return {
      newKeyDialog: false,
      keyExists: this.$isServer
        ? false
        : !!localStorage["_chancellory_key_" + this.$auth.user.id + "_"]
    };
  },
  computed: {
    keyTitle() {
      return this.keyExists ? "You already have key" : "You don't have key";
    }
  },
  methods: {
    updateKey() {
      this.keyExists = true;
    }
  },
  components: { NewKeyDialog, Profile }
};
</script>

<style>
</style>
