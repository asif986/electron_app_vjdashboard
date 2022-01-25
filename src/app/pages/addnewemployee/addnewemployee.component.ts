import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { AttendanceReport } from 'src/app/common/Model/model';
import { APIService } from 'src/app/shared/APIService';
import { AuthService } from 'src/app/shared/authentication/auth.service';
import { EmpinfoService } from 'src/app/shared/empinfo.service';
import { HelperService } from 'src/app/shared/helper.service';

@Component({
  selector: 'app-addnewemployee',
  templateUrl: './addnewemployee.component.html',
  styleUrls: ['./addnewemployee.component.css']
})
export class AddnewemployeeComponent implements OnInit {

  @Output() empEvent = new EventEmitter<string>();

  title = "New Employee";
  isVisible = false;
  isfillupData = false;

  modalTitle = "";
  isDepartment = false;
  isLocation = false;

  locationNewValue = null;
  departmentNewValue = null;

  hideRm: boolean = false;

  isSubmitLoading = false;
  isaddLoSubmitLoading = false;
  isaddDeSubmitLoading = false;
  validateForm: FormGroup;
  isReadPassword = true;

  departmentList = [];
  reportingmanagerList = [];
  hrList = [];
  hodList = [];
  officeList = [];
  roleList = [];
  workingSlotList = [];


  birthDate = null;
  joinDate = null;
  dateFormat = 'yyyy/MM/dd';
  passBirth;

  updateEmpInfo: boolean = false;


  listOfControl: Array<{ id: number; controlInstance: string }> = [];


  getDepartment() {
    this.apiService.getDepartmentList().subscribe(res1 => {
      this.departmentList = res1;
    }, (e) => { console.log(e) });
  }

  getHrList() {
    this.apiService.getHrList().subscribe(res1 => {
      this.hrList = res1;
    }, (e) => { console.log(e) });
  }
  getHodList() {
    this.apiService.getHodList().subscribe(res1 => {
      this.hodList = res1;
    }, (e) => { console.log(e) });
  }

  getLocation() {
    this.apiService.getOfficeList().subscribe(res2 => {
      //console.log(res2);
      this.officeList = res2;
    }, (e) => { console.log(e) });
  }

  getWorkingSlot() {
    this.apiService.getWorkingSlotList().subscribe(res3 => {
      console.log(res3);
      this.workingSlotList = res3;
    }, (e) => { console.log(e) });
  }

  reportingManagerList() {
    this.apiService.getreportingManagerList().subscribe(res2 => {
      //  console.log(res2);
      this.reportingmanagerList = res2;
    }, (e) => { console.log(e) });
  }

  getRole() {
    this.empInfoService.getRole().then((res: Array<Object>) => {
      console.log(res);
      this.roleList = res;
    })
  }

  ngOnInit(): void {
    // this.isVisible =true;
    this.getRole();
    this.getDepartment();
    this.getLocation();
    this.getWorkingSlot();
    this.getHrList();
    this.getHodList();
    this.reportingManagerList();

    this.empInfoService.isOpenEmpForm.subscribe((res: boolean) => {
      console.log(res);
      this.isVisible = res;
    });

    this.updateEmployee();
  }

