import { AuthService } from './../../../auth/services/auth.service';
import { UserProfile } from './../../../auth/services/user-profile.interface';
import { Component, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { GlobalApprovalService } from '../../services/global-approval.service';
import { Store } from '../../../store';
import { GlobalApproval } from '../../../state';
import { Observable, Subscription } from 'rxjs/Rx';
import AdminConstants from '../../../admin.constant';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';

@Component({
    selector: 'global-approval',
    styleUrls: ['global-approval.component.scss'],
    template: `
        <div class="container-fluid">
            <div class="col-md-12 marginleftallpages padding-zero">
                <div class="demo">
                    <div class="col-md-12 padding-zero">

                        <global-approval-table class="table-body"
                            [approvalList]="approvalAllData$ | async"
                            [headerControls]="tableFilterControls"
                            [paginationControls]="tablePaginationControls"
                            [userProfile] ="userProfile"
                            (approved) ="onTableBtnApproved()"
                            (rejected) ="onTableBtnRejected()"
                            (selected)="onTableSelected($event)"
                            (controlsChanged)="onTableHeaderControlsChanged($event)"
                            (paginationChanged)="onTablePaginationControlsChanged($event)">
                        </global-approval-table>
                    </div>
                </div>
            </div>
        </div>

        <global-approval-modal [show] ="showModal"
                               [action]="actionType"
                               [submitting] ="isSubmitting"
                               (hide)="onModalHide()"
                               (confirmed)="onModalConfirmed($event)">
        </global-approval-modal>
    `
})
export class GlobalApprovalComponent implements OnInit, OnDestroy {
    isSubmitting = false; // true if approving or rejecting get called

    tableFilterControls = {
        filterBy : AdminConstants.STATUS.PENDING_APPROVAL,
        fromDate: null,
        toDate: null,
        search: ''
    };
    tablePaginationControls = {
        itemsPerPage: 25,
        currentPage: 1,
        totalItems: 0
    };
    approvalAllData$: Observable<GlobalApproval[]>;

    actionType: string;
    showModal: boolean;
    selectedList: string[];

    userProfile: UserProfile;

    private _getApprovalSubscription: Subscription;
    private _approveRejectSubscription: Subscription;

    constructor(
        private approvalService: GlobalApprovalService,
        private store: Store,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.userProfile = this.authService.getUserProfile();

        this._getApprovalSubscription = this.approvalService.getGlobalApprovals()
            .subscribe();

        this.approvalAllData$ = this.store.select('globalApprovalAllData')
            .filter(Boolean)
            .distinctUntilChanged()
            .map(allTenants => allTenants.filter(tenant => tenant.status === this.tableFilterControls.filterBy))
            .map(filteredTenants => {
                if (!filteredTenants.length || !this.tableFilterControls.fromDate) {
                    return filteredTenants;
                }

                return filteredTenants.filter(tenant =>
                    new Date(tenant.created_on).getTime() >= this.tableFilterControls.fromDate.getTime());
            })
            .map(tenantList => {
                if (!tenantList.length || !this.tableFilterControls.toDate) {
                    return tenantList;
                }

                return tenantList.filter(tenant =>
                    new Date(tenant.created_on).getTime() <= this.tableFilterControls.toDate.getTime());

            })
            .map(tenantList => {
                if (!tenantList.length || !this.tableFilterControls.search) {
                    return tenantList;
                }

                return this.getSearchTenantList(tenantList, this.tableFilterControls.search);
            })
            .do(tenantList => this.tablePaginationControls.totalItems = tenantList.length)
            .map(tenantList => {
                if (!tenantList.length) {
                    return tenantList;
                }
                return tenantList.slice((this.tablePaginationControls.currentPage - 1) *
                    this.tablePaginationControls.itemsPerPage, this.tablePaginationControls.currentPage * this.tablePaginationControls.itemsPerPage);
            });
    }

    getSearchTenantList(tenantList: GlobalApproval[], searchValue): any[] {
        return tenantList.filter(item => {
            for (const prop in item) {
                if (item.hasOwnProperty(prop) && item[prop].toString().toLowerCase().includes(searchValue.toLowerCase())) {
                    return true;
                }
            }
        });
    }

    onModalConfirmed(confirm: {action: string, message: string}) {
        this.isSubmitting = true;
        const status = (confirm.action === 'approve') ? AdminConstants.STATUS.APPROVED : AdminConstants.STATUS.REJECTED;
        this._approveRejectSubscription = this.approvalService.requestApprovedReject(this.selectedList, status, confirm.message)
            .subscribe(
                res => {
                  this.isSubmitting = false;
                  this.onModalHide();
                  const successMsg = (confirm.action === 'approve') ? 'Request approved successfully.' : 'Request rejected successfully.';
                },
                err => {
                    this.isSubmitting = false;
                    this.onModalHide();
                }
            );
    }

    onTableSelected(ids: string[]) {
        this.selectedList = ids;
    }

    onModalHide() {
        this.showModal = false;
    }

    onTableBtnApproved() {
        this.actionType = 'approve';
        this.showModal = true;
    }

    onTableBtnRejected() {
        this.actionType = 'reject';
        this.showModal = true;
    }

    ngOnDestroy() {
        if (this._getApprovalSubscription) {
            this._getApprovalSubscription.unsubscribe();
        }
        if (this._approveRejectSubscription) {
            this._approveRejectSubscription.unsubscribe();
        }
    }

    onTableHeaderControlsChanged($event: any) {
        this.tableFilterControls = $event;
        const globalApprovalList = this.store.value.globalApprovalAllData;
        this.store.set('globalApprovalAllData', Object.assign([], globalApprovalList));
    }

    onTablePaginationControlsChanged($event: any) {
        this.tablePaginationControls = $event;
        const globalApprovalList = this.store.value.globalApprovalAllData;
        this.store.set('globalApprovalAllData', Object.assign([], globalApprovalList));
    }

}
