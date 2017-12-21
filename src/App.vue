<template>
  <div id="app">
    <Test></Test>
    <Workspace></Workspace>
  </div>
</template>

<script>
import Test from './components/Test'
// import ElementUITest from './components/ElementUITest'
import Workspace from './components/Workspace'

export default {
  name: 'app',
  components: {
    Test, Workspace
  }
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  height: 600px;
}
</style>
