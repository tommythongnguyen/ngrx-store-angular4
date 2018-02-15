import { environment } from './../../../environments/environment';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { RouterStateUrl } from './../../shared/utils';

import { localStorageSync } from 'ngrx-store-localstorage';

import * as fromRouter from '@ngrx/router-store';

export interface State {
    routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
}

export const reducer: ActionReducerMap<State> = {
    routerReducer: fromRouter.routerReducer
};

// ---- meta-reducer: is a factory function that return a reducer function
export function logger(innerReducer: ActionReducer<State>): ActionReducer<State> {
    return function (state: State, action: any): State {
        console.log('state: ', state);
        console.log('action: ', action);
        return innerReducer(state, action);
    };
}

// ------meta-reducer -----
export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
    return localStorageSync({ keys: ['id_token', 'userProfile'] })(reducer);
}

/**
 * By default @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer
 */
const metas: MetaReducer<State>[] = !environment.production ? [logger] : [];
metas.push(localStorageSyncReducer);
export const metaReducers = metas;


