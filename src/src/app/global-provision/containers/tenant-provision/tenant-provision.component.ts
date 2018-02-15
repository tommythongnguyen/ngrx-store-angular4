import { AuthService } from './../../../auth/services/auth.service';
import { Subscription, Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/forkJoin';

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import AdminConstant from '../../../admin.constant';
import { Tenant } from '../../../state';
import { Store } from '../../../store';
import { TenantService } from '../../services/tenant.service';

export interface IdAndStatus {
    id: string;
    status: string;
}

@Component({
    selector: 'tenant-provision',
    styleUrls: ['tenant-provision.component.scss'],
    templateUrl: 'tenant-provision.component.html'
})
export class TenantProvisionComponent implements OnInit, OnDestroy {
    deletingIdsStatus: IdAndStatus[] = [];

    actionType = 'Add';

    eragTenantData: any = {};
    modalTitle: string;

    showAddEditTeantModal = false;
    showDeleteModal = false;
    submittingTenantModal = false; // true if form is submitting

    allTeants$: Observable<Tenant[]>;

    tenantUsers: any[]; // for teant-role-form
    tenantDetail: Tenant; // for tenant-detail-form

    selectedTenantId; // store the id of Selected Tenant

    private _deleteTenantsSubscription: Subscription;
    private _editTenantSubscription: Subscription;
    private _addTenantSubscription: Subscription;
    private _getTenantUsersSubscription: Subscription;

    constructor(
        private tenantService: TenantService,
        private store: Store,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.allTeants$ = this.store
            .select('allTenants')
            .filter(Boolean)
            .distinctUntilChanged();
    }

    onTenantsSeleted(deleteItems: IdAndStatus[]) {
        this.deletingIdsStatus = deleteItems;
    }

    onDeteleBtnClick() {
        this.showDeleteModal = true;
    }

    // let delete the tenants
    onDeteleModalConfirm() {
        this._deleteTenantsSubscription = this.tenantService.deleteTenants(this.deletingIdsStatus)
            .subscribe(
            res => {
                this.deletingIdsStatus = [];
                // this.displaySuccessAlert('Tenant deletion request sent successfully for approval');
            },
            err => { },
            () => this.showDeleteModal = false
            );
    }

    // Function is used to update the action type to edit
    onTenantEdited(tenantId) {
        this.selectedTenantId = tenantId;
        this._getTenantUsersSubscription = this.getTenantUsers(tenantId)
            .subscribe(
            next => {
                this.tenantDetail = Object.assign({}, this.tenantDetail, next[0]);
                this.tenantUsers = Object.assign([], this.tenantUsers, next[1]);
                this.actionType = 'Edit';
                this.showAddEditTeantModal = true;
            },
            err => { },
            () => console.log('completed')
            );
    }

    onAddTenantBtnClicked() {
        this.tenantDetail = undefined;
        this.tenantUsers = undefined;
        this.actionType = 'Add';
        this.showAddEditTeantModal = true;
    }

    onDeleteTenantModalConfirmed() {
        this.tenantService.deleteTenants(this.deletingIdsStatus)
            .subscribe(
            next => this.showDeleteModal = false
            );
    }

    onAddEditTenantModalSubmit($event) {
        this.submittingTenantModal = true;

        if (this.actionType === 'Add') {
            this._addTenantSubscription = this.tenantService.saveTenant($event)
                .subscribe(
                   next => {
                       this.submittingTenantModal = false;
                       this.showAddEditTeantModal = false;
                    },
                   error => this.submittingTenantModal = false
                );
        } else { // edit
            this._editTenantSubscription = this.tenantService.editTenant($event, this.selectedTenantId)
                .subscribe(
                   next => {
                       this.submittingTenantModal = false;
                       this.showAddEditTeantModal = false;
                    },
                    error => this.submittingTenantModal = false
                );
        }

    }

    getTenantUsers(seletedTenantId): Observable<any> {
        const tenantDetail$ = this.allTeants$
            .map(tenants => tenants.filter(tenant => tenant.id === seletedTenantId)[0])
            .take(1);

        const tenatUsers$ = this.tenantService.getTenantUsers(seletedTenantId);

        return Observable.forkJoin([tenantDetail$, tenatUsers$]);
    }

    get isAllowable(): boolean {
        const userProfile = this.authService.getUserProfile();
        if (userProfile.role === AdminConstant.SUPER_USER ||
            userProfile.role === AdminConstant.GLOBAL_ADMIN) {
            return true;
        }
        return false;
    }

    ngOnDestroy() {
        if (this._deleteTenantsSubscription) {
            this._deleteTenantsSubscription.unsubscribe();
        }
        if (this._editTenantSubscription) {
            this._editTenantSubscription.unsubscribe();
        }
        if (this._getTenantUsersSubscription) {
            this._getTenantUsersSubscription.unsubscribe();
        }
        if (this._addTenantSubscription) {
            this._addTenantSubscription.unsubscribe();
        }
    }

}
