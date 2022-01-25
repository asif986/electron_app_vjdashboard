import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AttendancereportService } from 'src/app/shared/attendancereport.service';
import { AuthService } from 'src/app/shared/authentication/auth.service';
import { ThemeService } from 'src/app/shared/theme.service';
import { APIService } from '../../shared/APIService';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  isCollapsed = false;
  userDetails: any = { name: "", role: "", photoPath: null };
  theme = '';
  dynamicFlag = false;

  dynamicCSSUrl: string;

  menus: any = [];

  /**
   * Role list
   */
  roleList = ['', 'R.M', 'HR', 'Admin', 'HOD'];
  /**
   * Role Name
   */
  roleName: string;

  constructor(
    public authService: AuthService,
    public attendanceReport: AttendancereportService,
    public themeService: ThemeService,
    public apiService: APIService,
    public router:Router
  ) { }

  ngOnInit(): void {
    //   this.userDetails ={name:"Sumit Patak",post:"HR",photoPath:"assets/img/hrPhoto.jpeg"};
    // console.log(this.userDetails);
    this.authService.getUserDetails().then((res) => {
      // console.log(res);
      this.userDetails = res;
      this.roleName = this.roleList[this.userDetails.role];
    });
    this.getMenus();
  }

  /**
   * Gets menus
   */
  getMenus() {
    this.apiService.getMenus().subscribe((res: any[]) => {
      this.menus = res;
    });
  }

  /**
   * Logout button click
   */
  logout() {
    this.authService.logout();
  }

  /**
   * Enables theme
   */
  enableTheme() {
    this.attendanceReport.enableTheme(true);
  }

  /**
   * Toggles theme
   */
  toggleTheme(): void {
    this.themeService.toggleTheme().then();
  }

  navigateUrl(url: any) {
    // console.log(url);
   url == 'LOGOUT'?this.logout():this.router.navigate([`${url}`]);
  }

}
