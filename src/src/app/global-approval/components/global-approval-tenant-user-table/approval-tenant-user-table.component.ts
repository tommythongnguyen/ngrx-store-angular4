import { Component, ChangeDetectionStrategy, Input, AfterViewInit } from '@angular/core';
import { GlobalApproval } from '../../../state';

@Component({
    selector: 'global-approval-tenant-user-table',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        .table {
            margin-bottom: 0;
        }
    `],
    template: `
        <table class="table table-user">
            <thead>
                <tr>
                   <th>Name</th>
                   <th>Role</th>
                   <th>UserID</th>
                   <th>Email</th>
                   <th>Created by</th>
                   <th>Status</th>
                </tr>
                <tr *ngFor="let userData of tenant.userData">
                   <td class="user-td">{{userData.firstname}} {{userData.lastname}}</td>
                   <td class="user-td">{{userData.role}}</td>
                   <td class="user-td">{{userData.userid}}</td>
                   <td class="user-td table-content" style="color:blue;text-decoration:underline">{{userData.email}}</td>
                   <td class="user-td">{{tenant.user.firstname}} {{tenant.user.lastname}}</td>
                   <td class="user-td">{{userData.status}}</td>
                </tr>
            </thead>
        </table>
    `
})
export class GlobalApprovalTenantUserTableComponent {
    @Input() tenant: GlobalApproval;

}

