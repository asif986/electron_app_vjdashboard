import { Injectable } from '@angular/core';
//
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class WebServer {

  constructor(public http: HttpClient) { }

  /*Base URL*/
  // public BASE_URL = environment.requestUrl;

  //for test 
  // public BASE_URL = 'https://preemi.vjpartners.co.in/attendance/test/public/api/'; 

  // for live 
  // public BASE_URL = 'https://preemi.vjpartners.co.in/attendance/live1/public/api/';

  // public BASE_URL = 'http://127.0.0.1:8000/api/';
  public BASE_URL = environment.BASE_URL;



  // using IP
  //for test 
  // public BASE_URL = 'http://65.1.95.206/attendance/test/public/api/';

  // for live 
  // public BASE_URL = 'https://preemi.vjpartners.co.in/attendance/live/public/api/';


  public insertAttendance = this.BASE_URL + "insertAttendance";

  public fetchAttendanceById = this.BASE_URL + "fetchAttendanceById";
  public dashboardLogin = this.BASE_URL + "dashboardLogin";
  public requestLeave = this.BASE_URL + "requestLeave";
  public gettingAllLeaves = this.BASE_URL + "gettingAllLeaves";
  public gettingAllRequests = this.BASE_URL + "allrequests";
  public sendrequest = this.BASE_URL + "insertRequest";
  public deleterequest = this.BASE_URL + "deleterequests";
  public dailyReport = this.BASE_URL + "adminview";

  public allOffices = this.BASE_URL + "alloffice";

  public allDepartments = this.BASE_URL + "alldepartment";

  public fetchAttendanceByIdforDay = this.BASE_URL + "fetchAttendanceByIdforDay";

  public employeeCount = this.BASE_URL + "getEmployeeCount";
  public dailyPresentCount = this.BASE_URL + "getDailyPresentCount";
  public dailyAbsentCount = this.BASE_URL + "getDailyAbsentCount";
  public dailyLeaveCount = this.BASE_URL + "getDailyLeaveCount";
  public getDailyLeave = this.BASE_URL + "getDailyLeave";
  public dailyAttendanceReport = this.BASE_URL + "dailyAttendanceReport";
  public diffDateWiseAttendanceReport =this.BASE_URL +"diffDateWiseAttendanceReport";
  public dateWiseAttendanceReport = this.BASE_URL + "dateWiseAttendanceReport";
  public empMonthWiseAttendanceReport = this.BASE_URL + "empMonthWiseAttendanceReport";
  public disabledEmployee = this.BASE_URL + "disabledEmployee";
  public releaseEmployee = this.BASE_URL + "releaseEmployee";

  public approvedLeave = this.BASE_URL + "approvedLeave";

  public requests = this.BASE_URL + "requests";
  public requestStatus = this.BASE_URL + "requestStatus";

  public employeeList = this.BASE_URL + "employeeList";
  public updateEmployeeList = this.BASE_URL + "updateEmployeeList";


  public departmentList = this.BASE_URL + "departmentList";
  public reportingManagerList = this.BASE_URL + "reportingManagerList";
  public hrList =this.BASE_URL + "hrList"
  public hodList =this.BASE_URL + "hodList"


  public officeList = this.BASE_URL + "officeList";

  public addDepartment = this.BASE_URL + "addDepartment";
  public addOffice = this.BASE_URL + "addOffice";
  public addEmployee = this.BASE_URL + "addEmployee";
  
  public birthDate = this.BASE_URL + "birthDate";
  public workAnniversary = this.BASE_URL + "workAnniversary";

  public updateIntimeOrOutTime = this.BASE_URL + "updateIntimeOrOutTime";

  public workingSlot = this.BASE_URL + "workingSlot";

  public qrcodeGen = this.BASE_URL + "qrcodeGen";

  public qrcodeInfo = this.BASE_URL + "qrcodeInfo";

  public deleteQrCode = this.BASE_URL + "deleteQrCode";

  public deleteOffice = this.BASE_URL + "deleteOffice";
  
  public updateQrCode = this.BASE_URL + "updateQrCode";

  public updateOffice = this.BASE_URL + "updateOffice";

  public updateDepartment = this.BASE_URL + "updateDepartment";

















  // public login =this.BASE_URL +"login";
  // public login =this.BASE_URL +"login";



}
