<template>
  <div id="app">
    app
    <test></test>
  </div>
</template>

<script>
  let Test = {
    name: 'test',
    template: '<h2>Test</h2>'
  }
  export default {
    name: 'App',
    components: {
      Test
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
