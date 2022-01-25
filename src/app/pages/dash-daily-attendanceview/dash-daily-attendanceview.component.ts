import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AttendanceReport, ColumnItem, userInfoData, Office } from 'src/app/common/Model/model';
import { APIService } from 'src/app/shared/APIService';
import { AttendancereportService } from 'src/app/shared/attendancereport.service';
import { AuthService } from 'src/app/shared/authentication/auth.service';
import { HelperService } from 'src/app/shared/helper.service';

@Component({
  selector: 'app-dash-daily-attendanceview',
  templateUrl: './dash-daily-attendanceview.component.html',
  styleUrls: ['./dash-daily-attendanceview.component.css']
})
export class DashDailyAttendanceviewComponent implements OnInit {


  loading = true;

  employeeDetails: boolean = false;
  officeList = [];
  departmentList =[];
  empList = [];
  statusFromDashboard;
  currentDate = new Date();
  viewAttendanceData: any = [];

  filterData;
  searchValue = '';
  isNameSearchVisible: boolean = false;
  isGroupFilterVisible: boolean = false;
  visible = false;
  searchName;
  filterGroup;
  sortName = null;
  sortValue = null;
  searchValue1 = '';

 displayData =[];

  constructor(
    public attendanceReportService: AttendancereportService,
    public apiService: APIService,
    public router: Router,
    public activateRoute:ActivatedRoute,
    public authService: AuthService,
    public datePipe: DatePipe,
    public helper: HelperService
  ) {
    // console.log(this.router.getCurrentNavigation().extras.state);
    
    // this.statusFromDashboard = this.router.getCurrentNavigation().extras.state;
  }

  viewAttednance() {
    let date = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    this.authService.getUserDetails().then((res: any) => {
      // console.log(res);
      this.apiService.getDailyAttendanceReport(res, date).subscribe((res) => {
        console.log(res);
        this.viewAttendanceData = res.filter((res1: any) => {
          if (this.statusFromDashboard != 'A') {
            this.empList.push(res1);
            this.displayData.push(res1);
            // console.log(res1);
            return res1.remark == this.statusFromDashboard || res1.remark == "P/Late";
          } else {
            return res1.remark == this.statusFromDashboard;
          }
        });
        console.log(this.viewAttendanceData.length);
        this.loading = false;
      }, (e) => {
        console.log(e);
        this.helper.newopenAlertBox('error', 'Something went to Wrong');
      });
    });
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(res=>{
      this.statusFromDashboard =res.id;
      console.log(this.statusFromDashboard);
    })
    this.viewAttendanceData = [];
    this.viewAttednance();
    this.getOfficeList();
    this.getDepartmentList();
  }

  getOfficeList() {
    this.apiService.getOfficeList().subscribe(res2 => {
      this.officeList = res2;
    }, (e) => { console.log(e) });
  }

  getDepartmentList() {
    this.apiService.getDepartmentList().subscribe(res2 => {
      this.departmentList = res2;
    }, (e) => { console.log(e) });
  }

