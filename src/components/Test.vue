<template>
  <div>
    <h1>{{title}}</h1>
    <!-- <p>{{user.first_name}}</p> -->
    <!-- <p v-text='user.last_name'></p> -->
  </div>
</template>

<script>
  export default {
    name: "Test",
    data() {
      return {
        title: 'Procedure-based Motion Synchronization for Live 2D Animation',
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
