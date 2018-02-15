import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/share';

import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs/Rx';

import * as authActions from '../../../auth/store/actions/auth.actions';
import * as fromAuth from '../../../auth/store/reducers';
import * as homeActions from '../../store/actions/home.actions';
import * as fromHome from '../../store/reducers';

import sideBarLinks from '../sidebar/sidebar.icons';
import AdminConstant from '../../../admin.constant';
import { UserProfile } from '../../../auth/services/user-profile.interface';
import { Tenant } from '../../../state';

@Component({
    selector: 'admin-home',
    styleUrls: ['home.component.scss'],
    template: `
        <header    [userProfile]="userProfile$ | async"></header>

        <sidebar    [userProfile]="userProfile$ | async"
                    (toggle)="onToggleSidebar($event)">
        </sidebar>

        <div id="page-content-wrapper" class="main-content-wrapper nopadding" #mainContent>
            <div class="col-sm-12 main-header-container">
                <div class="col-sm-6">
                    <breadcrumb [icon]="breadcrumbIcon" [links]="breadcrumbLinks"></breadcrumb>
                </div>
                <div class="col-sm-6 main-header-right-side">
                    <ng-container *ngIf="(tenants$ | async)?.length >1; else no_tenant">
                        <erad-dropdown  class="breadcrumb-right-content"
                                        [tenants]=" tenants$ | async"
                                        [selectedTenant]="selectedTenant$ | async"
                                        [message]="'Please Select Tenant'"
                                        icon="arrow-circle-down"
                                        [show]="showTenantDropdown"
                                        (toggle)="onToggleTenantDropdown()"
                                        (select)="onSelectTenant($event)">
                        </erad-dropdown>
                    </ng-container>

                    <ng-template #no_tenant>
                        <div class="dropdown-label"
                             (click)="onTenantClick()"
                             [ngClass]="{'hoverable': (tenants$ | async).length === 1}">
                             {{dropdownLabel}}
                        </div>
                    </ng-template>
                </div>
            </div>

            <div class="container-fluid home-view">
                <router-outlet></router-outlet>
            </div>
        </div>
    `
})

export class HomeComponent implements OnInit, OnDestroy {
    showTenantDropdown = false;
    breadcrumbLinks = [];
    breadcrumbIcon = '';

    userProfile$: Observable<UserProfile>;

    tenants$: Observable<Tenant[]>;
    selectedTenant$: Observable<Tenant>;

    defaultTenant: Tenant;

    defaultSelectTenant: Tenant;

    userAllawable = false;

    dropdownLabel = 'No Tenant Available';

    private _clickCallback: Function;

    @ViewChild('mainContent') mainContent: ElementRef;
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private renderer: Renderer2,
        private ngrxStore: Store<fromHome.State>
    ) {
        router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.setPageTitle(val.urlAfterRedirects);
            }
        });
    }

    ngOnInit() {
        this.userProfile$ = this.ngrxStore.select(fromAuth.getUserProfile)
            .filter(Boolean)
            .distinctUntilChanged();

        this.selectedTenant$ = this.ngrxStore.select(fromHome.getSelectedTenant)
            .distinctUntilChanged();

        this.tenants$ = this.ngrxStore.select(fromHome.getTenants)
            .filter(Boolean)
            .distinctUntilChanged()
            .map((list: Tenant[]) => list.filter(tenant =>
                tenant.status !== AdminConstant.STATUS.PENDING_APPROVAL &&
                tenant.status !== AdminConstant.STATUS.REJECTED)
            )
            .do((list: Tenant[]) => {
                if (list) {
                    if (list.length === 1) {
                        this.dropdownLabel = list[0].name;
                        this.defaultTenant = list[0];
                    }
                } else {
                    this.dropdownLabel = 'No Tenant Available';
                }
            });

        this.ngrxStore.dispatch(new authActions.GetUserProfile());
        this.ngrxStore.dispatch(new homeActions.GetTenants());

        this.registerEventListeners();
    }

    goback() {
        this.ngrxStore.dispatch(new authActions.LoginRedirect());
    }

    onToggleSidebar($event) {
        if ($event.collapsed) {
            this.renderer.removeStyle(this.mainContent.nativeElement, 'margin-left');
        } else {
            this.renderer.setStyle(this.mainContent.nativeElement, 'margin-left', '140px');
        }
    }

    setPageTitle(pageUrl: string) {
        const arr = pageUrl.split('/');
        const currentUrl = arr[arr.length - 1];
        sideBarLinks.map(item => {
            if (item.url === currentUrl) {
                this.breadcrumbIcon = item.icon;
                this.breadcrumbLinks = [item.label];
            }
        });
    }

    onSelectTenant($event: Tenant) {
        this.showTenantDropdown = false;
        this.ngrxStore.dispatch(new homeActions.SelectTenant($event));
        this.router.navigate(['tenant'], { relativeTo: this.activatedRoute });
    }

    onTenantClick() {
        event.stopPropagation();
        this.onSelectTenant(this.defaultTenant);
    }

    onToggleTenantDropdown() {
        this.showTenantDropdown = !this.showTenantDropdown;
    }

    checkeUsersAllowable(userProfile: UserProfile) {
        if (userProfile.role === AdminConstant.GLOBAL_APPROVER ||
            userProfile.role === AdminConstant.GLOBAL_ADMIN ||
            userProfile.role === AdminConstant.SUPER_USER) {
            this.userAllawable = true;
        }
        this.userAllawable = false;
    }

    registerEventListeners() {
        this._clickCallback = this.renderer.listen('document', 'click', () => {
            if (this.showTenantDropdown) {
                this.showTenantDropdown = false;
            }
        });
    }
    ngOnDestroy() {}

}
