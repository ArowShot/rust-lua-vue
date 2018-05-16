<template>
  <div class="out" @keydown="keypress" tabindex="1">
    <span v-for="(char, i) of output" :key="char+i" :class="char.color">{{char.char}}<br v-if="char.char=='\n'"/></span>
    <span class="cursor">_</span>
  </div>
</template>

<script>
import Monaco from 'monaco-editor-forvue'
import luaEngine from '../lua'

export default {
  name: 'Output',
  props: {},
  data() {
    return {
      output: []
    }
  },
  methods: {
    keypress(e) {
      if(e.key.length == 1) {
        luaEngine.EventBus.$emit('STDIN', e)
      }
    }
  },
  mounted() {
    luaEngine.EventBus.$on('STDOUT', (text, color) => {
      this.output.push({
        char: text,
        color: color || ''
      })
      this.$nextTick(() => {
        this.$el.scrollTop = this.$el.scrollHeight;
      })
    })
    luaEngine.EventBus.$on('STDERR', text => {
      this.output.push({
        char: text,
        color: 'error'
      })
      this.$nextTick(() => {
        this.$el.scrollTop = this.$el.scrollHeight;
      })
    })
  },
  components: {
    Monaco
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.out {
  flex-grow: 1;
  height: calc(100vh - 10px);
  overflow-y: auto;
  padding: 5px;
  color: #d4d4d4;
  background-color: #1e1e1e;
  font-family: Consolas, "Courier New", monospace;

  .cursor {
    //outline: 1px #d4d4d4 solid;
    box-shadow:inset 0px 0px 0px 1px #d4d4d4;
    color: rgba(0, 0, 0, 0);
    background: rgba(0, 0, 0, 0);
  }

  &:focus {
    outline: none;

    .cursor {
      background: #d4d4d4;
    }
  }
  
  &::-webkit-scrollbar {
    width: 14px;
    background-color: transparent;
    border-left: 1px hsla(0,0%,47%,0.4) solid;
  }

  &:hover {
    &::-webkit-scrollbar-thumb {
      background-color: hsla(0,0%,47%,0.4);
      opacity: 0.4;
    }
  }

  &::-webkit-scrollbar-thumb {
    background-color: hsla(0,0%,47%,0);
    opacity: 0;
    transition: opacity .8s linear;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: hsla(0,0%,47%,0.7);
    opacity: 0.7;
  }
}
.error {
  color: #F14C4C;
}

.green {
  color: #4CF14C;
}
</style>
