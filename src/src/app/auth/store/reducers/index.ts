import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from './auth.reducer';
import * as fromLogin from './login.reducer';
export interface AuthState {
    status: fromAuth.State;
    loginPage: fromLogin.State;
}

export interface State {
    auth: AuthState;
}
export const reducers = {
    status: fromAuth.reducer,
    loginPage: fromLogin.reducer
};

// --- create Feature Selector for this ModuleWithProviders
export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthStateStatus = createSelector(
    selectAuthState,
    (state: AuthState) => state.status
);

export const getLoggedIn = createSelector(
    selectAuthStateStatus,
    fromAuth.getLoggedIn
);

export const getUserProfile = createSelector(
    selectAuthStateStatus,
    fromAuth.getUserProfile
);

export const getLoginPageStatus = createSelector(
    selectAuthState,
    (state: AuthState) => state.loginPage
);
export const getLoginPageError = createSelector(
    getLoginPageStatus,
    fromLogin.getError
);
export const getLoginPagePending = createSelector(
    getLoginPageStatus,
    fromLogin.getPending
);
