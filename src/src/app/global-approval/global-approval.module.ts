import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalApprovalService } from './services/global-approval.service';

import { GlobalApprovalComponent } from './containers/global-approval/global-approval.component';
import { GlobalApprovalTableComponent } from './components/global-approval-table/global-approval-table.component';
import { GlobalApprovalTenantUserTableComponent } from './components/global-approval-tenant-user-table/approval-tenant-user-table.component';
import { GlobalApprovalModalComponent } from './components/global-approval-modal/global-approval-modal.component';
const ROUTES: Routes = [
    { path : '', component: GlobalApprovalComponent}
];
@NgModule({
    declarations: [
        GlobalApprovalComponent,
        GlobalApprovalTableComponent,
        GlobalApprovalTenantUserTableComponent,
        GlobalApprovalModalComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(ROUTES),
        SharedModule
     ],
    providers: [GlobalApprovalService],
})
export class GloabalApprovalModule {}
