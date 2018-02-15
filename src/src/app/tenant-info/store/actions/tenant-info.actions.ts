import { Tenant } from './../../../home/models/tenant';
import { Action } from '@ngrx/store';

// export const GET_TENANTS = '[Tenant Info] Get Tenants';
export const ADD_TENANT = '[Tenant Info] Add Tenant';
export const REMOVE_TENANT = '[Tenant Info] Remove Tenant';
// export const SELECT_TENANT = '[Tenant Info] Get Selected Tenant';

export class AddTenant implements Action {
    readonly type = ADD_TENANT;
    constructor(public payload: Tenant) {}
}

export class RemoveTenant implements Action {
    readonly type = REMOVE_TENANT;
    constructor(public payload: Tenant) {}
}

export type Actions = AddTenant | RemoveTenant;
