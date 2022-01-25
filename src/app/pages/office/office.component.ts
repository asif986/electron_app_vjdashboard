import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { APIService } from 'src/app/shared/APIService';
import { HelperService } from 'src/app/shared/helper.service';

@Component({
  selector: 'app-office',
  templateUrl: './office.component.html',
  styleUrls: ['./office.component.css']
})
export class OfficeComponent implements OnInit {


  isVisible = false;
  isOkLoading = false;

  latLong;
  eventCount = 0;
  eventLog: string = '';
  eventSubject = new Subject<string>();
  editCache: { [key: string]: { edit: boolean; data: any } } = {};
  qrCodeForm: FormGroup;

  modalHeaderNm;


  officeList = [];
  isLocation: boolean = false;
  isfillupData: boolean = false;
  isaddLoSubmitLoading: boolean = false;
  locationNewValue = "";

  loading = true;

  office_id;
  officeLat;
  officeLng;
  officeName = null;
  shortOfficeName = null;


  value: any = "";
  value1: any = "ABC";

  marker;

  constructor(
    public apiService: APIService,
    public helper: HelperService,
    private ngZone: NgZone,
    public router: Router,
    public fb: FormBuilder
  ) {
    // this.qrCodeForm = this.fb.group({
    //   shortOfficeName: ['', [Validators.required]],
    //   officeLat: ['', [Validators.required]],
    //   officeLng: ['', [Validators.required]],
    //   officeName: ['', [Validators.required]],
    // });
  }
  updateEditCache(): void {
    this.officeList.forEach(item => {
      this.editCache[item.office_id] = {
        edit: false,
        data: { ...item }
      };
    });
  }
  startEdit(id: any): void {
    console.log(id);
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.officeList.findIndex(item => item.office_id === id);
    this.editCache[id] = {
      data: { ...this.officeList[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {
    this.loading = true;
    const index = this.officeList.findIndex(item => item.office_id === id);
    let updateOfficeInfo = Object.assign(this.officeList[index], this.editCache[id].data, { update: 1 });
    // return  console.log(updateOfficeInfo)
    this.apiService.updateOffice(updateOfficeInfo).subscribe(res => {
      this.loading = false;

      this.helper.newopenAlertBox('success', 'Office updated successfully');
      // this.getQrcodeOfficeInfo();
    }, (e) => {
      console.log(e)
      this.loading = false;
      this.helper.newopenAlertBox('error', e);
    });
    this.editCache[id].edit = false;
  }

  ngOnInit(): void {
    // this.getQrcodeOfficeInfo();
    this.getOfficeLocation();
    // this.isVisible = true;
  }


  getOfficeLocation() {
    this.apiService.getOfficeList().subscribe(res2 => {
      console.log(res2);
      this.officeList = res2;
      this.loading = false;
      this.updateEditCache();
    }, (e) => {
      this.loading = false;
      console.log(e)
    });

  }

  cancelField() {
    this.isfillupData = false;
  }
  showModal(isAdd): void {
    isAdd == 0 ? this.modalHeaderNm = "Add Office" : this.modalHeaderNm = "Update Office";
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }


  /**
   * Adds office
   */
  addOffice() {
    console.log(this.locationNewValue);
    this.isaddLoSubmitLoading = true;
    if (this.officeName != null && this.shortOfficeName != null) {

      this.apiService.addOffice({ o_name: this.officeName, short_o_name: this.shortOfficeName }).subscribe(res => {

        this.getOfficeLocation();
        this.helper.newopenAlertBox('success', `Office add successfully`);
        // this.officeName = null;
        this.clearOfficeForm();
        this.isaddLoSubmitLoading = false;
        console.log(res);

      }, e => {
        console.log(e);

        this.helper.newopenAlertBox('error', e);
        this.isaddLoSubmitLoading = false;
      });
    } else {
      this.isaddLoSubmitLoading = false;
      this.helper.newopenAlertBox('error', 'Please Fill the Information');

    }

  }


  deleteOffice(id: any) {
    this.loading = true;
    this.apiService.deleteOffice(id).subscribe(res => {
      this.loading = false;
      this.getOfficeLocation();
      this.helper.newopenAlertBox('success', `Delete QR Code Successfully`);

    }, (e) => {
      this.loading = false;
      this.helper.newopenAlertBox('error', e);

    })
  }

  clearOfficeForm() {
    // this.officeLat = null;
    // this.officeLng = null;
    this.officeName = null;
    this.shortOfficeName =null;
  }

}
