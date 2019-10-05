import { ActionTree } from 'vuex';
import { State } from './state';
import { httpApi } from '@/utils/http-api';
import { Mutations } from './mutations';

export const enum Actions {
    INIT = 'init',
    GET_INFO = 'getInfo',
    GET_GRANTS = 'getGrants',
}

export const actions: ActionTree<State, State> = {
    async [Actions.INIT]({ commit }) {
        const { schemas, roles } = await httpApi('/info/init', null, 'GET');
        commit(Mutations.SET_SCHEMAS, schemas);
        commit(Mutations.SET_ROLES, roles);
    },
    async [Actions.GET_INFO]({ commit }, { schemas }) {
        const info = await httpApi('/info', { schemas });
        commit(Mutations.SET_INFO, info);
    },
    async [Actions.GET_GRANTS]({ commit }, { grantees }) {
        const grants = await httpApi('/grants', { grantees });
        commit(Mutations.SET_GRANTS, grants);
    },
};
