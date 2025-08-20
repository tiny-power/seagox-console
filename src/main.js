import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import '@/plugins/axios'
import '@/css/main.css'

import echarts from '@/utils/echarts'
Vue.prototype.$echarts = echarts

import template from '@/utils/art-template'
Vue.prototype.$template = template

import { BigNumber } from 'bignumber.js'
Vue.prototype.$BigNumber = BigNumber

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$store = store
new Vue({
    router,
    store,
    render: h => h(App),
    beforeCreate() {
        Vue.prototype.$bus = this
    }
}).$mount('#app')
