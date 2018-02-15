import { Action } from '@ngrx/store';

export const SUBMIT = '[Idp Provider] Submit';
export const SUBMIT_SUCCESS = '[Idp Provider] Submit Success';
export const SUBMIT_FAILURE = '[Idp Provider] Submit Failure';
export const SUBMITTED = '[Idp Provider] Submitted';
export const SHOW_LOADING = '[Idp Provider] Show Loading';
export const HIDE_LOADING = '[Idp Provider] Hide Loading';

export const SET_SUBMITTED = '[Idp Provider] Set Submitted';

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

