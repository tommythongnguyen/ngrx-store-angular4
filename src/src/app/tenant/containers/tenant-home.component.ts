
import { Store } from '@ngrx/store';
import * as tenantReducer from '../store/reducers';
import * as tenantActions from '../store/actions/tenant.actions';

import * as homeReducer from '../../home/store/reducers';
import * as homeActions from '../../home/store/actions/home.actions';

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';


import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';

import { Tenant } from '../../state';
// import { Store } from '../../../store';

import AdminConstant from '../../admin.constant';

@Component({
    selector: 'tenant-home',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['tenant-home.component.scss'],
    template: `
        <ng-container *ngIf="(tenantList$ | async)?.length">
            <div class="col-md-12">
                <ul class="nav nav-tabs" (click)="$event.preventDefault()">
                    <li *ngFor="let tenant of (tenantList$ | async); trackBy: trackByFn" class="nav-item" >
                        <a class="nav-link" [ngClass]="{'active': (currentTenant$ | async)?.id === tenant.id }"
                                            (click)="onSelect(tenant)">
                            <span>{{tenant.name}}</span>
                            <span (click)="$event.preventDefault(); removeTab(tenant);" class="glyphicon glyphicon-remove-circle"></span>
                        </a>
                    </li>
                </ul>

                <div class="tab-content">
                    <div class="row">
                        <div class="col-md-1">
                            <sidebar [navList]="sidebar"
                                     (select)="onSidebarSelect($event)">
                            </sidebar>
                        </div>

                        <div class="col-md-11 right-sidebar-container">
                            <router-outlet></router-outlet>
                        </div>

                    </div>
                </div>
            </div>
        </ng-container>
    `
})
export class TenantHomeComponent implements OnInit, OnDestroy {
    sidebar = [
        { icon: 'fa-cog', link: 'settings', title: 'Settings', active: false},
        { icon: 'fa-link', link: 'urlsList', title: 'Url', active: false },
        { icon: 'fa-user-o', link: 'users', title: 'User', active: false },
        { icon: 'fa-thumbs-o-up', link: 'approvals', title: 'Approval', active: false },
        { icon: 'fa-users', link: 'groups', title: 'Group', active: false },
        { icon: 'fa-bar-chart', link: 'reports', title: 'Report', active: false }
    ];

    tenantList$: Observable<Tenant[]>;
    currentTenant$: Observable<Tenant>;

    private _combineLatestSubscription: Subscription;

    constructor(private ngrxStore: Store<tenantReducer.State>,
        private router: Router,
        private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.tenantList$ = this.ngrxStore.select(tenantReducer.getTenantCollection);
        this.currentTenant$ = this.ngrxStore.select(homeReducer.getSelectedTenant)
            .filter(Boolean)
            .distinctUntilChanged()
            .do((tenant: Tenant) => {
                if (!!tenant) {
                    this.setSidebarStatus(tenant);
                }
            });

        this.ngrxStore.select(homeReducer.getSelectedTenant)
            .filter(Boolean)
            .distinctUntilChanged()
            .do(tenant => this.ngrxStore.dispatch(new tenantActions.AddTenant(tenant)))
            .subscribe();
    }

    setSidebarStatus(tenant: Tenant) {
        switch (tenant.status) {
            case AdminConstant.STATUS.ACTIVE: {
                this.sidebar = this.sidebar.map(nav => {
                    nav.active = true;
                    return nav;
                });
                break;
            }
            case AdminConstant.STATUS.APPROVED:
            case AdminConstant.STATUS.PENDING_DEPLOYMENT: {
                this.sidebar = this.sidebar.map(nav => {
                    if (nav.link === 'settings' || nav.link === 'users' || nav.link === 'approvals') {
                        nav.active = true;
                    } else {
                        nav.active = false;
                    }
                    return nav;
                });
            }
        }

    }

    onSelect(tenant: Tenant) {
        event.stopPropagation();
        event.preventDefault();
        this.ngrxStore.dispatch(new homeActions.SelectTenant(tenant));
        // this.router.navigate([this.sidebar[0].link], { relativeTo: this.activatedRoute });
    }
    removeTab(tenantTab: Tenant) {

        this.ngrxStore.dispatch(new tenantActions.RemoveTenant(tenantTab));

        this._combineLatestSubscription = Observable.combineLatest(
                this.currentTenant$,
                this.tenantList$
            )
            .take(1)
            .subscribe(latestValues => {
                const [activeTenant, tenantList] = latestValues;
                if (!tenantList.length) {
                    this.ngrxStore.dispatch(new homeActions.RemoveTenant());
                    this.router.navigate(['/home']);
                } else {
                    if (!!activeTenant && activeTenant.id === tenantTab.id) { // user remove current Tenant Tab --> switch to the next one
                        const nextActiveTenant = tenantList[tenantList.length - 1];
                        this.ngrxStore.dispatch(new homeActions.SelectTenant(nextActiveTenant));
                    }
                }
            });
    }

    trackByFn(index: number, tenant: Tenant): string {
        return tenant.id;
    }

    onSidebarSelect($event) {
        this.router.navigate([$event.link], { relativeTo: this.activatedRoute });
    }

    ngOnDestroy() {
        if (this._combineLatestSubscription) {
            this._combineLatestSubscription.unsubscribe();
        }
    }
}
