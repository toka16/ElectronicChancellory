<template>
  <div>
    <p>Hello {{fullName}}</p>
  </div>
</template>

<script>
import axios from '~/plugins/axios'

export default {
  layout: 'vuetify',
  head () {
    return {
      title: 'Users'
    }
  },
  computed: {
    fullName(){
      console.log(this.$auth);
      return this.$auth.user.first_name+' '+this.$auth.user.last_name
    }
  }
}
</script>

<style>
</style>
