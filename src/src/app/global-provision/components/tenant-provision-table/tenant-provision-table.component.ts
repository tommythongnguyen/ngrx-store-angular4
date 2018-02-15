import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import ADMIN_CONSTANTS from '../../../admin.constant';
import { Tenant } from '../../../state';

export interface ProvisionTenant extends Tenant {
    checked: boolean;
}

@Component({
    selector: 'tenant-provision-table',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['tenant-provision-table.component.scss'],
    template: `
        <ng-container *ngIf="tenantList" >
            <table class="table" >
                <thead>
                    <tr>
                        <th>
                            <input type="checkbox" id="checkalltenant" name="checkedAll"
                                   [checked]="checkedAll"
                                   (change)="toggleAllTenant()"
                                   [disabled]="isOnlyApprovalDeleteRequestedTenants">
                        </th>
                        <th>Tenant Name</th>
                        <th>Domain</th>
                        <th width="50%">Description</th>
                        <th>Status</th>
                        <th>Created On</th>
                        <th>Edit</th>
    				</tr>
                </thead>
                <tbody>
                    <tr *ngFor="let tenant of tenantList; trackBy: trackByFn">
                        <td>
                             <input type="checkbox" [checked]="tenant.checked"
                                                    (change)="onCheckboxChange(tenant)"
                                                    [disabled]="tenant.status ==='Pending Deployment' || tenant.settings.approval_delete_requested">
                        </td>

                        <td>{{tenant.name}}</td>
                        <td>{{tenant.settings.domainname}}</td>
                        <td class="table-content">{{ tenant.description }}</td>
                        <td title="{{tenant.status}}">
                            <i class="fa fa-circle"
                                [ngClass]= "getStatusClass(tenant)"
                                aria-hidden="true"></i>
                        </td>
                        <td>{{ tenant.createdAt | date:'yyyy-MM-dd HH:mm:ss'}}</td>
                        <td>

                                <span   *ngIf="checkEditableTenant(tenant)"
                                        class="icon-hover"
                                        (click)='editTenant(tenant);'>
                                        <i class="glyphicon glyphicon-pencil icon-editable" aria-hidden="true" title="Edit"></i>
                                </span>

                                <span *ngIf="!checkEditableTenant(tenant)">
                                        <i class="glyphicon glyphicon-pencil icon-disable" ></i>
                                </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </ng-container>
   `
})
export class TenantProvisionTableComponent {
    checkedAll = false;

    private _allTenants: ProvisionTenant[] = [];
    private _selectedTenant: ProvisionTenant;

    @Output() selected = new EventEmitter<{ id: string, status: string }[]>();
    @Output() edited = new EventEmitter<string>();

    @Input()
    set tenantList(list: ProvisionTenant[]) {
        if (list) {
            if (!list.length) {
                this._allTenants = [];
            } else {
                this._allTenants = list.map((tenant: ProvisionTenant) => {
                    tenant.checked = false;
                    return tenant;
                });
            }
        }
    }
    get tenantList(): ProvisionTenant[] {
        return this._allTenants;
    }

    get isOnlyApprovalDeleteRequestedTenants(): boolean {
        if (!this.tenantList.length) {
            return true;
        }
        const deletedRequestList = this.tenantList.filter(tenant => !!tenant.settings.approval_delete_requested);
        return deletedRequestList.length === this.tenantList.length;
    }

    checkEditableTenant(tenant: ProvisionTenant): boolean {
        return tenant.status === ADMIN_CONSTANTS.STATUS.PENDING_APPROVAL ||
            tenant.status === ADMIN_CONSTANTS.STATUS.REJECTED;
    }

    updateCheckedAll() {
        this.checkedAll = !this.tenantList.some(tenant => {
            if (!tenant.checked && tenant.status !== ADMIN_CONSTANTS.STATUS.PENDING_DEPLOYMENT) {
                return true;
            }
            return false;
        });

        this.emitEvent();
    }

    // toggle checkedAll checkbox
    toggleAllTenant(): boolean {
        this.checkedAll = !this.checkedAll;
        this.tenantList.forEach(tenant => {
            if (tenant.status !== ADMIN_CONSTANTS.STATUS.PENDING_DEPLOYMENT && !tenant.settings.approval_delete_requested) {
                tenant.checked = this.checkedAll;
            }
        });

        this.emitEvent();
        return false;
    }

    trackByFn(index: number, tenant: Tenant): string {
        return tenant.id;
    }

    emitEvent() {
        const idList = this.tenantList
            .filter(item => item.checked)
            .map(item => {
                if (item.checked) {
                    return { id: item.id, status: item.status };
                }
            });

        this.selected.emit(idList);
    }

    onCheckboxChange(tenant: ProvisionTenant) {
        tenant.checked = !tenant.checked;
        this._selectedTenant = tenant;
        this.updateCheckedAll();
    }

    getStatusClass(tenant: ProvisionTenant): string {
        if (tenant.status === ADMIN_CONSTANTS.STATUS.PENDING_APPROVAL ||
            tenant.status === ADMIN_CONSTANTS.STATUS.PENDING_DEPLOYMENT) {
            return 'status-pending';
        } else if (tenant.status === ADMIN_CONSTANTS.STATUS.APPROVED) {
            return 'status-on';
        } else if (tenant.status === ADMIN_CONSTANTS.STATUS.REJECTED) {
            return 'status-reject';
        } else if (tenant.status === ADMIN_CONSTANTS.STATUS.APPROVED_DEPLOYING) {
            return 'status-deploying-approved';
        } else if (tenant.status === ADMIN_CONSTANTS.STATUS.REJECTED_DEPLOYING) {
            return 'status-deploying-rejected';
        } else if (tenant.status === ADMIN_CONSTANTS.STATUS.APPROVED_DEPLOYED) {
            return 'status-deployed-approved';
        } else {
            return 'status-active';
        }
    }

    editTenant(item) {
        this.edited.emit(item.id);
    }


}
