import { SettingEffects } from './store/effects/settings.effect';
import { EffectsModule } from '@ngrx/effects';
import { SettingService } from './services/settings.service';
import { DnsGatewayComponent } from './components/dns-gateway/dns-gateway.component';
import { IdentityProviderComponent } from './components/identity-provider/identity-provider.component';
import { LogoUploadComponent } from './components/logo-upload/logo-upload.component';
import { TslCertificateUploadComponent } from './components/tsl-certificate-upload/tsl-certificate-upload.component';
import { ServerCertificateComponent } from './components/server-certificate/server-certificate.component';
import { TenantSettingComponent } from './containers/tenant-setting.component';
import { SharedModule } from './../shared/shared.module';
import { reducers } from './store/reducers/index';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        TenantSettingComponent,
        ServerCertificateComponent,
        TslCertificateUploadComponent,
        LogoUploadComponent,
        IdentityProviderComponent,
        DnsGatewayComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        SharedModule,
        StoreModule.forFeature('tenantSetting', reducers),
        EffectsModule.forFeature([SettingEffects])
    ],
    exports: [TenantSettingComponent],
    providers: [SettingService],
})
export class TenantSettingModule {}
