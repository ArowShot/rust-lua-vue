import Vue from 'vue'
import App from './App.vue'
import luaEngine from './lua'
import './main.scss'

Vue.config.productionTip = false

new Vue({
  luaEngine,
  render: h => h(App)
}).$mount('#app')
