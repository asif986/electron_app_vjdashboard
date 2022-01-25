import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AttendanceReport, userInfoData, Office } from 'src/app/common/Model/model';
import { APIService } from 'src/app/shared/APIService';
import { ColumnItem, Location } from 'src/app/common/Model/model'
import { AttendancereportService } from 'src/app/shared/attendancereport.service';
import { DateFormatPipe, DifferencePipe } from 'ngx-moment';
import { AuthService } from 'src/app/shared/authentication/auth.service';
import { filter, map } from 'rxjs/operators';
import { HelperService } from 'src/app/shared/helper.service';
import { DatePipe } from '@angular/common';
import { EmpinfoService } from 'src/app/shared/empinfo.service';

@Component({
  selector: 'app-viewattendance',
  templateUrl: './viewattendance.component.html',
  styleUrls: ['./viewattendance.component.css']
})
export class ViewattendanceComponent implements OnInit {

  loading = true;

  startTime: any;
  endTime: any
  diff: any;
  inputValue;
  statusFromDashboard;
  officeList = [];
  searchUser = [];
  listOfFilterData: userInfoData[] = [];
  s: any;
  viewAttendanceData: any = [];

  currentDate = new Date();

  excelKeys = [];
  filters: any = {};
  isFilterEnable: boolean = false;

  searchName;
  filterGroup;
  multipleGroup = {};
  remark_status;

  filterData;
  searchValue = '';
  isNameSearchVisible: boolean = false;
  isGroupFilterVisible: boolean = false;
  footerString = "Total Count =";
  visible = false;
  statusList = [];
  departmentList = [];
  empList = [];
  sortName = null;
  sortValue = null;
  constructor(
    public datePipe: DatePipe,
    public helper: HelperService,
    public authService: AuthService,
    public apiService: APIService,
    public router: Router,
    public empInfoService: EmpinfoService,
    public attendanceReportService: AttendancereportService) {
  }
  //viewAttendanceData =[{name:"Rohit Jadhav",office:"HO",department:"IT",status:"P",inTime:"10.00AM",outTime:"6.00PM"},{name:"Shanshree S",department:"Brand",office:"HO",status:"P",inTime:"10.00AM",outTime:"6.00PM"},{name:"Aditya J",office:"HO",department:"CEO",status:"P",inTime:"10.00AM",outTime:"6.00PM"},{name:"Himmat S.",office:"HO",department:"IT",status:"A",inTime:"10.00AM",outTime:"6.00PM"},{name:"Aniket S.",office:"Wakad",department:"IT",status:"L",inTime:"10.00AM",outTime:"6.00PM"},{name:"Asif  M.",office:"Wakad",department:"IT",status:"H",inTime:"10.00AM",outTime:"6.00PM"}  ];

  viewAttednance() {
    let date = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    this.authService.getUserDetails().then((res: any) => {
      // console.log(res);
      this.apiService.getDailyAttendanceReport(res, date).subscribe((res) => {
        // console.log(res);
        this.viewAttendanceData = res;
        this.listOfFilterData = this.viewAttendanceData;
        this.loading = false;
      });
    });
  }
  getDepartmentList() {
    this.apiService.getDepartmentList().subscribe(res2 => {
      this.departmentList = res2;
    }, (e) => { console.log(e) });
  }

  getEmpList() {
    this.empInfoService.getEmployeeList().then((res: []) => {
      // console.log(res);
      // this.loading = false;
      this.empList = res;
    }, (e) => {
      console.log(e);
    });
  }


  ngOnInit(): void {
    this.viewAttendanceData = [];
    this.viewAttednance();
    this.getStatusList();
    this.getDepartmentList();
    this.getEmpList();
    this.getOfficeList();

  }

  getOfficeList() {
    this.apiService.getOfficeList().subscribe(res2 => {
      this.officeList = res2;
    }, (e) => { console.log(e) });
  }
  getStatusList() {
    this.statusList = this.attendanceReportService.getStatusList();
  }

  // sortFn = (a: AttendanceReport, b: AttendanceReport) => a.remark.localeCompare(b.remark);

