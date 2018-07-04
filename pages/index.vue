<template>
  <div>
    <p>Hello {{fullName}}</p>
  </div>
</template>

<script>
export default {
  layout: 'vuetify',
  computed: {
    fullName(){
      return this.$auth.user.first_name+' '+this.$auth.user.last_name
    }
  }
}
</script>

<style>
</style>
