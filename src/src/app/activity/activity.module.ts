import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityComponent } from './containers/activity/activity.component';
import { SharedModule } from '../shared/shared.module';

import { ActivityService } from './services/activity.service';
import { ActivityTableComponent } from './components/activity-table/activity-table.component';

const ROUTES: Routes = [
    { path: '', component: ActivityComponent }
];
@NgModule({
    declarations: [
        ActivityComponent,
        ActivityTableComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES),
        SharedModule
    ],
    providers: [ActivityService],
})
export class ActivityModule { }
