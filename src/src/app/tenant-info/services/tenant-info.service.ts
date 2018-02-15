import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { API_TOKEN } from '../../api.token';
import { TenantUrlData } from '../../state';
import { Store } from '../../store';

interface UrlParams {
    tenant: string | null;
}

interface UserParams {
    tenant: string;
    role: string;
}

interface GroupParams {
    tenant: string | null;
}

export interface TenantURLDataResponse {
    status: string;
    data: any[];
    [propName: string]: any;
}

@Injectable()
export class TenantInfoService {
    private header: HttpHeaders;
    constructor(
        private http: HttpClient,
        @Inject(API_TOKEN) private api: string,
        private store: Store) {
        this.header = new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded');
    }

    addTenantUrlData(data: TenantUrlData): Observable<any> {
        console.log('############ svain tenant url#############');
        return this.http.post<Observable<any>>(this.api + '/urls', data)
            .retry(1)
            .do((res: any) => {
                if (res.data && res.data.length) {
                    const urlDataList = this.store.value.tenantUrlData;
                    this.store.set('tenantUrlData', Object.assign([], urlDataList, res.data));
                }
            })
            .catch(err => Observable.of(err));
    }

    editTenantUrlData(urlData: TenantUrlData): Observable<any> {
        return this.http.put<Observable<any>>(this.api + `/urls/${urlData.id}`, urlData)
            .retry(1)
            .do((res: any) => {
                if (res.data && res.data.length) {
                    const urlDataList = this.store.value.tenantUrlData;
                    this.store.set('tenantUrlData', Object.assign([], urlDataList, res.data));
                }
            })
            .catch(err => Observable.of(err));
    }

    getUrlDetails(tenant: string | null) {
        const params = this._generateUrlHttpParams({ 'tenant': tenant });

        return this.http.get<TenantURLDataResponse>(this.api + '/urls', { params: params })
            .retry(1)
            .do(res => this.store.set('tenantUrlData', res.data))
            .map((noContent: any) => {
                if (noContent.errorCode === '204') {
                    return Observable.throw(noContent);
                }
            })
            .catch(err => {
                console.log('Error :', err);
                this.store.set('tenantUrlData', undefined);
                return Observable.of(err);
            });
    }

    // Function is used to delete the url
    deleteUrls(ids: string[]) {
        const observableBatch = [];
        ids.forEach((id, key) => {
            const params = new HttpParams().set('id', id);
            observableBatch.push(
                this.http.delete<any>(this.api + '/urls', { params: params })
            );
        });
        return Observable.forkJoin(observableBatch).do((res: any) => {
            const allURLData = this.store.value.tenantUrlData.filter(url => {
                let isNotExist;
                isNotExist = true;
                ids.forEach(id => {
                    if (id === url.id) {
                        isNotExist = false;
                    }
                });
                return isNotExist;
            });
            this.store.set('tenantUrlData', Object.assign([], allURLData));
        }).catch(err => {
            return Observable.throw(err);
        });
    }

    saveSSOUrl(ssoDetails: any) {
        console.log('ssoDetails ::', ssoDetails);
        return this.http.put<Observable<any>>(this.api + `/tenants/${ssoDetails.tenant}`, ssoDetails)
            .retry(1)
            .do((res: any) => {
                if (res.data && res.data.length) {
                    console.log('Updated Successfully');
                }
            })
            .catch(err => Observable.of(err));
    }

    submitWhitelistIpsForm(ips: string[]) {
        const currentTenant = this.store.value.currentTenant;
        return this.http.put<Observable<any>>(this.api + `/tenants/${currentTenant.id}/whitelist`, { whitelistIps: ips })
            .retry(1)
            .do((res: any) => {
                if (res.statusCode === 200 && !!res.data) {
                    this._updateAllTenantsAndCurrentTenant(res.data);
                }
            })
            .catch(err => Observable.of(err));
    }

    submitTwoFactorForm(twoFactorDetail: any) {
        const currentTenant = this.store.value.currentTenant;
        return this.http.put<Observable<any>>(this.api + `/tenants/${currentTenant.id}/twofa`, twoFactorDetail)
            .retry(1)
            .do((res: any) => {
                if (res.statusCode === 200 && !!res.data) {
                    this._updateAllTenantsAndCurrentTenant(res.data);
                }
            })
            .catch(err => Observable.of(err));
    }

