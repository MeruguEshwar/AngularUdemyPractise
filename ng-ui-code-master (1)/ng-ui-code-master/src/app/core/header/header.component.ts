import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { AuthService } from "../service/auth.service";
import { User, UserHasMultipleAccounts } from "@app/shared/models/user.model";
import { HttpClient } from "@angular/common/http";
import { ApiResponse } from "@app/shared/models/api-response.model";
import { SharedService } from "@app/shared/shared.service";
import { UserActionServices } from "@app/shared/userAction.services";
import { Router } from "@angular/router";
import { environment } from "@env/environment";
import { AdminDashBoard } from "@app/shared/models/adminDashboard-module.model";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { PasswordStrengthValidator } from "./password-strength.validators";
import { Role } from "@app/shared/enums/role.enum";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  dashboardDetails: AdminDashBoard;
  organizationName: string = "Aroha Technologies";
  organizationList: any = [
    "Demo One Technologies",
    "Demo Two Technologies",
    "Demo Three Technologies",
  ];
  notifications: any[];
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    public sharedService: SharedService,
    private userAction: UserActionServices,
    private router: Router,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}
  changepasswordForm = this.formBuilder.group({
    currentPassword: ["", [Validators.required]],
    newPassword: [
      "",
      [
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(32),
        PasswordStrengthValidator.hasRepeatedLetters,
        PasswordStrengthValidator.isMatchPattern,
        PasswordStrengthValidator.validateSequence,
        this.newPasswordMatchValidator,
      ],
    ],
    confnewPassword: [
      "",
      [
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(32),
        PasswordStrengthValidator.hasRepeatedLetters,
        PasswordStrengthValidator.isMatchPattern,
        PasswordStrengthValidator.validateSequence,
        this.confPasswordMatchValidator,
      ],
    ],
  });
  user: User;
  changePassword: any;
  clientErrorMsg: any;
  switchedView: boolean;
  hasMultipullOrg: boolean = false;
  enableActiveClass: number;
  pictureUrl: string = environment.pictureUrl;
  unreadRequestCount: number;
  employeeAccounts: any = [];

  ngOnInit(): void {
    this.changePassword = new ChangePassword();
    this.dashboardDetails = new AdminDashBoard();
    this.user = this.authService.currentUser;
    this.organizationName = this.authService.currentUser.orgnizationName;
    this.sharedService.userRole = "employee";
    this.switchedView = this.sharedService.getUserViewType();
    this.enableActiveClass = this.sharedService.getAdminMenuType();
    this.hasMultipullOrg =
      this.authService.userHasMultipleAccounts.hasMultipleAccounts;
    if (this.authService.userHasMultipleAccounts.employeeAccounts != null) {
      this.authService.userHasMultipleAccounts.employeeAccounts.forEach(
        (element) => {
          this.employeeAccounts.push({
            label: element.orgnizationName,
            value: element.employeeDetailsId,
          });
        }
      );
    }
    // this.hasMultipullOrg = true;
    // this.employeeAccounts = [
    //   {
    //     label: "Testing",
    //     value: 92,
    //   },
    // ];
    // this.http
    //   .get<ApiResponse<any>>("api/dashboard/admin/get")
    //   .subscribe((res) => {
    //     if (res.statusCode == 200) {
    //       this.dashboardDetails = res.responsePayload;
    //       this.userAction.adminDashBoard.next(res.responsePayload);
    //     } else {
    //       this.sharedService.add({
    //         severity: "error",
    //         summary: "Error",
    //         detail: res.message,
    //       });
    //     }
    //   });
    this.userAction.adminDashBoard.subscribe((res) => {
      this.dashboardDetails = res;
    });
    this.getUnreadRequestCount(this.switchedView);
    this.getAllNotification();
  }

  confPasswordMatchValidator(control) {
    if (control.value != null) {
      var conPass = control.value;
      var newPass = control.root.get("newPassword");
      if (newPass) {
        var newpassword = newPass.value;
        if (conPass !== "" && newpassword !== "") {
          if (conPass !== newpassword) {
            return {
              passwordMisMatch: true,
            };
          } else {
            return null;
          }
        }
      }
    }
  }
  newPasswordMatchValidator(control) {
    if (control.value != null) {
      var newPass = control.value;
      var currPass = control.root.get("currentPassword");
      if (currPass) {
        var currentpassword = currPass.value;
        if (newPass !== "" && currentpassword !== "") {
          if (newPass === currentpassword) {
            return {
              newPasswordMisMatch: true,
            };
          } else {
            return null;
          }
        }
      }
    }
  }
  get f() {
    return this.changepasswordForm.controls;
  }
  changeView() {
    console.log(this.switchedView);
    this.switchedView = !this.switchedView;
    console.log(this.switchedView);
    this.sharedService.setUserViewType(this.switchedView);
    this.userAction.switcheddView.next(this.switchedView);
    this.getUnreadRequestCount(this.switchedView);
    this.sharedService.userRole = this.user.role;
    if (this.switchedView) {
      this.router.navigate([
        "/" + this.authService.currentUser.role + "/dashboard",
      ]);
      this.onMenuType(1);
    } else {
      this.sharedService.userRole = "employee";
      this.router.navigate(["employee/dashboard"]);
    }
  }
  getUnreadRequestCount(isAdminView) {
    this.sharedService.getUnreadRequestsCount(isAdminView).subscribe((resp) => {
      this.unreadRequestCount = resp.responsePayload;
    });
  }
  onMenuType(menuType) {
    this.sharedService.setAdminMenuType(menuType);
    this.userAction.megaMenuClicked.next(menuType);
    this.enableActiveClass = menuType;
  }
  onLogoutClick() {
    this.authService.logout();
  }
  onChangePasswordClick() {
    this.changePassword = new ChangePassword();
  }
  onChangePassword(formObj) {
    this.changePassword.currentPassword = formObj.currentPassword;
    this.changePassword.newPassword = formObj.newPassword;
    this.changePassword.confirmPassword = formObj.confnewPassword;
    if (
      this.changePassword.currentPassword != this.changePassword.newPassword
    ) {
      this.http
        .post<ApiResponse<User>>(
          "api/employee/password/update",
          this.changePassword
        )
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            this.authService.logout();
            this.hiddenScroll();
          } else {
            this.sharedService.add({
              severity: "error",
              summary: "Error!",
              detail: res.message,
            });
          }
        });
    }
    this.changePassword = new ChangePassword();
  }
  getAllNotification() {
    this.http
      .get<ApiResponse<any>>("/api/notifications/all")
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.notifications = res.responsePayload;
        }
      });
  }
  // mobilebtn(){
  //   document.getElementById("mainwrapper").classList.add("slide-nav");
  // }
  hiddenScroll() {
    try {
      let bodyElement = document.getElementById("modalbody") as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.add("modal-open");
      }
    } catch (ex) {
      this.clientErrorMsg(ex, "hiddenScroll");
    }
  }
  displayScroll() {
    try {
      let bodyElement = document.getElementById("modalbody") as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.remove("modal-open");
      }
    } catch (ex) {
      this.clientErrorMsg(ex, "displayScroll");
    }
  }
  onChangeOrg(employeeDetailsId) {
    this.http
      .get<ApiResponse<any>>(
        `api/employee/login/defaults/get?employeeDetailsId=${employeeDetailsId}`
      )
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.cdr.detectChanges();
          this.authService.clearSessionStorage();
          this.user = res.responsePayload;
          this.authService.currentUser = this.user;
          this.authService.currentUser.role =
            Role[res.responsePayload?.roleId].toLowerCase();
          this.authService.switchLogin(this.authService.currentUser);
          this.changePassword = new ChangePassword();
          this.dashboardDetails = new AdminDashBoard();
          this.organizationName = this.authService.currentUser.orgnizationName;
          this.switchedView = this.sharedService.getUserViewType();
          this.enableActiveClass = this.sharedService.getAdminMenuType();
          this.userAction.adminDashBoard.subscribe((res) => {
            this.dashboardDetails = res;
          });
          this.getUnreadRequestCount(this.switchedView);
          this.getAllNotification();
          this.userAction.switcheddView.next(this.switchedView);
          this.router.navigate(["/employee"]);
        }
      });
  }
}
export class ChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
