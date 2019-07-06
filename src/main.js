import Vue from 'vue';
import { plugin as VueFunctionApi } from 'vue-function-api';

import App from './App.vue';

Vue.use(VueFunctionApi);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
