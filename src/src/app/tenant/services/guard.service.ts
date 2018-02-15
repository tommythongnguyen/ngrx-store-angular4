import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

import * as homeReducer from '../../home/store/reducers';
import * as tenantActions from '../store/actions/tenant.actions';
import * as tenantReducer from '../store/reducers';

@Injectable()
export class TenantGuard implements CanActivate {
    constructor(
        private store: Store<tenantReducer.State>,
        private router: Router
    ) { }

    canActivate(): Observable<boolean> {
        return this.store.select(homeReducer.getSelectedTenant)
            .map(tenant => {
                if (!!tenant) {
                    return true;
                }
                this.router.navigate(['/home']);
                return false;
            })
            .take(1);
    }
}
