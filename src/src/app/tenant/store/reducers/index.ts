import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTenant from './tenant.reducer';


export interface TenantState {
    tenantList: fromTenant.State;
}
export interface State {
    tenant: TenantState;
}

export const reducers = {
    tenantList: fromTenant.reducer
};

export const selectTenantState = createFeatureSelector<TenantState>('tenant');

export const selectTenantHomeState = createSelector(
    selectTenantState,
    (state: TenantState) => state.tenantList
);

export const getTenantCollection = createSelector(
    selectTenantHomeState,
    fromTenant.getCollection
);

