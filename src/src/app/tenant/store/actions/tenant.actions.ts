import { Tenant } from './../../../home/models/tenant';
import { Action } from '@ngrx/store';
export const ADD_TENANT = '[Tenant] Add Tenant';
export const REMOVE_TENANT = '[Tenant] Remove Tenant';
export const SET_TENANTS = '[Tenant] Set Tenants';

export class AddTenant implements Action {
    readonly type = ADD_TENANT;
    constructor(public payload: Tenant) { }
}

export class RemoveTenant implements Action {
    readonly type = REMOVE_TENANT;
    constructor(public payload: Tenant) {}
}

export class SetTenants implements Action {
    readonly type = SET_TENANTS;
    constructor(public payload: Tenant[]) {}
}
export type Actions = AddTenant | RemoveTenant | SetTenants;
