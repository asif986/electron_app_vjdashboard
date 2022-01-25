import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NzTableFilterFn, NzTableFilterList, NzTableQueryParams, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { Observable, of } from 'rxjs';
import { AttendanceReport, userInfoData, Office, } from 'src/app/common/Model/model';
import { APIService } from 'src/app/shared/APIService';
import * as XLSX from 'xlsx';
import { DatePipe, NumberFormatStyle } from '@angular/common'
import { AttendancereportService } from 'src/app/shared/attendancereport.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver'
import { HelperService } from 'src/app/shared/helper.service';
import { AuthService } from 'src/app/shared/authentication/auth.service';
import { map } from 'rxjs/operators';
import { EmpinfoService } from 'src/app/shared/empinfo.service';
import { ExcelService } from 'src/app/shared/excel.service';


interface ColumnItem {
  name: string;
  sortOrder?: NzTableSortOrder | null;
  sortFn?: NzTableSortFn | null;
  listOfFilter?: NzTableFilterList;
  filterFn?: NzTableFilterFn | null | any;
  filterMultiple?: boolean;
  sortDirections?: NzTableSortOrder[];
}
@Component({
  selector: 'app-attendancereport',
  templateUrl: './attendancereport.component.html',
  styleUrls: ['./attendancereport.component.css']
})
export class AttendancereportComponent implements OnInit {

  dateFormat = 'yyyy/MM/dd';
  monthFormat = 'yyyy/MM';
  loading = true;
  date = null;
  changeDate;
  selectedEmployee = null;
  selectedMonth;

  inputValue: string | null = null;

  viewAttendanceData = [];
  empList = [];

  filterData;
  searchValue = '';
  isNameSearchVisible: boolean = false;
  isGroupFilterVisible: boolean = false;
  visible = false;
  listOfDisplayData;

  officeList = [];
  departmentList = [];
  statusList = [];
  cEtime;
  cStime;
  timechangeUserId;


  changestartTime: any;
  changeEndTime: any;
  editCache: { [key: string]: { edit: boolean; data: userInfoData } } = {};
  searchName;
  filterGroup;
  multipleGroup = {};
  remark_status;
  userInfo = {};

  currentDate = new Date();
  m_date: string;

  excelKeys = [];
  filters: any = {};
  isFilterEnable: boolean = false;
  footerString = "Total Count =";

  arr = [];
  sortName = null;
  sortValue = null;

  /**
   * Two differ date of
   */
  twoDifferDate = null;

  isTimeChange: boolean = false;

  oneUserInfo;

  isDisabledStartTime: boolean = false;
  isDisabledEndTime: boolean = false;

  //  viewAttendanceData =[{name:"Rohit Jadhav",office:"HO",department:"IT",status:"P",inTime:"10.00AM",outTime:"6.00PM"},{name:"Rohit Jadhav",office:"HO",department:"IT",status:"P",inTime:"10.00AM",outTime:"6.00PM"},{name:"Rohit Jadhav",office:"HO",department:"IT",status:"P",inTime:"10.00AM",outTime:"6.00PM"},{name:"Rohit Jadhav",office:"HO",department:"IT",status:"P",inTime:"10.00AM",outTime:"6.00PM"},{name:"Rohit Jadhav",office:"HO",department:"IT",status:"P",inTime:"10.00AM",outTime:"6.00PM"},{name:"Rohit Jadhav",office:"HO",department:"IT",status:"P",inTime:"10.00AM",outTime:"6.00PM"},{name:"Rohit Jadhav",office:"HO",department:"IT",status:"P",inTime:"10.00AM",outTime:"6.00PM"},{name:"Rohit Jadhav",office:"HO",department:"IT",status:"P",inTime:"10.00AM",outTime:"6.00PM"},{name:"Shanshree S",department:"Brand",office:"HO",status:"P",inTime:"10.00AM",outTime:"6.00PM"},{name:"Aditya J",office:"HO",department:"CEO",status:"P",inTime:"10.00AM",outTime:"6.00PM"},{name:"Himmat S.",office:"HO",department:"IT",status:"A",inTime:"10.00AM",outTime:"6.00PM"},{name:"Aniket S.",office:"Wakad",department:"IT",status:"L",inTime:"10.00AM",outTime:"6.00PM"},{name:"Asif  M.",office:"Wakad",department:"IT",status:"H",inTime:"10.00AM",outTime:"6.00PM"}  ];
  constructor(
    public datePipe: DatePipe,
    public empInfoService: EmpinfoService,
    public authService: AuthService,
    public helper: HelperService,
    public apiService: APIService,
    public datepipe: DatePipe,
    public attendanceReportService: AttendancereportService,
    public excelService: ExcelService
  ) { }

