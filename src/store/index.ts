import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

import { state, State } from './state';
import { actions } from './actions';
import { mutations } from './mutations';
import { getters } from './getters';
Vue.use(Vuex);

const vuexLocal = new VuexPersistence<State>({
    storage: window.localStorage,
    reducer: (s) => ({ config: s.config, selected: s.selected }),
});
export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    plugins: [vuexLocal.plugin],
});
