import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { take } from 'rxjs/operators';
import { APIService } from 'src/app/shared/APIService';
import { AuthService } from 'src/app/shared/authentication/auth.service';
import { EmpinfoService } from 'src/app/shared/empinfo.service';
import { CardCount } from '../../common/Model/model';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  currentDate = new Date();
  todaysString = "Todays Update : " + this.currentDate.toDateString();

  /**
   * Loading  condition 
   */
  loading: boolean = true;


  // cards :any=[]

  cardsCount: any = [];
  skeltoncardsCount: any = [{}, {}, {}, {}];


  notificatioCount = 0;

  navigateCards = [{ name: "Notifications", url: '/dashboard/', imgurl: "bell" }, { name: "Requests", url: '/dashboard/viewrequests', imgurl: "user" }, { name: "Leave", url: '/dashboard/viewleave', imgurl: "calendar" }, { name: "Attendance", url: '/dashboard/attendancereport', imgurl: "calendar" }]

  //serverData :any=[{name:"Rohit Jadhav",office:"HO",department:"IT",time:"P"},{name:"Shanshree S",department:"Brand",office:"HO",time:"P"},{name:"Aditya J",office:"HO",department:"CEO",time:"P"},{name:"Himmat S.",office:"HO",department:"IT",time:"A"},{name:"Aniket S.",office:"Wakad",department:"IT",time:"L"},{name:"Asif  M.",office:"Wakad",department:"IT",time:"H"}  ];

  isCollapsed = false;

  userDetails: any = [];


  constructor(
    public empInfoService: EmpinfoService,
    private notification: NzNotificationService,
    public apiService: APIService,
    public authService: AuthService
  ) { }


  createBasicNotification(template: TemplateRef<{}>): void {
    this.notification.template(template);
  }

  ngOnInit(): void {
    this.getCountInformation();
  }

  /**
   * Gets count information for employee count ,present ,absent , leave count
   */
  getCountInformation() {
    this.authService.getUserDetails().then((res: any) => {
      this.apiService.get_Daily_Employee_Present_Absent_Leave_Count(res).subscribe((res: any[]) => {
        let lCount: number, pCount: number;
        // console.log(res);
        setTimeout(() => {
          this.loading = false;
        }, 500);
        lCount = 0;
        pCount = res[1].pcount;
        this.cardsCount.push({ name: "Total Employee", count: res[0], navigateUrl: '/dashboard/employeeInfo' });
        this.cardsCount.push({ name: "Present", count: pCount, navigateUrl: '/dashboard/attendanceview/P', status: 'P' });
        // this.cardsCount.push({ name: "Leave", count: lCount, navigateUrl: '/dashboard/attendanceview/L', status: 'L' });
        this.cardsCount.push({ name: "Absent", count: res[0] - pCount, navigateUrl: '/dashboard/attendanceview/A', status: 'A' });
      }, (e) => console.log(e));
    });
  }
}

