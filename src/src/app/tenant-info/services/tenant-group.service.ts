import { Store } from '../../store';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_TOKEN } from '../../api.token';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/retry';
import 'rxjs/Rx';
import 'rxjs/add/observable/forkJoin';

import { TenantGroup, TenantGroupEndUser, AdSyncGroup } from '../../state';

interface GroupParams {
    tenant: string | null;
}

interface AdSyncGroupParams {
    search_group_name: string | null;
}

interface GroupEndUserParams {
    group: string | null;
}

export interface DataResponse {
    status: string;
    data?: any[];
    errorCode?: Number;
    errorDetail?: string;
}

export interface GroupRequestResponse {
    status: string;
    errorCode?: Number;
    errorDetail?: string;
}

export interface DeleteGroupInterface {
    'id': string[];
}

@Injectable()
export class TenantGroupService {
    constructor(
        private http: HttpClient,
        private store: Store,
        @Inject(API_TOKEN) private api: string
    ) { }

    // Function is used to fetch tenant specific Group Data
    getTenantGroups(tenant: string | null) {
        const params = this._generateTenantGroupHttpParams({ 'tenant': tenant });

        return this.http.get<TenantGroup>(this.api + '/tenants/groups', { params: params })
            .retry(1)
            .do(res => this.store.set('tenantGroupAllData', res.data))
            .catch(err => {
                console.log('Error :', err);
                this.store.set('tenantGroupAllData', undefined);
                return Observable.of(err);
            });
    }

    deleteGroups(ids: string[]) {
        const observableBatch = [];
        ids.forEach((id, key) => {
            const params = new HttpParams().set('id', id);
            observableBatch.push(
                this.http.delete<TenantGroup>(this.api + '/tenants/groups', { params: params })
            );
        });
        return Observable.forkJoin(observableBatch).do((res: any) => {
            const allGroupData = this.store.value.tenantGroupAllData.filter(group => {
                let isNotExist;
                isNotExist = true;
                ids.forEach(id => {
                    if (id === group.id) {
                        isNotExist = false;
                    }
                });
                return isNotExist;
            });
            this.store.set('tenantGroupAllData', Object.assign([], allGroupData));
        }).catch(err => {
            return Observable.throw(err);
        });
    }

    // Function is used to delete the end users

    deleteGroupEndUser(ids: string[]) {
        const observableBatch = [];
        ids.forEach((id, key) => {
            const params = new HttpParams().set('id', id);
            observableBatch.push(
                this.http.delete<TenantGroup>(this.api + '/tenants/groups/enduser', { params: params })
            );
        });
        return Observable.forkJoin(observableBatch).do((res: any) => {
            const allGroupEndUserData = this.store.value.tenantGroupEndUserAllData.filter(enduser => {
                let isNotExist;
                isNotExist = true;
                ids.forEach(id => {
                    if (id === enduser.id) {
                        isNotExist = false;
                    }
                });
                return isNotExist;
            });
            this.store.set('tenantGroupEndUserAllData', Object.assign([], allGroupEndUserData));
        }).catch(err => {
            return Observable.throw(err);
        });
    }

    // Function is used to delete the end users

    resendMultiEmail(ids: string[]) {
      const observableBatch = [];
        ids.forEach((id, key) => {
            // const params = new HttpParams().set('id', id);
            observableBatch.push(
                this.http.put<TenantGroupEndUser>(this.api + '/tenants/groups/resend', {
                id: id
            })
            );
        });
        return Observable.forkJoin(observableBatch).do((res: any) => {
            const allGroupEndUserData = this.store.value.tenantGroupEndUserAllData.filter(group => {
                let isNotExist;
                isNotExist = true;
                ids.forEach(id => {
                    if (id === group.id) {
                        isNotExist = false;
                    }
                });
                return isNotExist;
            });
            console.log(res);
            const updatedEndUser = [];

            res.forEach(enduser => {
                console.log(enduser);
                updatedEndUser.push(enduser.data);
            });

            this.store.set('tenantGroupEndUserAllData', Object.assign([], allGroupEndUserData, updatedEndUser));
        }).catch(err => {
            return Observable.throw(err);
        });
    }

    // Function is used to save group data
    addTenantGroup(groupData: any): Observable<any> {
        console.log(groupData);
        return this.http.post<Observable<any>>(this.api + '/tenants/groups', groupData)
            .retry(1)
            .do((res: any) => {
                if (res.data && res.data.length) {
                    const groupDataList = this.store.value.tenantGroupAllData;
                    this.store.set('tenantGroupAllData', Object.assign([], groupDataList, res.data));
                }
            })
            .catch(err => Observable.of(err));
    }

    // Function is used to fetch tenant specific Group end user data
    getTenantGroupEndUsers(group: string | null) {
        const params = this._generateGroupEndUserHttpParams({ 'group': group });

        return this.http.get<TenantGroupEndUser>(this.api + '/tenants/groups/endusers', { params: params })
            .retry(1)
            .do(res => this.store.set('tenantGroupEndUserAllData', res.data))
            .catch(err => {
                console.log('Error :', err);
                this.store.set('tenantGroupEndUserAllData', undefined);
                return Observable.of(err);
            });
    }

    getTenantAdSyncGroups(searchString: string, tenant: string | null) {
        const params = this._generateTenantAdSyncGroupHttpParams({ 'search_group_name': searchString });

        return this.http.get<AdSyncGroup>(this.api + '/tenants/' + tenant + '/active_directory', { params: params })
            .retry(1)
            .do(res => this.store.set('tenantAdSyncGroupAllData', res.data))
            .catch(err => {
                console.log('Error :', err);
                this.store.set('tenantAdSyncGroupAllData', undefined);
                return Observable.of(err);
            });
    }

    // Function is used to save group data
    addTenantAdSyncGroup(groupData: any, tenant: string | null): Observable<any> {
        return this.http.post<Observable<any>>(this.api + '/tenants/' + tenant + '/active_directory', groupData)
            .retry(1)
            .do((res: any) => {
                if (res.data && res.data.length) {
                    const groupDataList = this.store.value.tenantGroupAllData;
                    this.store.set('tenantGroupAllData', Object.assign([], groupDataList, res.data));
                }
            })
            .catch(err => Observable.of(err));
    }


    private _generateTenantGroupHttpParams(paramObject: GroupParams) {
        return new HttpParams()
            .set('tenant', paramObject.tenant);
    }

    private _generateGroupEndUserHttpParams(paramObject: GroupEndUserParams) {
        return new HttpParams()
            .set('group', paramObject.group);
    }

    private _generateTenantAdSyncGroupHttpParams(paramObject: AdSyncGroupParams) {
        return new HttpParams()
            .set('search_group_name', paramObject.search_group_name);
    }

}
