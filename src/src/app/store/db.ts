import { DBSchema } from '@ngrx/db';

export const schema: DBSchema = {
    version: 1,
    name: 'erag_admin',
    stores: {
        id_token: {
            autoIncrement: false,
            primaryKey: '1'
        },
        user_profile: {
            autoIncrement: false,
            primaryKey: '1'
        }
    }
};