  attednanceReportExcelKeys() {
    this.apiService.attednanceReportExcelKeys().subscribe((res: any[]) => {
      this.excelKeys = res;
    })
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

  getStatusList() {
    this.statusList = this.attendanceReportService.getStatusList();
  }

  viewAttendance(date) {
    this.authService.getUserDetails().then((res: any) => {
      this.timechangeUserId = res.user_id;
      this.apiService.getDailyAttendanceReport(res, date).subscribe((res: any) => {
        // console.log(res);
        this.viewAttendanceData = res;
        this.empList = res;
        this.listOfDisplayData = this.viewAttendanceData;
        this.loading = false;
        this.updateEditCache();
      }, (e) => {
        this.helper.newopenAlertBox('error', 'something went to wrong')
      });
    });
  }

  twoDiferDateviewAttendance(s_date, e_date) {

    this.authService.getUserDetails().then((res: any) => {
      this.timechangeUserId = res.user_id;
      this.apiService.getDiffDateWiseAttendanceReport(res, s_date, e_date).subscribe((res: any) => {
        // console.log(res);
        this.viewAttendanceData = res;
        // this.empList = res;
        this.listOfDisplayData = this.viewAttendanceData;
        this.loading = false;
        this.updateEditCache();
      }, (e) => {
        this.loading = false;
        this.helper.newopenAlertBox('error', 'something went to wrong');
      });
    });

  }

  monthWiseViewAttendance(year, mo) {
    this.listOfDisplayData = [];
    this.authService.getUserDetails().then((res: any) => {
      this.apiService.getEmpMonthWiseAttendanceReport(year, mo, res, 1).subscribe((res: any) => {
        console.log(res);
        this.viewAttendanceData = res;
        this.listOfDisplayData = this.viewAttendanceData;
        this.loading = false;
        this.updateEditCache();
      }, (e) => {
        this.loading = false;
        this.helper.newopenAlertBox('error', 'something went to wrong');
        console.log(e);
      });
    });
  }

  getEmpList() {

    this.empInfoService.getEmployeeList().then((res: []) => {
      console.log(res);
      this.loading = false;
      this.empList = res;
    }, (e) => {
      console.log(e);
    });
  }

  // this.listOfDisplayData = [...this.viewAttendanceData];

  ngOnInit(): void {

    this.attednanceReportExcelKeys();
    this.getOfficeList();
    this.getDepartmentList();
    this.getStatusList();
    this.getViewAttendance();

    // this.changestartTime =new Date();
    // this.changestartTime =this.datePipe.transform('10:06:00 AM', `H:mm:ss:a`)
    // this.isTimeChange =true;

    //this.getEmpList();
    //this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
  }

  getViewAttendance() {
    this.m_date = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    this.viewAttendance(this.m_date);
  }


  exportexcel(): void {

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    //  return  console.log(this.filterData);
    this.helper.loadingIndicatorBox('Excelsheet importing in progress..');
    let d = new Date();

    if (this.selectedEmployee == undefined && this.selectedMonth != null) {
      let filename = `vjattednance-${monthNames[d.getMonth()]}.xlsx`;

      this.excelService.exportexcel(filename, this.excelKeys, this.listOfDisplayData);
    } else {
      let filename = `vjattednance-${new Date().toDateString()}.xlsx`;
      this.excelService.exportexcel(filename, this.excelKeys, this.listOfDisplayData);
    }
  }


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
      sortFn: (a: AttendanceReport, b: AttendanceReport) => a.office.localeCompare(b.office),
      sortDirections: ['ascend', 'descend', null],
      listOfFilter: [
        { text: 'Head Office', value: 'Head Office' },
        { text: 'Centro Office', value: 'Centro Office' }
      ],
      // filterFn: null,
      filterMultiple: true,
      filterFn: (list, item: AttendanceReport) => {

        list.some(name => item.office.indexOf(name) !== -1)

        return this.listOfDisplayData = this.viewAttendanceData.filter((item: AttendanceReport) => item.office.indexOf(list) !== -1);
        console.log(this.listOfDisplayData);
      }


      //list.some(name => item.office.indexOf(name) !== -1)

    },

