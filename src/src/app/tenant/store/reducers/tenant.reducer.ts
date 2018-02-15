import { Tenant } from '../../../home/models/tenant';

import * as tenantActions from '../actions/tenant.actions';
export interface State {
    collection: Tenant[];
}

export const initialState: State = {
    collection: []
};

export function reducer(state = initialState, action: tenantActions.Actions) {
    switch (action.type) {
        case tenantActions.ADD_TENANT: {
            // check if add tenant is already exist or not
            let alreadyExist = false;
            const updatedList = state.collection.map((tenant: Tenant) => {
                if (!!tenant && tenant.id === action.payload.id) {
                    alreadyExist = true;
                    return action.payload;
                }
                return tenant;
            });
            if (!alreadyExist) {
                updatedList.push(action.payload);
            }
            return Object.assign({}, state, { collection: updatedList });
        }

        case tenantActions.REMOVE_TENANT: {
            console.log('remove tennat: ', action.payload);
            const updatedList = state.collection.filter((tenant: Tenant) => tenant.id !== action.payload.id);
            return Object.assign([], state, { collection: updatedList });
        }

        case tenantActions.SET_TENANTS: {
            return Object.assign([], state, { collection: action.payload });
        }

        default: {
            return state;
        }
    }
}

export const getCollection = (state: State) => state.collection;
