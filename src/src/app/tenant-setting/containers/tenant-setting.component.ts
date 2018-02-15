import { Store } from '@ngrx/store';
import { Tenant } from './../../home/models/tenant';

import { AuthService } from './../../auth/services/auth.service';
import { API_TOKEN } from './../../api.token';

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';

import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

import AdminConstant from '../../admin.constant';

import * as homeReducer from '../../home/store/reducers';
import * as homeAction from '../../home/store/actions/home.actions';

import * as settingReducers from '../store/reducers';

import * as serverCertActions from '../store/actions/server-cert.action';

import * as logoUploadActions from '../store/actions/logo-upload.action';

import * as idpProviderActions from '../store/actions/idp-provider.action';

import * as dnsGatewayActions from '../store/actions/dns-gateway.action';


@Component({
    selector: 'tenant-setting',
    styleUrls: ['tenant-setting.component.scss'],
    template: `
        <div class="col-sm-12 padding-zero">
            <div class="header-title">Settings</div>

            <server-certificate     [tenant]= "selectedTenant$ | async"
                                    [authToken]= "authToken"
                                    [api]= "uploadUrl"
                                    [showLoading]= "serverCertPending$ | async"
                                    [formSumitted] ="serverCertSubmitted$ | async"
                                    (privateKeySubmitted) ="onKeySubmitted($event)"
                                    (clientCertSubmitted) ="onKeySubmitted($event)"
                                    (submit) ="onServerCertSubmit()"
                                    (submitSuccess) ="onServerCertSubmitSuccess()"
                                    (submitFailure)= "onServerCertSubmitFailure()">

                <tsl-certificate-upload class="tsl-certificate-upload"
                                           [tenant]= "selectedTenant$ | async"
                                           [authToken]= "authToken"
                                           [api]= "uploadUrl"
                                           (added)= "onTslCertAdded()"
                                           (uploadSuccess)= "onTslCertUploadSuccess($event)"
                                           (uploadFailure)= "onTslCertUploadFailure()">
                </tsl-certificate-upload>
            </server-certificate>

            <logo-upload  [tenant]= "selectedTenant$ | async"
                          [authToken]= "authToken"
                          [api]= "uploadUrl"
                          [showLoading]= "logoUploadPending$ | async"
                          [submitted] ="logoUploadSubmitted$ | async"
                          (submit)= "onLogoUploadSubmit()"
                          (submitSuccess)= "onLogoUploadSubmitSuccess($event)"
                          (submitFailure) ="onLogoUploadSubmitFailure()">
            </logo-upload>

            <identity-provider  [tenant]="selectedTenant$ | async"
                                [authToken]="authToken"
                                [api]="uploadUrl"
                                [showLoading]= "idpProviderPending$ | async"
                                [submitted] ="idpProviderSubmitted$ | async"
                                (submit)="onIdpProviderSubmit()"
                                (submitSuccess)="onIdpProviderSubmitSuccess($event)"
                                (submitFailure)="onIdpProviderSubmitFailure()">
            </identity-provider>

            <dns-gateway    [tenant]="selectedTenant$ | async"
                            [showLoading] ="dnsGatewayPending$ | async"
                            [submitted] ="dnsGatewaySubmitted$ | async"
                            (submit)="onGatewaySubmit($event)">
            </dns-gateway>

        </div>

    `
})
export class TenantSettingComponent implements OnInit {
    uploadUrl = this.api + '/tenants/upload';
    authToken = this.authService.authToken;

    private _selectedTenantId: string;

    selectedTenant$: Observable<Tenant>;

    serverCertPending$: Observable<boolean>;
    serverCertSubmitted$: Observable<boolean>;

    logoUploadPending$: Observable<boolean>;
    logoUploadSubmitted$: Observable<boolean>;

    idpProviderPending$: Observable<boolean>;
    idpProviderSubmitted$: Observable<boolean>;

    dnsGatewayPending$: Observable<boolean>;
    dnsGatewaySubmitted$: Observable<boolean>;

    constructor(
        private authService: AuthService,
        private store: Store<settingReducers.State>,
        @Inject(API_TOKEN) public api: string) { }