    {
      name: 'Department',
      sortOrder: null,
      sortFn: (a: AttendanceReport, b: AttendanceReport) => a.departmentname.localeCompare(b.departmentname),
      sortDirections: ['ascend', 'descend', null],
      listOfFilter: [
        { text: 'IT', value: 'IT' },
        { text: 'Brand', value: 'Brand' },
        { text: 'CEO', value: 'CEO' },
        { text: 'ERP', value: 'ERP' }

      ],
      // filterFn: null,
      filterMultiple: true,
      filterFn: (list: string[], item: AttendanceReport) => list.some(name => item.departmentname.indexOf(name) !== -1)

    },
    {
      name: 'Work Area',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: AttendanceReport, b: AttendanceReport) => a.main_requests_id.localeCompare(b.main_requests_id),
      listOfFilter: [
        { text: 'Out Of Office', value: 'Out Of Office' },
        { text: 'Work From Home', value: 'Work From Home' },
        { text: 'Miss Punch', value: 'Miss Punch' }
      ],
      // filterFn: null,
      filterMultiple: true,
      filterFn: (list: string[], item: AttendanceReport) => list.some(main_requests_id => item.main_requests_id.indexOf(main_requests_id) !== -1)


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
      filterFn: (list: string[], item: AttendanceReport) => list.some(name => item.remark.indexOf(name) !== -1)

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
    {
      name: 'Action'
    }

  ];


  onDateChange(result: Date): void {
    // console.log(result);
    if (result != null) {
      this.loading = true;
      let change_date = this.datepipe.transform(result, 'yyyy-MM-dd');
      console.log('onChange: ', change_date);
      setTimeout(() => {
        this.viewAttendance(change_date);
      }, 1000);

    } else {
      this.loading = true;
      setTimeout(() => {
        this.viewAttendance(this.m_date);
      }, 1000);
    }
  }

  /**
   * Determines whether two differnt date change on
   * @param result 
   */
  onTwoDifferntDateChange(result: any[]) {
    console.log(result);
    if (result.length != 0) {
      this.loading = true;
      let start_date = this.datepipe.transform(result[0], 'yyyy-MM-dd');
      let end_date = this.datepipe.transform(result[1], 'yyyy-MM-dd');
      this.twoDiferDateviewAttendance(start_date, end_date);

    }
  }

  onMonthChange(month: Date) {
    // console.log(month)
    this.loading = true;
    let mo = this.datepipe.transform(month, 'MM');
    let year = this.datepipe.transform(month, 'YYYY');
    this.selectedMonth = mo;
    // console.log(mo);
    // console.log(year);
    // console.log(this.selectedEmployee);

    if (mo != null && this.selectedEmployee != null) {
      this.apiService.getEmpMonthWiseAttendanceReport(year, mo, this.selectedEmployee, 0).subscribe(res1 => {
        this.loading = false;
        console.log(res1);
        this.viewAttendanceData = res1;
        this.listOfDisplayData = this.viewAttendanceData;
      }, e => { console.log(e) })

    } else if (mo != null && this.selectedEmployee == null) {

      this.monthWiseViewAttendance(year, mo);

    } else {

      this.loading = true;
      setTimeout(() => {

        this.viewAttendance(this.m_date);
      }, 500);

    }


  }

  changeEmp(eName) {
    console.log(eName);

  }

  filterchangeData() {
    console.log(this.listOfDisplayData)

  }

  reset(obj_key, nm): void {
    console.log(obj_key)
    // this.searchValue = '';
    // this.searchName = '';
    // this.filterGroup = '';
    // this.search();
    // console.log(this.filters+'.'+obj_key);
    delete this.filters[obj_key];
    console.log(this.filters);

    this.filterKeys(this.filters);
    // this.viewAttendance(this.m_date);
  }

  resetFilterModal() {
    this.isGroupFilterVisible = false;
    this.isNameSearchVisible = false;
  }


  onQueryParamsChange(event) {
    console.log(event)
  }
  // edit option 
  /**
   * Changes start time
   * @param ctime 
   * @param startDate 
   * @param flag  if falg  =1 then start time 2 means end time 
   */
  changesTime(ctime: Date, startDate, flag): void {
    console.log(startDate);
    if (flag == 1) {
      this.changestartTime = this.datePipe.transform(ctime, `${startDate} H:mm:ss`);
      // console.log(this.cStime);
    } else {
      this.changeEndTime = this.datePipe.transform(ctime, 'YYYY-MM-dd H:mm:ss');
      console.log(this.cEtime);
    }

    // console.log(); 
  }



  updateEditCache(): void {
    this.viewAttendanceData.forEach(item => {
      this.editCache[item.attendance_id] = {
        edit: false,
        data: { ...item }
      };
    });
  }


  startEdit(userInfo: AttendanceReport): void {
    // this.editCache[id].edit = true;
    console.log(userInfo);
    this.oneUserInfo = userInfo;
    this.isTimeChange = true;
    if (userInfo.full_intime == "-" && userInfo.full_outtime == "-") {
      this.isDisabledStartTime = true;
      this.isDisabledEndTime = true;
      this.changestartTime = null;
      this.changeEndTime =null;
    } else if (userInfo.full_intime !== "-" && userInfo.full_outtime == "-") {
      this.isDisabledEndTime = true;
      this.isDisabledStartTime =false;
      this.changestartTime =Date.parse(userInfo.full_intime);
    }
    else if (userInfo.full_intime == "-" && userInfo.full_outtime !== "-") {
      this.isDisabledStartTime = true;
      this.isDisabledEndTime =false;
      this.changeEndTime =Date.parse(userInfo.full_outtime);
    }else{
      this.changestartTime =Date.parse(userInfo.full_intime);
      this.changeEndTime =Date.parse(userInfo.full_outtime);
      this.isDisabledStartTime = false;
      this.isDisabledEndTime = false;
    }
  }

  // id: string
  cancelEdit(): void {
    this.isTimeChange = false;
    // const index = this.viewAttendanceData.findIndex(item => item.id === id);
    // this.editCache[id] = {
    //   data: { ...this.viewAttendanceData[index] },
    //   edit: false
    // };
  }

  saveEdit(id: any): void {
    const index = this.viewAttendanceData.findIndex(item => item.id === id);
    console.log(index);
    console.log(this.viewAttendanceData[index]);


    let updateEmployeeInfo = Object.assign({ id: this.viewAttendanceData[index].id, changeIntime: this.cStime, changeOutTime: this.cEtime, date: this.viewAttendanceData[index].date, timeChangerUserId: this.timechangeUserId });

    console.log(updateEmployeeInfo);
    return;

    this.apiService.updateIntimeOrOutTime(updateEmployeeInfo).subscribe(res => {
      console.log(res);
      this.loading = false;
      this.ngOnInit();
      this.helper.newopenAlertBox('success', 'Time update successfully');

    }, (e) => {
      console.log(e)

      this.helper.newopenAlertBox('error', e);

    });


    this.editCache[id].edit = false;
  }

  multipleGroupChange(e: any) {
    // console.log(e);
    // this.arr.push(e);
    // e.forEach(element => {      
    //   this.arr.push( element);
    // });
    // console.log(this.arr);

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
    console.log(this.multipleFilters(this.viewAttendanceData, this.filters.name, this.filters.office_name, this.filters.department_name, this.filters.remark))
    this.listOfDisplayData = this.multipleFilters(this.viewAttendanceData, this.filters.name, this.filters.office_name, this.filters.department_name, this.filters.remark);
  }

  /**
   * Multiples filters
   * @param filter 
  //  */
  multipleFilters(array, e_name, office_name, department_name, remark) {
    // this.listOfDisplayData=[];
    return array.filter(a =>
      (!office_name || a.office_name.includes(office_name)) &&
      (!e_name || a.name.includes(e_name)) &&
      // (!teamName || a.Team.name.toLowerCase().includes(teamName.toLowerCase())) &&
      // (!color || a.Team.color.toLowerCase().includes(color.toLowerCase())) &&
      (!remark || a.remark.includes(remark)) &&
      (!department_name || department_name.length === 0 || department_name.some(s => a.department_name.includes(s)))
    )
  }



  // multipleFilters (filters) {
  //   console.log(filters);
  //   this.listOfDisplayData= this.viewAttendanceData.filter((product:any) => {

  //     return Object.entries(filters).every(([filterProperty, filterValues]:any) => {
  //                 console.log(product[filterProperty]);
  //       switch(Object.prototype.toString.call(product[filterProperty])){

  //         case '[object Object]':
  //           return Object.entries(filterValues).every(([extFilterProperty, extFilterValue]) => {
  //             return new Map(Object.entries(product[filterProperty])).get(extFilterProperty) === extFilterValue;
  //           });

  //         case '[object Array]':
  //            console.log('Object array');
  //           return product[filterProperty].some((productValue) => {
  //             return filterValues.includes(productValue);
  //           });

  //         default:
  //           return filterValues.includes(product[filterProperty]);

  //       }

  //     });
  //   });
  // }

  clearFilter() {

    this.searchValue = '';
    this.searchName = '';
    this.filterGroup = '';
    this.twoDifferDate = null;
    this.isFilterEnable = false;
    this.loading = true;
    this.getViewAttendance();

  }

  sort(sort: { key: string, value: string }): void {
    console.log(sort);
    this.sortName = sort.key;

    this.sortValue = sort.value;
    // this.search_sort();
    this.listOfDisplayData = this.viewAttendanceData.sort((a, b) => (this.sortValue === 'ascend') ? (a[this.sortName] > b[this.sortName] ? 1 : -1) : (b[this.sortName] > a[this.sortName] ? 1 : -1));
  }
  cancelField() {

  }
}






