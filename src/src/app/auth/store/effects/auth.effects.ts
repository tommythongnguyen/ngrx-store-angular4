import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { LoginService } from './../../services/login.service';
import { Authenticate } from '../../models/user.interface';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';

import * as Auth from '../actions/auth.actions';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/exhaustMap';
import { of } from 'rxjs/observable/of';

import { Database } from '@ngrx/db';

@Injectable()
export class AuthEffects {
    constructor(
        private loginService: LoginService,
        private authService: AuthService,
        private router: Router,
        private actions$: Actions,
        private db: Database
    ) { }

    @Effect({ dispatch: false })
    openDB$: Observable<any> = defer(() => {
        console.log('open database');
        return this.db.open('erag_admin');
    });

    @Effect()
    login$ = this.actions$
        .ofType(Auth.LOGIN)
        .map((action: Auth.Login) => action.payload)
        .exhaustMap((user: Authenticate) =>
            this.loginService
                .login(user)
                .map(res => {
                    const profile = this.authService.saveToken(res.token.token);
                    return new Auth.LoginSuccess(profile);
                })
                .catch(error => of(new Auth.LoginFailure(error)))
        );

    @Effect({ dispatch: false })
    loginSuccess$ = this.actions$
        .ofType(Auth.LOGIN_SUCCESS)
        .do(() => this.router.navigate(['/home']));

    @Effect({ dispatch: false })
    loginRedirect$ = this.actions$
        .ofType(Auth.LOGIN_REDIRECT)
        .do(() => {
            console.log('redirect');
            this.router.navigate(['/login']);
        });

    @Effect()
    getUserProfile$ = this.actions$
        .ofType(Auth.GET_USER_PROFILE)
        .map(() => {
            const profile = this.authService.getUserProfile();
            if (!!profile) {
                return new Auth.GetUserProfileSuccess(profile);
            }
            return new Auth.LoginRedirect();
        })
        .catch(() => of(new Auth.LoginRedirect()));

}
