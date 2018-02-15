import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

import { Store } from '@ngrx/store';
import * as fromAuth from '../store/reducers';
import * as Auth from '../store/actions/auth.actions';


@Injectable()
export class AuthGuardHome implements CanActivate {

  constructor(
    private store: Store<fromAuth.State>,
    private authService: AuthService) { }

  canActivate(): Observable<boolean> {

    return this.authService.isLoggedIn
      .map(authed => {
        if (!authed) {
          this.store.dispatch(new Auth.LoginRedirect);
          return false;
        } else {
          return true;
        }
      });
  }
}
