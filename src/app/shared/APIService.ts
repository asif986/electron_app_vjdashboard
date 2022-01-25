import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WebServer } from './WebServer';
import { Router } from '@angular/router';
import { APIClient } from './APIClient';

import { BehaviorSubject, forkJoin, from, Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { userInfoData } from '../common/Model/model';
import { stat } from 'node:fs';
//import { Observable } from 'rxjs/Observable';

@Injectable({
    providedIn: 'root'
})

export class APIService implements OnInit {


    // tslint:disable-next-line:max-line-length
    constructor(private router: Router, public apiClient: APIClient, public webServer: WebServer) {

    }

    ngOnInit() {

    }


    public insertAttendance(psData: any) {
        console.log(psData);
        return this.apiClient.post(this.webServer.insertAttendance, psData);
    }
    public requestLeave(psData: any) {
        console.log(psData);
        return this.apiClient.post(this.webServer.requestLeave, psData);
    }
    public sendrequest(psData: any) {
        console.log(psData);
        return this.apiClient.post(this.webServer.sendrequest, psData);
    }
    public gettingAllRequests(employeeId: any) {
        console.log(employeeId);
        return this.apiClient.get(this.webServer.gettingAllRequests + `/${employeeId}`);
        // return this.apiClient.get('https://preemi.vjpartners.co.in/attendance/live1/public/api/levelingrequest?user_id='+employeeId );

    }
    public deleterequest(requestid: any, userid: any) {
        console.log(requestid);
        return this.apiClient.get(this.webServer.deleterequest + `/${requestid}` + `/${userid}`);
    }
    public fetchDailyReport() {
        return this.apiClient.get(this.webServer.dailyReport);
    }

    public allOffices() {
        return this.apiClient.get(this.webServer.allOffices);
    }

    public allDepartments() {
        return this.apiClient.get(this.webServer.allDepartments);

    }
    public fetchAttendanceById(employeeId: any) {
        console.log(employeeId);
        return this.apiClient.get(this.webServer.fetchAttendanceById + `/${employeeId}`);
    }
    public gettingAllLeaves(employeeId: any) {
        console.log(employeeId);
        return this.apiClient.get(this.webServer.gettingAllLeaves + `/${employeeId}`);
    }
    public fetchAttendanceByIdforDay(employeeId: any) {
        console.log(employeeId);
        return this.apiClient.get(this.webServer.fetchAttendanceByIdforDay + `/${employeeId}`);
    }

    //login
    public login(cred: any) {
        //  console.log(cred);
        let data =
        {
            farvision_id: cred.email,
            password: cred.password
        }
        return this.apiClient.post(this.webServer.dashboardLogin, data);


    }

    //------------Dashboard API

    public get_Daily_Employee_Present_Absent_Leave_Count(rmEmCo?: any) {
        //console.log(rmEmCo);
        let eCount = this.apiClient.post(this.webServer.employeeCount, rmEmCo);
        let pCount = this.apiClient.post(this.webServer.dailyPresentCount, rmEmCo);
        let aCount = this.apiClient.post(this.webServer.dailyAbsentCount);
        let lCount = this.apiClient.post(this.webServer.dailyLeaveCount, rmEmCo);

        const arr = [eCount, pCount, lCount, aCount];
        // return 
        return forkJoin(arr);
    }

    public getDailyLeaveData() {
        return this.apiClient.get(this.webServer.getDailyLeave);
    }

    public getDailyAttendanceReport(res, date) {
        return this.apiClient.get(this.webServer.dailyAttendanceReport + "/" + res.role + "/" + res.user_id + "/" + date);
    }

    public getDiffDateWiseAttendanceReport(res, s_date,e_date) {
        return this.apiClient.get(this.webServer.diffDateWiseAttendanceReport +'?empId='+res.user_id +'&role='+res.role+'&start_date='+s_date+'&end_date='+e_date);
    }

    public getdateWiseAttendanceReport(change_date: any) {
        return this.apiClient.get(this.webServer.dateWiseAttendanceReport + '?date=' + change_date);
    }
    public getEmpMonthWiseAttendanceReport(year: any, month: any, eid: any, status: any) {
        console.log(month, eid);
        if (status == 0) {
            return this.apiClient.get(this.webServer.empMonthWiseAttendanceReport + '?month=' + month + '&empId=' + eid + '&year=' + year + '&isParticularUser=' + 0);
        } else {
            console.log(eid)
            return this.apiClient.get(this.webServer.empMonthWiseAttendanceReport + '?month=' + month + '&role=' + eid.role + '&year=' + year + '&empId=' + eid.user_id + '&isParticularUser=' + 1);
        }
    }

    public disabledEmployee(d_id: any, eid: any) {
        return this.apiClient.post(this.webServer.disabledEmployee + '?disabled=' + d_id + '&id=' + eid);

    }
    public releaseEmployee(r_id: any, eid: any) {
        console.log(r_id, eid);
        return this.apiClient.post(this.webServer.releaseEmployee + '?release=' + r_id + '&id=' + eid);

    }

    public approvedLeave(empId) {
        return this.apiClient.post(this.webServer.approvedLeave, empId);

    }


    public getRequests(employeeId: any, date: any,role:any) {

        // return this.apiClient.get(this.webServer.requests);
        
        return this.apiClient.get('https://preemi.vjpartners.co.in/attendance/live1/public/api/levelingrequest_dashboard?user_id=' + employeeId + '&date=' + date+'&role='+role);

        // return this.apiClient.get('https://preemi.vjpartners.co.in/attendance/live1/public/api/levelingrequest_dashboard?user_id=' + employeeId + '&date=' + date);

    }

    public reqApprovedOrReject(empId, reqId, status, rejectReason) {

        let psData = { user_id: empId, status: status, request_id: reqId, rejected_reason: rejectReason };
        // console.log(psData);
        // return this.apiClient.post(this.webServer.requestStatus, psData);
    return this.apiClient.post("https://preemi.vjpartners.co.in/attendance/live1/public/api/levelingrequest_web_action", psData);

    }

    public getEmployeeList(role: any, userId) {

        return this.apiClient.get(this.webServer.employeeList + "/" + role + "/" + userId);

    }

    public updateEmployeeList(updateEmployeeInfo?: userInfoData) {
        console.log(updateEmployeeInfo);
        return this.apiClient.post(this.webServer.updateEmployeeList, updateEmployeeInfo);
    }

    public getDepartmentList() {

        return this.apiClient.get(this.webServer.departmentList);
    }
    public getreportingManagerList() {

        return this.apiClient.get(this.webServer.reportingManagerList);
    }
    public getHrList() {
        return this.apiClient.get(this.webServer.hrList);
    }
    public getHodList() {
        return this.apiClient.get(this.webServer.hodList);
    }
    public getOfficeList() {

        return this.apiClient.get(this.webServer.officeList);
    }

    public addOffice(psData) {
        console.log(psData);
        return this.apiClient.post(this.webServer.addOffice, psData);
    }

    public addDepartment(d_nm) {
        console.log(d_nm);

        return this.apiClient.post(this.webServer.addDepartment, d_nm);
    }
    public addEmployee(emp_info) {

        return this.apiClient.post(this.webServer.addEmployee, emp_info);
    }
    public getBirthdays() {

        return this.apiClient.get(this.webServer.birthDate);
    }

    public getWorkAnniversarys() {

        return this.apiClient.get(this.webServer.workAnniversary);
    }
    public updateIntimeOrOutTime(data) {
        return this.apiClient.post(this.webServer.updateIntimeOrOutTime, data);

    }
    public getWorkingSlotList() {
        return this.apiClient.get(this.webServer.workingSlot);
    }
    public qrcodeGeneration(psData) {
        return this.apiClient.post(this.webServer.qrcodeGen, psData);
    }

    public getQrcodeInfo() {
        return this.apiClient.get(this.webServer.qrcodeInfo);
    }
    public deleteQrCode(id) {
        console.log(id);
        return this.apiClient.post(this.webServer.deleteQrCode, { qrcode_id: id });
    }
    public deleteOffice(id) {
        console.log(id);
        return this.apiClient.post(this.webServer.deleteOffice, { office_id: id });
    }
    public updateQrCode(psData) {
        console.log(psData);
        return this.apiClient.post(this.webServer.updateQrCode, psData);
    }
    public updateOffice(psData) {
        console.log(psData);
        return this.apiClient.put(this.webServer.updateOffice, psData);
    }

    public updateDepartment(psData) {
        console.log(psData);
        return this.apiClient.post(this.webServer.updateDepartment, psData);
    }
    public userInformationExcelKeys() {
        return this.apiClient.get('assets/json/userInformation.json');
    }
    public attednanceReportExcelKeys() {
        return this.apiClient.get('assets/json/attendancereport.json');
    }
    public getMenus() {
        return this.apiClient.get('assets/json/menus.json');
    }
}
