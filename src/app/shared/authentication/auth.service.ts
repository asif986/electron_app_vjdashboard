import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { APIService } from '../APIService';
import { AuthGuard } from './auth.guard';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // loginInfo = new BehaviorSubject<{role,user_id}>(null);
  constructor(public apiService: APIService, public router: Router) { }

  login(cred: object) {
    // console.log(cred);
    return new Promise((resolve, reject) => {
      this.apiService.login(cred).subscribe((success: any) => {
        console.log(success.token);
        if (success == "0") {
          resolve(success);
        }
        else {
          // localStorage.setItem('token',success.token);
          localStorage.setItem('token', JSON.stringify(success.token));
          localStorage.setItem('user', JSON.stringify(success.user));
          let data = { role: success.user.role, user_id: success.user.id, name: success.user.name };
          localStorage.setItem('loginInfo', JSON.stringify(data));
          resolve(success);
        }
      }, (error) => {
        reject(error);
        //console.log(error);
      });
    });
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return !!localStorage.getItem('token');
  }

  /**
   * Logout 
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginInfo');
    this.router.navigate(['/login']);
  }


  getUserDetails() {
    // console.log(localStorage.getItem('user'));
    let loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
    //  console.log(user)
    return new Promise((resolve, reject) => {
      resolve(loginInfo);

    });
  }

  // getUserDetail() {
  //   let user = JSON.parse(localStorage.getItem('user'));
  //   //  console.log(user)
  //   return new Promise((resolve, reject) => {
  //     resolve(user);
  //   });
  // }

}
