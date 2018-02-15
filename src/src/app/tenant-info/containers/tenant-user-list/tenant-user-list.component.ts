import 'rxjs/add/operator/catch';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';

import { Tenant, TenantUser } from '../../../state';
import { Store } from '../../../store';
import { TenantUserService } from '../../services/tenant-user.service';



@Component({
    selector: 'tenant-user',
    styleUrls: ['tenant-user-list.component.scss'],
    template: `
        <div class="header-title">User Provisioning</div>
        <div class="tenant-user-container">
                <div [hidden]="!successMsg" class="alert alert-success userprovninfomargin" role="alert" id="tntapprvmsg">{{successMsg}}</div>
                <tenant-user-table class="table-body"
                                  [userList]="usersAllData$ | async"
                                  (add) ="onClickAddTenantUserData()"
                                  (selected)="onUsersSeleted($event)"
                                  (deleted)="onDeleteBtnClick()"
                                  [headerControls]="tableFilterControls"
                                [paginationControls]="tablePaginationControls"
                                (controlsChanged)="onTableHeaderControlsChanged($event)"
                                (paginationChanged)="onTablePaginationControlsChanged($event)">
                </tenant-user-table>
        </div>

        <!-- Modal Popup for Delete Tenant -->
        <erag-modal [show]="showDeleteModal" [submitBtnLabel]="'OK'"
                    [cancelBtnLabel]="'Cancel'" (submit)="onDeleteTenantUserModalConfirmed()"
                    customWidth="50%" (hide)="showDeleteModal = false">

            <div class="erag-modal-header">
                <span>Delete User</span>
            </div>

            <div class="erag-modal-body" style="color:green;padding:10px;">
                Are you sure if you want to delete the User?
            </div>
        </erag-modal>
     `
})

export class TenantUserListComponent implements OnInit, OnDestroy {

    tableFilterControls = {
        search: ''
    };
    tablePaginationControls = {
        itemsPerPage: 10,
        currentPage: 1,
        totalItems: 0
    };

    usersAllData$: Observable<TenantUser[]>;

    errMessage: string;

    showDeleteModal = false;
    selectedList: string[];
    successMsg: string;

    private _getTenantUserListSubscription: Subscription;
    private _deleteTenantUserSubscription: Subscription;

    infoTenant$: Observable<Tenant> = this.store.select('currentTenant')
        .filter(Boolean)
        .distinctUntilChanged()
        .share();

    constructor(
        private tenantUserService: TenantUserService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private store: Store) {
    }

    ngOnInit() {
        this.infoTenant$.subscribe((tenant: Tenant) => {
            this.tenantUserService.getUserDetails(tenant.id)
                .subscribe();
        });

        this.usersAllData$ = this.store.select('tenantUserData')
            .filter(Boolean)
            .distinctUntilChanged()
            .map(userList => {
                if (!userList.length || !this.tableFilterControls.search) {
                    return userList;
                }

                return this.getSearchUserList(userList, this.tableFilterControls.search);
            })
            .do(userList => this.tablePaginationControls.totalItems = userList.length)
            .map(userList => {
                if (!userList.length) {
                    return userList;
                }
                return userList.slice((this.tablePaginationControls.currentPage - 1) *
                    this.tablePaginationControls.itemsPerPage, this.tablePaginationControls.currentPage * this.tablePaginationControls.itemsPerPage);
            });
    }

    getSearchUserList(userList: TenantUser[], searchValue): any[] {
        return userList.filter(item => {
            for (const prop in item) {
                if (item.hasOwnProperty(prop) && item[prop].toString().toLowerCase().includes(searchValue.toLowerCase())) {
                    return true;
                }
            }
        });
    }

    onClickAddTenantUserData() {
        this.router.navigate(['add'], { relativeTo: this.activatedRoute });
    }

    onUsersSeleted(deleteItems) {
        this.selectedList = deleteItems;
    }

    onDeleteBtnClick() {
        this.showDeleteModal = true;
    }


    // Function is used to delete tenant
    onDeleteTenantUserModalConfirmed() {
        this._deleteTenantUserSubscription = this.tenantUserService.deleteUsers(this.selectedList)
            .subscribe(
            res => {
                this.showDeleteModal = false;
                this.successMsg = 'User Deleted Successfully.';
            },
            err => { this.showDeleteModal = false; }
            );
    }

    onTableHeaderControlsChanged($event: any) {
        this.tableFilterControls = $event;
        const tenantUserList = this.store.value.tenantUserData;
        this.store.set('tenantUserData', Object.assign([], tenantUserList));
    }

    onTablePaginationControlsChanged($event: any) {
        this.tablePaginationControls = $event;
        const tenantUserList = this.store.value.tenantUserData;
        this.store.set('tenantUserData', Object.assign([], tenantUserList));
    }

    ngOnDestroy() {
        if (this._getTenantUserListSubscription) {
            this._getTenantUserListSubscription.unsubscribe();
        }
        if (this._deleteTenantUserSubscription) {
            this._deleteTenantUserSubscription.unsubscribe();
        }
    }

}
