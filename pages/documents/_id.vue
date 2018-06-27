<template>
  <div>
    <h3>{{author}}</h3>
    <h5>created at {{new Date(document.created_at).toLocaleString()}}</h5>
    <v-divider />
    <div v-if="!document.signature">
      <no-ssr>
        <load-key v-on:key="updateKey" />
      </no-ssr>
      <v-btn type="button" @click="sign" :disabled="!prvKey" color="info">Sign</v-btn>
    </div>
    <div v-else>
      <v-alert :value="true" :type="signStatus">
        This document is signed by {{signer}} at {{new Date(document.signed_at).toLocaleString()}}
        <v-btn @click="verify">Verify</v-btn>
      </v-alert>
    </div>
    <v-divider />
    <div>
      <h2 class="text-sm-center mt-5">{{document.title}}</h2>
      <p class="mt-3">{{document.text}}</p>
      <v-divider />
      <v-card v-for="comment in comments" class="mt-1">
        <v-card-title primary-title>
          <div>
            <h3>{{comment.author}}</h3>
            <h5>created at {{new Date(comment.created_at).toLocaleString()}}</h5>
            <v-divider />
            <div>{{comment.text}}</div>
          </div>
        </v-card-title>
      </v-card>
      <form @submit.prevent="addComment">
        <v-text-field textarea label="Write a comment..." v-model="newComment" required></v-text-field>
        <v-btn type="submit" color="info">Submit Comment</v-btn>
      </form>
    </div>

  </div>
</template>

<script>
import LoadKey from "../../components/LoadKey";
import { sign, validateWithMultipleKey } from "../../utils/sign-utils.js";

export default {
  layout: "vuetify",
  asyncData(ctx) {
    const docP = ctx.$axios.$get(`/api/docs/${ctx.params.id}`).catch(res => {
      console.log(res);
    });
    const commentsP = ctx.$axios
      .$get(`/api/docs/${ctx.params.id}/comments`)
      .catch(res => {
        console.log(res);
      });
    // eslint-disable-next-line
    return Promise.all([docP, commentsP]).then(([doc, comments]) => {
      return {
        document: doc,
        comments
      };
    });
  },
  data() {
    return {
      prvKey: null,
      signStatus: "info",
      newComment: ""
    };
  },
  computed: {
    author() {
      return `${this.document.first_name} ${this.document.last_name}`;
    },
    signer() {
      return `${this.document.signer_first_name} ${
        this.document.signer_last_name
      }`;
    }
  },
  methods: {
    async sign() {
      const signature = await sign(this.prvKey, {
        title: this.document.title,
        text: this.document.text,
        created_at: this.document.created_at,
        author_id: this.document.author_id
      });
      await this.$axios
        .post(`/api/docs/${this.document.id}/sign`, {
          signature
        })
        .then(() => {
          location.reload();
        })
        .catch(res => {
          alert("error");
        });
    },
    async verify() {
      const keys = await this.$axios.$get("/api/keys", {
        params: {
          owner_id: this.document.signer_id,
          created_at: this.document.signed_at
        }
      });
      const res = await validateWithMultipleKey(
        keys,
        {
          title: this.document.title,
          text: this.document.text,
          created_at: this.document.created_at,
          author_id: this.document.author_id
        },
        this.document.signature
      );
      this.signStatus = res ? "success" : "error";
    },
    updateKey(key) {
      this.prvKey = key;
    },
    addComment() {
      const comment = {
        author: this.$auth.user.first_name + " " + this.$auth.user.last_name,
        text: this.newComment,
        created_at: new Date()
      };
      this.$axios
        .post(`/api/docs/${this.document.id}/comments`, comment)
        .then(() => {
          this.comments.push(comment);
          this.newComment = "";
        })
        .catch(res => {
          console.log(res);
        });
    }
  },
  components: { LoadKey }
};
</script>