  listOfColumns: ColumnItem[] = [
    {
      name: 'Name',
      sortOrder: null,
      sortFn: (a: AttendanceReport, b: AttendanceReport) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend', null],
    },

    {
      name: 'Location',
      sortOrder: null,
      sortFn: (a: AttendanceReport, b: AttendanceReport) => a.default_location.localeCompare(b.default_location),
      sortDirections: ['ascend', 'descend', null],
      listOfFilter: [
        // { text: 'Head Office', value: 'Head Office' },
        // { text: 'Centro Office', value: 'Centro Office' }
      ],
      // filterFn: null,
      filterMultiple: true,
      // filterFn: (list: string[], item: AttendanceReport) => list.some(name => item.default_location.indexOf(name) !== -1)

    },

    {
      name: 'Group',
      sortOrder: null,
      sortFn: (a: AttendanceReport, b: AttendanceReport) => a.department_name.localeCompare(b.department_name),
      sortDirections: ['ascend', 'descend', null],
      // listOfFilter: [
      //   { text: 'IT', value: 'IT' },
      //   { text: 'Brand', value: 'Brand' },
      //   { text: 'CEO', value: 'CEO' },
      //   { text: 'ERP', value: 'ERP' }

      // ],
      // filterFn: null,
      filterMultiple: true,
      // filterFn: (list: string[], item: AttendanceReport) => list.some(name => item.department_name.indexOf(name) !== -1)

    },
    {
      name: 'Work Area',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: AttendanceReport, b: AttendanceReport) => a.main_requests.localeCompare(b.main_requests),
      listOfFilter: [
        // { text: 'Out Of Office', value: 'Out Of Office' },
        // { text: 'Work From Home', value: 'Work From Home' },
        // { text: 'Miss Punch', value: 'Miss Punch' }
      ],
      filterFn: null,
      filterMultiple: true,
      // filterFn: (list: string[], item: AttendanceReport) => list.some(main_requests => item.main_requests.indexOf(main_requests) !== -1)

    },
    {
      name: 'Location',
      sortOrder: null,
      sortFn: (a: AttendanceReport, b: AttendanceReport) => a.location.localeCompare(b.location),
      sortDirections: ['ascend', 'descend', null],
      // listOfFilter: [
      //   {text:'Head Office',value:'Head Office'},
      //   {text:'Centro Office',value:'Centro Office'}
      // ],
      // // filterFn: null,
      //filterMultiple: true,
      //filterFn: (list: string[], item: AttendanceReport) => list.some(name => item.office.indexOf(name) !== -1)

    },

    {
      name: 'Status',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: AttendanceReport, b: AttendanceReport) => a.remark.localeCompare(b.remark),
      listOfFilter: [
        { text: 'P', value: 'P' },
        { text: 'A', value: 'A' },
        { text: 'L', value: 'L' }
      ],
      // filterFn: null,
      filterMultiple: true,
      // filterFn: (list: string[], item: AttendanceReport) => list.some(name => item.remark.indexOf(name) !== -1)

    },
    {
      name: 'Date',
      // sortFn: (a: AttendanceReport, b: AttendanceReport) => a.inTime.localeCompare(b.inTime),
    },
    {
      name: 'In Time',
      // sortFn: (a: AttendanceReport, b: AttendanceReport) => a.inTime.localeCompare(b.inTime),
    },
    {
      name: 'Out Time',
      // sortFn: (a: AttendanceReport, b: AttendanceReport) => a.inTime.localeCompare(b.inTime),
    },
    {
      name: 'Total Hours',
    },
  ];


  reset(): void {
    this.searchValue = '';
    this.searchName = '';
    this.filterGroup ='';
    this.viewAttendanceData = [];
    this.viewAttednance();
  }
  // search office
  search(): void {
    this.visible = false;
    console.log(this.searchValue);
    // console.log(this.viewAttendanceData);
    this.viewAttendanceData = this.viewAttendanceData.filter((item: AttendanceReport) => item.office_id == this.searchValue);
    //  this.viewAttendanceData = this.listOfData.filter((item: DataItem) => item.name.indexOf(this.searchValue) !== -1);
    // console.log(this.listOfDisplayData)
  }
  onChangeSearchName() {
    this.isNameSearchVisible = false;
    console.log(this.searchName);

    this.viewAttendanceData = this.viewAttendanceData.filter((item: AttendanceReport) => item.name == this.searchName);
    //  this.viewAttendanceData = this.listOfData.filter((item: DataItem) => item.name.indexOf(this.searchValue) !== -1);
    // console.log(this.listOfDisplayData)
  }
  //group filter
  groupFilter() {
    this.isGroupFilterVisible = false;
    this.viewAttendanceData = this.viewAttendanceData.filter((item: AttendanceReport) => item.department_id == this.filterGroup);
  }


  sortFn = (a: AttendanceReport, b: AttendanceReport) => a.remark.localeCompare(b.remark);


}
