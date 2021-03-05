import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

import VueParticles from 'vue-particles'

Vue.use(VueParticles)

//导入axios
import axios from 'axios'
//挂载
Vue.prototype.$http = axios
//设置访问根路径
axios.defaults.baseURL = "http://localhost:8081"//FIXME

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