  listOfColumns: ColumnItem[] = [
    {
      name: 'Name',
      sortOrder: null,
      sortFn: (a: AttendanceReport, b: AttendanceReport) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend', null],
    },

    {
      name: 'Office',
      sortOrder: null,
      sortFn: (a: AttendanceReport, b: AttendanceReport) => a.office_name.localeCompare(b.office_name),
      sortDirections: ['ascend', 'descend', null],
      // listOfFilter: [
      //   { text: 'Head Office', value: 'Head Office' },
      //   { text: 'Centro Office', value: 'Centro Office' }
      // ],
      filterFn: null,
      // filterMultiple: true,
      // filterFn: (list: string[], item: AttendanceReport) => list.some(name => item.default_location.indexOf(name) !== -1)
    },

    {
      name: 'Group',
      sortOrder: null,
      sortFn: (a: AttendanceReport, b: AttendanceReport) => a.department_name.localeCompare(b.department_name),
      sortDirections: ['ascend', 'descend', null],
      /*
      listOfFilter: [
        { text: 'IT', value: 'IT' },
        { text: 'Brand', value: 'Brand' },
        { text: 'CEO', value: 'CEO' },
        { text: 'ERP', value: 'ERP' }

      ],
      */
      filterFn: null,
      // filterMultiple: true,
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
        // // {text:'Miss Punch',value:'Miss Punch'}
        // { text: 'In Office', value: 'In Office' }

      ],
      // filterFn: null,
      // filterMultiple: true,
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
      // filterMultiple: true,
      // filterFn: (list: string[], item: AttendanceReport) => list.some(name => item.office.indexOf(name) !== -1)

    },

    {
      name: 'Status',
      sortOrder: 'descend',
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: AttendanceReport, b: AttendanceReport) => a.remark.localeCompare(b.remark),
      listOfFilter: [
        { text: 'P', value: 'P' },
        { text: 'A', value: 'A' },
        { text: 'L', value: 'L' },
        { text: 'P/Late', value: 'P/Late' }
      ],
      // filterFn: null,
      filterMultiple: true,
      filterFn: (list: string[], item: AttendanceReport) => list.some(remark => item.remark.indexOf(remark) !== -1)

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

  /**
   * Select  user
   * @param item 
   */
  selectUser(item: any) {
    // do something with selected item
    // console.log(item);
    // console.log(this.searchUser);
    if (item != null) {
      let data = this.viewAttendanceData.filter(res => {
        return res.id == item;
      });
      // console.log(data);
      this.viewAttendanceData = [];
      this.viewAttendanceData = data;
    } else {
      this.viewAttendanceData = [];
      // this.getEmpList();
      this.viewAttendanceData = this.listOfFilterData;
    }

  }

  multipleGroupChange(e: any) {
    console.log(e);

  }
  clearFilter() {

    this.searchValue = '';
    this.searchName = '';
    this.filterGroup = '';
    this.isFilterEnable = false;
    this.loading = true;
    this.viewAttednance();

  }
  /**
   * Filters keys
   * @param obj 
   */
   filterKeys(obj: any) {
    this.isFilterEnable = true;
    this.filters = Object.assign(this.filters, obj);
    console.log(this.filters)
    // this.multipleFilters(this.filters);
    console.log(this.multipleFilters(this.viewAttendanceData, this.filters.office_name, this.filters.department_name,this.filters.remark))
   this.listOfFilterData =this.multipleFilters(this.viewAttendanceData, this.filters.office_name, this.filters.department_name,this.filters.remark);
  }

  /**
   * Multiples filters
   * @param filter 
  //  */
  multipleFilters(array,office_name,department_name,remark) {
    // this.listOfDisplayData=[];
        return array.filter(a =>
          (!office_name || a.office_name.includes(office_name)) &&
          // (!teamName || a.Team.name.toLowerCase().includes(teamName.toLowerCase())) &&
          // (!color || a.Team.color.toLowerCase().includes(color.toLowerCase())) &&
          (!remark || a.remark.includes(remark)) &&
          (!department_name || department_name.length === 0 || department_name.some(s => a.department_name.includes(s)))
        )
  }

  sort(sort: { key: string, value: string }): void {
    console.log(sort);
    this.sortName = sort.key;

    this.sortValue = sort.value;
    // this.search_sort();
    this.listOfFilterData = this.viewAttendanceData.sort((a, b) => (this.sortValue === 'ascend') ? (a[this.sortName] > b[this.sortName] ? 1 : -1) : (b[this.sortName] > a[this.sortName] ? 1 : -1));
  }


  reset(obj_key, nm): void {
    console.log(obj_key)

    // this.searchValue = '';
    // this.searchName = '';
    // this.filterGroup = '';
    // this.search();
    // console.log(this.filters+'.'+obj_key);
    // if (obj_key.department_id) {
    //   this.filterGroup ='';
    // }
    delete this.filters[obj_key];
    console.log(this.filters);
    // Object.keys(this.filters).length == ?this.isFilterEnable =false:'';
    this.filterKeys(this.filters);
    // this.viewAttendance(this.m_date);
  }
}
