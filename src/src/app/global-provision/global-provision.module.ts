import { TenantUsersFormComponent } from './components/tenant-users-form/tenant-users-form.component';
import { TenantDetailFormComponent } from './components/tenant-detail-form/tenant-detail-form.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { TenantService } from './services/tenant.service';
import {AsyncValidatorService} from '../utils/services/async.service';

import { BsModalService } from 'ngx-bootstrap/modal';

import { TenantProvisionComponent} from './containers/tenant-provision/tenant-provision.component';

// import { EragUserComponent } from './components/erag-user/erag-user.component';
import { TenantProvisionTableComponent } from './components/tenant-provision-table/tenant-provision-table.component';

import { StepWizardComponent } from './components/step-wizard/step-wizard.component';
import { DeleteTenantModalComponent } from './components/delete-tenant-modal/delete-tenant-modal.component';
import { AddEditTenantModalComponent } from './components/add-edit-tenant-modal/add-edit-tenant-modal.component';

const ROUTES: Routes = [
    { path: '', component: TenantProvisionComponent }
];
@NgModule({
    declarations: [
        TenantProvisionComponent,
        // EragUserComponent,
        TenantProvisionTableComponent,

        DeleteTenantModalComponent,
        StepWizardComponent,
        AddEditTenantModalComponent,
        TenantDetailFormComponent,
        TenantUsersFormComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES),
        SharedModule,
        FormsModule,
        ReactiveFormsModule
    ],
    entryComponents: [],
    providers: [TenantService, BsModalService, AsyncValidatorService],
})
export class GlobalProvisionModule { }
