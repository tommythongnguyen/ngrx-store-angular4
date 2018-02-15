import 'rxjs/add/operator/catch';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';

import AdminConstant from '../../../admin.constant';
import { AuthService } from '../../../auth/services/auth.service';
import { UserProfile } from '../../../auth/services/user-profile.interface';
import { Tenant, TenantUrlData } from '../../../state';
import { Store } from '../../../store';
import { TenantInfoService } from '../../services/tenant-info.service';

@Component({
    selector: 'tenant-url',
    styleUrls: ['tenant-url-list.component.scss'],
    template: `
        <div class="header-title">URL Provisioning</div>
        <div class="tenant-url-container">
            <div [hidden]="!successMsg" class="alert alert-success userprovninfomargin" role="alert" id="tntapprvmsg">{{successMsg}}</div>
                <tenant-url-table class="table-body"
                                  [urlList]="urlDetails$ | async"
                                  [user]="_userProfile"
                                  (delete)="onDeleteBtnClick()"
                                  (edit)="onSelectedEditTenantUrlData($event)"
                                  (add) ="onClickAddTenantUrlData()"
                                  (selected)="onUrlsSeleted($event)"
                                  [headerControls]="tableFilterControls"
                                    [paginationControls]="tablePaginationControls"
                                    (controlsChanged)="onTableHeaderControlsChanged($event)"
                                    (paginationChanged)="onTablePaginationControlsChanged($event)">
                </tenant-url-table>
        </div>
        <!-- Modal Popup for Delete Tenant -->
        <erag-modal [show]="showDeleteURLModal" [submitBtnLabel]="'OK'"
                    [cancelBtnLabel]="'Cancel'" (submit)="onDeleteTenantModalConfirmed();"
                    customWidth="50%" (hide)="onModalHide()">
            <div class="erag-modal-header">
                <span>Delete Url</span>
            </div>

            <div class="erag-modal-body">
                Are you sure if you want to delete the Url?
            </div>
        </erag-modal>
     `
})


export class TenantUrlListComponent implements OnInit, OnDestroy {

    tableFilterControls = {
        search: ''
    };
    tablePaginationControls = {
        itemsPerPage: 10,
        currentPage: 1,
        totalItems: 0
    };

    showDeleteURLModal= false;
    deletingIds = [];
    successMsg: string;

    urlDetails$: Observable<TenantUrlData[]>;

    infoTenant$: Observable<Tenant> = this.store.select('currentTenant')
        .filter(Boolean)
        .distinctUntilChanged()
        .share();

    // private getTenantUrlListSubscription: Subscription;
    private _deleteTenantUrlSubscription: Subscription;
    private _getTenantUrlSubscription: Subscription;
    _userProfile: UserProfile;
    constructor(
        private authService: AuthService,
        private tenantInfoService: TenantInfoService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private store: Store) {
        // this.urlDetails$ = this.store.select('tenantUrlData');
    }

    ngOnInit() {
        this._userProfile = this.authService.getUserProfile();

        this._getTenantUrlSubscription = this.infoTenant$.subscribe((tenant: Tenant) => {
            this.tenantInfoService.getUrlDetails(tenant.id)
                .subscribe();
        });
        this.urlDetails$ = this.store.select('tenantUrlData')
            .filter(Boolean)
            .distinctUntilChanged()
            .map(urlList => {
                if (!urlList.length || !this.tableFilterControls.search) {
                    return urlList;
                }

                return this.getSearchURLList(urlList, this.tableFilterControls.search);
            })
            .do(urlList => this.tablePaginationControls.totalItems = urlList.length)
            .map(urlList => {
                if (!urlList.length) {
                    return urlList;
                }
                return urlList.slice((this.tablePaginationControls.currentPage - 1) *
                    this.tablePaginationControls.itemsPerPage, this.tablePaginationControls.currentPage * this.tablePaginationControls.itemsPerPage);
            });
    }

    getSearchURLList(urlList: TenantUrlData[], searchValue): any[] {
        return urlList.filter(item => {
            for (const prop in item) {
                if (item.hasOwnProperty(prop) && item[prop].toString().toLowerCase().includes(searchValue.toLowerCase())) {
                    return true;
                }
            }
        });
    }

    onClickAddTenantUrlData() {
        this.store.set('selectedTenantUrlData', undefined);
        this.router.navigate(['add'], { relativeTo: this.activatedRoute });
    }

    onSelectedEditTenantUrlData($event: TenantUrlData) {
        this.store.set('selectedTenantUrlData', $event);
        this.router.navigate(['edit'], { relativeTo: this.activatedRoute });
    }

    onUrlsSeleted(deleteItems) {
        this.deletingIds = deleteItems;
    }
    checkUserPermission(): boolean {
        if (this._userProfile.role === AdminConstant.SUPER_USER || this._userProfile.role === AdminConstant.TENANT_ADMIN) {
            return true;
        }
        return false;
    }

    ngOnDestroy() {
        // if (this.getTenantUrlListSubscription) {
        //     this.getTenantUrlListSubscription.unsubscribe();
        // }
        if (this._deleteTenantUrlSubscription) {
            this._deleteTenantUrlSubscription.unsubscribe();
        }
        if (this._getTenantUrlSubscription) {
            this._getTenantUrlSubscription.unsubscribe();
        }
    }

    onDeleteBtnClick() {
        console.log('########### click on delete button ###########');
        this.showDeleteURLModal = true;
    }

    onModalHide() {
        console.log('################ Comming here ##############');
        this.showDeleteURLModal = false;
        console.log(this.showDeleteURLModal);
    }

    // Function is used to delete tenant
    onDeleteTenantModalConfirmed() {

        this._deleteTenantUrlSubscription = this.tenantInfoService.deleteUrls(this.deletingIds)
            .subscribe(
            res => {
                this.showDeleteURLModal = false;
                this.successMsg = 'URL Deleted Successfully.';
            },
            err => { this.showDeleteURLModal = false; }
            );
    }

     onTableHeaderControlsChanged($event: any) {
        this.tableFilterControls = $event;
        const tenantUserList = this.store.value.tenantUrlData;
        this.store.set('tenantUrlData', Object.assign([], tenantUserList));
    }

    onTablePaginationControlsChanged($event: any) {
        this.tablePaginationControls = $event;
        const tenantUrlList = this.store.value.tenantUrlData;
        this.store.set('tenantUrlData', Object.assign([], tenantUrlList));
    }

}
