import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { API_TOKEN } from '../../api.token';
import { TenantUser } from '../../state';
import { Store } from '../../store';

interface UserParams {
    tenant: string | null;
}

export interface TenantUserDataResponse {
    status: string;
    [propName: string]: any;
}


@Injectable()
export class TenantUserService {
    private header: HttpHeaders;
    constructor(private http: HttpClient, @Inject(API_TOKEN) private api: string, private store: Store) {
        this.header = new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded');
    }

    addTenantUserData(data: TenantUser): Observable<any> {
        return this.http.post<Observable<any>>(this.api + '/tenants/adminusers', data)
            .retry(1)
            .do((res: any) => {
                const userDataList = this.store.value.tenantUserData;
                this.store.set('tenantUserData', Object.assign([], userDataList, res));
            })
            .catch(err => Observable.of(err));
    }

    getUserDetails(tenant: string | null) {
        const params = this._generateTenantUserHttpParams({ 'tenant': tenant });

        return this.http.get<TenantUserDataResponse>(this.api + '/tenants/adminusers', { params: params })
            .retry(1)
            .do(res => this.store.set('tenantUserData', res))
            .map((noContent: any) => {
                if (noContent.errorCode === '204') {
                    return Observable.throw(noContent);
                }
            })
            .catch(err => {
                console.log('Error :', err);
                this.store.set('tenantUserData', undefined);
                return Observable.of(err);
            });
    }

    deleteUsers(ids: string[]) {
        const observableBatch = [];
        ids.forEach((id, key) => {
            const params = new HttpParams().set('id', id);
            observableBatch.push(
                this.http.delete<TenantUser>(this.api + '/tenants/adminusers', { params: params })
            );
        });
        return Observable.forkJoin(observableBatch).do((res: any) => {
            const allUserData = this.store.value.tenantUserData.filter(user => {
                let isNotExist;
                isNotExist = true;
                ids.forEach(id => {
                    if (id === user.id) {
                        isNotExist = false;
                    }
                });
                return isNotExist;
            });
            this.store.set('tenantUserData', Object.assign([], allUserData));
        }).catch(err => {
            return Observable.throw(err);
        });
    }

    private _generateTenantUserHttpParams(paramObject: UserParams) {
        return new HttpParams()
            .set('tenant', paramObject.tenant);
    }

}
