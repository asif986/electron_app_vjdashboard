import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APIService } from './shared/APIService';
import { AttendancereportService } from './shared/attendancereport.service';
import { Plugins } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  dynamicFlag = false;
 dynamicCSSUrl: string;
 theme = 'dark';
   constructor(public router:Router,public attendanceReport:AttendancereportService,private sanitizer: DomSanitizer){
  
   }

 
   ngOnInit(){

      

   }
   
}
