<template>
  <v-dialog v-model="alive" max-width="500px">
    <v-card>
      <v-card-title>
        <h3>Create New Key</h3>
      </v-card-title>
      <v-card-text>
        <v-layout row>
          <v-alert :value="true" :type="isLoading?'info':'success'" style="flex-grow:1">
            {{isLoading?'Your Key Pair is being generated...':'Your Key Pair is created, save or download it from below'}}
          </v-alert>
        </v-layout>
        <v-layout row>
          <v-progress-circular v-if="isLoading" indeterminate color="primary"></v-progress-circular>
          <template v-else>
            <v-btn @click.native="saveKeyInFile" flat style="flex-grow:1">Download Key</v-btn>
            <v-btn @click.native="saveKeyInBrawser" flat style="flex-grow:1">Save In Brawser</v-btn>
          </template>
        </v-layout>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" flat @click.stop="alive=false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { generatePair } from "../utils/key-utils";
let textFile;
export default {
  props: ["value"],
  watch: {
    alive(val) {
      if (val) {
        this.generateNewKey();
      }
    }
  },
  methods: {
    async saveKeyInServer() {

      await this.$axios.post('/api/keys', {
        key: this.pubKey
      })
    },
    generateNewKey() {
      this.isLoading = true;
      generatePair().then(pair => {
        this.prvKey = pair.prvKey;
        this.pubKey = pair.pubKey;
        this.isLoading = false;
      }).catch(()=>{
        alert('Error, Please try again later');
      });
    },
    async fleshKeys() {
      await this.saveKeyInServer();
      this.$emit("newKey", this.prvKey);
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
      window.requestAnimationFrame(() => {
        var event = new MouseEvent("click");
        link.dispatchEvent(event);
        document.body.removeChild(link);

        this.fleshKeys();
      });
    },
    async saveKeyInBrawser() {
      await this.fleshKeys();
      localStorage["_chancellory_key_"] = this.prvKey;
    }
  },
  computed: {
    alive: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  data: () => ({
    prvKey: null,
    pubKey: null,
    keySaved: false,
    isLoading: false
  })
};
</script>

<style>
</style>
