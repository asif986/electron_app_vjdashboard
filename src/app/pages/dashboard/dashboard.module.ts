import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { WelcomeComponent } from '../welcome/welcome.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { antModule } from 'src/app/common/module/ant.module';
import { ViewleaveComponent } from '../viewleave/viewleave.component';
import { ViewattendanceComponent } from '../viewattendance/viewattendance.component';
import { AttendancereportComponent } from '../attendancereport/attendancereport.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashDailyAttendanceviewComponent } from '../dash-daily-attendanceview/dash-daily-attendanceview.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { EmployeeinfoComponent } from '../employeeinfo/employeeinfo.component';
import { AddnewemployeeComponent } from '../addnewemployee/addnewemployee.component';
import { AddLoDeReComponent } from '../add-lo-de-re/add-lo-de-re.component';
import { QrcodegenerateComponent } from '../qrcodegenerate/qrcodegenerate.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { AgmCoreModule } from '@agm/core';
import { NotificationsComponent } from '../notifications/notifications.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { DepartmentComponent } from 'src/app/pages/department/department.component';
import { OfficeComponent } from '../office/office.component';
import { ExcelimportComponent } from 'src/app/common/component/excelimport/excelimport.component';


@NgModule({
  declarations: [
    DashboardComponent,
    WelcomeComponent,
    ViewleaveComponent,
    ViewattendanceComponent,
    AttendancereportComponent,
    DashDailyAttendanceviewComponent,
    EmployeeinfoComponent,
    AddnewemployeeComponent,
    AddLoDeReComponent,
    QrcodegenerateComponent,
    NotificationsComponent,
    DepartmentComponent,
    OfficeComponent,
    ExcelimportComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DashboardRoutingModule,
    NzLayoutModule,
    NzMenuModule,
    antModule,
    Ng2SearchPipeModule,
    AutocompleteLibModule,
    LeafletModule,
    NgxQRCodeModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD44s7WG-RzfoEqvL6Cdoa81jhmkrRwUFI',
      libraries: ['places']
    })

  ],
  exports: [

  ]
})
export class DashboardModule { }
