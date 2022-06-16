import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatInputModule } from "@angular/material/input";
import { Router } from "@angular/router";
import { SharedService } from "../shared/shared.service";
import { LoginService } from "./login.service";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  NgForm,
} from "@angular/forms";
import { AuthService } from "@app/core/service/auth.service";
import { Role } from "@app/shared/enums/role.enum";
import { User, UserHasMultipleAccounts } from "@app/shared/models/user.model";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  @Input() nonRoutingModule: boolean = false;
  @Input() actionType: string = "login";
  @Output() onClose = new EventEmitter<any>();
  loginForm: FormGroup;
  userLogin: Login;
  forgotForm: FormGroup;
  forgotLogin: Login;
  isloginShow: boolean = true;
  showForgotSuccessMsg: boolean = false;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private loginService: LoginService,
    private authService: AuthService,
    public sharedService: SharedService
  ) {
    this.userLogin = new Login();
    this.forgotLogin = new Login();
  }
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: new FormControl(this.userLogin.userName, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(150),
        Validators.pattern(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/),
      ]),
      password: new FormControl(this.userLogin.password, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(32),
        Validators.pattern(
          /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&-_*]).{8,}/
        ),
      ]),
    });
    this.forgotForm = this.fb.group({
      forgotEmailId: new FormControl(this.forgotLogin.userName, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(150),
        Validators.pattern(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/),
      ]),
    });
    localStorage.removeItem("isLoggedIn");
    if (this.actionType == "login") {
      this.onsignIn();
    } else {
      this.onsignUp();
    }
  }
  onFormSubmit() {
    if (this.loginForm.valid) {
      let objLogin = { email: "", password: "" };
      objLogin.email = this.loginForm.get("userName").value;
      objLogin.password = this.loginForm.get("password").value;
      this.loginService.login(objLogin).subscribe(
        (res) => {
          if (res.statusCode == 10021) {
            this.sharedService.add({
              severity: "error",
              summary: "Error",
              detail: res.message,
            });
          } else if (res.message == "Invalid Credentials") {
            this.sharedService.add({
              severity: "error",
              summary: "Error",
              detail: res.message,
            });
          } else if (res.message == "User Login Successful") {
            let loggedInEmployeeAccountDetails = new UserHasMultipleAccounts();
            loggedInEmployeeAccountDetails.hasMultipleAccounts =
              res.responsePayload.hasMultipleAccounts;
            loggedInEmployeeAccountDetails.employeeAccounts =
              res.responsePayload.employeeAccounts;
            // Need to un comment for two factor authenticate
            // sessionStorage.setItem("authinfo", JSON.stringify(res.responsePayload))
            // this.router.navigate(['/authenticate']);

            // Normal login
            this.authService.currentUser = res.responsePayload;
            this.authService.currentUser.role =
              Role[res.responsePayload?.roleId].toLowerCase();
            this.authService.userHasMultipleAccounts =
              loggedInEmployeeAccountDetails;
            this.authService.login(this.authService.currentUser);
            if (this.authService.currentUser.roleId == 7) {
              this.router.navigate(["/timesheet_Approvers"]);
            } else {
              this.router.navigate(["/employee/dashboard"]);
            }

            this.onCloseEvent({ type: "close" });
          }
        },
        (error) => {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: error,
          });
        }
      );
    } else {
      this.sharedService.add({
        severity: "error",
        summary: "Error",
        detail: "Username and Password didn't match. Please try again.",
      });
    }
  }
  getRole(roleId: number) {
    if (
      roleId == Role.SupremeAdmin ||
      roleId == Role.Admin ||
      roleId == Role.HR
    ) {
      return Role[Role.Admin].toLowerCase();
    } else if (roleId == Role.Employee) {
      return Role[Role.User].toLowerCase();
    } else {
      return Role[roleId].toLowerCase();
    }
  }
  get userName() {
    return this.loginForm.get("userName");
  }
  get password() {
    return this.loginForm.get("password");
  }
  get forgotEmailId() {
    return this.forgotEmailId.get("password");
  }
  onsignUp() {
    document.getElementById("container")?.classList.add("right-panel-active");
    this.loginForm.reset();
  }
  onsignIn() {
    document
      .getElementById("container")
      ?.classList.remove("right-panel-active");
    this.isloginShow = true;
    this.loginForm.reset();
  }
  onForgotSubmit() {
    this.loginService
      .forgotPassword(this.forgotForm.get("forgotEmailId").value)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.showForgotSuccessMsg = true;
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }
  showForm(type) {
    if (type == "login") {
      this.isloginShow = true;
    } else if (type == "forgot") {
      this.isloginShow = false;
    }
  }
  onCloseEvent(event) {
    this.onClose.emit(event);
  }
}
export class Login {
  userName: string;
  password: string;
}
