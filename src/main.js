import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './icons'
import './style/index.scss'
import './theme/index.css'

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
