// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import store from './store'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import * as VueGoogleMaps from 'vue2-google-maps'
import VeeValidate from 'vee-validate';
import LogRocket from 'logrocket'
import VueDefaultValue from 'vue-default-value';
Vue.use(VueDefaultValue);

require(`../static/themes/fwp/css/app.scss`)
require(`../static/themes/fwp/css/global.css`)
require(`../static/themes/fwp/css/option.scss`)
require(`../static/themes/fwp/css/thanks.scss`)

import './theme_manager.js';
import {
  ThemeManager
} from './theme_manager';

new ThemeManager().loadTheme()

Vue.use(Vuex)
Vue.use(ElementUI, {
  locale
})
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBJs2f0TNNui_OcRHgVRTIsJAvGQ0EB7oA',
    libraries: 'places'
  }
})

Vue.use(VeeValidate);
import './custom-vee-validate';
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

let bus = new Vue()
export default bus
