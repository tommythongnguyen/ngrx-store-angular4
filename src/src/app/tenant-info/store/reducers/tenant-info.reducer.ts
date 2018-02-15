
import { Tenant } from './../../../home/models/tenant';
import * as TenantInfo from '../actions/tenant-info.actions';

export interface State {
    tenants: Tenant[];
    selectedTenant: Tenant | null;
}
export const initialState = {
    tenants: [],
    selectedTenant: null
};

export function reducer(state = initialState, action: TenantInfo.Actions) {
    switch (action.type) {
        case TenantInfo.ADD_TENANT: {
            let editTenants = [];
            if (state.tenants.length) {
                let index = 0;
                editTenants = state.tenants.filter((item, i) => {
                    if (item.id === action.payload.id) {
                        index = i;
                    } else {
                        return item;
                    }
                });
                editTenants.splice(index, 0, action.payload);
            } else {
                editTenants.push(action.payload);
            }
            return {
                selectedTenant: action.payload,
                tenants: editTenants
            };
        }

        case TenantInfo.REMOVE_TENANT: {

        }
    }
}

