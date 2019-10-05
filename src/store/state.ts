import { InformationSchema } from '@/utils/@types-information';

export interface State {
    selected: {
        schemas: string[];
        roles: string[];
    };
    init: {
        schemas: string[];
        roles: string[];
    };
    info: {
        columns: InformationSchema.Default.Column[];
        roles: string[];
        tables: InformationSchema.Default.Table[];
        triggers: InformationSchema.Default.Trigger[];
        routines: InformationSchema.Default.Routine[];
    };
    grants: {
        columns: InformationSchema.Grants.Column[];
        objects: InformationSchema.Grants.Usage[];
        routines: InformationSchema.Grants.Routine[];
        tables: InformationSchema.Grants.Table[];
    };
}
export const state: State = {
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
