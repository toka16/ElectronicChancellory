<template>
    <v-layout flex align-center justify-center>
        <v-flex xs12 sm4>
            <v-toolbar class="pt-5 blue">
                <v-toolbar-title class="white--text">Register new user</v-toolbar-title>
            </v-toolbar>
            <v-card>
                <v-card-text class="pt-4">
                    <div>
                        <v-alert type="error" :value="!!error">
                            {{error}}
                        </v-alert>
                        <v-form v-model="valid" ref="form" @submit.prevent="submit">
                            <v-text-field label="Enter user's e-mail address" v-model="email" @keypress="error=null" :rules="emailRules" :disabled="!!loading" required></v-text-field>
                            <v-text-field label="Enter user's password" v-model="password" @keypress="error=null" :append-icon="hidePassword ? 'visibility' : 'visibility_off'" :append-icon-cb="() => (hidePassword = !hidePassword)" :type="hidePassword ? 'password' : 'text'" :rules="passwordRules" :disabled="!!loading" required></v-text-field>
                            <v-text-field label="Enter user's first name" v-model="first_name" @keypress="error=null" :rules="requiredRules" :disabled="!!loading" required></v-text-field>
                            <v-text-field label="Enter user's last name" v-model="last_name" @keypress="error=null" :rules="requiredRules" :disabled="!!loading" required></v-text-field>
                            <v-select :items="scopeOptions" item-text="title" item-value="key" box v-model="scope"></v-select>
                            <v-btn :class=" { blue : valid, disabled: !valid }" type='submit' :loading="loading">Register</v-btn>
                        </v-form>
                    </div>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>

</template>

<script>
export default {
  layout: "vuetify",
  data() {
    return {
      error: null,
      loading: false,
      valid: false,
      hidePassword: true,
      password: "",
      passwordRules: [v => !!v || "Password is required"],
      email: "",
      emailRules: [
        v => !!v || "E-mail is required",
        v =>
          /^\w+(\.?\w+)*@\w+(\.?\w+)*\.\w+$/.test(v) || "E-mail must be valid"
      ],
      first_name: "",
      requiredRules: [v => !!v || "This field is required"],
      last_name: "",
      scope: "user",
      scopeOptions: [{
          title: "Operator",
          key: "operator"
      },{
          title: "User",
          key: "user"
      },{
          title: "Admin",
          key: "admin"
      }]
    };
  },
  methods: {
    submit() {
      if (!this.$refs.form.validate()) return;
      this.$axios
        .post("/api/users", {
          email: this.email,
          password: this.password,
          first_name: this.first_name,
          last_name: this.last_name,
          scope: this.scope
        })
        .then(() => {
          this.$refs.form.reset();
          alert("User registered successfully");
        })
        .catch(err => {
          console.log(err);
          const data = err.response.data;
          this.error = data.error || data;
        });
    }
  }
};
</script>
