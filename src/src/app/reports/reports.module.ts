import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsComponent } from './containers/reports/reports.component';
import { ReportService } from './services/reports.service';
import { UserSessionTableComponent } from './components/user-session-table/user-session-table.component';

const ROUTES: Routes = [
    { path : '', component: ReportsComponent}
];
@NgModule({
    declarations: [
        ReportsComponent,
        UserSessionTableComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES),
        SharedModule,
        FormsModule
     ],
    providers: [ReportService],
})
export class ReportsModule {}
