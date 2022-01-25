import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AttendanceReport, ColumnItem, userInfoData } from 'src/app/common/Model/model';
import { APIService } from 'src/app/shared/APIService';
import { AuthService } from 'src/app/shared/authentication/auth.service';
import { EmpinfoService } from 'src/app/shared/empinfo.service';
import { ExcelService } from 'src/app/shared/excel.service';
import { HelperService } from 'src/app/shared/helper.service';


@Component({
  selector: 'app-employeeinfo',
  templateUrl: './employeeinfo.component.html',
  styleUrls: ['./employeeinfo.component.css']
})
export class EmployeeinfoComponent implements OnInit {

  rmName: any;
  dName: any;

  /**
   * Emp list of User
   */
  empList = [];

  /**
   * Search user of list
   */
  searchUser = [];

  /**
   * Role list
   */
  roleList1 = ['Employee', 'R.M', 'HR', 'Admin', 'HOD'];
  editCache: { [key: string]: { edit: boolean; data: userInfoData } } = {};

  listOfData: userInfoData[] = [];

  listOfFilterData: userInfoData[] = [];

  /**
   * Department list
   */
  departmentList = [];

  /**
   * Filter department list
   */
  filterDepartmentList: any[] = [];

  /**
   * Reporting manager list
   */
  reportingmanagerList = [];

  /**
   * Office list 
   */
  officeList = [];
  /**
   * Role list
   */
  roleList = [];
  /**
   * Hr list
   */
  hrList = [];
  /**
   * Hr list
   */
  hodList = [];

  loading = true;

  employeeDetails: boolean = false;


  /**
   * Determines whether visible add emp form is
   */
  isVisibleAddEmpForm: boolean = true;

  // Excel sheet import 
  isexcelImportSpinner = false;

  isExcelExportSpinner = false;

  excelKeys = [];

  searchText;
  searchEmp;

  footerString = "Total Count=";

  constructor(
    public apiService: APIService,
    public helper: HelperService,
    public empInfoService: EmpinfoService,
    public authService: AuthService,
    public router: Router,
    public excelService: ExcelService
  ) { }


  /**
   * Get all emp list 
   */
  getEmpList() {
    this.listOfData = [];
    this.authService.getUserDetails().then((res: any) => {
      console.log(res);
      this.apiService.getEmployeeList(res.role, res.user_id).subscribe(res => {
        console.log(res);
        this.loading = false;
        this.listOfData = res;
        this.listOfFilterData = this.listOfData;
        this.updateEditCache();
      });
    });
  }

  ngOnInit(): void {

    this.userInformationExcelKeys();
    //Excel sheet loader using behaviour subject
    this.excelService.isexcelImportSpinner.subscribe((res: boolean) => {
      this.isexcelImportSpinner = res;
    });
    this.excelService.isexcelExportSpinner.subscribe((res: boolean) => {
      this.isExcelExportSpinner = res;
    });



    this.getEmpList();
    // fetching role list
    this.empInfoService.getRole().then((res: Array<Object>) => {
      // console.log(res);
      this.roleList = res;
    });

    this.apiService.getDepartmentList().subscribe(res1 => {
      this.departmentList = res1;
      this.departmentList.forEach(e => {
        this.filterDepartmentList.push({
          text: e.department_id,
          value: e.department_name,
        });
      })

    }, (e) => { console.log(e) });

    this.apiService.getreportingManagerList().subscribe(res2 => {
      //  console.log(res2);
      this.reportingmanagerList = res2;

    }, (e) => { console.log(e) });

    this.apiService.getHrList().subscribe(res2 => {
      //  console.log(res2);
      this.hrList = res2;
    }, (e) => { console.log(e) });

    this.apiService.getHodList().subscribe(res2 => {
      //  console.log(res2);
      this.hodList = res2;
    }, (e) => { console.log(e) });


    this.apiService.getOfficeList().subscribe(res2 => {
      // console.log(res2);
      this.officeList = res2;
    }, (e) => { console.log(e) });

    //  let viewAttendanceData1 =[{id:"1",name:"Rohit Jadhav",email:"HO",mobile:"123456789",reporting_manager:"Rohit Jadhav",default_location:"hinjewadi",departmentname:"IT"} ];
    //this.listOfData = viewAttendanceData1;

  }

  userInformationExcelKeys() {
    this.apiService.userInformationExcelKeys().subscribe((res: any) => {
      this.excelKeys = res;
    });
  }

  startEdit(data: any): void {
    // this.editCache[data.id].edit = true;
    this.editCache[data.id].data.office_id = data.office_id.toString();
    this.editCache[data.id].data.reporting_manager_id = data.reporting_manager_id.toString();
    this.editCache[data.id].data.hr_id = data.hr_id.toString();
    this.editCache[data.id].data.hod_id = data.hod_id.toString();
    this.editCache[data.id].data.department_id = data.department_id.toString();

    // this.router.navigate(['/dashboard/employee'],);
  }

