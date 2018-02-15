import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';

import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ModuleWithProviders } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

import { AuthService } from '../../../auth/services/auth.service';
import { Store } from '../../../store';
import { TenantInfoService } from '../../services/tenant-info.service';
import { API_TOKEN } from './../../../api.token';
import { Tenant, Cert } from './../../../state';

import AdminConstant from '../../../admin.constant';

@Component({
    selector: 'tenant-setting',
    styleUrls: ['tenant-setting.component.scss'],
    template: `
        <div class="col-sm-12 padding-zero" [loading]="isPendingDeployment">
            <div class="header-title">Settings</div>

            <ts-server-certificate  [tenant]="currentTenant$ | async"
                                    [authToken]="authToken"
                                    [api]="uploadUrl"
                                    [showLoading] ="showServerCerficateLoading"
                                    (privateKeySubmitted) ="onServerCertPrivateKeySubmitted($event)"
                                    (clientCertSubmitted) ="onServerCertClientCertSubmitted($event)"
                                    (uploaded)="onServeCertSubmitUploadStatus($event)"
                                    (formSubmitFailure)="onServerCertSubmitFailure()">
                <ts-tsl-certificate-upload class="tsl-certificate-upload"
                                           [tenant]="currentTenant$ | async"
                                           [authToken]="authToken"
                                           [api]="uploadUrl"
                                           (added) ="onTslCertificateAdding($event)"
                                           (uploadSuccess)="onTslCertificateUploaded($event)"
                                           (uploadFailure)="onTslCertificateUploadFailure($event)">
                </ts-tsl-certificate-upload>
            </ts-server-certificate>

            <tenant-setting-upload-logo [tenant]="currentTenant$ | async"
                                        [authToken]="authToken"
                                        [api]="uploadUrl"
                                        (submitted)="onUploadLogoSubmitted($event)">
            </tenant-setting-upload-logo>

            <ts-identity-provider   [tenant]="currentTenant$ | async"
                                    [authToken]="authToken"
                                    [api]="uploadUrl"
                                    (submitted)="onIdpProviderSubmitted($event)"
                                    (uploaded)="onIdpProviderUploadStatus($event)"
                                    (formSubmitFailure)="onIdpProviderSubmitFailure()">
            </ts-identity-provider>

            <tenant-setting-gateway [tenant]="currentTenant$ | async"
                                    [showLoading] ="showGatewayLoading"
                                    (submitted)="onGatewaySubmitted($event)"
                                    (uploaded)="onGatewayUploadStatus($event)">
            </tenant-setting-gateway>

            <tenant-setting-whitelist-ips [tenant]="currentTenant$ | async"
                                          [show]="showWhitelistIpsDropdow"
                                          [showLoading] ="showWhitelistIPsLoading"
                                          (toggle)="onWhitelistIpsToggle($event)"
                                          (submitted)="onWhitelistIpsSubmitted($event)">
            </tenant-setting-whitelist-ips>

            <tenant-setting-twofactor   [tenant]="currentTenant$ | async"
                                        [showLoading] ="showTwoFactorLoading"
                                        (submitted)="onTwofactorSubmit($event)"
                                        (uploaded)="onTwofactorUploadStatus($event)">
            </tenant-setting-twofactor>

            <tenant-setting-active-directory [tenant]="currentTenant$ | async"
                                             [validConnection]="activeDirectoryValidConnection"
                                             [showLoading] ="showActiveDirectoryLoading"
                                             (validated)="onActiveDirectoryFormValidated($event)"
                                             (submitted)="onActiveDirectoryFormSubmitted($event)">
            </tenant-setting-active-directory>


            <div class="col-sm-12 btn-deploy-container text-right" *ngIf="(currentTenant$ | async)?.status !== 'Active' ">
               <button type="buttion" class="btn btn-cust"
                       [disabled]="!allFormsSubmitted"
                       [ngClass]="{ deployable: allFormsSubmitted }"
                       (click)="showConfirmDeployModal = true">
                    Deploy
                </button>
            </div>
        </div>

        <confirm-deploy-modal [show]="showConfirmDeployModal"
                              (hide)="showConfirmDeployModal = false"
                              (confirmed)= "onDeploymentConfimed()">
        </confirm-deploy-modal>
    `
})
export class TenantSettingComponent implements OnInit, OnDestroy {
    uploadUrl = this.api + '/tenants/upload';
    authToken = this.authService.authToken;

    currentTenant$: Observable<Tenant>;

    isPendingDeployment = false;

    // -- for Server Certificate form ---------
    showServerCerficateLoading = false;

