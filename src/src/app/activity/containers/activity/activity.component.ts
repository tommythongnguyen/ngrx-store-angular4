import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { ActivityService } from '../../services/activity.service';
import { Store } from '../../../store';
import { ActivityLog } from '../../../state';
import { Subscribable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

export interface Pagination {
    page: number;
    itemsPerPage: number;
}
@Component({
    selector: 'activity',
    styleUrls: [`./activity.component.scss`],
    template: `
    <div style="padding-top:15px">
        <div class="padding-zero">
            <div class="demo">
                <!-- Search box and filter box will come chere -->
                <div class="col-md-12 padding-zero">
                    <erag-table-layout>
                        <ng-container class="table-body">
                            <activity-table [activityList]="activityDetails$ | async"></activity-table>
                        </ng-container>
                        <ng-container class="table-footer-right-side" *ngIf="(activityDetails$ | async)?.length>0">
                            <div class="pull-right">
                                <erag-pagination [maxSize]="pageMaxSize"
                                    [itemsPerPage]="currentIpPage.itemsPerPage"
                                    [currentPage]="currentIpPage.page"
                                    [totalItems]="(activityDetails$ | async)?.length">
                                </erag-pagination>
                            </div>
                        </ng-container>
                    </erag-table-layout>
                </div>
            </div>
        </div>
    </div>
    `
})

export class ActivityComponent implements OnInit, OnDestroy {
    activityDetails$: Observable<ActivityLog[]>;
    private getActivityListSubscription: Subscription;
    currentIpPage: Pagination = {
        page: 1,
        itemsPerPage: 10
    };
    // --- pagination-------
    pageMaxSize = 7;
    itemsPerPage = 2;
    currentPage = 1;
    constructor(private activityService: ActivityService,
        private store: Store) {
        this.activityDetails$ = this.store.select('globalActivityData');
    }

    ngOnInit() {
        this.getActivityListSubscription = this.activityService.getActivities()
            .subscribe();
    }

    ngOnDestroy() {
        if (this.getActivityListSubscription) {
            this.getActivityListSubscription.unsubscribe();
        }
    }
}
