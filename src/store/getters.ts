import { GetterTree } from 'vuex';
import { State } from './state';
import { InformationSchema } from '@/utils/@types-information';

export type EntityGrant = Record<string, string[]>;
export const enum Getters {
    CONNECTION_LIST = 'clientList',
    SCHEMA_LIST = 'schemaList',
    ROLE_LIST = 'roleList',
    TABLE_COLUMN_MAP = 'tableColumnMap',
    TABLE_SET = 'tableSet',
    ROUTINE_SET = 'routineSet',
    ENTITY_TREE = 'entityTree',
    GRANT_COLUMN_MAP = 'grantColumn',
    GRANT_TABLE_MAP = 'grantTable',
    GRANT_ROUTINE_MAP = 'grantRoutine',
    GRANT_OBJECT_MAP = 'grantObject',
    TRIGGER_MAP = 'triggerMap',
}
export const enum EntityTypes {
    TABLE = 'table',
    COLUMN = 'column',
    ROUTINE = 'routine',
    OBJECT = 'object',
    TRIGGER = 'trigger',
}
interface KeyItem {
    table_schema: string;
    table_name: string;
    column_name?: string;
}
interface KeyRoutineItem {
    routine_schema: string;
    routine_name: string;
}
interface KeyTriggerItem {
    trigger_name: string;
    trigger_schema: string;
    event_object_table: string;
}
interface KeyObjectItem {
    object_name: string;
    object_schema: string;
}
const columnKey = (c: KeyItem) =>
    `${c.table_schema}.${c.table_name}.${c.column_name}`;
const tableKey = (t: KeyItem) => `${t.table_schema}.${t.table_name}`;
const routineKey = (r: KeyRoutineItem) =>
    `${r.routine_schema}.${r.routine_name}`;
const objectKey = (o: KeyObjectItem) => `${o.object_schema}.${o.object_name}`;
const triggerKey = (t: KeyTriggerItem) =>
    `${t.trigger_schema}.${t.event_object_table}`;
const columnLabel = (c: KeyItem) => `${c.table_name}.${c.column_name}`;
const tableLabel = tableKey;

const generateGrantMap = (
    arr: InformationSchema.BaseGrant[],
    roles: string[],
    keyFn: CallableFunction,
) => {
    const map = new Map();
    arr.forEach((item) => {
        const id = keyFn(item);
        if (!map.has(id)) {
            map.set(id, {});
        }
        const role = item.grantee;
        const entityGrants = map.get(id);
        roles.forEach((r) => {
            if (!(r in entityGrants)) {
                entityGrants[r] = [];
            }
        });
        if (!(role in entityGrants)) {
            entityGrants[role] = [];
        }
        entityGrants[role].push(item.privilege_type);
    });
    return map;
};
const generateColumnMap = (arr: any[]) => {
    const map = new Map();
    arr.forEach((item) => {
        const tableId = tableKey(item);
        const columnId = columnKey(item);
        if (!map.has(tableId)) {
            map.set(tableId, {
                label: tableLabel(item),
                columns: new Map(),
            });
        }
        const tableMap = map.get(tableId);
        tableMap.columns.set(columnId, { label: columnLabel(item) });
    });
    return map;
};
const filterPg = (list: string[], hasIgnore: boolean) =>
    hasIgnore ? list.filter((s) => !s.startsWith('pg_')) : list;

const emptyGrants = (roles: string[]) =>
    roles.reduce(
        (acc, r) => {
            acc[r] = [];
            return acc;
        },
        {} as EntityGrant,
    );

