<template>
  <v-container fluid column>
    <v-toolbar color="pink">
      <v-toolbar-title class="white--text">
        <template v-if="isOperator">
          <v-select :items="docOptions" item-text="title" item-value="key" box v-model="docs" @change="docsChanged"></v-select>
        </template>
        <template v-else>
          Documents
        </template>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon to="/new-document">
        <v-icon>add</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card>
      <v-data-table :headers="headers" :items="items" hide-actions>
        <template slot='items' slot-scope='props'>
          <td>{{props.item.owner}}</td>
          <td>{{props.item.title}}</td>
          <td>{{props.item.created_at}}</td>
          <td>
            <v-icon v-if="!!props.item.signature">done</v-icon>
          </td>
          <td>
            <v-btn icon :to="'/documents/'+props.item.id">
              <v-icon>visibility</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
export default {
  layout: "vuetify",
  async asyncData(ctx) {
    const docs = await ctx.$axios.$get("/api/docs?group=assigned-to-me");
    for (let doc of docs) {
      doc.owner = `${doc.first_name} ${doc.last_name}`;
    }
    return {
      items: docs
    };
  },
  methods: {
    async docsChanged(val) {
      const docs = await this.$axios.$get("/api/docs?group="+val);
      for (let doc of docs) {
        doc.owner = `${doc.first_name} ${doc.last_name}`;
      }
      this.items = docs
    }
  },
  data() {
    return {
      docs: "assigned-to-me",
      docOptions: [
        { title: "All", key: "all" },
        { title: "Assigned to me", key: "assigned-to-me" },
        { title: "Signed by me", key: "signed-by-me" },
        { title: "Unsigned", key: "unsigned" }
      ],
      headers: [
        {
          text: "Owner",
          value: "owner"
        },
        {
          text: "Title",
          value: "title"
        },
        {
          text: "Created At",
          value: "created_at"
        },
        {
          text: "Signed",
          sortable: false
        },
        {
          text: "View",
          sortable: false
        }
      ]
    };
  },
  computed: {
    isOperator() {
      return this.$auth.user.scope === "operator";
    }
  }
};
</script>
