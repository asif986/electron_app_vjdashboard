import { Injectable, OnInit } from '@angular/core';
import { resolve } from 'node:path';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { userInfoData } from '../common/Model/model';
import { APIService } from './APIService';
import { AuthService } from './authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmpinfoService implements OnInit {

  roleList = [];
  isOpenEmpForm = new Subject();
  isUpdateEmployee = new Subject();
  notificationCount = new BehaviorSubject(0);
  constructor(public authService: AuthService, public apiService: APIService) {


  }

  ngOnInit() {
    this.getBirthdays();
    this.getWorkAnniversarys();


  }

  getRole() {
    return new Promise((resolve, reject) => {
      this.roleList = [
        { role_id: 4, role_name: "HOD" },
        { role_id: 3, role_name: "Admin" },
        { role_id: 2, role_name: "HR" },
        { role_id: 1, role_name: "Reporting Manager" },
        { role_id: 0, role_name: "Employee" }]
      resolve(this.roleList)
    })
  }

  getBirthdays() {

    return new Promise((resolve, reject) => {

      this.authService.getUserDetails().then((res: any) => {
        console.log(res);
        if (res.role == 1) {

          this.apiService.getBirthdays().pipe(
            map((data1: userInfoData[]) => {
              return data1.filter(data => data.reporting_manager_id == res.user_id);

            })).subscribe((res: []) => {
              //this.getBirthdayList = res;
              resolve(res);
              this.notificationCount.next(res.length);
              console.log(res);
              console.log(res);
            }, e => console.log(e));

        }
        else if (res.role == 2) {
          this.apiService.getBirthdays().pipe(
            map((data1: userInfoData[]) => {
              return data1.filter(data => data.hr_id == res.user_id);

            })).subscribe((res: []) => {
              // this.getBirthdayList = res;
              resolve(res);
              this.notificationCount.next(res.length);
              console.log(res);
            }, e => console.log(e));
        }
        else if (res.role == 3) {
          this.apiService.getBirthdays().subscribe((res: []) => {
            // this.getBirthdayList = res;
            resolve(res);
            this.notificationCount.next(res.length);
            console.log(res);
          }, e => console.log(e));
        }
      });


    });

  }

  getWorkAnniversarys() {
    return new Promise((resolve, reject) => {

      this.authService.getUserDetails().then((res: any) => {
        console.log(res);
        if (res.role == 1) {

          this.apiService.getWorkAnniversarys().pipe(
            map((data1: userInfoData[]) => {
              return data1.filter(data => data.reporting_manager_id == res.user_id);

            })).subscribe(res => {
              //  this.getWorkAnniversaryList = res;

              resolve(res);
            }, e => console.log(e));

        }
        else if (res.role == 2) {
          this.apiService.getWorkAnniversarys().pipe(
            map((data1: userInfoData[]) => {
              return data1.filter(data => data.hr_id == res.user_id);

            })).subscribe(res => {
              //    this.getWorkAnniversaryList = res;
              console.log(res);
              resolve(res);

            }, e => console.log(e));

        }
        else if (res.role == 3) {
          this.apiService.getWorkAnniversarys().subscribe(res => {
            //    this.getWorkAnniversaryList = res;
            console.log(res);
            resolve(res);

          }, e => console.log(e));

        }
      });
    })


  }

  getEmployeeList() {

    return new Promise((resolve, reject) => {
      this.authService.getUserDetails().then((res: any) => {
        console.log(res);
        this.apiService.getEmployeeList(res.role, res.user_id).subscribe(res => {
          resolve(res);
        });
      });
    })
  }

}
