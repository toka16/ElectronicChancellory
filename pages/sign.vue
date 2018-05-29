<template>
  <div>
    <div>
      <v-text-field textarea label="Text" :error="!valid" v-model="text" required></v-text-field>

      <v-btn type="button" @click="signData" :disabled="!prvKey">Sign</v-btn>
      <v-btn type="button" @click="validateData" :disabled="!pubKey">Validate</v-btn>

      <p>{{sigValueHex}}</p>

    </div>
    <v-divider></v-divider>
    <div>
      <v-btn type="button" @click="generateKeys">Generate New Key Pair</v-btn>
      <v-btn type="button" @click="loadKeys">Load Keys</v-btn>
      <v-btn type="button" @click="saveKeyInFile">Save Keys in file</v-btn>
      <upload-button title="Load Keys from file" :selectedCallback="loadKeyFromFile"></upload-button>

      <v-checkbox v-model="saveInBrawser" label="Save in brawser" />

      <p>{{prvKey}}</p>
      <p>{{pubKey}}</p>

    </div>
  </div>
</template>

<script>
import { generatePair } from "../utils/key-utils";
import { Signer, Validator } from "../utils/sign-utils";

import UploadButton from "../components/UploadButton";

let textFile = null;
export default {
  layout: "vuetify",
  data: () => ({
    text: "",
    sigValueHex: "",
    valid: true,
    prvKey: "",
    pubKey: "",
    saveInBrawser: true
  }),
  methods: {
    generateKeys() {
      generatePair().then(pair => {
        console.log("pair: ", pair);
        localStorage["prvKey"] = pair.prvKey;
        localStorage["pubKey"] = pair.pubKey;
      }).catch((e)=>{
        console.error(e);
      })
      // const pair = generatePair();

      // localStorage["prvKey"] = pair.prvKey;
      // localStorage["pubKey"] = pair.pubKey;
    },
    loadKeys() {
      this.prvKey = localStorage["prvKey"];
      this.pubKey = localStorage["pubKey"];
    },

    signData() {
      const sig = new Signer(this.prvKey);
      this.sigValueHex = sig.signText(this.text);
    },

    validateData() {
      const val = new Validator(this.pubKey);
      const valid = val.validateText(this.text, this.sigValueHex);
      console.log(valid);
    },

    saveKeyInFile() {
      var data = new Blob([this.prvKey], { type: "text/plain" });

      if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
      }

      textFile = window.URL.createObjectURL(data);

      var link = document.createElement("a");
      link.setAttribute("download", "prvKey-pem.txt");
      link.href = textFile;
      document.body.appendChild(link);

      // wait for the link to be added to the document
      window.requestAnimationFrame(function() {
        var event = new MouseEvent("click");
        link.dispatchEvent(event);
        document.body.removeChild(link);
      });
    },
    loadKeyFromFile(file) {
      if (!file) return;
      var reader = new FileReader();
      reader.onload = () => {
        this.prvKey = reader.result;
      };
      reader.readAsText(file);
    }
  },
  components: { UploadButton }
};
</script>
