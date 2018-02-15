import { Component, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { TenantGroupService } from '../../services/tenant-group.service';
import { Store } from '../../../store';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { TenantGroupEndUser, TenantGroup } from '../../../state';
import AdminConstants from '../../../admin.constant';

import 'rxjs/add/operator/concatMap';

@Component({
    selector: 'tenant-group-enduser',
    styleUrls: ['tenant-group-enduser.component.scss'],
    template: `
        <div class="header-title"><span (click)="goToGroupProvision();">Group Provisioning </span> » Group Users » <span>{{groupName}}</span></div>
        <div class="tenant-group-container">
                <tenant-group-enduser-table class="table-body"
                    [groupEndUserList]="groupEndUserAllData$ | async"
                    (action) ="onTableBtnAction($event)"
                    (selected)="onTableSelected($event)"
                    [headerControls]="tableFilterControls"
                    [paginationControls]="tablePaginationControls"
                    (controlsChanged)="onTableHeaderControlsChanged($event)"
                    (paginationChanged)="onTablePaginationControlsChanged($event)">
                </tenant-group-enduser-table>
        </div>

         <!-- Modal Popup for end user actions -->
        <erag-modal [show]="showModal" [submitBtnLabel]="'OK'"
                    [cancelBtnLabel]="'Cancel'" (submit)="onModalConfirmed()"
                    customWidth="50%" (hide)="showModal = false">

            <div class="erag-modal-header">
                <span>{{(actionType=='resend')?'Resend Email':'Delete End User'}}</span>
            </div>

            <div class="erag-modal-body">
            {{(actionType=='resend')?'Are you sure if you want to resend email to the End Users?':'Are you sure if you want to delete the End User?'}}
            </div>
        </erag-modal>
     `
})

export class TenantGroupEndUserComponent implements OnInit, OnDestroy {
    tableFilterControls = {
        search: ''
    };
    groupName: string;
    tablePaginationControls = {
        itemsPerPage: 10,
        currentPage: 1,
        totalItems: 0
    };

    groupEndUserAllData$: Observable<TenantGroupEndUser[]>;
    currentGroup$: Observable<TenantGroup>;

    showModal: boolean;
    selectedList: string[];
    successMsg: string;
    actionType: string;

    private _getGroupEndUserSubscription: Subscription;
    private _deletedSubscription: Subscription;
    private _resendSubscriptindon: Subscription;

    constructor(
        private groupService: TenantGroupService,
        private store: Store,
        private router: Router,
        private activatedRoute: ActivatedRoute) {
        this.currentGroup$ = this.store.select('currentGroup')
            .filter(Boolean)
            .distinctUntilChanged();
    }

    ngOnInit() {
        this._getGroupEndUserSubscription = this.currentGroup$
            .concatMap((group: TenantGroup) => {
                this.groupName = group.name;
                return this.groupService.getTenantGroupEndUsers(group.id);
            })
            .subscribe();

        this.groupEndUserAllData$ = this.store.select('tenantGroupEndUserAllData')
            .filter(Boolean)
            .distinctUntilChanged()
            .map(groupEndUserList => {
                if (!groupEndUserList.length || !this.tableFilterControls.search) {
                    return groupEndUserList;
                }

                return this.getSearchGroupEndUserList(groupEndUserList, this.tableFilterControls.search);
            })
            .do(groupEndUserList => this.tablePaginationControls.totalItems = groupEndUserList.length)
            .map(groupEndUserList => {
                if (!groupEndUserList.length) {
                    return groupEndUserList;
                }
                return groupEndUserList.slice((this.tablePaginationControls.currentPage - 1) *
                    this.tablePaginationControls.itemsPerPage, this.tablePaginationControls.currentPage * this.tablePaginationControls.itemsPerPage);
            });
    }

    getSearchGroupEndUserList(groupEndUserList: TenantGroupEndUser[], searchValue): any[] {
        return groupEndUserList.filter(item => {
            for (const prop in item) {
                if (item.hasOwnProperty(prop) && item[prop].toString().toLowerCase().includes(searchValue.toLowerCase())) {
                    return true;
                }
            }
        });
    }

    onModalConfirmed() {
        if (this.actionType === 'delete') {
            this._deletedSubscription = this.groupService.deleteGroupEndUser(this.selectedList)
            .subscribe(
                res => {
                  this.onModalHide();
                  this.successMsg = 'Group End User deleted successfully.';
                },
                err => this.onModalHide()
            );
        } else if (this.actionType === 'resend') {
            this.groupService.resendMultiEmail(this.selectedList)
            .subscribe(
                res => {
                  this.onModalHide();
                  this.successMsg = 'Email Resend successfully.';
                },
                err => this.onModalHide()
            );
        }
    }

    onTableSelected(ids: string[]) {
        this.selectedList = ids;
    }

    onModalHide() {
        this.showModal = false;
    }

    onTableBtnAction(type: string) {
        this.actionType = type;
        this.showModal = true;
    }

    goToGroupProvision() {
        this.router.navigate(['home/tenantInfo/groups']);
    }

    ngOnDestroy() {
        if (this._getGroupEndUserSubscription) {
            this._getGroupEndUserSubscription.unsubscribe();
        }
        if (this._deletedSubscription) {
            this._deletedSubscription.unsubscribe();
        }
        if (this._resendSubscriptindon) {
            this._resendSubscriptindon.unsubscribe();
        }
    }

    onTableHeaderControlsChanged($event: any) {
        this.tableFilterControls = $event;
        const tenantApprovalList = this.store.value.tenantGroupEndUserAllData;
        this.store.set('tenantGroupEndUserAllData', Object.assign([], tenantApprovalList));
    }

    onTablePaginationControlsChanged($event: any) {
        this.tablePaginationControls = $event;
        const tenantApprovalList = this.store.value.tenantGroupEndUserAllData;
        this.store.set('tenantGroupEndUserAllData', Object.assign([], tenantApprovalList));
    }

}
