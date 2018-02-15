import { SharedModule } from '../shared/shared.module';
import { ActivationService } from './services/activation.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PopoverModule } from 'ngx-bootstrap';
import { AuthModule } from '../auth/auth.module';
import { AuthGuardLogin } from '../auth/guards/guard.login';
import { ActivationFormComponent } from './components/activation-form/activation-form.component';
import { ActivationComponent } from './containers/activation.component';

const ROUTES: Routes = [
    {
        path: 'activation',
        canActivate: [AuthGuardLogin],
        component: ActivationComponent
    }
];
@NgModule({
    imports: [
        ReactiveFormsModule,
        CommonModule,
        HttpClientModule,
        RouterModule.forChild(ROUTES),
        PopoverModule.forRoot(),
        AuthModule,
        SharedModule
    ],
    declarations: [
        ActivationComponent,
        ActivationFormComponent
    ],
    providers: [
        ActivationService
    ],
})
export class ActivationModule { }
