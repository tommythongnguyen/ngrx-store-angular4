import { schema } from './store/db';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { metaReducers, reducer } from './store/reducers/app.reducer';
import { StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from './store';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';

import { environment } from '../environments/environment';

import { DBModule } from '@ngrx/db';

import { API_TOKEN } from './api.token';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { HomeModule } from './home/home.module';

import { ActivationModule } from './activation/activation.module';

// ----- Features ---------------------------
// ----- Api Token----------------------------
// --------- Guards---------------------------
// --------Entry Point -----------------------
// ----------- Feature Components--------------


const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HomeModule,
    AuthModule.forRoot(),
    RouterModule.forRoot(ROUTES, { preloadingStrategy: PreloadAllModules }),

    StoreModule.forRoot(reducer, { metaReducers }),
    EffectsModule.forRoot([]),
    DBModule.provideDB(schema),
    /**
     * @ngrx/router-store keeps router state up-to-date in the store
     */
    StoreRouterConnectingModule,

    // !environment.production ? StoreDevtoolsModule.instrument() : [],
    ActivationModule,
    AuthModule.forRoot(),
    RouterModule.forRoot(ROUTES, { preloadingStrategy: PreloadAllModules })
  ],
  providers: [
    Store,
    { provide: API_TOKEN, useValue: environment.api_url }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
