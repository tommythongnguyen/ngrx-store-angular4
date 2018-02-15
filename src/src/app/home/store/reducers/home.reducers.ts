import { Tenant } from './../../models/tenant';
import * as Home from '../actions/home.actions';
export interface State {
    loading: boolean;
    tenants: Tenant[];
    selectedTenant: Tenant | undefined;
}
export const initialState: State = {
    loading: false,
    tenants: [],
    selectedTenant: undefined
};

export function reducer(state: State = initialState, action: Home.Actions) {
    switch (action.type) {
        case Home.GET_TENANTS: {
            return Object.assign({}, state, { loading: true });
        }

        case Home.SET_TENANTS: {
            return Object.assign({}, state, { tenants: action.payload });
        }

        case Home.GET_TENANTS_SUCCESS: {
            console.log('getTenantSUccess: ', action.payload);
            return Object.assign({}, state, { tenants: action.payload, loading: false });
        }

        case Home.GET_TENANTS_FAILURE: {
            return Object.assign({}, state, { tenants: [], loading: false });
        }

        case Home.SELECT_TENANT: {
            return Object.assign({}, state, { selectedTenant: action.payload });
        }

        case Home.REMOVE_TENANT: {
            return Object.assign({}, state, { selectedTenant: undefined });
        }

        case Home.REFRESH_TENANT: {
            const tenant = state.selectedTenant;
            return { ...state, selectedTenant: tenant };
        }

        default: {
            return state;
        }
    }
}

export const getLoading = (state: State) => state.loading;
export const getTenants = (state: State) => state.tenants;
export const getSelectedTenant = (state: State) => state.selectedTenant;
