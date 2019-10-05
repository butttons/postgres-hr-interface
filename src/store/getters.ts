import { GetterTree } from 'vuex';
import { State } from './state';

export const enum Getters {
    ENTITIES = 'entities',
}
export const enum EntityTypes {
    TABLE = 'table',
    COLUMN = 'column',
}
export const getters: GetterTree<State, State> = {
    [Getters.ENTITIES]: (state) => {
        const hasTables = state.info.tables.length > 0;
        const hasColumns = state.info.columns.length > 0;
        const hasSelectedRoles = state.selected.roles.length > 0;

        if (!hasColumns || !hasTables || !hasSelectedRoles) {
            return [];
        }
        const selectedUsers = state.selected.roles;
        const result = state.info.tables.reduce(
            (acc, table) => {
                const { table_name, table_schema } = table;
                const columns = state.info.columns.filter(
                    (c) =>
                        c.table_name === table_name &&
                        c.table_schema === table_schema,
                );
                const tableGrants = selectedUsers.map((role) =>
                    state.grants.tables
                        .filter(
                            (t) =>
                                t.table_name === table_name &&
                                t.table_schema === table_schema &&
                                t.grantee === role,
                        )
                        .map((g) => g.privilege_type),
                );

                acc.push({
                    type: EntityTypes.TABLE,
                    level: 0,
                    label: `${table_schema}.${table_name}`,
                    grants: tableGrants,
                });
                columns.forEach((c) => {
                    const columnGrants = selectedUsers.map((role) =>
                        state.grants.columns
                            .filter(
                                (cg) =>
                                    cg.column_name === c.column_name &&
                                    cg.table_name === table_name &&
                                    cg.table_schema === table_schema &&
                                    cg.grantee === role,
                            )
                            .map((g) => g.privilege_type),
                    );
                    acc.push({
                        type: EntityTypes.COLUMN,
                        level: 1,
                        label: `${c.table_name}.${c.column_name}`,
                        grants: columnGrants,
                    });
                });
                return acc;
            },
            [] as any[],
        );
        return result;
    },
};
