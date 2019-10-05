import { ActionTree, MutationTree } from 'vuex';
import { State } from './state';

export const enum Mutations {
    SET_INFO = 'SET_INFO',
    SET_GRANTS = 'SET_GRANTS',
    SET_SCHEMAS = 'SET_SCHEMAS',
    SET_ROLES = 'SET_ROLES',
    SELECT_SCHEMAS = 'SELECT_SCHEMAS',
    SELECT_ROLES = 'SELECT_ROLES',
}

export const mutations: MutationTree<State> = {
    [Mutations.SET_INFO]: (state, info) => (state.info = info),
    [Mutations.SET_GRANTS]: (state, grants) => (state.grants = grants),
    [Mutations.SET_SCHEMAS]: (state, schemas) => (state.init.schemas = schemas),
    [Mutations.SET_ROLES]: (state, roles) => (state.init.roles = roles),
    [Mutations.SELECT_SCHEMAS]: (state, schemas) =>
        (state.selected.schemas = schemas),
    [Mutations.SELECT_ROLES]: (state, roles) => (state.selected.roles = roles),
};
