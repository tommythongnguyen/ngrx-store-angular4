import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ResetPasswordComponent } from '../profile/containers/reset-password/reset-password.component';
import { ResetPasswordService } from './services/reset-password.service';
import {AsyncValidatorService} from '../utils/services/async.service';

export const ROUTES: Routes = [
    {
        path: '', component: ResetPasswordComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES),
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ],
    exports: [
    ],
    declarations: [ResetPasswordComponent],
    providers: [
        ResetPasswordService,
        AsyncValidatorService
    ],
})
export class ProfileModule { }
