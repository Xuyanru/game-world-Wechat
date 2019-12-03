// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import "../static/js/public.js";
import App from './App';
import router from './router';
import "../static/css/public.css";
import "../static/js/need/layer.css";
import "../static/js/jquery-1.9.1.min.js";
import "../static/js/layer.js";
import "../static/css/style.css";
import "../static/css/mobiscroll.custom-2.17.0.min.css";
import "../static/js/mobiscroll.custom-2.17.0.min.js";
Vue.use(ElementUI);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