  constructor(public datepipe: DatePipe, public authService: AuthService, private fb: FormBuilder, public apiService: APIService, public helper: HelperService, public empInfoService: EmpinfoService) {
    this.validateForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      // [Validators.email, Validators.required]
      email: [''],
      // [Validators.minLength(10), Validators.required]
      mobile_no: [''],
      office_id: ['', [Validators.required]],
      reporting_manager_id: ['', [Validators.required]],
      hr_id: ['', [Validators.required]],
      department_id: ['', [Validators.required]],
      farvision_id: ['', [Validators.required]],
      password: ['', [Validators.required]],
      role: ['', [Validators.required]],
      dateofbirth: ['', [Validators.required]],
      workanniversary: ['', [Validators.required]],
      workingslot: ['', [Validators.required]],
      hod_id: ['', [Validators.required]]
      //      confirm: ['', [this.confirmValidator]],
      //    comment: ['', [Validators.required]]
    });
  }


  updateEmployee() {
    this.empInfoService.isUpdateEmployee.subscribe((res: AttendanceReport) => {
      console.log(res);

      if (res != 0) {
        let data = {
          id: +res.id,
          name: res.name,
          email: res.email,
          mobile_no: res.mobile_no,
          office_id: res.office_id.toString(),
          reporting_manager_id: res.reporting_manager_id.toString(),
          hr_id: res.hr_id.toString(),
          department_id: res.department_id.toString(),
          farvision_id: res.farvision_id,
          password: res.password,
          role: res.role.toString(),
          dateofbirth: res.dateofbirth,
          workanniversary: res.workanniversary,
          workingslot: res.workingslot.toString(),
          hod_id: res.hod_id.toString()
        }

        this.isReadPassword = false;
        this.title = "Update Employee";
        this.updateEmpInfo = !!res;
        this.birthDate = data.dateofbirth;
        this.joinDate = data.workanniversary;
        this.passBirth = res.password;
        this.validateForm.patchValue(data);
      } else {
        this.validateForm.reset();
        this.birthDate = null;
        this.joinDate = null;
        this.passBirth = null;
        this.title = "New Employee";
      }
    });
  }
  showModal(): void {
    this.isVisible = true;
  }


  handleCancel(): void {
    this.isVisible = false;
  }
  handleCancelf() {
    this.isfillupData = false;
  }

  submitForm(value) {

    this.isSubmitLoading = true;
    console.log(value);

    //   if true then update the emp.
    if (this.updateEmpInfo) {
      delete value.farvision_id;
      this.apiService.updateEmployeeList(value).subscribe(res => {
        // console.log(res);
        this.isSubmitLoading = false;
        // this.ngOnInit();
        this.empEvent.emit(res.statusText);
        this.validateForm.reset();
        this.helper.newopenAlertBox('success', 'Employee information updated successfully');
      }, (e) => {
        console.log(e)
        this.isSubmitLoading = false;
        this.helper.newopenAlertBox('error', e);
      });

    } else {
      let addemp = [];
      addemp.push(value);
      this.apiService.addEmployee(addemp).subscribe(res => {
        console.log(res);
        if (res) {
          this.empEvent.emit(res.statusText);
          this.isSubmitLoading = false;
          // this.validateForm.reset();
          this.helper.newopenAlertBox('success', `Employee add successfully`);
        } else {
          this.isSubmitLoading = false;
          this.helper.newopenAlertBox('error', `Something went to wrong`);
        }


      }, (e) => {
        console.log(e)
        this.isSubmitLoading = false;
        this.helper.newopenAlertBox('error', `Something went to wrong`);
      });
    }



    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }

  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }


  handleOk() {

  }

  onBirthDateChange(e) {
    // console.log(e);
    // console.log(this.birthDate);

    let bd = this.datepipe.transform(this.birthDate, 'ddMMyyyy');
    // console.log(bd);
    if (!this.updateEmpInfo) {

      this.passBirth = bd;
    }
  }
  onJoinDateChange(e) {

  }
  /*nzRequired
    validateConfirmPassword(): void {
      setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
    }
  
      confirmValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
          return { error: true, required: true };
        } else if (control.value !== this.validateForm.controls.password.value) {
          return { confirm: true, error: true };
        }
        return {};
      };
  */

  changeManager(m_id) {
    console.log(m_id);

  }
  changeHod(h_id) {

  }
  changeDepartment(d_id) {
    console.log(d_id);

  }
  changeOffice(o_id) {
    console.log(o_id);
  }

  changeRole(e) {
    console.log(e);
    e == 2 ? this.hideRm = true : this.hideRm = false;
    console.log(this.hideRm);
  }
  changeworkingSlot(e) {
    console.log(e);
  }
  addField(e?: MouseEvent, fill_id?: string, Modaltitle?: string) {

    if (e) {
      e.preventDefault()
    }

    if (fill_id == '1') {
      this.isLocation = true;
      this.isDepartment = false;
      this.modalTitle = Modaltitle;
    } else {
      this.isDepartment = true;
      this.isLocation = false;
      this.modalTitle = Modaltitle;
    }




    this.isfillupData = true;
  }

  addLocation() {
    console.log(this.locationNewValue);
    this.isaddLoSubmitLoading = true;
    this.apiService.addOffice({ o_name: this.locationNewValue }).subscribe(res => {

      this.getLocation();
      this.helper.newopenAlertBox('success', `Location add successfully`);

      this.isaddLoSubmitLoading = false;
      console.log(res);
      this.locationNewValue = "";

    }, e => {
      console.log(e);

      this.helper.newopenAlertBox('error', e);
      this.isaddLoSubmitLoading = false;
    });

  }
  addDepartment() {
    console.log(this.departmentNewValue);
    this.isaddDeSubmitLoading = true;
    this.apiService.addDepartment({ d_name: this.departmentNewValue }).subscribe(res => {
      console.log(res);
      this.helper.newopenAlertBox('success', `Department add successfully`);
      this.getDepartment();
      this.departmentNewValue = "";
      this.isaddDeSubmitLoading = false;
    }, e => {
      console.log(e);
      this.helper.newopenAlertBox('error', e);
      this.isaddDeSubmitLoading = false;

    });
  }

  cancelField() {
    this.isfillupData = false;
  }
}
