<template>
  <v-app>
    <v-navigation-drawer :mini-variant.sync="miniVariant" :clipped="false" v-model="drawer" fixed app>
      <v-list>
        <v-list-tile router :to="item.to" :key="i" v-for="(item, i) in items" exact>
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app :clipped-left="false">
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="logout">
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="false" app>
      Electronic Chancellory <span>&copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      miniVariant: false
    };
  },
  computed: {
    title() {
      return this.$store.state.title
    },
    items() {
      const items = [
        { icon: "apps", title: "Welcome", to: "/" },
        { icon: "person", title: "Profile", to: "/profile" }
      ];
      if (this.$auth.user.scope === "admin") {
        items.push(
          { icon: "group", title: "Users", to: "/users" },
          { icon: "person_add", title: "Register", to: "/register" }
        );
      } else if (this.$auth.user.scope === "operator") {
        items.push({
          icon: "collections_bookmark",
          title: "Documents",
          to: "/documents"
        });
      } else {
        items.push({
          icon: "edit",
          title: "Create New Document",
          to: "/new-document"
        });
      }
      return items;
    }
  },
  methods: {
    logout() {
      this.$auth.logout().then(() => {
        this.$router.push("/login");
      });
    }
  }
};
</script>