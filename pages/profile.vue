<template>
    <v-container fluid column>
        <v-toolbar color="pink">
            <v-toolbar-title class="white--text">My Profile</v-toolbar-title>
        </v-toolbar>
        <v-card>
            <v-form class="pl-3">
                <v-text-field label="E-mail address" v-model="$auth.user.email" disabled></v-text-field>
                <v-text-field label="First name" v-model="$auth.user.first_name" disabled></v-text-field>
                <v-text-field label="Last name" v-model="$auth.user.last_name" disabled></v-text-field>
                <v-text-field label="Scope" v-model="$auth.user.scope" disabled></v-text-field>
            </v-form>
        </v-card>
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
export default {
  layout: "vuetify",
  data(){
      console.log(this)
      return {
          newKeyDialog: false,
          keyExists: this.$isServer ? false : !!localStorage["_chancellory_key_"+this.$auth.user.id+"_"]
      }
  },
  computed: {
      keyTitle(){
          return this.keyExists ? "You already have key" : "You don't have key"
      }
  },
  methods: {
      updateKey(){
          this.keyExists = true
      }
  },
  components: { NewKeyDialog }
};
</script>

<style>
</style>
