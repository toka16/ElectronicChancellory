<template>
  <div>
    <v-text-field textarea label="Text" :error="!valid" v-model="text" required></v-text-field>
    <p>{{sigValueHex}}</p>
    <v-btn type="button" @click="signData">Sign</v-btn>
    <v-btn type="button" @click="validateData">Validate</v-btn>
  </div>
</template>

<script>
import r from "jsrsasign";

export default {
  layout: "vuetify",
  data: () => ({
    text: "",
    sigValueHex: "",
    valid: true
  }),
  methods: {
    getPrvKey() {
      return r.KEYUTIL.getKey(localStorage["prvKey"]);
    },
    getPubKey() {
      return r.KEYUTIL.getKey(localStorage["pubKey"]);
    },
    createSigner() {
      var sig = new r.KJUR.crypto.Signature({ alg: "SHA1withRSA" });
      sig.init(this.getPrvKey());
      return sig;
    },
    createValidator() {
      var sig = new r.KJUR.crypto.Signature({ alg: "SHA1withRSA" });
      sig.init(this.getPubKey());
      return sig;
    },
    signData() {
      const sig = this.createSigner();
      sig.updateString(this.text);
      this.sigValueHex = sig.sign();
      this.valid = true;
    },
    validateData() {
      const validator = this.createValidator();
      validator.updateString(this.text);
      this.valid = validator.verify(this.sigValueHex);
    }
  }
};
</script>
