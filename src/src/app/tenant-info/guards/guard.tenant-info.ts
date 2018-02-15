import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/switchMap';

import { Store } from '../../store';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class GuardTenantInfo implements CanActivate {
    constructor( private router: Router,
                 private store: Store) {}

    getFromStore(state: string): Observable<any> {
        return this.store.select(state)
                    .filter((tenants: any) => tenants !== undefined || tenants.length > 0)
                    .take(1); // take 1 value from Observable then complete --> which does our unsubscribing, technically
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        // return our Observable stream from above
        return this.getFromStore('selectedTenants')
                    .switchMap((tenants) => {
                        if (tenants.length) {
                            return of(true);
                        }else {
                            this.router.navigate(['/home/dashboard']);
                            return of(false);
                        }
                    })
                    .catch(() => {
                        this.router.navigate(['/home/dashboard']);
                        return of(false);
                    });
    }
}
