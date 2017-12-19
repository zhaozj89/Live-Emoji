<template>
  <div id="app">
    <ElementUITest></ElementUITest>
  </div>
</template>

<script>
import Test from './components/Test'
import ElementUITest from './components/ElementUITest'

export default {
  name: 'app',
  components: {
    Test, ElementUITest
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
