import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { concatMap } from 'rxjs/operators'
import { APIService } from 'src/app/shared/APIService';
import { HelperService } from 'src/app/shared/helper.service';
@Component({
  selector: 'app-viewleave',
  templateUrl: './viewleave.component.html',
  styleUrls: ['./viewleave.component.css']
})
export class ViewleaveComponent implements OnInit {

  currentDate=new Date();
  loading = true;
  todayLeaveString ="Today Leaves : "+this.currentDate.toDateString();

  
  constructor(private helper:HelperService,public apiService:APIService) { }


//    leaveData=[
//   {name:"Rohit Jadhav",department_name:"IT",leave_type:"Sick ",subject:"sick",description:"sick leave",form_date:"26-03-2021",to_date:"30-03-2021",status:"Pending"},
  
//   {name:"Asif Mulla",department_name:"IT",leave_type:"Casual ",subject:"casual",description:"casual leave..",form_date:"26-03-2021",to_date:"30-03-2021",status:"Pending"},
// ]
leaveData=[];

  ngOnInit(): void {
  
  this.apiService.getDailyLeaveData().subscribe(res=>{
console.log(res);
    setTimeout(() => {
      this.loading=false;
      this.leaveData =res;      
    }, 500);
  },(e)=>{
  console.log(e);
})
  }

  approved(empId){

    console.log(empId);

    this.apiService.approvedLeave(empId).subscribe((res)=>{

      this.helper.newopenAlertBox('success','Approved Successfully.');

    },(e)=>{
      console.log(e);
      this.helper.newopenAlertBox('error','Approved not Successfully.');

    })
}
cancel(){
  // this.helper.newopenAlertBox('success','Approved Successfully.')

}

  

}
