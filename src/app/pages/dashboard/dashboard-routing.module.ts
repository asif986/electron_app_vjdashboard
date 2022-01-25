import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashDailyAttendanceviewComponent } from '../dash-daily-attendanceview/dash-daily-attendanceview.component';
import { ViewattendanceComponent } from '../viewattendance/viewattendance.component';
import { ViewleaveComponent } from '../viewleave/viewleave.component';
import { ViewrequestsComponent } from '../viewrequests/viewrequests.component';
import { WelcomeComponent } from '../welcome/welcome.component';

const routes: Routes = [
//   {
//   path: '', pathMatch: 'full', redirectTo: '/welcome',
  
// },
// {
//   path: 'welcome', component:WelcomeComponent,
// },
// {
//   path: 'viewrequests', component:ViewrequestsComponent,
// },
// {
//   path: 'viewleave', component:ViewleaveComponent,
// },
// {
//   path: 'viewattendance', component:ViewattendanceComponent,
// },
// { path: 'attendanceview', component:DashDailyAttendanceviewComponent ,
// // canActivate:[AuthGuard] 
// }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
