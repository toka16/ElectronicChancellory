<template>
    <v-container fluid column>
        <profile :title="title" :user="user" :editable="true" />
    </v-container>
</template>

<script>
import Profile from '../../components/Profile'
export default {
  layout: "vuetify",
  asyncData(ctx) {
    return ctx.$axios
      .$get(`/api/users/${ctx.params.id}`)
      .then(user => ({ user }))
      .catch(res => {
        console.log(res);
      });
  },
  computed:{
      title(){
          return this.user.first_name + ' ' + this.user.last_name
      }
  },
  components: {Profile}
};
</script>
