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
      <v-menu bottom offset-y class="mr-3">
        <template slot="activator">
          <v-icon large color="grey" v-if="newNotifications.length==0">
            info
          </v-icon>
          <v-badge v-else color="red">
            <span slot="badge">{{newNotifications.length}}</span>
            <v-icon large color="grey">
              info
            </v-icon>
          </v-badge>
        </template>
        <template>
          <v-list v-if="notifications.length>0">
            <v-list-tile v-for="item in notifications" :key="item.id" :to="item.link" @click="clearNotifications(item)">
              <v-list-tile-title :class="'black--text ' + (item.status||'info')">{{ item.text }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
          <div class="white" v-else>You don't have notifications</div>
        </template>
      </v-menu>
      <v-btn icon @click="logout">
        <v-icon large>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="false" app>
      Electronic Chancellory
      <span>&copy; 2018</span>
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
      return this.$store.state.title;
    },
    notifications() {
      return this.$store.state.notifications;
    },
    newNotifications() {
      return this.notifications.filter(item => !item.status);
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
        items.push(
          {
            icon: "collections_bookmark",
            title: "Documents",
            to: "/documents"
          },
          {
            icon: "edit",
            title: "Create New Document",
            to: "/new-document"
          }
        );
      }
      return items;
    }
  },
  methods: {
    logout() {
      this.$auth.logout().then(() => {
        this.$router.push("/login");
      });
    },
    clearNotifications(item){
      console.log(item)
      this.$axios.put(`/api/notifications/${item.id}/seen`).then(()=>{
        item.status = 1
      }).catch(err=>{
        console.log(err)
      })
    }
  }
};
</script>