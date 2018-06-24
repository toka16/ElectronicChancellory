<template>
    <div>
        <h3>{{author}}</h3>
        <h5>created at {{new Date(created_at).toLocaleString()}}</h5>
        <v-divider />
        <h2 class="text-sm-center mt-5">{{title}}</h2>
        <p>{{text}}</p>
        <div v-if="!signature">
            <no-ssr>
                <load-key v-on:key="updateKey" />
            </no-ssr>
            <v-btn type="button" @click="sign" :disabled="!prvKey" color="info">Sign</v-btn>
        </div>
        <div v-else>
            <v-alert :value="true" :type="signStatus">
                This document is signed by {{signer}} at {{new Date(signed_at).toLocaleString()}}
                <v-btn @click="verify">Verify</v-btn>
            </v-alert>
        </div>
    </div>
</template>

<script>
import LoadKey from "../../components/LoadKey";
import { sign, validateWithMultipleKey } from "../../utils/sign-utils.js";

export default {
  layout: "vuetify",
  asyncData(ctx) {
    return ctx.$axios
      .get(`/api/docs/${ctx.params.id}`)
      .then(res => {
        return res.data;
      })
      .catch(res => {
        console.log(res);
      });
  },
  data() {
    return {
      prvKey: null,
      signStatus: "info"
    };
  },
  computed: {
    author() {
      return `${this.first_name} ${this.last_name}`;
    },
    signer() {
      return `${this.signer_first_name} ${this.signer_last_name}`;
    }
  },
  methods: {
    async sign() {
      const signature = await sign(this.prvKey, this.text);
      await this.$axios
        .post(`/api/docs/${this.id}/sign`, {
          signature
        })
        .then(() => {
          alert("Signed");
        })
        .catch(res => {
          alert("error");
        });
    },
    async verify() {
      const keys = await this.$axios.$get("/api/keys", {
        params: { owner_id: this.signer_id, created_at: this.signed_at }
      });
      const res = await validateWithMultipleKey(
        keys,
        this.text,
        this.signature
      );
      console.log(res);
      this.signStatus = res ? "success" : "error";
    },
    updateKey(key) {
      this.prvKey = key;
    }
  },
  components: { LoadKey }
};
</script>