    ngOnInit() {
        this.selectedTenant$ = this.store.select(homeReducer.getSelectedTenant)
            .filter(Boolean)
            .distinctUntilChanged()
            .do(tenant => {
                // this.updateServerCertSubmitStatus(tenant);
                // this.updateLogoUploadSubmitStatus(tenant);
                // this.updateIdpProviderSubmitStatus(tenant);
                // this.updateDnsGatewaySubmitStatus(tenant);

                this._selectedTenantId = tenant.id;
            });

        this.serverCertPending$ = this.store.select(settingReducers.getServerCertPending)
            .distinctUntilChanged();

        this.serverCertSubmitted$ = this.store.select(settingReducers.getServerCertSubmitted)
            .distinctUntilChanged();

        this.logoUploadPending$ = this.store.select(settingReducers.getLogoUploadPending)
            .distinctUntilChanged();

        this.logoUploadSubmitted$ = this.store.select(settingReducers.getLogoUploadSubmitted);

        this.idpProviderPending$ = this.store.select(settingReducers.getIdpProviderPending)
            .distinctUntilChanged();

        this.idpProviderSubmitted$ = this.store.select(settingReducers.getIdpProviderSubmitted)
            .distinctUntilChanged();

        this.dnsGatewayPending$ = this.store.select(settingReducers.getDnsGatewayPending)
            .distinctUntilChanged();

        this.dnsGatewaySubmitted$ = this.store.select(settingReducers.getDnsGatewaySubmitted)
            .distinctUntilChanged();
    }

    onTslCertAdded() {
        this.store.dispatch(new serverCertActions.ShowLoading());
    }

    onTslCertUploadSuccess(tenant: Tenant) {
        this.store.dispatch(new serverCertActions.HideLoading());
        this.store.dispatch(new homeAction.SelectTenant(tenant));
    }

    onTslCertUploadFailure() {
        this.store.dispatch(new serverCertActions.HideLoading());
        this.store.dispatch(new homeAction.RefreshTenant());
    }

    onKeySubmitted(tenant: Tenant) {
        this.store.dispatch(new homeAction.SelectTenant(tenant));
    }

    onServerCertSubmit() {
        this.store.dispatch(new serverCertActions.Submit());
    }

    onServerCertSubmitSuccess() {
        this.store.dispatch(new serverCertActions.SubmitSuccess());
    }

    onServerCertSubmitFailure() {
        this.store.dispatch(new serverCertActions.SubmitFailure());
        this.store.dispatch(new homeAction.RefreshTenant());
    }

    updateServerCertSubmitStatus(tenant: Tenant) {
        const fqdn = tenant.settings.tenant_fqdn;
        const certificate_available = tenant.settings.is_ca_certificate_available;
        const client_certificate = tenant.settings.client_cert.client_certificate_file;
        if (fqdn && certificate_available && client_certificate) {
            this.store.dispatch(new serverCertActions.SetSubmitted());
        }
    }

    // ---- logo upload ---------------------------------------------------------------------------------
    onLogoUploadSubmit() {
        this.store.dispatch(new logoUploadActions.Submit());
    }
    onLogoUploadSubmitSuccess(tenant: Tenant) {
        this.store.dispatch(new logoUploadActions.SubmitSuccess());
        this.store.dispatch(new homeAction.SelectTenant(tenant));
    }
    onLogoUploadSubmitFailure() {
        this.store.dispatch(new logoUploadActions.SubmitFailure());
        this.store.dispatch(new homeAction.RefreshTenant());
    }

    updateLogoUploadSubmitStatus(tenant: Tenant) {
        if (!!tenant.settings.tenant_logo) {
            this.store.dispatch(new logoUploadActions.SetSubmitted());
        }
    }

    // -----Idp Provider ---------------------------------------------------------------------------
    onIdpProviderSubmit() {
        this.store.dispatch(new idpProviderActions.Submit());
    }
    onIdpProviderSubmitSuccess(tenant: Tenant) {
        this.store.dispatch(new idpProviderActions.SubmitSuccess());
        this.store.dispatch(new homeAction.SelectTenant(tenant));
    }
    onIdpProviderSubmitFailure() {
        this.store.dispatch(new idpProviderActions.SubmitFailure());
        this.store.dispatch(new homeAction.RefreshTenant());
    }

    updateIdpProviderSubmitStatus(tenant: Tenant) {
        const idpUrl = tenant.settings.sso_url;
        const securityToken = tenant.settings.security_token_file;

        if (idpUrl && securityToken) {
            this.store.dispatch(new idpProviderActions.SetSubmitted());
        }
    }

    // ----- Dns Gateway --------------------------------------------------------------------------
    onGatewaySubmit(gateway) {
        this.store.dispatch(new dnsGatewayActions.Submit({ dnsGateway: gateway, tenantId: this._selectedTenantId}));
    }

    updateDnsGatewaySubmitStatus(tenant: Tenant) {
        if (!!tenant.settings.gateway_dns) {
            this.store.dispatch(new dnsGatewayActions.SetSubmitted());
        }
    }
}
