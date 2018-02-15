import { Action } from '@ngrx/store';
import { Tenant } from '../../models/tenant';

export const GET_TENANTS = '[Home] Get Tenants';
export const SET_TENANTS = '[Home] Set Tenants';
export const GET_TENANTS_SUCCESS = '[Home] Get Tenants Success';
export const GET_TENANTS_FAILURE = '[Home] Get Tenants Failure';

export const SELECT_TENANT = '[Home] Select Tenant';
export const REMOVE_TENANT = '[Home] Remove Tenant';
export const REFRESH_TENANT = '[Home] Refresh Tenant';

export class GetTenants implements Action {
    readonly type = GET_TENANTS;
    constructor(public payload?: string) {}
}

export class SetTenants implements Action {
    readonly type = SET_TENANTS;
    constructor (public payload: Tenant[]) {}
}

export class GetTenantsSuccess implements Action {
    readonly type = GET_TENANTS_SUCCESS;
    constructor(public payload: Tenant[]) { }
}
export class GetTenantFailure implements Action {
    readonly type = GET_TENANTS_FAILURE;
    constructor(public payload?: any) {}
}

export class SelectTenant implements Action {
    readonly type = SELECT_TENANT;
    constructor(public payload: Tenant) {}
}

export class RemoveTenant implements Action {
    readonly type = REMOVE_TENANT;
}

export class RefreshTenant implements Action {
    readonly type = REFRESH_TENANT;
}

export type Actions = GetTenants | SetTenants | GetTenantsSuccess | GetTenantFailure | SelectTenant | RemoveTenant | RefreshTenant;
