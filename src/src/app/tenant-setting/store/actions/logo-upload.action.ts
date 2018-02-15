import { Action } from '@ngrx/store';

export const SUBMIT = '[Logo Upload] Submit';
export const SUBMIT_SUCCESS = '[Logo Upload] Submit Success';
export const SUBMIT_FAILURE = '[Logo Upload] Submit Failure';
export const SUBMITTED = '[Logo Upload] Submitted';
export const SHOW_LOADING = '[Logo Upload] Show Loading';
export const HIDE_LOADING = '[Logo Upload] Hide Loading';

export const SET_SUBMITTED = '[Logo Upload] Set Submitted';

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

