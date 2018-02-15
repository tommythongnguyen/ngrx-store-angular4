import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import * as  AdminConstants from '../../../admin.constant';


@Component({
    selector: 'activity-table',
    template: `
        <ng-container *ngIf="activityList">
            <table class="table ">
                <thead>
                    <tr>
                    <th>Type <i class="glyphicon glyphicon-triangle-bottom"></i></th>
                    <th>Activity <i class="glyphicon glyphicon-triangle-bottom"></i></th>
                    <th>Tenant/Organization <i class="glyphicon glyphicon-triangle-bottom"></i></th>
                    <th>Action Performed By <i class="glyphicon glyphicon-triangle-bottom"></i></th>
                    <th>Activity Time <i class="glyphicon glyphicon-triangle-bottom"></i></th>
                    </tr>
                </thead>
                <tbody >
                        <tr *ngFor="let item of activityList; trackBy: trackByFn">
                        <td>{{ item.notification_category }}</td>
                        <td>{{item.notification }}</td>
                        <td>{{ item.tenant?.name }}</td>
                        <td>{{ item.user.role }}</td>
                        <td>{{ item.createdAt | date:'yyyy-MM-dd HH:mm:ss'}}</td>
                        </tr>
                </tbody>
            </table>
            <div class="text-center message" [hidden]='activityList.length>0'>
                <strong>No Activities are available</strong>
            </div>
        </ng-container>
    `,
    styleUrls: ['./activity-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityTableComponent implements OnInit {

    @Input() activityList: any;

    constants = AdminConstants.default;

    constructor() { }

    ngOnInit() {
    }

    trackByFn(index: number, approval: any): number {
        return index;
    }

}
