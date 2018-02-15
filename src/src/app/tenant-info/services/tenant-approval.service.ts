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

import { TenantApproval } from '../../state';

interface ApprovalParams {
    tenant: string | null;
}

export interface DataResponse {
    status: string;
    data?: any[];
    errorCode?: Number;
    errorDetail?: string;
}

export interface ApprovalRequestResponse {
    status: string;
    errorCode?: Number;
    errorDetail?: string;
    data?: any;
}

@Injectable()
export class TenantApprovalService {
    constructor(
        private http: HttpClient,
        private store: Store,
        @Inject(API_TOKEN) private api: string
    ) { }

    // Function is used to fetch tenant specific Approval Data
    getTenantApprovals(tenant: string | null) {
        const params = this._generateTenantApprovalHttpParams({ 'tenant': tenant });

        return this.http.get<TenantApproval>(this.api + '/tenants/approvals', { params: params })
            .retry(1)
            .do(res => this.store.set('tenantApprovalAllData', res.data))
            .catch(err => {
                console.log('Error :', err);
                this.store.set('tenantApprovalAllData', undefined);
                return Observable.of(err);
            });
    }

    // Call to approval service
    requestApprovedReject(approvalRequestsIds: string [], status: string, comments?: string) {
        return this.http.put<ApprovalRequestResponse>(this.api + '/approvals', {
                ids: approvalRequestsIds,
                comments: comments,
                status: status
            })
            .retry(1)
            .do((res) => {
                // update global Provision State from all data sent by backend
                if (res.data.globalApproval && res.data.globalApproval.length) {
                    this.store.set('globalApprovalAllData', Object.assign([], res.data.globalApproval));
                }
                // update allTenant appState from all data sent by backend
                if (res.data.globalTenant && res.data.globalTenant.length) {
                    this.store.set('allTenants', Object.assign([], res.data.globalTenant));
                }
            })
            .catch(err => {
                return Observable.of(err);
            });



    //    const observableBatch = [];

    //     approvalRequests.forEach((id, key) => {
    //         observableBatch.push(
    //             this.http.put<ApprovalRequestResponse>(this.api + '/tenants/' + id + '/approvals', {
    //                 id: id,
    //                 comments: comments,
    //                 status: status
    //             })
    //         );
    //     });
    //     return Observable.forkJoin(observableBatch).do((res: any) => {
    //         const updateApproval = [];
    //         let allApprovers;
    //         for (let i = 0; i < res.length; i++) {
    //             allApprovers = this.store.value.tenantApprovalAllData.filter(approval => {
    //                 approvalRequests.forEach(id => {
    //                     if (id === approval.id) {
    //                         return false;
    //                     }
    //                 });
    //                 return true;
    //             });
    //             updateApproval.push(res[i]);
    //         }
    //         this.store.set('tenantApprovalAllData', Object.assign([], allApprovers, updateApproval));
    //     }).catch(err => {
    //         return Observable.throw(err);
    //     });
    }

    private _generateTenantApprovalHttpParams(paramObject: ApprovalParams) {
        return new HttpParams()
            .set('tenant', paramObject.tenant);
    }

}
