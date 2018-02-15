import { Action } from '@ngrx/store';
export const SUBMIT = '[Dns Gateway] Submit';
export const SUBMIT_SUCCESS = '[Dns Gateway] Submit Success';
export const SUBMIT_FAILURE = '[Dns Gateway] Submit Failure';
export const SUBMITTED = '[Dns Gateway] Submitted';
export const SHOW_LOADING = '[Dns Gateway] Show Loading';
export const HIDE_LOADING = '[Dns Gateway] Hide Loading';

export const SET_SUBMITTED = '[Dns Gateway] Set Submitted';

export class Submit implements Action {
    readonly type = SUBMIT;
    constructor(public payload: { dnsGateway: {gateway: string}, tenantId: string}) {}
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