    // --- for Gateway Form ------------
    showGatewayLoading = false;

    // --- for Whitelist Ips -------
    showWhitelistIpsDropdow = false;
    showWhitelistIPsLoading = false;

    // --- for Two Factor ------
    showTwoFactorLoading = false;

    // ----- for Active Directory Form ------
    activeDirectoryValidConnection = false;
    showActiveDirectoryLoading = false;
    allFormsSubmitted = false; // ---- deploy Btn  -----
    showConfirmDeployModal = false; // true if you user agree to deploy

    private _server_cer_form_submit_state = false;
    private _idp_provider_form_submit_state = false;
    private _gateway_form_submit_state = false;
    private _two_factor_form_submit_state = false;
    private _active_directory_submit_state = false;

    private _whitelistIpsSubscription: Subscription;
    private _gatewaySubscription: Subscription;
    private _twoFactorSubscription: Subscription;
    private _activeDirectorySubscription: Subscription;
    private _activeDirectoryValidationSubscription: Subscription;

    private _settingFormSubscription: Subscription;


    constructor(
        private tenantInfoService: TenantInfoService,
        private store: Store,
        private authService: AuthService,
        private cd: ChangeDetectorRef,
        @Inject(API_TOKEN) public api: string) { }

    ngOnInit() {
        this.currentTenant$ = this.store.select('currentTenant')
            .filter(Boolean)
            .distinctUntilChanged()
            .do(tenant => {
               // console.log('tenant: ', tenant.status);
                if (tenant.status === AdminConstant.STATUS.PENDING_DEPLOYMENT) {
                    this.isPendingDeployment = true;
                } else {
                    this.isPendingDeployment = false;
                }
            });
    }

    // ---- Idp Provider------
    onIdpProviderSubmitted($event) {
        this._idp_provider_form_submit_state = true;
        this.resetCurrentTenant($event);
        this.checkDeployStatus();
    }

    onGatewayUploadStatus($event: boolean) {
        this._idp_provider_form_submit_state = $event;
        this.checkDeployStatus();
    }

    onIdpProviderUploadStatus($event: boolean) {
        this._idp_provider_form_submit_state = $event;
        this.checkDeployStatus();
    }

    onIdpProviderSubmitFailure() {
        this.resetCurrentTenant();
    }

    // ----- for Server Certificate----------------
    onServerCertPrivateKeySubmitted($event) {
        console.log('onServerCertPrivateKeySubmitted: ', $event);
        this.resetCurrentTenant($event);
    }

    onServerCertClientCertSubmitted($event) {
        console.log('onServerCertClientCertSubmitted: ', $event);
        this.resetCurrentTenant($event);
    }

    onServerCertSubmitFailure() {
        this.resetCurrentTenant();
    }

    onServeCertSubmitUploadStatus($event: boolean) {
        this._server_cer_form_submit_state = $event;
        this.checkDeployStatus();
    }

    // -------For Logo--------------------------
    onUploadLogoSubmitted($event) {
        this.resetCurrentTenant($event);
       this.cd.markForCheck();
    }

    //  ----- fopr Tsl Certificate ---
    onTslCertificateAdding(fileName: string) {
        this.showServerCerficateLoading = true;
    }

    onTslCertificateUploaded($event) {
        this.showServerCerficateLoading = false;

        this.resetCurrentTenant( $event);
        this.checkDeployStatus();
    }

    onTslCertificateUploadFailure(fileName: string) {
        this.showServerCerficateLoading = false;
        this.resetCurrentTenant();
    }

    // whitelist IPs Form----------

    onWhitelistIpsToggle(action: string) {
        switch (action) {
            case 'open':
                this.showWhitelistIpsDropdow = true;
                break;
            case 'close':
                this.showWhitelistIpsDropdow = false;
                break;
            case 'toggle':
                this.showWhitelistIpsDropdow = !this.showWhitelistIpsDropdow;
                break;
        }
    }

    onWhitelistIpsSubmitted(ips: string[]) {
        this.showWhitelistIPsLoading = true;
        this._whitelistIpsSubscription = this.tenantInfoService.submitWhitelistIpsForm(ips)
            .subscribe(
               res => {
                    this.resetCurrentTenant(res.data);
                    this.showWhitelistIPsLoading = false;
                    this.cd.markForCheck();
                },
                error => {
                    this.showWhitelistIPsLoading = false;
                    this.cd.markForCheck();
                }
            );
    }

