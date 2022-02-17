import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'

import '../src/assets/css/style.css'

import http from './http'
// Vue.prototype.$http = http

// createApp(App).mount('#app')
const app = createApp(App)

app.config.globalProperties.$http = http

app.mixin({
  computed: {
    uploadUrl() {
      return this.$http.defaults.baseURL + '/upload'
    }
  },
  methods: {
    getAuthHeaders() {
      return {
        Authorization: `Bearer ${localStorage.token || ''}`
      }
    }
  }
})

app.use(router)
// app.use(ElementPlus)
app.mount('#app')
