import Vue from 'vue';
import App from './App.vue';
import store from './store/index';
import 'animate.css';
import '@/assets/css/tailwind.css';
import '@/assets/css/v-tooltip.css';
import '@/assets/css/main.css';
import VTooltip from 'v-tooltip';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faCheckCircle,
    faSync,
    faTable,
    faColumns,
    faCode,
    faBolt,
    faBox,
    faUsers,
    faMinusCircle,
    faPlusCircle,
    faBars,
    faCaretRight,
    faArrowRight,
    faTimesCircle,
    faPlus,
    faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(
    faCheckCircle,
    faCircle,
    faSync,
    faTable,
    faColumns,
    faCode,
    faBolt,
    faBox,
    faUsers,
    faMinusCircle,
    faPlusCircle,
    faBars,
    faCaretRight,
    faArrowRight,
    faTimesCircle,
    faPlus,
    faExclamationTriangle,
);
Vue.use(VTooltip);

Vue.component('fa-icon', FontAwesomeIcon);
Vue.config.productionTip = false;
new Vue({
    store,
    render: (h) => h(App),
}).$mount('#app');