    //  ------- two Factor Form -------------------
    onTwofactorSubmit($event) {
        this.showTwoFactorLoading = true;
        this._twoFactorSubscription = this.tenantInfoService.submitTwoFactorForm($event)
            .subscribe(
            res => {
                this.resetCurrentTenant(res.data);
                this._two_factor_form_submit_state = true;
                this.showTwoFactorLoading = false;
                this.checkDeployStatus();
                this.cd.markForCheck();
            },
            error => {
                this._two_factor_form_submit_state = false;
                this.showTwoFactorLoading = false;
                this.checkDeployStatus();
                this.cd.markForCheck();
            }
            );
    }

    onTwofactorUploadStatus($event: boolean) {
        this._two_factor_form_submit_state = $event;
        this.checkDeployStatus();
    }

    onGatewaySubmitted($event) {
        this.showGatewayLoading = true;
        this._gateway_form_submit_state = true;
        this._gatewaySubscription = this.tenantInfoService.submitGateWayForm($event)
            .subscribe(
            res => {
                this.resetCurrentTenant(res.data);
                this._gateway_form_submit_state = true;
                this.showGatewayLoading = false;
                this.checkDeployStatus();
                this.cd.markForCheck();
            },
            error => {
                this._gateway_form_submit_state = false;
                this.showGatewayLoading = false;
                this.checkDeployStatus();
                this.cd.markForCheck();
            }
            );
    }

    onActiveDirectoryFormSubmitted($event) {
        this.showActiveDirectoryLoading = true;
        this._activeDirectorySubscription = this.tenantInfoService.submitActiveDirectoryForm($event)
            .subscribe(
              res => {
                this.resetCurrentTenant(res.data);
                this._active_directory_submit_state = true;
                this.showActiveDirectoryLoading = false;
                this.checkDeployStatus();
                this.cd.markForCheck();
            },
            error => {
                this._active_directory_submit_state = false;
                this.showActiveDirectoryLoading = false;
                this.checkDeployStatus();
                this.cd.markForCheck();
            }
            );
    }

    onActiveDirectoryFormValidated($event) {
        this.showActiveDirectoryLoading = true;
        this._activeDirectoryValidationSubscription = this.tenantInfoService.validateActiveDirectoryForm($event)
            .subscribe(
            next => {
                this.activeDirectoryValidConnection = true;
                this.showActiveDirectoryLoading = false;
                this.cd.markForCheck();
            },
            error => {
                this.activeDirectoryValidConnection = false;
                this.showActiveDirectoryLoading = false;
                this.cd.markForCheck();
            }
            );
    }

    checkDeployStatus() {
        if (this._server_cer_form_submit_state &&
            this._idp_provider_form_submit_state &&
            this._gateway_form_submit_state &&
            this._two_factor_form_submit_state) {
            this.allFormsSubmitted = true;
        } else {
            this.allFormsSubmitted = false;
        }
    }

    onDeploymentConfimed() {
        this.showConfirmDeployModal = false;

        // need to manually change the deploying status to `pending Deployement`
        const deployTeanant = this.store.value.currentTenant;
        this.store.set('currentTenant', Object.assign({}, deployTeanant, { status: AdminConstant.STATUS.PENDING_DEPLOYMENT }));
        this._settingFormSubscription = this.tenantInfoService
            .deployTenantSettingForm()
            .subscribe(
            next => { },
            error => { }
            );
    }

    resetCurrentTenant(updatedTeanant?: Tenant) {
        let index = 0;
        const currentTenant = updatedTeanant || this.store.value.currentTenant;
        const TenantTabs = this.store.value.selectedTenants.filter((tenant, i) => {
            if (tenant.id === currentTenant.id) {
                index = i;
            } else {
                return tenant;
            }
        });
        TenantTabs.splice(index, 0, currentTenant);
       // console.log('TenantTabs.length: ', TenantTabs);

        this.store.set('currentTenant', Object.assign({}, currentTenant));
        this.store.set('selectedTenants', Object.assign([], TenantTabs));
    }

    ngOnDestroy() {
        if (this._gatewaySubscription) {
            this._gatewaySubscription.unsubscribe();
        }
        if (this._twoFactorSubscription) {
            this._twoFactorSubscription.unsubscribe();
        }
        if (this._activeDirectorySubscription) {
            this._activeDirectorySubscription.unsubscribe();
        }
        if (this._activeDirectoryValidationSubscription) {
            this._activeDirectoryValidationSubscription.unsubscribe();
        }
        if (this._whitelistIpsSubscription) {
            this._whitelistIpsSubscription.unsubscribe();
        }
    }
}
