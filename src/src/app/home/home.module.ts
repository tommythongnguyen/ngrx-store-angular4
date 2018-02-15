import { HomeEffects } from "./store/effects/home.effects";
import { EffectsModule } from "@ngrx/effects";
import { reducers } from "./store/reducers";
import { StoreModule } from "@ngrx/store";
import { SharedModule } from "../shared/shared.module";
import { AuthModule } from "../auth/auth.module";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuardHome } from "../auth/guards/guard.home";
import { DashboardComponent } from "../dashboard/containers/dashboard/dashboard.component";
import { DashboardModule } from "../dashboard/dashboard.module";
import { BreadcrumbComponent } from "./components/breadcrumb/breadcrumb.component";

import { HeaderLogoComponent } from "./components/header-logo/header-logo.component";
import { HeaderNotificationComponent } from "./components/header-notification/header-notification.component";
import { HeaderUserProfileComponent } from "./components/header-user-profile/header-user-profile.component";
import { HeaderComponent } from "./containers/header/header.component";
import { HomeComponent } from "./containers/home/home.component";
import { SidebarComponent } from "./containers/sidebar/sidebar.component";
import { HomeService } from "./services/home.service";
import { ResetPasswordComponent } from "../profile/containers/reset-password/reset-password.component";

export const ROUTES: Routes = [
  {
    path: "home",
    canActivate: [AuthGuardHome],
    component: HomeComponent,
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      { path: "dashboard", component: DashboardComponent },
      {
        path: "provision",
        loadChildren:
          "../global-provision/global-provision.module#GlobalProvisionModule"
      },
      {
        path: "approval",
        loadChildren:
          "../global-approval/global-approval.module#GloabalApprovalModule"
      },
      {
        path: "reports",
        loadChildren: "../reports/reports.module#ReportsModule"
      },
      {
        path: "change-password",
        loadChildren: "../profile/profile.module#ProfileModule"
      },
      {
        path: "activity",
        loadChildren: "../activity/activity.module#ActivityModule"
      },
      {
        path: "tenant",
        loadChildren: "../tenant/tenant.module#TenantModule"
      }
    ]
  }
];

const directives: any[] = [
  HomeComponent,
  SidebarComponent,
  HeaderComponent,
  HeaderLogoComponent,
  HeaderNotificationComponent,
  HeaderUserProfileComponent,
  BreadcrumbComponent
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    HttpClientModule,
    AuthModule,
    DashboardModule,
    SharedModule,
    StoreModule.forFeature("home", reducers),
    EffectsModule.forFeature([HomeEffects])
  ],
  exports: [HomeComponent],
  declarations: [...directives],
  providers: [HomeService]
})
export class HomeModule {}
