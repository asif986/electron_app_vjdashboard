import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DepartmentComponent } from './pages/department/department.component';
import { AttendancereportComponent } from './pages/attendancereport/attendancereport.component';
import { DashDailyAttendanceviewComponent } from './pages/dash-daily-attendanceview/dash-daily-attendanceview.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmployeeinfoComponent } from './pages/employeeinfo/employeeinfo.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { QrcodegenerateComponent } from './pages/qrcodegenerate/qrcodegenerate.component';
import { ViewattendanceComponent } from './pages/viewattendance/viewattendance.component';
import { ViewleaveComponent } from './pages/viewleave/viewleave.component';
import { ViewrequestsComponent } from './pages/viewrequests/viewrequests.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { AuthGuard } from './shared/authentication/auth.guard';
import { OfficeComponent } from './pages/office/office.component';
import { AddnewemployeeComponent } from './pages/addnewemployee/addnewemployee.component';

const routes: Routes = [

  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },


  {
    path: 'dashboard', component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '', component: WelcomeComponent,
      },
      {
        path: 'viewrequests', component: ViewrequestsComponent,
      },
      {
        path: 'viewleave', component: ViewleaveComponent,
      },
      {
        path: 'viewattendance', component: ViewattendanceComponent,
      },
      {
        path: 'attendancereport', component: AttendancereportComponent
      }
      ,
      {
        path: 'attendanceview/:id', component: DashDailyAttendanceviewComponent,
        // canActivate:[AuthGuard] 
      },
      {
        path: 'employeeInfo', component: EmployeeinfoComponent,
        // canActivate:[AuthGuard] 
      },
      {
        path: 'qrCodeGen', component: QrcodegenerateComponent,
        // canActivate:[AuthGuard] 
      },
      {
        path: 'welcome', component: WelcomeComponent,
        // canActivate:[AuthGuard] 
      },

      {
        path: 'office', component: OfficeComponent,
        // canActivate:[AuthGuard] 
      },
      {
        path: 'notifications', component: NotificationsComponent,
        // canActivate:[AuthGuard] 
      },
      {
        path: 'department', component: DepartmentComponent,
        // canActivate:[AuthGuard] 
      },
      {
        path: 'employee', component: AddnewemployeeComponent,
        // canActivate:[AuthGuard] 
      },

    ]
  },


  {
    path: 'login', component: LoginComponent,
    // canActivate:[AuthGuard] 
  },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