  cancelEdit(id: string): void {
    const index = this.listOfData.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.listOfData[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {
    const index = this.listOfData.findIndex(item => item.id === id);
    // console.log(Object.assign(this.listOfData[index], this.editCache[id].data));

    let updateEmployeeInfo = Object.assign(this.listOfData[index], this.editCache[id].data, { update: 1 });
    // return  console.log(updateEmployeeInfo)
    this.apiService.updateEmployeeList(updateEmployeeInfo).subscribe(res => {
      // console.log(res);
      this.loading = false;
      this.ngOnInit();
      this.helper.newopenAlertBox('success', 'Employee information update successfully');

    }, (e) => {
      console.log(e)
      this.helper.newopenAlertBox('error', e);
    });
    this.editCache[id].edit = false;
  }

  updateEditCache(): void {
    this.listOfData.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  /**
   * Disabled employee
   * @param id 
   * @param d_id 
   * @param status 
   */
  disabled(id, d_id, status) {

    this.loading = true;
    const index = this.listOfData.findIndex(item => item.id === id);
    console.log(this.listOfData[index].id);
    console.log(d_id);


    this.apiService.disabledEmployee(d_id, this.listOfData[index].id).subscribe(res => {
      console.log(res);
      this.loading = false;

      this.getEmpList();
      this.helper.newopenAlertBox('success', `Employee ${status} successfully`);

    });
  }

  /**
   * Releases employee 
   * @param id 
   * @param r_id 
   * @param status 
   */
  release(id, r_id, status) {
    this.apiService.releaseEmployee(r_id, id).subscribe(res => {
      console.log(res);
      this.loading = false;

      this.getEmpList();
      this.helper.newopenAlertBox('success', `Employee ${status} successfully`);

    });

  }

  changeManager(m_id) {
    this.rmName = m_id;
  }
  changeHr(hr_id) {
    // this.hr
  }
  changeDepartment(d_id) {
    this.dName = d_id;

  }
  changeOffice(o_id) {

  }


  callBackaddEmp(status) {

    console.log(status);
    status = "OK" ? this.getEmpList() : '';
    // this.items.push(newItem);
  }

  /**
   * Calls backa excel import
   * @param event 
   */
  callBackaExcelImport(event) {
    this.apiService.addEmployee(event).subscribe(res => {
      console.log(res);
      if (res == true) {
        this.isexcelImportSpinner = false;
        this.helper.newopenAlertBox('success', `Employee add successfully`);
      } else {
        this.isexcelImportSpinner = false;
        this.helper.newopenAlertBox('error', `Something went to wrong`);
      }
      // this.empEvent.emit(res.statusText);

      // this.isSubmitLoading =   false;

    }, (e) => {
      console.log(e)
      this.isexcelImportSpinner = false;
      this.helper.newopenAlertBox('error', `Something went to wrong`);
    })
  }

  // selectUser(item: any) {
  //   // do something with selected item
  //   // console.log(item);
  //   // console.log(this.searchUser);
  //   if (item != null) {
  //     let data = this.listOfData.filter(res => {
  //       this.updateEditCache();
  //       return res.id == item;
  //     });
  //     console.log(data);
  //     this.listOfData = [];
  //     this.listOfData = data;
  //   } else {
  //     this.listOfData = [];
  //     // this.getEmpList();
  //     this.listOfData = this.listOfFilterData;
  //     this.updateEditCache();
  //   }
  // }

  exportexcel() {
    this.excelService.exportexcel('Employee Information', this.excelKeys, this.listOfData);
  }

  showModal(value: any) {
    console.log('add emp');
    this.empInfoService.isOpenEmpForm.next(true);
    this.empInfoService.isUpdateEmployee.next(value);

  }

  async updateResults() {
    this.listOfFilterData = this.searchByValue();
    console.log(this.listOfFilterData);

  }
  clearSearch() {
    this.searchText = null;
    this.listOfFilterData = this.listOfData;
  }

  searchByValue() {
    return this.listOfData.filter(item => {
      if (this.searchText.trim() === '') {
        return true;
      } else {
        return item.name.toLowerCase().includes(this.searchText.trim().toLocaleLowerCase()) || item.farvision_id.toLowerCase().includes(this.searchText.trim().toLocaleLowerCase());
      }
    })
  }



  /**
   * List of columns of employeeinfo table
   */
  listOfColumns: ColumnItem[] = [
    {
      name: 'Name',
      sortOrder: null,
      sortFn: (a: AttendanceReport, b: AttendanceReport) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend', null],

    },
    {
      name: 'Farvision Id',
      sortOrder: null,
      sortFn: (a: AttendanceReport, b: AttendanceReport) => a.farvision_id.localeCompare(b.farvision_id),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Role',
      //  sortOrder: null,
      //   sortFn: (a: AttendanceReport, b: AttendanceReport) => a.role.localeCompare(b.role),
      //   sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Email',
      sortOrder: null,
      sortFn: (a: AttendanceReport, b: AttendanceReport) => a.email.localeCompare(b.email),
      sortDirections: ['ascend', 'descend', null],
    },

    {
      name: 'Mobile No',

    },
    {
      name: 'Location',

      sortOrder: null,
      sortFn: (a: AttendanceReport, b: AttendanceReport) => a.default_location.localeCompare(b.default_location),
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
      name: 'R. Manager',
    },
    {
      name: 'H.R',
    },
    {
      name: 'H.O.D'
    },
    {
      name: 'Group',
      sortOrder: null,
      sortFn: (a: AttendanceReport, b: AttendanceReport) => a.department_name.localeCompare(b.department_name),
      sortDirections: ['ascend', 'descend', null],
      // listOfFilter: this.filterDepartmentList,
      filterFn: null,
      // filterMultiple: true,
      // filterFn: (list: string[], item: AttendanceReport) => list.some(name => item.department_name.indexOf(name) !== -1)


    },


    {
      name: 'Action',

    },


  ];
}
