<template>
    <v-container fluid column>
        <v-toolbar color="pink">
            <v-toolbar-title class="white--text">Users</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon to="/register">
                <v-icon>add</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card>
            <v-data-table :headers="headers" :items="users" hide-actions>
                <template slot='items' slot-scope='props'>
                    <td>{{props.item.email}}</td>
                    <td>{{props.item.first_name}}</td>
                    <td>{{props.item.last_name}}</td>
                    <td>{{props.item.scope}}</td>
                    <td>
                        <v-btn icon :to="'/users/'+props.item.id">
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
    const users = await ctx.$axios.$get("/api/users");
    return {
      users
    };
  },
  data() {
    return {
      headers: [
        {
          text: "Email",
          value: "email"
        },
        {
          text: "First Name",
          value: "first_name"
        },
        {
          text: "Last Name",
          value: "last_name"
        },
        {
          text: "Scope",
          value: "scope"
        },
        {
          text: "Actions",
          sortable: false
        }
      ]
    };
  }
};
</script>
