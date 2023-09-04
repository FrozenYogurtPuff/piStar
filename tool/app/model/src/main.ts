import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// @ts-ignore
import App from './App.vue'
import vuetify from './plugins/vuetify'
// import { createStore } from 'vuex'

// Vue.config.productionTip = false
Vue.use(ElementUI)
// Vue.use(Vuex)


new Vue({
  el: '#app',
  // @ts-ignore
  vuetify,
  render: h => h(App)
});
