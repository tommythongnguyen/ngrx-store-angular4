import { IPDetailTableComponent } from './components/ip-details-table/ip-details-table.component';
import { MarkerInfoWindowComponent } from './components/marker-info-window/marker-info-window.component';
import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { SharedModule } from '../shared/shared.module';
import { DateNavComponent } from './components/date-nav/date-nav.component';
import { GoogleMapComponent } from './components/google-map/google-map.component';
import {
    PermissionControlRadiosComponent,
} from './components/permission-control-radios/permission-control-radios.component';
import { PortControlRadiosComponent } from './components/port-control-radios/port-control-radios.component';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { FooterControlsComponent } from './containers/footer-controls/footer-controls.component';
import { DashboardService } from './services/dasboard.service';

@NgModule({
    declarations: [
        DashboardComponent,
        GoogleMapComponent,
        MarkerInfoWindowComponent,
        DateNavComponent,
        FooterControlsComponent,
        PermissionControlRadiosComponent,
        PortControlRadiosComponent,
        IPDetailTableComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDcjhQBxCgkrfwmGDPWEVKe4xNHOL_7BFI&libraries=places'
        }),
        SharedModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        DashboardComponent
    ],
    providers: [
        DashboardService
    ],
})
export class DashboardModule { }

