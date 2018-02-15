import { UserProfile } from '../../../auth/services/user-profile.interface';
import { DashboardService } from '../../services/dasboard.service';

import { Component, EventEmitter, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import AdminConstant from '../../../admin.constant';
import { AuthService } from '../../../auth/services/auth.service';
import { Tenant } from '../../../state';
import { Store } from '../../../store';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
    selector: 'footer-controls',
    styleUrls: ['footer-controls.component.scss'],
    templateUrl: 'footer-controls.component.html'
})
export class FooterControlsComponent implements OnInit, OnDestroy {
    private _userProfile: UserProfile;

    private _clickCallback: Function;

    // ---- radio controls--------------
    radioPermissionValue: string;
    radioPortValue: string;

    private tenantSubscription: Subscription;

    listOfDate = [
        { name: 'Today', value: '1day'},
        { name: 'One Week', value: '1week'},
        { name: 'One Month', value: '1month'},
        { name: 'Six Months', value: '6month'},
        { name: 'One Year', value: '1year'}
    ];

    selectedDateNav: any; // default: listOfDate[0];

    fromDateValue: Date;
    toDateValue: Date;

    showToDate = false;
    showFromDate = false;

    tenantMessage = 'Tenants loading ...';
    tenants: Tenant[] = [];
    selectedTenant: Tenant;
    showTenantDropdown= false;

    @Output()viewTraffic = new EventEmitter<any>();

    constructor( private authService: AuthService,
                 private dashboardService: DashboardService,
                 private store: Store,
                 private renderer: Renderer2) { }

    ngOnInit() {
        this.selectedDateNav = this.listOfDate[0]; // default

        this.updateFromToDateFilter();

        this._userProfile = this.authService.getUserProfile();

        this.tenantSubscription = this.store.select('allTenants')
            .filter(Boolean)
            .distinctUntilChanged()
            .map((list: Tenant[]) => list.filter(tenant =>
                tenant.status !== AdminConstant.STATUS.PENDING_APPROVAL &&
                tenant.status !== AdminConstant.STATUS.REJECTED)
            )
            .subscribe(
                (tenants: Tenant[] |undefined) => {
                    if (tenants && tenants.length) {
                        if ( this._userProfile.role === AdminConstant.SUPER_USER ||
                            this._userProfile.role === AdminConstant.GLOBAL_ADMIN ||
                            this._userProfile.role === AdminConstant.GLOBAL_APPROVER) {

                            const allTenant: Tenant = {
                                name: 'All Tenant',
                                id: '',
                                description: 'All Tenant',
                                status: 'All Tenant',
                                createdAt: '',
                                settings: undefined
                            };
                            this.tenantMessage = allTenant.name;
                            this.tenants = [allTenant];
                        }
                        tenants.map(tenant => this.tenants.push(tenant));
                        this.selectedTenant = this.tenants[0]; // set tenant[0] is the default selected Tenant
                        this.updateMapControls({ mapTenant: this.selectedTenant });

                        this.tenantMessage = 'Please Select Tenant';

                    }else {// no tenent
                        this.tenantMessage = 'No Tenant Available';
                    }
                },
                err => this.tenantMessage = 'Could not loading tenants'
            );

        this.radioPermissionValue = 'all';
        this.radioPortValue = 'allPorts';
        this.updateMapControls({radioPermission: this.radioPermissionValue, radioPort: this.radioPortValue});

        // register event
        this.registerEventListener();
    }

    checkUserPermission(type: string): boolean {
        switch (type) {
            case 'super':
                return this.checkUserRole([AdminConstant.GLOBAL_APPROVER, AdminConstant.GLOBAL_ADMIN, AdminConstant.SUPER_USER]);
            case 'tenant':
                return this.checkUserRole([AdminConstant.BUSINESS_MANAGER, AdminConstant.TENANT_ADMIN, AdminConstant.TENANT_APPROVER, AdminConstant.TENANT_VIEWER]);
        }
    }

    checkUserRole(userRoleList: string[]): boolean {
        if (this._userProfile) {
            return userRoleList.indexOf(this._userProfile.role) > -1;
        }
        return false;
    }

    updateFromToDateFilter() {
        this.toDateValue = new Date(); // today
        this.fromDateValue = new Date();
        switch (this.selectedDateNav.value) {
            case '1day':
                this.fromDateValue.setDate(this.toDateValue.getDate() - 1);
                break;
            case '1week':
                this.fromDateValue.setDate(this.toDateValue.getDate() - 7);
                break;
            case '1month':
                this.fromDateValue.setMonth(this.toDateValue.getMonth() - 1);
                break;
            case '6month':
                this.fromDateValue.setMonth(this.toDateValue.getMonth() - 6);
                break;
            case '1year':
                this.fromDateValue.setFullYear(this.toDateValue.getFullYear() - 1);
                break;
        }
        this.updateMapControls({fromDate: this.fromDateValue, toDate: this.toDateValue});
    }
    onToggleTenantDropdown() {
        this.showTenantDropdown = !this.showTenantDropdown;
    }
    onSelectTenant($event: Tenant) {
        this.showTenantDropdown = false;
        this.selectedTenant = $event;
        this.updateMapControls({mapTenant: this.selectedTenant});
        this.onViewTraffic();
    }

    /**
     * onSelectDateNave: + update FromDate and ToDate of DateTimePicker
     *                   + update GoogleMap
    */
    onSelectDateNav($event) {
        this.selectedDateNav = $event;
        this.updateFromToDateFilter();
        this.onViewTraffic();
    }

    onToggleFromDate() {
        this.showFromDate = ! this.showFromDate;
    }
    onToggleToDate() {
        this.showToDate = !this.showToDate;
    }

    onSelectFromDate($event: Date) {
        this.fromDateValue = $event;
        this.selectedDateNav = null;
        this.onToggleFromDate();
        this.updateMapControls({ fromDate: this.fromDateValue});
    }

    /**
     * onSelectToDate: + auto update base on the FromDate and activeDateNav
    */
    onSelectToDate($event: Date) {
        this.selectedDateNav = null;
        this.toDateValue = $event;
        this.onToggleToDate();
        this.updateMapControls({toDate: this.toDateValue });
    }

    onViewTraffic() {
        this.viewTraffic.emit();
    }



    registerEventListener() {
        this._clickCallback = this.renderer.listen('document', 'click', () => {
            if (this.showFromDate) {
                this.showFromDate = false;
            }
            if (this.showToDate) {
                this.showToDate = false;
            }
            if (this.showTenantDropdown) {
                this.showTenantDropdown = false;
            }
        });
    }

    // ------//------- radio Permission -----------
    onRadioPermisionChange($event) {
        this.radioPermissionValue = $event;
        this.updateMapControls({radioPermission: $event});
        this.onViewTraffic();
    }

    // -------radio ports---------
    onRadioPortsChange($event) {
        this.radioPortValue = $event;
        this.updateMapControls({radioPort: $event});
        this.onViewTraffic();
    }

    // -----updateMapControls
    updateMapControls(keyValueObject) {
        const mapControls = this.store.value.mapControls;
        this.store.set('mapControls', Object.assign({}, mapControls, keyValueObject));
    }

    ngOnDestroy() {
        this.tenantSubscription.unsubscribe();
        if (this._clickCallback) {
            this._clickCallback();
        }
    }

}
