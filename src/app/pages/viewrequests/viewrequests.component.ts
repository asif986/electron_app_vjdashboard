import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { userInfoData } from 'src/app/common/Model/model';
import { APIService } from 'src/app/shared/APIService';
import { AuthService } from 'src/app/shared/authentication/auth.service';

@Component({
  selector: 'app-viewrequests',
  templateUrl: './viewrequests.component.html',
  styleUrls: ['./viewrequests.component.css']
})
export class ViewrequestsComponent implements OnInit {


  /**
   * Req details 
   */
  reqDetails = { empId: "", status: "" };

  /**
   * Determines whether model visible or not
   */
  isModelVisible = false;

  /**
   * In button add  loader
   */
  isOkLoading = false;

  /**
   * Reason reject 
   */
  reasonReject: "";
  change_date;

  requestId;
  userRole;
  userId;

  todayRequestsString = "Today Requests";
  // +this.currentDate.toDateString();
  
  changeDate;
  currentDate = new Date();
  c_date: any;
  dateFormat = 'yyyy/MM/dd';
  isFilterEnable: boolean = false;
  constructor(
    public apiService: APIService,
    public authService: AuthService,
    public datepipe: DatePipe) { }

  loading = true;
  requestData = [];

  footerString = "Total Count=";
  //    requestData=[
  //   {user_id:1,name:"Rohit Jadhav",department_name:"IT",main_requests:"1 ",sub_requests:"1",date:"23-09-2021",reasonformmisspunch:"sick leave",status:"1"},
  //   {user_id:2,name:"Asif Mulla",department_name:"IT",main_requests:"2",sub_requests:"1",date:"23-09-2021",reasonformmisspunch:"casual leave..",status:"2"},
  // ]

  getRequestsData(c_date) {
    this.loading = true;
    this.requestData = [];

    this.authService.getUserDetails().then((res: any) => {
      res.role == 4
      console.log(res);
      this.userId = res.user_id;
      this.apiService.getRequests(this.userId, c_date,res.role).subscribe((res: any) => {
        console.log(res);
        this.loading = false;
        this.requestData = res;
      }, (e) => {
        this.loading = false;
        console.log(e);
      });
    });

  }

  ngOnInit(): void {

    this.c_date = this.datepipe.transform(this.currentDate, 'yyyy-MM-dd');
    this.getRequestsData(this.c_date);


  }

  /**
   * Determines whether date change on
   * @param result 
   */
  onDateChange(result: Date): void {
    // console.log(result);
    if (result != null) {
      this.loading = true;
      this.change_date = this.datepipe.transform(result, 'yyyy-MM-dd');
      console.log('onChange: ', this.change_date);
      setTimeout(() => {
        this.getRequestsData(this.change_date);
      }, 1000);

    }
  }

  /**
   * Approved viewrequests component
   * @param empId 
   * @param status  Approved Status note here
   * @param reqId 
   * @param main_req 
   */
  approved(req, status) {
    console.log(req);
    this.receiveReq(this.userId, req.request_id, status, '').subscribe((s) => {
      console.log(s);
      this.requestData = [];
      this.getRequestsData(this.change_date);
    }, (e) => {
      console.log(e);
    });


    // let role;
    // role = this.userRole;
    // this.receiveReq(empId, status, '', reqId, main_req, role).subscribe((s) => {
    //   console.log(s);
    //   console.log('pending req success');
    //   this.requestData = [];
    //   this.getRequestsData();
    // }, (e) => {
    //   console.log(e);
    // });

  }



  /**
   * Rejects viewrequests 
   * @param reqId 
   * @param status 
   */
  reject(reqId, status) {

    console.log("status =" + status);
    console.log("req id =" + reqId);

    this.reqDetails.empId = this.userId;
    this.reqDetails.status = status;
    this.requestId = reqId;
    this.isModelVisible = true;

  }



  cancel() {
    // this.helper.newopenAlertBox('success','Approved Successfully.')

  }

  handleOk() {

    this.isOkLoading = true;
    this.receiveReq(this.reqDetails.empId, this.requestId, this.reqDetails.status, this.reasonReject).subscribe((s) => {
      console.log(s);
      this.isModelVisible = false;
      this.isOkLoading = false;
      //console.log('rejectes req success');
      this.reasonReject = "";
      this.requestData = [];
      this.getRequestsData(this.c_date);
      this.onlyMyReq();
    }, (e) => {

      console.log(e);
    });


  }


  receiveReq(empId, reqId: number, status, rejectReason) {

    return this.apiService.reqApprovedOrReject(empId, reqId, status, rejectReason);

  }

  handleCancel(): void {
    this.isModelVisible = false;
  }

  /**
   * Status request
   * @param statusId 
   * @returns  
   */
  statusRequest(request: any) {

    let reqStatus = ['', 'Pending From', 'Accepted By R.M', 'Accepted By H.R', 'Rejected By R.M', 'Rejected By H.R'];
    if (request.status == 1 || request.status == 2 || request.status == 4 ) {
      // For pending,  Accepted By R.M ,Rejected By R.M
      return reqStatus[request.status] + ' ' + '(' + request.reportingmn + ')';
    }
    else if (request.status == 3) {
      // For HR
      return reqStatus[request.status] + ' ' + '(' + request.hrnm + ')';
    }
  }

  showOrHideForReq(req: any) {

    let flagStatus = [];
    if (req.flag == 1) {
      flagStatus.push({ action: 1, status: 2 });
    } else if (req.flag == 2) {
      flagStatus.push({ action: 2, status: 3 });
    }
    else if (req.flag == 3) {
      flagStatus.push({ action: 3, status: 4 });
    }
    else if (req.flag == 4) {
      flagStatus.push({ action: 4, status: 4 });
    }


  }

  /**
   *  show Onlys my req 
   */
  onlyMyReq() {
    this.isFilterEnable = true;
    this.requestData = this.requestData.filter(item => {
      if(item.status ==1 && item.flag==1){
        return item;
      } else if(item.status ==2 && item.flag==2){
        return item;
      }
     else if (item.status ==1 && item.flag==3) {
      return item;
      }
    });

  }
  clearFilter() {
    this.isFilterEnable = false;
    this.changeDate = '';
    this.ngOnInit();

  }

}
