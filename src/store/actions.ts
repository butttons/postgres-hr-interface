import { ActionTree } from 'vuex';
import { State } from './state';
import { httpApi } from '@/utils/http-api';
import { Mutations } from './mutations';

export const enum Actions {
    INIT = 'init',
    FETCH_DATA = 'fetchData',
    GET_INFO = 'getInfo',
    GET_GRANTS = 'getGrants',
    GET_CACHED_CONNECTIONS = 'getCachedClients',
    GET_CURRENT_CONNECTION = 'getCurrentConnection',
    NEW_CONNECTION = 'newConnection',
    SET_CONNECTION = 'setConnection',
    RUN_QUERY = 'runQuery',
    REFRESH_DATA = 'refreshData',
}

export const actions: ActionTree<State, State> = {
    async [Actions.INIT]({ dispatch }) {
        dispatch(Actions.GET_CURRENT_CONNECTION);
        dispatch(Actions.GET_CACHED_CONNECTIONS);
        dispatch(Actions.FETCH_DATA);
    },
    async [Actions.GET_CURRENT_CONNECTION]({ commit }) {
        const cachedClient = await httpApi('/cache/current', null, 'GET');
        if ('notCached' in cachedClient) {
            commit(Mutations.SET_CACHE_STATUS, false);
            commit(Mutations.SET_CACHE_CONNECTION, null);
        } else {
            commit(Mutations.SET_CACHE_STATUS, true);
            commit(Mutations.SET_CACHE_CONNECTION, cachedClient.currentId);
        }
    },
    async [Actions.FETCH_DATA]({ commit }) {
        const { schemas, roles } = await httpApi('/info/init', null, 'GET');
        commit(Mutations.SET_SCHEMAS, schemas);
        commit(Mutations.SET_ROLES, roles);
    },
    async [Actions.GET_INFO]({ commit }, { schemas }) {
        commit(Mutations.SELECT_SCHEMAS, schemas);
        const info = await httpApi('/info', { schemas });
        commit(Mutations.SET_INFO, info);
    },
    async [Actions.GET_GRANTS]({ commit }, { grantees }) {
        commit(Mutations.SELECT_ROLES, grantees);
        const grants = await httpApi('/grants', { grantees });
        commit(Mutations.SET_GRANTS, grants);
    },
    async [Actions.GET_CACHED_CONNECTIONS]({ commit }) {
        const connections = await httpApi('/cache/connections', null, 'GET');
        commit(Mutations.SET_CACHE_CONNECTION_LIST, connections);
    },
    async [Actions.NEW_CONNECTION]({ commit }, { connection }) {
        const allConnections = await httpApi('/cache/newConnection', {
            connection,
        });
        commit(Mutations.SET_CACHE_CONNECTION_LIST, allConnections);
    },
    async [Actions.SET_CONNECTION]({ commit, dispatch }, { connectionId }) {
        await httpApi('/cache/setConnection', { connectionId });
        commit(Mutations.RESET_SELECTED);
        commit(Mutations.SET_CACHE_CONNECTION, connectionId);
        dispatch(Actions.FETCH_DATA);
    },
    async [Actions.REFRESH_DATA]({ dispatch }, { schemas, grantees }) {
        await dispatch(Actions.GET_INFO, { schemas });
        await dispatch(Actions.GET_GRANTS, { grantees });
    },
    async [Actions.RUN_QUERY]({ dispatch }, { sql, schemas, grantees }) {
        await httpApi('/info/query', { sql });
        dispatch(Actions.REFRESH_DATA, { schemas, grantees });
    },
};
