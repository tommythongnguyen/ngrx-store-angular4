import { UserProfile } from '../../services/user-profile.interface';
import { Authenticate } from '../../models/user.interface';
import { Action } from '@ngrx/store';

export const LOGIN = '[Auth] Login';
export const LOGIN_SUCCESS = '[Auth] Login Success';
export const LOGIN_FAILURE = '[Auth] Login Failure';
export const LOGIN_REDIRECT = '[Auth] Login Redirect';
export const LOG_OUT = '[Auth] Logout';

export const GET_USER_PROFILE = '[Auth] Get User Proifle';
export const GET_USER_PROFILE_SUCCESS = '[Auth] Get User Proifle Success';

export class Login implements Action {
    readonly type = LOGIN;
    constructor(public payload: Authenticate) {}
}

export class LoginSuccess implements Action {
    readonly type = LOGIN_SUCCESS;
    constructor(public payload: UserProfile) {}
}

export class LoginFailure implements Action {
    readonly type = LOGIN_FAILURE;
    constructor(public payload?: any) {}
}

export class LoginRedirect implements Action {
    readonly type = LOGIN_REDIRECT;
}

export class Logout implements Action {
    readonly type = LOG_OUT;
}

export class GetUserProfile implements Action {
    readonly type = GET_USER_PROFILE;
}

export class GetUserProfileSuccess implements Action {
    readonly type = GET_USER_PROFILE_SUCCESS;
    constructor(public payload: UserProfile) { }
}
export type AuthActions
    = Login
    | LoginSuccess
    | LoginFailure
    | LoginRedirect
    | Logout
    | GetUserProfile
    | GetUserProfileSuccess;
