import { SharedModule } from './../shared/shared.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CookieService } from 'ng2-cookies';

import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoginComponent } from './containers/login.component';
import { AuthGuardHome } from './guards/guard.home';
import { AuthGuardLogin } from './guards/guard.login';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthService } from './services/auth.service';
import { LoginService } from './services/login.service';
import { AuthEffects } from './store/effects/auth.effects';
import { reducers } from './store/reducers/index';

export const ROUTES: Routes = [
    { path: 'login', component: LoginComponent }
];

@NgModule({
    declarations: [
        LoginComponent,
        LoginFormComponent
    ],
    imports: [
        HttpClientModule,
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        SharedModule
    ]
})
export class AuthModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: RootAuthModule,
            providers: [
                AuthService,
                AuthGuardHome,
                AuthGuardLogin,
                LoginService,
                CookieService,
                { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
            ]
        };
    }
}

@NgModule({
    imports: [
        AuthModule,
        RouterModule .forChild(ROUTES),
        StoreModule.forFeature('auth', reducers),
        EffectsModule .forFeature([AuthEffects])
    ]
})
export class RootAuthModule { }
