<template>
    <v-layout flex align-center justify-center>
        <v-flex xs12 sm4>
            <v-toolbar class="pt-5 blue">
                <v-toolbar-title class="white--text">Sign In</v-toolbar-title>
            </v-toolbar>
            <v-card>
                <v-card-text class="pt-4">
                    <div>
                        <v-alert type="error" :value="!!error">
                            {{error}}
                        </v-alert>
                        <v-form v-model="valid" ref="form" @submit.prevent="submit">
                            <v-text-field label="Enter your e-mail address" v-model="email" @keypress="error=null" :rules="emailRules" :disabled="!!loading" required></v-text-field>
                            <v-text-field label="Enter your password" v-model="password" @keypress="error=null" :append-icon="hidePassword ? 'visibility' : 'visibility_off'" :append-icon-cb="() => (hidePassword = !hidePassword)" :type="hidePassword ? 'password' : 'text'" :rules="passwordRules" :disabled="!!loading" required></v-text-field>
                            <v-layout column>
                                <v-layout justify-space-between>
                                    <v-btn :class=" { blue : valid, disabled: !valid }" type='submit' :loading="loading">Login</v-btn>
                                    <v-btn to="/register">Register</v-btn>
                                </v-layout>
                            </v-layout>
                        </v-form>
                    </div>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>

</template>

<script>
export default {
  auth: false,
  created() {
    if (this.$auth.loggedIn) {
      this.$router.push(this.$store.$auth.options.redirect.home);
    }
  },
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
      ]
    };
  },
  methods: {
    submit() {
      if (!this.$refs.form.validate()) return;
      this.$auth
        .loginWith("local", {
          data: {
            email: this.email,
            password: this.password
          }
        })
        .then(() => {
          this.$router.push(this.$store.$auth.options.redirect.home);
        })
        .catch(error => {
          this.error = error.response.data.error;
        });
    }
  }
};
</script>

<style>
.error {
  background-color: #ff5252 !important;
}
</style>
