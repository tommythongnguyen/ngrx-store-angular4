import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { HomeService } from '../../services/home.service';
import { Tenant } from './../../models/tenant';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';

import * as homeActions from '../actions/home.actions';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/take';

@Injectable()
export class HomeEffects {
    constructor(
        private actions$: Actions,
        private homeService: HomeService
    ) {}
    @Effect()
    getTenants = this.actions$
        .ofType(homeActions.GET_TENANTS)
        .map((action: homeActions.GetTenants) => action.payload)
        .exhaustMap(tenantId =>
            this.homeService
                .getTenants(tenantId)
                .take(1)
        )
        .map((tenants: Tenant[]) => new homeActions.GetTenantsSuccess(tenants))
        .catch(err => of(new homeActions.GetTenantFailure()));

}
