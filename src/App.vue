<template>
  <div id="app">
    <Editor class="editor"/>
    <Output class="out"/>
  </div>
</template>

<script>
import Editor from './components/Editor.vue'
import Output from './components/Output.vue'

export default {
  name: 'app',
  components: {
    Editor,
    Output,
  }
}
</script>

<style>
#app {
  display: grid;
  grid-template-columns: 50vw 50vw;
  grid-template-rows: 100vh;
  grid-gap: 1px;
  height: 100%;
  background: #383838;
  overflow: hidden;
}
</style>
