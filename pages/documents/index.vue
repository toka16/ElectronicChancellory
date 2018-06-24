<template>
    <v-container fluid column>
        <v-toolbar color="pink">
            <v-toolbar-title class="white--text">Documents</v-toolbar-title>
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
                    <td><v-icon v-if="!!props.item.signature">done</v-icon></td>
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
    const docs = await ctx.$axios.$get("/api/docs");
    for (let doc of docs) {
      doc.owner = `${doc.first_name} ${doc.last_name}`;
    }
    return {
      items: docs
    };
  },
  data() {
    window.t = this;
    return {
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
  }
};
</script>
