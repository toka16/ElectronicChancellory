<template>
  <div>
    <v-layout row>
      <v-flex xs6>
        <h3>{{author}}</h3>
        <h5>created at {{new Date(document.created_at).toLocaleString()}}</h5>
      </v-flex>
      <v-flex xs6>
        <v-select v-if="$auth.user.scope==='operator'" @change="changeAssignee" label="Assigned to" :items="operators" item-text="full_name" item-value="id" box v-model="document.assigned_to_id"></v-select>
        <h4 v-else class="text-xs-right">Assigned to {{assignee}}</h4>
      </v-flex>
    </v-layout>
    <v-divider />
    <div v-if="!document.signature">
      {{$auth.user.scope}}
      <template v-if="isOperator">
        <no-ssr>
          <load-key v-on:key="updateKey" />
        </no-ssr>
        <v-btn type="button" @click="sign" :disabled="!prvKey" color="info">Sign</v-btn>
      </template>
      <v-alert v-else :value="true" type="info">
        This document is NOT signed yet
      </v-alert>
    </div>
    <div v-else>
      <v-alert :value="true" :type="signStatus">
        This document is signed by {{signer}} at {{new Date(document.signed_at).toLocaleString()}}
        <v-btn @click="verify" v-show="signStatus === 'info'">Verify</v-btn>
      </v-alert>
    </div>
    <v-divider />
    <div>
      <h2 class="text-sm-center mt-5">{{document.title}}</h2>
      <p class="mt-3">{{document.text}}</p>
      <v-divider />
      <v-card v-for="comment in comments" :key="comment.id" class="mt-1">
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
        <v-btn type="submit" color="info" :disabled="!newComment">Submit Comment</v-btn>
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
    let pArr = [];
    const docP = ctx.$axios.$get(`/api/docs/${ctx.params.id}`).catch(res => {
      console.log(res);
    });
    pArr.push(docP);
    const commentsP = ctx.$axios
      .$get(`/api/docs/${ctx.params.id}/comments`)
      .catch(res => {
        console.log(res);
      });
    pArr.push(commentsP);
    if (ctx.store.$auth.user.scope === "operator") {
      const operP = ctx.$axios
        .$get(`/api/users/operators`)
        .then(operators => {
          operators.forEach(op => {
            op.full_name = `${op.first_name} ${op.last_name}`;
          });
          return operators;
        })
        .catch(res => {
          console.log(res);
        });
      pArr.push(operP);
    }
    // eslint-disable-next-line
    return Promise.all(pArr).then(data => {
      console.log(data);
      return {
        document: data[0],
        comments: data[1],
        operators: ctx.store.$auth.user.scope === "operator" ? data[2] : []
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
    isOperator() {
      return this.$auth.user.scope === "operator";
    },
    author() {
      return `${this.document.first_name} ${this.document.last_name}`;
    },
    signer() {
      return `${this.document.signer_first_name} ${
        this.document.signer_last_name
      }`;
    },
    assignee() {
      return this.document.assigned_to_id
        ? `${this.document.assignee_first_name} ${
            this.document.assignee_last_name
          }`
        : "NO ONE";
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
          // location.reload();
          this.document.signature = signature;
          this.document.signed_at = new Date();
          this.document.signer_first_name = this.$auth.user.first_name;
          this.document.signer_last_name = this.$auth.user.last_name;
        })
        .catch(res => {
          console.log(res);
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
    },
    changeAssignee(val){
      console.log(val)
      this.$axios.put("/api/docs/"+this.document.id+"/assignee", {id: val})
    }
  },
  components: { LoadKey }
};
</script>