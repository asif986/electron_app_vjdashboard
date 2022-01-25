import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { userInfoData } from 'src/app/common/Model/model';
import { APIService } from 'src/app/shared/APIService';
import { AuthService } from 'src/app/shared/authentication/auth.service';
import { EmpinfoService } from 'src/app/shared/empinfo.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  getBirthdayList = [];
  getWorkAnniversaryList = [];
  isNotification:boolean =false;
  
  constructor(public apiService: APIService, public authService: AuthService,public empInfoService:EmpinfoService) { }

  ngOnInit(): void {
    this.getBirthdays();
    this.getWorkAnniversarys();

  }
  getBirthdays() {



    this.empInfoService.getBirthdays().then((res:[])=>{
      console.log(res); 
       this.getBirthdayList =res;
    });

  }

  getWorkAnniversarys() {

    this.empInfoService.getWorkAnniversarys().then((res:[])=>{
      console.log(res); 
         this.isNotification =true;
       this.getWorkAnniversaryList =res;
    })
  }


  wokringDays(dateString){
    
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
    {
        age--;
    }
    return age;

  }


}
