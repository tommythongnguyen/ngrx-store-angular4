import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import 'rxjs/Rx';

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { API_TOKEN } from '../../api.token';
import { Store } from '../../store';

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
export class GlobalApprovalService {
    constructor(
        private http: HttpClient,
        private store: Store,
        @Inject(API_TOKEN) private api: string
    ) { }

    // Function is used to fetch global Apporval Data
    getGlobalApprovals() {
        return this.http.get<DataResponse>(this.api + '/approvals')
            .retry(1)
            .do(res => this.store.set('globalApprovalAllData', Object.assign([], res.data)))
            .catch(err => {
                this.store.set('globalApprovalAllData', []);
                return Observable.of(err);
            });
    }

    // Call to approval service
    requestApprovedReject(approvalRequestsIds: string[], status: string, comments?: string) {
        return this.http.put<ApprovalRequestResponse>(this.api + '/approvals', {
            ids: approvalRequestsIds,
            comments: comments,
            status: status
        })
            .retry(1)
            .do(((res: any) => {
                if (res.statusCode === 200) {
                    const allTenants = this.store.value.allTenants;

                    // get all global Approval
                    const globalApproval = this.store.value.globalApprovalAllData;

                    approvalRequestsIds.forEach(id => {
                        globalApproval.some((approval, index) => {
                            if (approval.id === id) {
                                globalApproval.splice(index, 1);
                                return true;
                            }
                        });
                    });

                    if (res.data.rejectedTenantIds && res.data.rejectedTenantIds.length) {
                        res.data.rejectedTenantIds.forEach(_id => {
                            globalApproval.forEach((approval, index) => {
                                if (approval.tenant._id === _id) {
                                    globalApproval.splice(index, 1);
                                }
                            });
                        });
                    }

                    if (!!res.data) { // users did delete approval tenant
                        // update allTenant
                        if (Array.isArray(res.data.globalTenant)) {
                            // update allTenant appState
                            this.store.set('allTenants', Object.assign([], res.data.globalTenant));
                        }
                        if (res.data.globalApproval && res.data.globalApproval.length) {
                            globalApproval.push(...res.data.globalApproval);
                        }

                    }

                    // update global Approval State
                    this.store.set('globalApprovalAllData', Object.assign([], globalApproval));
                }
            }))
            .catch(err => {
                return Observable.of(err);
            });

    }
}
