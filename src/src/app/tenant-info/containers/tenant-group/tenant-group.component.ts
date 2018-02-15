import 'rxjs/add/operator/concatMap';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';

import { Tenant, TenantGroup, AdSyncGroup } from '../../../state';
import { Store } from '../../../store';
import { TenantGroupService } from '../../services/tenant-group.service';

@Component({
    selector: 'tenant-group',
    styleUrls: ['tenant-group.component.scss'],
    template: `
        <div class="header-title">Group Provisioning</div>
        <div class="tenant-group-container"  style="margin-top:15px">
            <div [hidden]="!successMsg" class="alert alert-success userprovninfomargin" role="alert" id="tntapprvmsg">{{successMsg}}</div>
                <tenant-group-table class="table-body"
                    [groupList]="groupAllData$ | async"
                    (deleted) ="onTableBtnDeleted()"
                    (add) ="onTableBtnAdd()"
                    (selected)="onTableSelected($event)"
                    (groupclicked)= "onGroupClicked($event)"
                    [adSyncGroupList]= "adSyncGroupAllData$ | async"
                    (searchAdSync)= "onSearchAdSyncGroup($event)"
                    (resetAdSyncData) = "onResetAdSyncForm()"
                    (adSyncSave)= "onAdSyncGroupSave($event)"
                    [headerControls]="tableFilterControls"
                    [paginationControls]="tablePaginationControls"
                    (controlsChanged)="onTableHeaderControlsChanged($event)"
                    (paginationChanged)="onTablePaginationControlsChanged($event)">
                </tenant-group-table>
        </div>

         <!-- Modal Popup for Delete Group -->
        <erag-modal [show]="showDeleteModal" [submitBtnLabel]="'OK'"
                    [cancelBtnLabel]="'Cancel'" (submit)="onModalConfirmed()"
                    customWidth="50%" (hide)="showDeleteModal = false">

            <div class="erag-modal-header">
                <span>Delete Group</span>
            </div>

            <div class="erag-modal-body">
                Are you sure if you want to delete the Group?
            </div>
        </erag-modal>
     `
})

export class TenantGroupComponent implements OnInit, OnDestroy {
    tableFilterControls = {
        search: ''
    };
    tablePaginationControls = {
        itemsPerPage: 10,
        currentPage: 1,
        totalItems: 0
    };

    groupAllData$: Observable<TenantGroup[]>;
    adSyncGroupAllData$: Observable<AdSyncGroup[]>;
    // adSyncselectedList: string[];
    infoTenant$: Observable<Tenant>;

    showDeleteModal: boolean;
    selectedList: string[];
    successMsg: string;
    isShowGroupSync: boolean; // TODO : Need to use when on tennant setting ad syncing group will donw
    tenantID: string;

    private _getGroupSubscription: Subscription;
    private _deletedSubscription: Subscription;
    private _getAdSyncGroupSubscription: Subscription;

    constructor(
        private groupService: TenantGroupService,
        private store: Store,
        private router: Router,
        private activatedRoute: ActivatedRoute) {

        this.infoTenant$ = this.store.select('currentTenant')
            .filter(Boolean)
            .distinctUntilChanged();
    }

    ngOnInit() {

        this._getGroupSubscription = this.infoTenant$
            .concatMap((tenant: Tenant) => this.groupService.getTenantGroups(tenant.id))
            .subscribe();

        this.groupAllData$ = this.store.select('tenantGroupAllData')
            .filter(Boolean)
            .distinctUntilChanged()
            .map(groupList => {
                if (!groupList.length || !this.tableFilterControls.search) {
                    return groupList;
                }

                return this.getSearchGroupList(groupList, this.tableFilterControls.search);
            })
            .do(groupList => this.tablePaginationControls.totalItems = groupList.length)
            .map(groupList => {
                if (!groupList.length) {
                    return groupList;
                }
                return groupList.slice((this.tablePaginationControls.currentPage - 1) *
                    this.tablePaginationControls.itemsPerPage, this.tablePaginationControls.currentPage * this.tablePaginationControls.itemsPerPage);
            });

        this.adSyncGroupAllData$ = this.store.select('tenantAdSyncGroupAllData');
    }

    getSearchGroupList(groupList: TenantGroup[], searchValue): any[] {
        return groupList.filter(item => {
            for (const prop in item) {
                if (item.hasOwnProperty(prop) && item[prop].toString().toLowerCase().includes(searchValue.toLowerCase())) {
                    return true;
                }
            }
        });
    }

    onModalConfirmed(confirm: {action: string, message: string}) {
        this._deletedSubscription = this.groupService.deleteGroups(this.selectedList)
            .subscribe(
                res => {
                  this.onModalHide();
                  this.successMsg = 'Group deleted successfully.';
                },
                err => this.onModalHide()
            );
    }

    onTableSelected(ids: string[]) {
        this.selectedList = ids;
    }

    onModalHide() {
        this.showDeleteModal = false;
    }

    onTableBtnDeleted() {
        this.showDeleteModal = true;
    }

    onTableBtnAdd() {
        this.router.navigate(['add'], { relativeTo: this.activatedRoute });
    }

    onGroupClicked(group: TenantGroup) {
        console.log(group);
        this.store.set('currentGroup', Object.assign({}, group));
        this.router.navigate(['endusers'], { relativeTo: this.activatedRoute });
    }

    ngOnDestroy() {
        if (this._getGroupSubscription) {
            this._getGroupSubscription.unsubscribe();
        }
        if (this._deletedSubscription) {
            this._deletedSubscription.unsubscribe();
        }
        if (this._getAdSyncGroupSubscription) {
            this._getAdSyncGroupSubscription.unsubscribe();
        }
    }

    onTableHeaderControlsChanged($event: any) {
        this.tableFilterControls = $event;
        const tenantGroupList = this.store.value.tenantGroupAllData;
        this.store.set('tenantGroupAllData', Object.assign([], tenantGroupList));
    }

    onTablePaginationControlsChanged($event: any) {
        this.tablePaginationControls = $event;
        const tenantGroupList = this.store.value.tenantGroupAllData;
        this.store.set('tenantGroupAllData', Object.assign([], tenantGroupList));
    }

    /* Ad sync code */
    onSearchAdSyncGroup(searchString: string) {
        this._getAdSyncGroupSubscription = this.infoTenant$
        .concatMap((tenant: Tenant) => {
            this.tenantID = tenant.id;
            return this.groupService.getTenantAdSyncGroups(searchString, tenant.id);
        }).subscribe();
    }

    onAdSyncGroupSave(groups: AdSyncGroup[]) {
        const formData = Object.assign({}, { tenant: this.tenantID, groups: groups });
        this.groupService.addTenantAdSyncGroup(formData, this.tenantID)
        .subscribe(res => {
            this.router.navigate(['home/tenantInfo/groups']);
        });
    }

    onResetAdSyncForm() {
        this.store.set('tenantAdSyncGroupAllData', []);
    }

    /* EOC for Ad Sync*/

}
