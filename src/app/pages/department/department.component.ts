import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/shared/APIService';
import { HelperService } from 'src/app/shared/helper.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  /**
   * Get department list Data
   */
  DepartmentList = [];

  /**
   * Loading  of department Table
   */
  loading = false;

  /**
   * Edit cache for table inline edit
   */
  editCache: { [key: string]: { edit: boolean; data: any } } = {};

  /**
   * Search department name 
   */
  searchDepartName;

  isDepartNameSearchVisible;
  constructor(
    public apiService: APIService,
    public helper: HelperService
  ) { }

  ngOnInit(): void {
    // call getDepartment Function
    this.getDepartments();

  }
  /**
   * Gets department
   */
  getDepartments() {
    this.loading = true;
    this.apiService.getDepartmentList().subscribe((res: any) => {
      console.log(res);
      this.loading = false;
      this.DepartmentList = res;
      this.updateEditCache();
    }, (e) => {
      this.loading = false;
      console.log(e);
    })
  }

  /**
   * Updates edit cache initalize the table
   */
  updateEditCache(): void {
    this.DepartmentList.forEach(item => {
      this.editCache[item.department_id] = {
        edit: false,
        data: { ...item }
      };
    });
  }
  /**
   * Starts edit
   * @param id 
   */
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  /**
   * Cancels edit
   * @param id 
   */
  cancelEdit(id: string): void {
    const index = this.DepartmentList.findIndex(item => item.department_id === id);
    this.editCache[id] = {
      data: { ...this.DepartmentList[index] },
      edit: false
    };
  }

  /**
   * Saves edit information
   * @param id 
   */
  saveEdit(id: string): void {
    this.loading = true;
    const index = this.DepartmentList.findIndex(item => item.department_id === id);
    // console.log(Object.assign(this.listOfData[index], this.editCache[id].data));

    let updateDepartmentInfo = Object.assign(this.DepartmentList[index], this.editCache[id].data, { update: 1 });
    // return console.log(updateDepartmentInfo)
    this.apiService.updateDepartment(updateDepartmentInfo).subscribe(res => {
      console.log(res);
      this.loading = false;
      // this.ngOnInit();
      this.helper.newopenAlertBox('success', 'Department update successfully');
      this.getDepartments();

    }, (e) => {
      console.log(e)
      this.helper.newopenAlertBox('error', e);
    });
    this.editCache[id].edit = false;
  }
  /**
   * Reset Search
   */
  reset(): void {

    this.searchDepartName = '';
    this.getDepartments();
  }
  /**
   * Determines whether change search department name 
   */
  onChangeSearchDepartmentName() {
    this.isDepartNameSearchVisible = false;
    this.DepartmentList = this.DepartmentList.filter((item: any) => item.department_name == this.searchDepartName);
  }

}
