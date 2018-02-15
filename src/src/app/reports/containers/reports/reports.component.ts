import { UserProfile } from '../../../auth/services/user-profile.interface';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { ReportService } from '../../services/reports.service';
import { Store } from '../../../store';
import { UserSessionLogData, Tenant} from '../../../state';
import 'rxjs/add/operator/catch';
import AdminConstants from '../../../admin.constant';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
    selector: 'reports',
    template: `
    <div class="container-fluid padding-zero">

        <div class="row uibtabpadding">
            <div class="col-md-12 ">
                <div class="demo">
                    <div [hidden]="!successMsg" class="alert alert-success userprovninfomargin" role="alert" id="successmsg">{{successMsg}}</div>
                    <ul class="nav nav-tabs">
                        <li [ngClass]="{'active':(selectedTabName=='IP')}"><a data-toggle="tab" (click)="showTemplate('IP')">IP's</a></li>
                        <li [ngClass]="{'active':(selectedTabName=='UserSessions')}"><a data-toggle="tab" (click)="showTemplate('UserSessions')">User Sessions</a></li>
                    </ul>

                    <div class="tab-content" *ngIf="selectedTabName=='IP'">
                        IP Detail will be here
                    </div>
                    <div class="tab-content" *ngIf="selectedTabName=='UserSessions'">
                        <user-session-table class="table-body"
                            [userSessionList]="userSessionDetails$ | async"
                            [tenants]="tenants"
                            (killSession)="killSession($event)"
                            [headerControls]="tableFilterControls"
                            [paginationControls]="tablePaginationControls"
                            (controlsChanged)="onTableHeaderControlsChanged($event)"
                            (paginationChanged)="onTablePaginationControlsChanged($event)">
                        </user-session-table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Popup for Kill Session -->
        <erag-modal [show]="isShowModal" [submitBtnLabel]="'OK'" [cancelBtnLabel] ="'Cancel'" (submit)="sessionKilled()" customWidth="50%"  (hide)="onHideSessionModal()">
            <div class="erag-modal-header">
                <span>{{header}}</span>
            </div>
            <div class="erag-modal-body">
                {{body}}
            </div>
        </erag-modal>
        <!-- End of Modal Popup for Kill Session-->
    `,
    styles: [``]
})
export class ReportsComponent implements OnInit, OnDestroy {

    tableFilterControls = {
        tenant: ''
    };
    tablePaginationControls = {
        itemsPerPage: 10,
        currentPage: 1,
        totalItems: 0
    };

    userSessionDetails$: Observable<UserSessionLogData[]>;
    tenants$: Observable<Tenant[]>;
    private _getUserSessionListSubscription: Subscription;
    private _killSessionSubscription: Subscription;
    private _tenantSubscription: Subscription;

    selectedTabName: string;
    successMsg: string;
    selectedSessions: Array<any>;
    header: string;
    body: string;
    isShowModal: Boolean = false;
    constants: any = AdminConstants;
    private _userProfile: UserProfile;
    tenants: Tenant[] = [];

    constructor(private reportsService: ReportService,
        private store: Store,
        private authService: AuthService) {
            // this.userSessionDetails$ = this.store.select('userSessionLogData');
            // this.tenants$ = this.store.select('tenants');
        }

    ngOnInit() {
        // TODO Need to chnage the first parameter will selected tenant id from filter once filter option will be available
        this._getUserSessionListSubscription = this.reportsService.getUserSessions( this.constants.STATUS.ACTIVE_SESSION)
            .subscribe();
        this._userProfile = this.authService.getUserProfile();
        this.userSessionDetails$ = this.store.select('userSessionLogData')
            .filter(Boolean)
            .distinctUntilChanged()
            .map(userSessionList => {
                if (!userSessionList.length || !this.tableFilterControls.tenant) {
                    return userSessionList;
                }
                return userSessionList.filter(userSession => {
                    if (userSession[0].tenant._id === this.tableFilterControls.tenant) {
                        return true;
                    }
                    return false;
                });
            })
            .do(userSessionList => this.tablePaginationControls.totalItems = userSessionList.length)
            .map(userSessionList => {
                if (!userSessionList.length) {
                    return userSessionList;
                }
                return userSessionList.slice((this.tablePaginationControls.currentPage - 1) *
                    this.tablePaginationControls.itemsPerPage, this.tablePaginationControls.currentPage * this.tablePaginationControls.itemsPerPage);
            });

        this._tenantSubscription = this.store.select('allTenants')
            .filter(Boolean)
            .distinctUntilChanged()
            .map((list: Tenant[]) => list.filter(tenant =>
                tenant.status !== AdminConstants.STATUS.PENDING_APPROVAL &&
                tenant.status !== AdminConstants.STATUS.REJECTED)
            )
            .subscribe(
                (tenants: Tenant[] |undefined) => {
                    if (tenants && tenants.length) {
                        if ( this._userProfile.role === AdminConstants.SUPER_USER ||
                            this._userProfile.role === AdminConstants.GLOBAL_ADMIN ||
                            this._userProfile.role === AdminConstants.GLOBAL_APPROVER) {

                            const allTenant: Tenant = {
                                name: 'All Tenant',
                                id: '',
                                description: 'All Tenant',
                                status: 'All Tenant',
                                createdAt: '',
                                settings: undefined
                            };
                            this.tenants = [allTenant];
                        }
                        tenants.map(tenant => this.tenants.push(tenant));
                        this.tableFilterControls.tenant = this.tenants[0].id; // set tenant[0] is the default selected Tenant
                        this.onTableHeaderControlsChanged({ tenant: this.tenants[0].id });
                    }
                }
            );

        this.showTemplate('IP');
    }

    // Function is used to show the tab data

    showTemplate(tabName) {
      this.selectedTabName = tabName;
    }

    // Function is used to kill session

    killSession (sessions) {
      this.isShowModal = true;
      this.header = 'Force Session Log Off';
      this.body = 'Are you sure you want to Kill Users Session?';
      this.selectedSessions = sessions;
    }

    // Function is used to kill the session
    sessionKilled () {
      this._killSessionSubscription = this.reportsService.killSession(this.selectedSessions, AdminConstants.STATUS.DEACTIVE_SESSION)
      .subscribe(res => {
            this.displaySuccessAlert('Session killed Successfully.');
            this.onHideSessionModal();
      });
    }

    // Function is used to hide session modal

    onHideSessionModal() {
        this.isShowModal = false;
    }

    // Function is used to show success messge
    displaySuccessAlert(message) {
        this.successMsg = message;
        setTimeout(() => {
            this.successMsg = '';
        }, 3000);
    }

    // On destroy of scope clear all the subscribers
    ngOnDestroy() {
        if (this._getUserSessionListSubscription) {
            this._getUserSessionListSubscription.unsubscribe();
        }
        if (this._killSessionSubscription) {
            this._killSessionSubscription.unsubscribe();
        }
        if (this._tenantSubscription) {
            this._tenantSubscription.unsubscribe();
        }
    }

    onTableHeaderControlsChanged($event: any) {
        this.tableFilterControls = $event;
        const userSessionList = this.store.value.userSessionLogData;
        this.store.set('userSessionLogData', Object.assign([], userSessionList));
    }

    onTablePaginationControlsChanged($event: any) {
        this.tablePaginationControls = $event;
        const userSessionList = this.store.value.userSessionLogData;
        this.store.set('userSessionLogData', Object.assign([], userSessionList));
    }

}
