import { Component, OnInit } from "@angular/core";
import { MatInputModule } from "@angular/material/input";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { SharedService } from "../shared/shared.service";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { Role } from "@app/shared/enums/role.enum";
import { UserActivationService } from "./user-activation.service";
import { PasswordStrengthValidator } from "@app/core/header/password-strength.validators";

@Component({
  selector: "app-user-activation",
  templateUrl: "./user-activation.component.html",
  styleUrls: ["./user-activation.component.css"],
})
export class UserActivationComponent implements OnInit {
  activationForm: FormGroup;
  token: string = "";
  isValid: boolean = false;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private activationService: UserActivationService,
    private sharedService: SharedService
  ) {
    this.activatedRoute.paramMap.subscribe((res: ParamMap) => {
      this.token = res.get("id");
    });
  }
  ngOnInit(): void {
    this.activationForm = this.fb.group({
      password: new FormControl({ value: "", disabled: false }, [
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(32),
        PasswordStrengthValidator.hasRepeatedLetters,
        PasswordStrengthValidator.isMatchPattern,
        PasswordStrengthValidator.validateSequence,
      ]),
      repassword: new FormControl({ value: "", disabled: false }, [
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(32),
        PasswordStrengthValidator.hasRepeatedLetters,
        PasswordStrengthValidator.isMatchPattern,
        PasswordStrengthValidator.validateSequence,
        this.confPasswordMatchValidator,
      ]),
    });
    this.validateRegistration(this.token);
  }
  validateRegistration(activationCode: string) {
    this.activationService
      .validateRegistration(activationCode)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.isValid = true;
        } else {
          this.isValid = false;
        }
      });
  }
  onFormSubmit() {
    if (this.activationForm.valid) {
      if (
        this.activationForm.get("password").value !==
        this.activationForm.get("repassword").value
      ) {
        this.sharedService.add({
          severity: "error",
          summary: "Error",
          detail: "Password and Re enter password should match",
        });
        return;
      }
      this.activationService
        .setPassword(this.token, this.activationForm.get("password").value)
        .subscribe(
          (res) => {
            if (res.message == "Password Set Successful") {
              this.sharedService.add({
                severity: "success",
                summary: "Success",
                detail: res.message,
              });
              this.router.navigate(["login"]);
            } else {
              this.sharedService.add({
                severity: "error",
                summary: "Error",
                detail: res.message,
              });
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
        detail: "Please enter the credentials.",
      });
    }
  }
  confPasswordMatchValidator(control) {
    if (control.value != null) {
      var conPass = control.value;
      var newPass = control.root.get("password");
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
}
