import { ActionTree, MutationTree } from 'vuex';
import { State } from './state';

export const enum Mutations {
    SET_INFO = 'SET_INFO',
    SET_GRANTS = 'SET_GRANTS',
    SET_SCHEMAS = 'SET_SCHEMAS',
    SET_ROLES = 'SET_ROLES',
    SELECT_SCHEMAS = 'SELECT_SCHEMAS',
    SELECT_ROLES = 'SELECT_ROLES',
    RESET_SELECTED = 'RESET_SELECTED',
    SET_CONFIG_IGNORE = 'SET_CONFIG_IGNORE',
    SET_CACHE_STATUS = 'SET_CACHE_STATUS',
    SET_CACHE_CONNECTION = 'SET_CACHE_CONNECTION',
    SET_CACHE_CONNECTION_LIST = 'SET_CACHE_CONNECTION_LIST',
}

export const mutations: MutationTree<State> = {
    [Mutations.SET_INFO]: (state, info) => (state.info = info),
    [Mutations.SET_GRANTS]: (state, grants) => (state.grants = grants),
    [Mutations.SET_SCHEMAS]: (state, schemas) => (state.init.schemas = schemas),
    [Mutations.SET_ROLES]: (state, roles) => (state.init.roles = roles),
    [Mutations.SELECT_SCHEMAS]: (state, schemas) =>
        (state.selected.schemas = schemas),
    [Mutations.SELECT_ROLES]: (state, roles) => (state.selected.roles = roles),
    [Mutations.RESET_SELECTED]: (state) => {
        state.selected.roles = [];
        state.selected.schemas = [];
        return state;
    },
    [Mutations.SET_CONFIG_IGNORE]: (state, isIgnore) =>
        (state.config.ignorePg = isIgnore),
    [Mutations.SET_CACHE_STATUS]: (state, status) =>
        (state.config.cache.hasCached = status),
    [Mutations.SET_CACHE_CONNECTION]: (state, client) =>
        (state.config.cache.currentConnection = client),
    [Mutations.SET_CACHE_CONNECTION_LIST]: (state, clientList) =>
        (state.config.cache.connectionList = clientList),
};
