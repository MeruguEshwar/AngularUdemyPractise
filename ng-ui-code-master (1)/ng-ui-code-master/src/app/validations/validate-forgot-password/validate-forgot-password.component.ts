import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ChangePassword } from "@app/core/header/header.component";
import { PasswordStrengthValidator } from "@app/core/header/password-strength.validators";
import { SharedService } from "@app/shared/shared.service";
import { ForgotPasswordValidationServices } from "../forgot-password-validation-services.service";

@Component({
  selector: "app-validate-forgot-password",
  templateUrl: "./validate-forgot-password.component.html",
  styleUrls: ["./validate-forgot-password.component.css"],
})
export class ValidateForgotPasswordComponent implements OnInit {
  token: any;
  showForm: boolean = false;
  changepasswordForm = this.formBuilder.group({
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
  changePassword: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private forgotPasswordValidationService: ForgotPasswordValidationServices,
    public sharedService: SharedService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.changePassword = new ChangePassword();
    this.route.params.subscribe((params) => {
      this.token = params["token"];
    });
    this.forgotPasswordValidationService
      .validateLink(this.token)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.showForm = true;
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
          this.router.navigate(["/"]);
        }
      });
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
  onChangePassword(formObj) {
    this.changePassword.newPassword = formObj.newPassword;
    this.changePassword.confirmPassword = formObj.confnewPassword;
    this.forgotPasswordValidationService
      .setForgotPassword(this.token, this.changePassword.newPassword)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.router.navigate(["/"]);
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
    this.changePassword = new ChangePassword();
    this.showForm = false;
  }
  cancel() {
    this.router.navigate(["/"]);
  }
}
