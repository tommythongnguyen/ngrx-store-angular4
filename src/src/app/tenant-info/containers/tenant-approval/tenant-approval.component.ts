import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

import AdminConstants from '../../../admin.constant';
import { Tenant, TenantApproval } from '../../../state';
import { Store } from '../../../store';
import { TenantApprovalService } from '../../services/tenant-approval.service';



@Component({
    selector: 'tenant-approval',
    styleUrls: ['tenant-approval.component.scss'],
    template: `
        <div class="header-title">Approval</div>
        <div class="tenant-approval-container">
                <tenant-approval-table class="table-body"
                    [approvalList]="approvalAllData$ | async"
                    (approved) ="onTableBtnApproved()"
                    (rejected) ="onTableBtnRejected()"
                    (selected)="onTableSelected($event)"
                    [headerControls]="tableFilterControls"
                    [paginationControls]="tablePaginationControls"
                    (controlsChanged)="onTableHeaderControlsChanged($event)"
                    (paginationChanged)="onTablePaginationControlsChanged($event)">
                </tenant-approval-table>
        </div>

        <tenant-approval-modal [show] ="showModal"
                               [action]="actionType"
                               (hide)="onModalHide()"
                               (confirmed)="onModalConfirmed($event)">
        </tenant-approval-modal>
     `
})

export class TenantApprovalComponent implements OnInit, OnDestroy {
    tableFilterControls = {
        filterBy: AdminConstants.STATUS.PENDING_APPROVAL,
        fromDate: null,
        toDate: null,
        search: ''
    };
    tablePaginationControls = {
        itemsPerPage: 10,
        currentPage: 1,
        totalItems: 0
    };

    approvalAllData$: Observable<TenantApproval[]>;

    actionType: string;
    showModal: boolean;
    selectedList: string[];

    private _getApprovalSubscription: Subscription;
    private _approveRejectSubscription: Subscription;

    infoTenant$: Observable<Tenant> = this.store.select('currentTenant')
        .filter(Boolean)
        .distinctUntilChanged()
        .share();

    constructor(private approvalService: TenantApprovalService, private store: Store) {

    }

    ngOnInit() {

        this.infoTenant$.subscribe((tenant: Tenant) => {
            this.approvalService.getTenantApprovals(tenant.id)
                .map(res => res.data).subscribe();
        });

        this.approvalAllData$ = this.store.select('tenantApprovalAllData')
            .filter(Boolean)
            .distinctUntilChanged()
            .map(allApprovals => {
                console.log(allApprovals);
                return allApprovals.filter(approval => approval.status === this.tableFilterControls.filterBy);
            })
            .map(filteredApprovals => {
                if (!filteredApprovals.length || !this.tableFilterControls.fromDate) {
                    return filteredApprovals;
                }

                return filteredApprovals.filter(approval =>
                    new Date(approval.created_on).getTime() >= this.tableFilterControls.fromDate.getTime());
            })
            .map(approvalList => {
                if (!approvalList.length || !this.tableFilterControls.toDate) {
                    return approvalList;
                }

                return approvalList.filter(approval =>
                    new Date(approval.created_on).getTime() <= this.tableFilterControls.toDate.getTime());

            })
            .map(approvalList => {
                if (!approvalList.length || !this.tableFilterControls.search) {
                    return approvalList;
                }

                return this.getSearchApprovalList(approvalList, this.tableFilterControls.search);
            })
            .do(approvalList => this.tablePaginationControls.totalItems = approvalList.length)
            .map(approvalList => {
                if (!approvalList.length) {
                    return approvalList;
                }
                return approvalList.slice((this.tablePaginationControls.currentPage - 1) *
                    this.tablePaginationControls.itemsPerPage, this.tablePaginationControls.currentPage * this.tablePaginationControls.itemsPerPage);
            });
    }

    getSearchApprovalList(approvalList: TenantApproval[], searchValue): any[] {
        return approvalList.filter(item => {
            for (const prop in item) {
                if (item.hasOwnProperty(prop) && item[prop].toString().toLowerCase().includes(searchValue.toLowerCase())) {
                    return true;
                }
            }
        });
    }

    onModalConfirmed(confirm: { action: string, message: string }) {
        const status = (confirm.action === 'approve') ? AdminConstants.STATUS.APPROVED : AdminConstants.STATUS.REJECTED;
        this._approveRejectSubscription = this.approvalService.requestApprovedReject(this.selectedList, status, confirm.message)
            .subscribe(
            res => {
                this.onModalHide();
                const successMsg = (confirm.action === 'approve') ? 'Request approved successfully.' : 'Request rejected successfully.';
            },
            err => this.onModalHide()
            );
    }

    onTableSelected(ids: string[]) {
        console.log(ids);
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
        const tenantApprovalList = this.store.value.tenantApprovalAllData;
        this.store.set('tenantApprovalAllData', Object.assign([], tenantApprovalList));
    }

    onTablePaginationControlsChanged($event: any) {
        this.tablePaginationControls = $event;
        const tenantApprovalList = this.store.value.tenantApprovalAllData;
        this.store.set('tenantApprovalAllData', Object.assign([], tenantApprovalList));
    }

}
