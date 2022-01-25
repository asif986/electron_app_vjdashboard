import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/authentication/auth.service';
import { HelperService } from 'src/app/shared/helper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  /**
   * Validate form Group 
   */
  validateForm!: FormGroup;


  constructor(
    public router: Router,
    public helper: HelperService,
    public authService: AuthService,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    // define form group object, formcontrol.
    this.validateForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    // console.log(this.validateForm);
    if (this.validateForm.valid) {
      this.helper.showSpinner();
      this.authService.login(this.validateForm.value).then((res: any) => {
        if (res == 0) {
          this.helper.hideSpinner();
          // console.log(res);
          this.helper.newopenAlertBox('error', 'Invalid credentials');
        } else {
          this.helper.hideSpinner();
          // console.log(res);
          if (res.user.role !== 0) {
            this.helper.newopenAlertBox('success', 'Login Successfully');
            this.router.navigate(['dashboard/'], { replaceUrl: true });
          } else {
            this.helper.newopenAlertBox('warning', 'You are not Allowed');
          }
        }

      }).catch((e) => {
        console.log(e);

        this.helper.hideSpinner();
        // this.helper.openSnackBar('Error',' Invalid Credinationals','');
        this.helper.newopenAlertBox('error', 'Invalid Credinationals');


      });

    }


  }


}
