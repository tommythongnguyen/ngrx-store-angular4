import { Store } from '../../store';
import { Observable } from 'rxjs/Rx';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { TenantUrlData } from '../../state';

import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';

@Injectable()
export class TenantUrlDetailResolver implements Resolve<TenantUrlData>{
    constructor(private store : Store) { }
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TenantUrlData>{
        let id = route.paramMap.get('id');

        return this.store.select('tenantUrlData')
            .take(1)
            .map((list: any) => {
                console.log('list: ', list);
                return list.filter(item => item.id === id);
            })
    }
}