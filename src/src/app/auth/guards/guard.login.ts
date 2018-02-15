import { Observable } from 'rxjs/Observable';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';

import * as fromAuth from '../store/reducers';
import * as Auth from '../store/actions/auth.actions';

@Injectable()
export class AuthGuardLogin implements CanActivate {

  constructor(
    private store: Store<fromAuth.State>,
    private router: Router
  ) { }

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<boolean> {
    return this.store.select(fromAuth.getLoggedIn)
      .map(authed => {
        console.log('login: ', activatedRouteSnapshot.params);
        if (authed) {
          this.router.navigate(['/home']);
          return false;
        } else {
          return true;
        }
      });
  }
}
