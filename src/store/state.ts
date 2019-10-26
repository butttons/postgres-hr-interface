import { InformationSchema } from '@/utils/@types-information';
interface StateConfig {
    cache: {
        hasCached: boolean;
        currentConnection: string | null;
        connectionList: Record<string, any> | null;
    };
    ignorePg: boolean;
}
interface StateInit {
    schemas: string[];
    roles: string[];
}
interface StateInfo {
    columns: InformationSchema.Default.Column[];
    roles: string[];
    tables: InformationSchema.Default.Table[];
    triggers: InformationSchema.Default.Trigger[];
    routines: InformationSchema.Default.Routine[];
}
interface StateGrants {
    columns: InformationSchema.Grants.Column[];
    objects: InformationSchema.Grants.Usage[];
    routines: InformationSchema.Grants.Routine[];
    tables: InformationSchema.Grants.Table[];
}
export interface State {
    config: StateConfig;
    selected: StateInit;
    init: StateInit;
    info: StateInfo;
    grants: StateGrants;
}
export type Computed<T> = {
    [K in keyof T]: () => T[K];
};
export const state: State = {
    config: {
        ignorePg: true,
        cache: {
            hasCached: false,
            currentConnection: null,
            connectionList: null,
        },
    },
    selected: {
        schemas: [],
        roles: [],
    },
    init: {
        schemas: [],
        roles: [],
    },
    info: {
        columns: [],
        roles: [],
        tables: [],
        triggers: [],
        routines: [],
    },
    grants: {
        columns: [],
        objects: [],
        routines: [],
        tables: [],
    },
};
