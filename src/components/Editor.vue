<template>
  <div class="editor">
    <monaco
      language="lua"
      :code="code"
      @mounted="editorMounted"/>
    <button class="run" @click="exeLua">Run script</button>
  </div>
</template>

<script>
import Monaco from 'monaco-editor-forvue';
 
export default {
  name: 'Editor',
  props: {},
  data() {
    return {
      code: `print("Hello, world!")`
    }
  },
  methods: {
    editorMounted(editor) {
      this.editor = editor;
      editor.layout();
    },
    exeLua() {
      this.$lua.executeLua(this.editor.getValue())
    }
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.editor.layout()
    })
    window.run = this.exeLua
  },
  components: {
    Monaco
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.editor {
  height: 100%;
  width: 100%;
  flex-grow: 1;
}

.run {
  position: absolute;
  bottom: 0px;left: 25%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%)
}
</style>
