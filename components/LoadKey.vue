<template>
    <div>
        <v-alert :type="keyType" :value="true">
            <h3 v-if="!!prvKey">Key is loaded</h3>
            <h3 v-else>You don't have key in brawser. Load it from
                <upload-button title="file" :selectedCallback="loadKeyFromFile"></upload-button> or create
                <v-btn @click.native="createNewOne">new one</v-btn>
            </h3>
            <new-key-dialog v-model="newKeyDialog" v-on:newKey="updateKey" />
        </v-alert>
    </div>
</template>

<script>
import UploadButton from "../components/UploadButton";
import NewKeyDialog from "./NewKeyDialog";

export default {
  created() {
    this.prvKey = localStorage["_chancellory_key_"];
  },
  data: () => ({
    prvKey: null,
    loadedFromFile: false,
    newKeyDialog: false
  }),
  computed: {
    keyType() {
      return this.prvKey ? "success" : "warning";
    }
  },
  watch: {
    prvKey(val) {
      if (val) {
        this.$emit("key", val);
      }
    }
  },
  methods: {
    createNewOne() {
      this.newKeyDialog = true;
    },
    loadKeyFromFile(file) {
      if (!file) return;
      var reader = new FileReader();
      reader.onload = () => {
        this.prvKey = reader.result;
        this.loadedFromFile = true;
      };
      reader.readAsText(file);
    },
    updateKey(key) {
      this.prvKey = key;
    }
  },
  components: { UploadButton, NewKeyDialog }
};
</script>

<style>

</style>
