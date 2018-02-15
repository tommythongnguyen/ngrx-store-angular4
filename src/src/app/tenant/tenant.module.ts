import { TenantSettingComponent } from './../tenant-setting/containers/tenant-setting.component';
import { TenantSettingModule } from '../tenant-setting/tenant-setting.module';
import { TenantGuard } from './services/guard.service';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './store/reducers';
import { StoreModule } from '@ngrx/store';
import { RouterModule, Routes } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TenantHomeComponent } from './containers/tenant-home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const ROUTES: Routes = [
  {
    path: '',
    canActivate: [ TenantGuard ],
    component: TenantHomeComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'settings' },
      { path: 'settings', component: TenantSettingComponent }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    StoreModule.forFeature('tenant', reducers),
    EffectsModule.forFeature([]),
    RouterModule.forChild(ROUTES),
    TenantSettingModule
  ],
  declarations: [
    TenantHomeComponent,
    SidebarComponent
  ],
  providers: [
    TenantGuard
  ]
})
export class TenantModule { }
