import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { API_TOKEN } from '../../api.token';
import { Store } from '../../store';



export interface TenantSaveResponse {
    status: string;
    errorCode?: Number;
    errorDetail?: string;
    data?: any;
}

export interface DataResponse {
    status: string;
    data?: any[];
    errorCode?: Number;
    errorDetail?: string;
}

interface TenantParams {
    tenantID: string | null;
}

@Injectable()
export class TenantService {

    constructor(private http: HttpClient,
        private store: Store,
        @Inject(API_TOKEN) private api: string
    ) {
    }


    // Function is used to save the tenant data
    saveTenant(tenantData) {
        return this.http.post<TenantSaveResponse>(this.api + '/tenants', tenantData)
            .retry(1)
            .do((res: any) => {
                if (res.data) {
                    // update allTenant appState
                    if (res.data.globalTenant && res.data.globalTenant.length) {
                        const allTenants = this.store.value.allTenants;
                        this.store.set('allTenants', Object.assign([], allTenants.concat(res.data.globalTenant)));
                    }

                    // update global Provision State
                    if (res.data.globalApproval && res.data.globalApproval.length) {
                        const allGlobalApprovals = this.store.value.globalApprovalAllData;
                        this.store.set('globalApprovalAllData', Object.assign([], allGlobalApprovals.concat(res.data.globalApproval)));
                    }
                }
            }).catch(err => {
                return Observable.throw(err);
            });
    }

    editTenant(tenantData: any, tenantId: string) {
        return this.http.put<TenantSaveResponse>(this.api + '/tenants/' + tenantId, tenantData)
            .retry(1)
            .do((res: any) => {
                if (res.data) {
                    // update allTenant appState
                    if (res.data.globalTenant && res.data.globalTenant.length) {
                        const allTenants = this.store.value.allTenants.map(tenant => {
                            if (tenant.id === tenantId) {
                                return res.data.globalTenant[0];
                            }
                            return tenant;
                        });
                        this.store.set('allTenants', Object.assign([], allTenants));
                    }

                    // update global Approval State
                    if (res.data.globalApproval && res.data.globalApproval.length) {
                        const globalApprovals = this.store.value.globalApprovalAllData.map(approval => {
                            if (approval.id === res.data.globalApproval[0].id) {
                                return res.data.globalApproval[0];
                            }
                            return approval;
                        });
                        this.store.set('globalApprovalAllData', Object.assign([], globalApprovals));
                    }
                }
            })
            .catch(err => {
                return Observable.throw(err);
            });
    }

    deleteTenants(deleteList: { id: string, status: string }[]) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const params = new HttpParams().set('tenantIds', JSON.stringify(deleteList));
        return this.http.delete<any>(this.api + '/tenants', { headers, params })
            .retry(1)
            .do((res: any) => {
                if (res.statusCode === 200) {
                    const tenantList = this.store.value.allTenants;
                    deleteList.forEach(item => {
                        tenantList.some((tenant, index) => {
                            if (tenant.id === item.id) {
                                tenantList.splice(index, 1);
                                return true;
                            }
                        });
                    });

                    const globalApproval = this.store.value.globalApprovalAllData;
                    deleteList.forEach(item => {
                        globalApproval.some((approval, index) => {
                            if (approval.tenant._id === item.id) {
                                globalApproval.splice(index, 1);
                                return true;
                            }
                        });
                    });

                    if (res.data) { // users did delete approval tenant
                        // update allTenant
                        if (res.data.globalTenant && res.data.globalTenant.length) {
                            tenantList.push(...res.data.globalTenant);
                        }
                        if (res.data.globalApproval && res.data.globalApproval.length) {
                            globalApproval.push(...res.data.globalApproval);
                        }

                    }
                    // update allTenant appState
                    this.store.set('allTenants', Object.assign([], tenantList));

                    // update global Approval State
                    this.store.set('globalApprovalAllData', Object.assign([], globalApproval));

                }
            })
            .catch(err => {
                return Observable.of(err);
            });
    }

    // Function is used to fetch tenant users
    getTenantUsers(tenantID: string | null) {
        return this.http.get<DataResponse>(this.api + '/tenants/' + tenantID + '/users')
            .retry(1)
            .map(res => {
                if (res.data) {
                    if (res.data.length) {
                        return res.data;
                    }
                    return Observable.throw(res);
                }
            })
            .catch(err => {
                return Observable.of(err);
            });
    }


    private _generateHttpParams(paramObject: TenantParams) {
        return new HttpParams()
            .set('tenantID', paramObject.tenantID);
    }
}
