<template>
  <div>
    <h1>{{title}}</h1>
    <p>{{user.first_name}}</p>
    <p v-text='user.last_name'></p>
  </div>
</template>

<script>
  export default {
    name: "Test",
    data() {
      return {
        title: 'Hello World',
        user: {
          first_name: 'John',
          last_name: 'Doe'
        }
      }
    }
  }
</script>

<style scoped>

</style>