const parseFunctionName = (name: string) => {
    const parts = name.split('.');
    return parts.length > 1 ? name : `public.${name}`;
};
const parseTriggerStatement = (statement: string) => {
    const matchFunction = /EXECUTE (PROCEDURE|FUNCTION) ([\w\.]+)\(/;
    if (!matchFunction.test(statement)) {
        return null;
    }
    const functionName = statement.match(matchFunction)![2];
    return parseFunctionName(functionName);
};
const parseTrigger = (trigger: InformationSchema.Default.Trigger) => {
    const functionTarget = parseTriggerStatement(trigger.action_statement);
    const {
        action_timing,
        trigger_name,
        trigger_schema,
        event_manipulation,
        event_object_schema,
        event_object_table,
    } = trigger;
    return {
        label: `${trigger_schema}.${trigger_name}`,
        functionTarget,
        tableTarget: `${event_object_schema}.${event_object_table}`,
        meta: {
            actionTiming: action_timing,
            eventManipulation: event_manipulation,
        },
    };
};
interface EntityRow {
    type: EntityTypes;
    level: number;
    label: string;
    grants: EntityGrant;
    meta?: any;
}
const entityRow = (
    type: EntityTypes,
    label: string,
    grants: EntityGrant,
    level: number | null = null,
    meta?: any[],
): EntityRow => {
    const entityLevels = new Map([
        [EntityTypes.TABLE, 0],
        [EntityTypes.COLUMN, 1],
        [EntityTypes.ROUTINE, 2],
        [EntityTypes.TRIGGER, 1],
        [EntityTypes.OBJECT, 1],
    ]);
    return {
        type,
        label,
        grants,
        meta,
        level: level === null ? entityLevels.get(type)! : level,
    };
};

export const getters: GetterTree<State, State> = {
    [Getters.CONNECTION_LIST]: ({
        config: {
            cache: { connectionList },
        },
    }) => (connectionList ? Object.entries(connectionList!) : null),
    [Getters.SCHEMA_LIST]: (state) =>
        filterPg(state.init.schemas, state.config.ignorePg),
    [Getters.ROLE_LIST]: (state) =>
        filterPg(state.init.roles, state.config.ignorePg),
    [Getters.GRANT_COLUMN_MAP]: (state) =>
        generateGrantMap(state.grants.columns, state.selected.roles, columnKey),
    [Getters.GRANT_TABLE_MAP]: (state) =>
        generateGrantMap(state.grants.tables, state.selected.roles, tableKey),
    [Getters.GRANT_ROUTINE_MAP]: (state) =>
        generateGrantMap(
            state.grants.routines,
            state.selected.roles,
            routineKey,
        ),
    [Getters.GRANT_OBJECT_MAP]: (state) =>
        generateGrantMap(state.grants.objects, state.selected.roles, objectKey),
    [Getters.TABLE_COLUMN_MAP]: (state) =>
        generateColumnMap(state.info.columns),
    [Getters.TABLE_SET]: (state) => new Set(state.info.tables.map(tableKey)),
    [Getters.ROUTINE_SET]: (state) =>
        new Set(state.info.routines.map(routineKey)),
    [Getters.ENTITY_TREE]: (state, storeGetters) => {
        const hasTables = state.info.tables.length > 0;
        const hasColumns = state.info.columns.length > 0;
        const hasSelectedRoles = state.selected.roles.length > 0;
        if (!hasColumns || !hasTables || !hasSelectedRoles) {
            return [];
        }
        const result: EntityRow[] = [];
        const mapTableGrants = storeGetters[Getters.GRANT_TABLE_MAP];
        const mapColumnGrants = storeGetters[Getters.GRANT_COLUMN_MAP];
        const mapRoutineGrants = storeGetters[Getters.GRANT_ROUTINE_MAP];

        const mapTriggers = storeGetters[Getters.TRIGGER_MAP];

        for (let routineId of storeGetters[Getters.ROUTINE_SET]) {
            const hasRoutineGrants = mapRoutineGrants.has(routineId);
            if (hasRoutineGrants) {
                const routineGrants = mapRoutineGrants.get(routineId);
                result.push(
                    entityRow(EntityTypes.ROUTINE, routineId, routineGrants, 0),
                );
            } else {
                result.push(
                    entityRow(
                        EntityTypes.ROUTINE,
                        routineId,
                        emptyGrants(state.selected.roles),
                    ),
                );
            }
        }
        for (let [tableId, tableInfo] of storeGetters[
            Getters.TABLE_COLUMN_MAP
        ]) {
            const hasTableGrants = mapTableGrants.has(tableId);
            if (hasTableGrants) {
                const tableGrants = mapTableGrants.get(tableId);
                result.push(entityRow(EntityTypes.TABLE, tableId, tableGrants));
            } else {
                result.push(
                    entityRow(
                        EntityTypes.TABLE,
                        tableInfo.label,
                        emptyGrants(state.selected.roles),
                    ),
                );
            }
            const hasTriggers = mapTriggers.has(tableId);
            if (hasTriggers) {
                const tableTriggers = mapTriggers.get(tableId);
                for (let trigger of tableTriggers) {
                    const { label, functionTarget, meta } = trigger;
                    result.push(
                        entityRow(
                            EntityTypes.TRIGGER,
                            label,
                            emptyGrants(state.selected.roles),
                            1,
                            meta,
                        ),
                    );
                    if (functionTarget !== null) {
                        const hasFunctionGrants = mapRoutineGrants.has(
                            functionTarget,
                        );
                        if (hasFunctionGrants) {
                            const functionGrants = mapRoutineGrants.get(
                                functionTarget,
                            );
                            result.push(
                                entityRow(
                                    EntityTypes.ROUTINE,
                                    functionTarget,
                                    functionGrants,
                                ),
                            );
                        } else {
                            result.push(
                                entityRow(
                                    EntityTypes.ROUTINE,
                                    functionTarget,
                                    emptyGrants(state.selected.roles),
                                ),
                            );
                        }
                    }
                }
            }

            for (let [columnId, columnInfo] of tableInfo.columns) {
                const hasColumnGrants = mapColumnGrants.has(columnId);
                if (hasColumnGrants) {
                    const columnGrants = mapColumnGrants.get(columnId);
                    result.push(
                        entityRow(
                            EntityTypes.COLUMN,
                            columnInfo.label,
                            columnGrants,
                        ),
                    );
                } else {
                    result.push(
                        entityRow(
                            EntityTypes.COLUMN,
                            columnInfo.label,
                            emptyGrants(state.selected.roles),
                        ),
                    );
                }
            }
        }
        return result;
    },
    [Getters.TRIGGER_MAP]: (state) => {
        const map = new Map();
        state.info.triggers.forEach((t) => {
            const id = triggerKey(t);
            const value = parseTrigger(t);
            if (!map.has(id)) {
                map.set(id, [value]);
            } else {
                map.set(id, [...map.get(id), value]);
            }
        });
        return map;
    },
    /* 
    [Getters.ENTITIES]: (state) => {
        const hasTables = state.info.tables.length > 0;
        const hasColumns = state.info.columns.length > 0;
        const hasSelectedRoles = state.selected.roles.length > 0;

        if (!hasColumns || !hasTables || !hasSelectedRoles) {
            return [];
        }
        const selectedUsers = state.selected.roles;

        const filterColumns = (t: InformationSchema.Default.Table) => (
            c: InformationSchema.Default.Column,
        ) => c.table_name === t.table_name && c.table_schema === t.table_schema;

        const filterTables = (
            role: string,
            t: InformationSchema.Default.Table,
        ) => (gt: InformationSchema.Grants.Table) =>
            gt.table_name === t.table_name &&
            gt.table_schema === t.table_schema &&
            gt.grantee === role;

        const result = state.info.tables.reduce(
            (acc, table) => {
                const { table_name, table_schema } = table;

                const columns = state.info.columns.filter(filterColumns(table));

                const tableGrants = selectedUsers.map((role) =>
                    state.grants.tables
                        .filter(filterTables(role, table))
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
    }, */
};
