<template>
    <div>
        <v-toolbar color="pink">
            <v-toolbar-title class="white--text">{{title}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn v-if="editable" icon @click="edit">
                <v-icon>edit</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card>
            <v-form class="pl-3" @submit.prevent="update">
                <v-text-field label="E-mail address" v-model="user.email" :disabled="!editing" required></v-text-field>
                <v-text-field label="First name" v-model="user.first_name" :disabled="!editing" required></v-text-field>
                <v-text-field label="Last name" v-model="user.last_name" :disabled="!editing" required></v-text-field>
                <v-text-field v-if="!!user.password" label="Password" v-model="user.password" :disabled="!editing" required></v-text-field>
                <v-text-field label="Scope" v-model="user.scope" disabled></v-text-field>
                <!-- <v-select :items="scopeOptions" item-text="title" item-value="key" box v-model="user.scope" :disabled="!editing"></v-select> -->
                <v-btn type="submit" color="info" v-if="editing">Update</v-btn>
            </v-form>
        </v-card>
    </div>
</template>

<script>
export default {
  props: ["title", "user", "editable"],
  data() {
    return {
      editing: false
    //   scopeOptions: [
    //     {
    //       title: "Operator",
    //       key: "operator"
    //     },
    //     {
    //       title: "User",
    //       key: "user"
    //     },
    //     {
    //       title: "Admin",
    //       key: "admin"
    //     }
    //   ]
    };
  },
  methods: {
    edit() {
      this.editing = !this.editing;
    },
    update() {
      this.$axios
        .put("/api/users/" + this.user.id, {
          user: this.user
        })
        .then(() => {
          this.editing = false;
        })
        .catch(err => {
          console.log(err);
          alert("Error occured. Please refresh page");
        });
    }
  }
};
</script>

<style>
</style>
