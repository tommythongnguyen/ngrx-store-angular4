import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { Tenant } from '../../../state';
import { Store } from '../../../store';

import AdminConstant from '../../../admin.constant';

@Component({
    selector: 'tenant-info',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['tenant-info.component.scss'],
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
                            <tenant-sidebar [navList]="sidebar"
                                            (select)="onSidebarSelect($event)">
                            </tenant-sidebar>
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
export class TenantInfoComponent implements OnInit {
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

    constructor(private store: Store,
        private router: Router,
        private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.tenantList$ = this.store.select('selectedTenants')
            .filter(Boolean)
            .distinctUntilChanged();

        this.currentTenant$ = this.store.select('currentTenant')
            .filter(Boolean)
            .distinctUntilChanged()
            .do((tenant: Tenant) => this.setSidebarStatus(tenant) );
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
        this.store.set('currentTenant', Object.assign({}, tenant));
        this.router.navigate([this.sidebar[0].link], { relativeTo: this.activatedRoute });
    }
    removeTab(tenantTab: Tenant) {
        let index = 0;
        const tenants = this.store.value.selectedTenants.filter((item, i) => {
            if (item.id === tenantTab.id) {
                index = i;
            } else {
                return item;
            }
        });
        this.store.set('selectedTenants', Object.assign([], tenants));

        if (tenants.length) {
            const current = this.store.value.currentTenant;
            if (current.id === tenantTab.id) { // user remove current Tenant Tab --> switch to the next one
                const nextActiveTenant = this.store.value.selectedTenants[index > 0 ? (index - 1) : 0];
                this.store.set('currentTenant', nextActiveTenant);
            }
        } else {
            this.store.set('currentTenant', undefined);
            this.router.navigate(['dashboard'], { relativeTo: this.activatedRoute });
        }
    }

    trackByFn(index: number, tenant: Tenant): string {
        return tenant.id;
    }

    onSidebarSelect($event) {
        console.log('############ on side bar select ###########');
        this.router.navigate([$event.link], { relativeTo: this.activatedRoute });
    }
}
