import { SettingService } from '../../services/settings.service';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';

import * as settingReducer from '../reducers';

import * as dnsGatewayActions from '../actions/dns-gateway.action';

import * as homeActions from '../../../home/store/actions/home.actions';

import 'rxjs/add/operator/exhaustMap';

@Injectable()
export class SettingEffects {
    constructor(
        private actions$: Actions,
        private store: Store<settingReducer.State>,
        private settingService: SettingService
    ) { }

    @Effect()
    dnsGatewaySubmit = this.actions$
        .ofType(dnsGatewayActions.SUBMIT)
        .map((action: dnsGatewayActions.Submit) => action.payload)
        .switchMap( payload =>
            this.settingService.submitGateWay(payload.tenantId, payload.dnsGateway)
                .map(tenant => {
                    if (!!tenant) {
                        this.store.dispatch(new homeActions.SelectTenant(tenant));
                        return new dnsGatewayActions.SubmitSuccess();
                    } else {
                        this.store.dispatch(new homeActions.RefreshTenant());
                        return new dnsGatewayActions.SubmitFailure();
                    }
                })
    );
}
