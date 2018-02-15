import { TenantUrlGroupDropdownComponent } from './components/tenant-url-group-dropdown/tenant-url-group-dropdown.component';
import { TenantSettingConfirmDeployModalComponent } from './components/tenant-setting-confirm-deploy-modal/tenant-setting-confirm-deploy-modal.component';
import { TenantSettingDeployingModalComponent } from './components/tenant-setting-deploying-modal/tenant-setting-deploying-modal.component';
import { TenantGroupEndUserTableComponent } from './components/tenant-group-enduser-table/tenant-group-enduser-table.component';
import { EndUserComponent } from './components/end-user/end-user.component';
import { TenantGroupTableComponent } from './components/tenant-group-table/tenant-group-table.component';
import { TenantGroupService } from './services/tenant-group.service';
import { TenantGroupEndUserComponent } from './containers/tenant-group-enduser/tenant-group-enduser.component';
import { AddTenantGroupComponent } from './containers/add-tenant-group/add-tenant-group.component';
import { TenantGroupComponent } from './containers/tenant-group/tenant-group.component';

/* Ad Sync files */
import { TenantGroupAdSyncComponent } from './components/group-adsync-form/group-adsync-form.component';
/* EOC for Ad Sync files */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { TenantApprovalModalComponent } from './components/tenant-approval-modal/tenant-approval-modal.component';
import { TenantApprovalTableComponent } from './components/tenant-approval-table/tenant-approval-table.component';
import {
    TenantSettingActiveDirectoryComponent,
} from './components/tenant-setting-active-directory/tenant-setting-active-directory.component';
import { TenantSettingGatewayComponent } from './components/tenant-setting-gateway/tenant-setting-gateway.component';
import {
    TenantSettingIdentityProviderComponent,
} from './components/tenant-setting-identity-provider/tenant-setting-identity-provider.component';
import {
    TenantSettingServerCertificateComponent,
} from './components/tenant-setting-server-certificate/tenant-setting-server-certificate.component';
import { TenantSettingSSOComponent } from './components/tenant-setting-sso/tenant-setting-sso.component';
import {
    TenantSettingTslCertificateUploadComponent,
} from './components/tenant-setting-tsl-certificate-upload/tenant-setting-tsl-certificate-upload.component';
import { TenantSettingTwoFactorComponent } from './components/tenant-setting-twofactor/tenant-setting-twofactor.component';
import {
    TenantSettingUploadLogoComponent,
} from './components/tenant-setting-upload-logo/tenant-setting-upload-logo.component';

import { TenantSettingWhitelistIPsComponent } from './components/tenant-setting-whitelist-ips/tenant-setting-whitelist-ips.component';

import { TenantSidebarComponent } from './components/tenant-sidebar/tenant-sidebar.component';
import { TenantTabsComponent } from './components/tenant-tabs/tenant-tabs.component';
import { TenantUrlTableComponent } from './components/tenant-url-table/tenant-url-table.component';
import { TenantUserTableComponent } from './components/tenant-user-table/tenant-user-table.component';
import { TenantApprovalComponent } from './containers/tenant-approval/tenant-approval.component';
import { TenantInfoComponent } from './containers/tenant-info/tenant-info.component';
import { TenantSettingComponent } from './containers/tenant-setting/tenant-setting.component';
import { TenantUrlDetailComponent } from './containers/tenant-url-detail/tenant-url-detail.component';
import { TenantUrlListComponent } from './containers/tenant-url-list/tenant-url-list.component';
import { TenantUserDetailComponent } from './containers/tenant-user-detail/tenant-user-detail.component';
import { TenantUserListComponent } from './containers/tenant-user-list/tenant-user-list.component';
import { GuardTenantInfo } from './guards/guard.tenant-info';
import { TenantApprovalService } from './services/tenant-approval.service';
import { TenantInfoService } from './services/tenant-info.service';
import { TenantUrlDetailResolver } from './services/tenant-url-detail-resolver.service';
import { TenantUserService } from './services/tenant-user.service';
import {AsyncValidatorService} from '../utils/services/async.service';

const ROUTES: Routes = [
    {
        path: '',
        canActivate: [GuardTenantInfo],
        component: TenantInfoComponent,
        children: [
            { path: '', redirectTo: 'settings', pathMatch: 'full' },
            { path: 'settings', component: TenantSettingComponent },
            {
                path: 'urlsList',
                children: [
                    { path: '', component: TenantUrlListComponent },
                    {
                        path: 'edit',
                        component: TenantUrlDetailComponent
                        // canDeactivate: [GuardTenantInfo],
                        // resolve: {
                        //     tenantUrlDetail: TenantUrlDetailResolver
                        // }
                    },
                    { path: 'add', component: TenantUrlDetailComponent }
                ]
            },
            {
                path: 'users',
                children: [
                    { path: '', component: TenantUserListComponent },
                    { path: 'add', component: TenantUserDetailComponent }
                ]
            },
            { path: 'approvals', component: TenantApprovalComponent },
            {
                path: 'groups',
                children: [
                    { path: '', component: TenantGroupComponent },
                    { path: 'add', component: AddTenantGroupComponent },
                    { path: 'endusers', component: TenantGroupEndUserComponent }
                ]
            }
        ]
    }
];

const COMPONENTS = [
    TenantInfoComponent,
    TenantTabsComponent,
    TenantUrlListComponent,
    TenantUrlDetailComponent,
    TenantUrlTableComponent,
    TenantUrlGroupDropdownComponent,
    TenantSidebarComponent,
    TenantSettingComponent,
    TenantSettingServerCertificateComponent,
    TenantSettingUploadLogoComponent,
    TenantSettingTslCertificateUploadComponent,
    TenantSettingGatewayComponent,
    TenantSettingTwoFactorComponent,
    TenantSettingActiveDirectoryComponent,
    TenantSettingIdentityProviderComponent,
    TenantSettingSSOComponent,
    TenantSettingWhitelistIPsComponent,
    TenantSettingDeployingModalComponent,
    TenantSettingConfirmDeployModalComponent,
    TenantUserListComponent,
    TenantUserTableComponent,
    TenantUserDetailComponent,
    TenantApprovalComponent,
    TenantApprovalModalComponent,
    TenantApprovalTableComponent,
    TenantGroupComponent,
    TenantGroupTableComponent,
    AddTenantGroupComponent,
    EndUserComponent,
    TenantGroupEndUserComponent,
    TenantGroupEndUserTableComponent,
    TenantGroupAdSyncComponent
];

@NgModule({
    declarations: [...COMPONENTS],
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES),
        ReactiveFormsModule,
        FormsModule,
        SharedModule
    ],
    providers: [
        GuardTenantInfo,
        TenantInfoService,
        TenantUrlDetailResolver,
        TenantUserService,
        TenantApprovalService,
        TenantGroupService,
        AsyncValidatorService
    ],
})
export class TenantInfoModule { }
