import { Tenant } from './../../../home/models/tenant';
import { Action } from '@ngrx/store';
export const SUBMIT = '[Server Cert] Submit';
export const SUBMIT_SUCCESS = '[Server Cert] Submit Success';
export const SUBMIT_FAILURE = '[Server Cert] Submit Failure';
export const SUBMITTED = '[Server Cert] Submitted';
export const SHOW_LOADING = '[Server Cert] Show Loading';
export const HIDE_LOADING = '[Server Cert] Hide Loading';

export const SET_SUBMITTED = '[Server Cert] Set Submitted';

export class Submit implements Action {
    readonly type = SUBMIT;
}

export class SubmitSuccess implements Action {
    readonly type = SUBMIT_SUCCESS;
}

export class SubmitFailure implements Action {
    readonly type = SUBMIT_FAILURE;
}

export class ShowLoading implements Action {
    readonly type = SHOW_LOADING;
}

export class HideLoading implements Action {
    readonly type = HIDE_LOADING;
}

export class SetSubmitted implements Action {
    readonly type = SET_SUBMITTED;
}

export type Actions = Submit | SubmitSuccess | SubmitFailure | ShowLoading | HideLoading | SetSubmitted;

