import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/service/auth.service';
import { Role } from '@app/shared/enums/role.enum';
import { SharedService } from '@app/shared/shared.service';
import { BackEndService } from './back-end.service';

@Component({
  selector: 'app-two-factor-auth',
  templateUrl: './two-factor-auth.component.html',
  styleUrls: ['./two-factor-auth.component.scss']
})
export class TwoFactorAuthComponent implements OnInit {

  public newUser = false;
  public user;
  public loginForm: FormGroup;
  private accessData = {};
  password: string = "";

  tfa: any = {};
  authcode: string = "";
  errorMessage: string = null;
  showTAQRCode: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private _backend: BackEndService,
    public sharedService: SharedService
  ) {

  }

  ngOnInit() {
    this.getAuthDetails();
    let _data = sessionStorage.getItem("authinfo") ? JSON.parse(sessionStorage.getItem("authinfo")) : {};
    if (Object.keys(_data).length) {
      this.showTAQRCode = _data['showTAQRCode'] ? _data['showTAQRCode'] : false;
    } else {
      this.showTAQRCode
    }
  }
  getAuthDetails() {
    this._backend.getAuth().subscribe((data) => {
      const result = data.body
      if (data['status'] === 200) {
        if (result == null) {
          this.setup();
        } else {
          this.tfa = result;
        }
      }
    });
  }
  reset() {
    this._backend.put("employee/tfastatus/reset/request").subscribe(accessData => {
      if (accessData != null) {
        if (accessData && accessData['statusCode'] === 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: accessData['message'],
          });
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: accessData['message'],
          });
        }
      }
    })
  }
  setup() {
    this._backend.setupAuth().subscribe((data) => {
      const result = data.body
      if (data['status'] === 200) {
        console.log("setup ", result);
        sessionStorage.setItem("tempSecret", result['tempSecret']);
        this.tfa = result;
      }
    });
  }
  confirm() {
    this._backend.verifyAuth(this.authcode, this.tfa.tempSecret).subscribe((data) => {
      const result = data.body
      if (result['status'] === 200) {
        console.log(result);
        this.errorMessage = null;
        this.tfa.secret = this.tfa.tempSecret;
        this.tfa.tempSecret = "";



        if (this.showTAQRCode) {
          this._backend.put("employee/tfastatus/update").subscribe(res => {
            this.redirectPage();
          })
        } else {
          this.redirectPage();
        }
      } else {
        this.errorMessage = result['message'];
      }
    });
  }
  redirectPage() {
    let _data = sessionStorage.getItem("authinfo") ? JSON.parse(sessionStorage.getItem("authinfo")) : {};
    if (Object.keys(_data).length) {
      this.authService.currentUser = _data;
      this.authService.currentUser.role = Role[
        _data?.roleId
      ].toLowerCase();
      // this.authService.currentUser.role = this.getRole(
      //   res.responsePayload?.roleId
      // );
      this.authService.login(this.authService.currentUser);
      this.router.navigate([this.authService.currentUser.role]);
    }
  }
}