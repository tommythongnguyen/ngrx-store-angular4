import { Notification } from '../../state';
import { Store } from '../../store';
import { API_TOKEN } from '../../api.token';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/retry';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import { Observable } from 'rxjs/Observable';


import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Tenant } from '../../state';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class HomeService {
    constructor(private http: HttpClient,
        private store: Store,
        @Inject(API_TOKEN) private api: string
    ) { }
    getNotifications() {
        return this.http.get<Notification>(this.api + '/activities/log')
            .do((res: any) => {
                this.store.set('notification', { count: res.data.count, activityLogs: res.data.data });
                console.log('notification: ', res.data);

            })
            .catch(err => {
                this.store.set('notification', undefined);
                return Observable.of(err);
            });
    }

    getTenants(tenantId?: string): Observable<Tenant[]> {
        const params = new HttpParams().set('tenantid', tenantId);

        return this.http.get<Tenant[]>(this.api + '/tenants', { params: params })
            .retry(1)
            .map((res: any) => res)
            .filter(Boolean)
            .do(tenants => {
                this.store.set('allTenants', tenants);
            })
            .catch(err => {
                this.store.set('allTenants', undefined);
                return Observable.throw(err);
            });
    }
}
