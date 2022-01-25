import { Injectable } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HelperService {


  constructor(
    private message: NzMessageService,
    private spinner: NgxSpinnerService) {
  }
  showSpinner() {
    this.spinner.show();
  }

  hideSpinner() {

    this.spinner.hide();
  }
  openAlertBox(title, position, icon, text) {
    Swal.fire({
      title: title,
      position: position,
      icon: icon,
      text: text,
      // showConfirmButton: false,
      // timer: 1500
    })
  }


  newopenAlertBox(type, msg) {

    this.message.create(type, msg);
  }


  loadingIndicatorBox(msg) {
    this.message.loading(msg, { nzDuration: 0 }).messageId;
  }

  dismissloadingIndicatorBox() {
    this.message.remove();
  }


}