    submitGateWayForm(GatewayDetails: any) {
        const currentTenant = this.store.value.currentTenant;
        return this.http.put<Observable<any>>(this.api + `/tenants/${currentTenant.id}/gateway`, GatewayDetails)
            .retry(1)
            .do((res: any) => {
                if (res.statusCode === 200 && !!res.data) {
                    this._updateAllTenantsAndCurrentTenant(res.data);
                }
            })
            .catch(err => Observable.of(err));
    }

    validateActiveDirectoryForm(ldapSettings: any) {
        const currentTenant = this.store.value.currentTenant;
        ldapSettings.gateway_dns = this.store.value.currentTenant.settings.gateway_dns;
        // we need gateway dns to validate connection
        // TODO: if gateway dns is not set not need to invoke validate connection
        return this.http.post<Observable<any>>(this.api + `/tenants/${currentTenant.id}/active_directory/validate`, ldapSettings)
            .retry(1)
            .catch(err => Observable.of(err));
    }

    submitActiveDirectoryForm(ldapSettings: any) {
        const currentTenant = this.store.value.currentTenant;
        return this.http.post<Observable<any>>(this.api + `/tenants/${currentTenant.id}/active_directory/submit`, ldapSettings)
            .retry(1)
            .do((res: any) => {
                if (res.statusCode === 200 && !!res.data) {
                    this._updateAllTenantsAndCurrentTenant(res.data);
                }
            })
            .catch(err => Observable.of(err));
    }

    deployTenantSettingForm() {
        const currentTenant = this.store.value.currentTenant;
        return this.http.post<Observable<any>>(this.api + `/tenants/${currentTenant.id}/deploy`, {})
            .catch(err => Observable.of(err));
    }

    getApproverList(tenant, role) {
        const params = this._generateUserHttpParams({ tenant, role });
        return this.http.get<TenantURLDataResponse>(this.api + '/users', { params: params })
            .retry(1)
            .catch(err => Observable.of(err));
    }

    // Function is used to get users by roles
    getUsersByRole(tenant, role) {
        const params = this._generateUserHttpParams({ tenant, role });
        return this.http.get<TenantURLDataResponse>(this.api + '/tenants/adminusers', { params: params })
            .retry(1)
            .catch(err => Observable.of(err));
    }

    // Function is used to fetch all user roles
    getUserRoles() {
        return this.http.get<TenantURLDataResponse>(this.api + '/tenants/userroles')
            .retry(1)
            .catch(err => Observable.of(err));
    }

    getGroupList(tenant: string | null) {
        const params = this._generateGroupHttpParams({ tenant });
        return this.http.get<TenantURLDataResponse>(this.api + '/groups', { params: params })
            .retry(1)
            .catch(err => Observable.of(err));
    }

    private _generateHttpParams(paramObject: UrlParams) {
        return new HttpParams()
            .set('tenantName', paramObject.tenant);
    }

    private _generateUrlHttpParams(paramObject: UrlParams) {
        return new HttpParams()
            .set('tenant', paramObject.tenant);
    }

    private _generateUserHttpParams(paramObject: UserParams) {
        return new HttpParams()
            .set('tenant', paramObject.tenant)
            .set('role', paramObject.role)
            .set('status', 'Approved');
    }

    private _generateGroupHttpParams(paramObject: GroupParams) {
        return new HttpParams()
            .set('tenant', paramObject.tenant);
    }

    private _generateDeleteRequest(deleteUrlData, source) {
        console.log(deleteUrlData);
        return false;
    }


    private _updateAllTenantsAndCurrentTenant(newTenant) {
        const currentTenant = this.store.value.currentTenant;
        const tenantList = this.store.value.allTenants.filter(tenant => tenant.id !== currentTenant.id);
        tenantList.push(newTenant);

        this.store.set('allTenants', Object.assign([], tenantList));

        this.store.set('currentTenant', Object.assign({}, newTenant));
    }
}
