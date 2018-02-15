import { UserProfile } from '../../../auth/services/user-profile.interface';
import { Notification } from '../../../state';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
    selector: 'header-notification',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['header-notification.component.scss'],
    template: `
        
        <div class="header-notification-container">
            <div class="user-role-label">{{profile?.role}} - {{currentdate | date}}</div>
            <div id='notifSection' (click)="toggleNotification($event)" class="notification-section">
                <div class="notifi-num"  id='notifSection' *ngIf="notification?.count">
                    {{notification.count}}
                </div>
                <i class='glyphicon glyphicon-bell notifiction-icon'></i>
            </div>
            <div class="notification-dropdown" id="notifSection" [ngClass]="{'hidden-notification': !show}">
                <div class="notification-details">
                    <div class="text-center message" *ngIf="isUnavailableNotification; else activityLogs">No new Notification available</div>
                    <ng-template #activityLogs>
                        <div class="notification-content" *ngFor="let activity of notification?.activityLogs">
                            <div class="category">{{activity.category}}</div>
                            <div class="description">{{activity.description}}</div>
                            <!--div class="when">{{activity.created_on}}</div-->
                        </div>

                     
                    </ng-template>
                       <a class="pull-right view-link"  (click)="onViewAllActivitiesLog()">
                            <i class="fa fa-arrow-circle-right" aria-hidden="true"></i>
                                View All Activities
                        </a>
                </div>
            </div>

        </div>
    `
})
export class HeaderNotificationComponent implements OnInit {
    currentdate = new Date();

    @Input() show =false;

    @Input()notification: Notification;

    @Input()profile: UserProfile;

    @Output()clickNotification = new EventEmitter<any>();

    @Output()viewAll = new EventEmitter<any>();

    constructor() { }

    ngOnInit() {}

    get isUnavailableNotification() :boolean {
        console.log('this.notification: ',this.notification);
        if(this.notification && this.notification.activityLogs && this.notification.activityLogs.length) return false;
        return true;
    }

    toggleNotification($event: Event): boolean {
        $event.stopPropagation();
        this.clickNotification.emit();
        return false;
    }

    onViewAllActivitiesLog(): boolean {
        this.viewAll.emit();
        return false;
    }
}
