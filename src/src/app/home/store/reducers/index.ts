import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromHome from './home.reducers';

export interface HomeState {
    tenants: fromHome.State;
}

export interface State {
    home: HomeState;
}

export const reducers = {
    tenants: fromHome.reducer
};

export const selectHomeState = createFeatureSelector<HomeState>('home');

export const selectTenantsState = createSelector(
    selectHomeState,
    (state: HomeState) => state.tenants
);

export const getTenants = createSelector(
    selectTenantsState,
    fromHome.getTenants
);

export const getTenantsLoading = createSelector(
    selectTenantsState,
    fromHome.getLoading
);

export const getSelectedTenant = createSelector(
    selectTenantsState,
    fromHome.getSelectedTenant
);



