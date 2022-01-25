import { Injectable, OnInit } from '@angular/core';
import { ColumnItem, Location, Office } from 'src/app/common/Model/model'
import { DateFormatPipe, DifferencePipe } from 'ngx-moment';
import { Subject } from 'rxjs';
import { resolve } from 'node:path';
import { APIService } from './APIService';


@Injectable({
  providedIn: 'root'
})
export class AttendancereportService implements OnInit {

  theme = new Subject();
  officeList = [];

  statusList = [
    { status_id: 1, status_name:"P"},
    { status_id: 2, status_name:"P/Late"},
    { status_id: 3, status_name:"A"}
  ];

  constructor(public apiService: APIService) {
    this.officeList = [];
    // console.log("construct");
    this.getOfficeList();

  }

  ngOnInit() {
    console.log("ng Oninit");

  }

   getStatusList(){
     return this.statusList;
   }

  getOfficeList() {

    this.apiService.getOfficeList().subscribe(res2 => {
      this.officeList = res2;
    }, (e) => { console.log(e) });

  }

  getOfficeName(id: any) {
    let data = [];
    let officeName;
    if (id == "-") {
      officeName = "-";
    } else {
      data = this.officeList.filter(data => data.office_id == id);
      // console.log(data);
      data.map(res => officeName = res.office_name);
      //return data[1].office_name;
    }
    return officeName;
  }

  locationFilterDisplay(location) {
    let object: Location;

    //  console.log("excel");
    let lo = "-";
    // && location == null
    if (location == "-" || location == null) {
      lo = "-";
    } else {
      //    console.log(location)
      object = JSON.parse(location);
      lo = `${object.subLocality + ' , ' + object.subAdministrativeArea}`;
    }
    return lo;
  }

  calculateTotalHours(inTime, outTime) {

    let startTime, endTime, diff;
    console.log("in Time  " + inTime + " " + "Out Time " + outTime);

    startTime = new Date().setHours(inTime);
    endTime = new Date().setHours(outTime);
    console.log(startTime);

    return diff = (new DifferencePipe()).transform(outTime, inTime, 'hour', true);
  }


  enableTheme(val) {

    this.theme.next(val);
  }


}