// Single filter code

  // // search office
  // search(): void {
  //   this.visible = false;
  //   console.log(this.searchValue);
  //   // this.listOfDisplayData = this.viewAttendanceData.filter((item: AttendanceReport) => item.office_id == this.searchValue);

  //   this.filters = Object.assign(this.filters, { office_id: this.searchValue });
  //   this.multipleFilters(this.filters);
  // }

  // onChangeSearchName() {
  //   this.isNameSearchVisible = false;
  //   // this.listOfDisplayData = this.viewAttendanceData.filter((item: AttendanceReport) => item.name == this.searchName);
  //   //  this.listOfDisplayData = this.listOfData.filter((item: DataItem) => item.name.indexOf(this.searchValue) !== -1);
  //   this.filters = Object.assign(this.filters, { name: this.searchName });
  //   this.multipleFilters(this.filters);
  // }
  // //group filter
  // groupFilter() {
  //   this.isGroupFilterVisible = false;
  //   // this.listOfDisplayData = this.viewAttendanceData.filter((item: AttendanceReport) => item.department_id == this.filterGroup);
  //   this.filters = Object.assign(this.filters, { department_id: this.filterGroup });
  //   this.multipleFilters(this.filters);
  // }



// dynamic sheet add code.
/*
    this.empList.forEach(sheet => {
        //e  means creating sheet as a name.
        let worksheet = workbook.addWorksheet(sheet.name);
        // I believe this needs to be set to show in LibreOffice.



        worksheet.state = 'visible';


        worksheet.columns = [
          { header: 'Employee Name', key: 'name', width: 25 },
          { header: 'Office', key: 'office', width: 20 },
          { header: 'Department', key: 'departmentname', width: 20 },
          { header: 'Working Area', key: 'main_requests_id', width: 20 },
          { header: 'Location', key: 'location', width: 20 },
          { header: 'Status', key: 'time', width: 20 },
          { header: 'Date', key: 'date', width: 20 },
          { header: 'In Time', key: 'intime', width: 20 },
          { header: 'Out Time ', key: 'outtime', width: 20 },
          { header: 'Total Hours', key: 'total', width: 20 },



        ];


        this.listOfDisplayData.forEach(e => {

          if (e.id == sheet.id) {
            worksheet.addRow({
              name: e.name, office: this.attendanceReportService.getOfficeName(e.office_id), departmentname: e.department_name, main_requests_id: e.main_requests,

              location: this.attendanceReportService.locationFilterDisplay(e.location), time: e.time, date: e.date, intime: e.intime == "-" ? '-' : this.datepipe.transform(e.intime, 'h:mm:ss a'), outtime: e.outtime == "-" ? '-' : this.datepipe.transform(e.outtime, 'h:mm:ss a'), total: e.total
            }, "n");
          }
        });

        const row = worksheet.getRow(1);
        row.font = { name: 'Popins', size: 12, bold: true };


      });any tas
*/