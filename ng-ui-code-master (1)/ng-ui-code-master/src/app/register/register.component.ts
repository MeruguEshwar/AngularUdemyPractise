import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { BasicSetup } from "@app/shared/models/basic-setup-model";
import { SharedService } from "@app/shared/shared.service";
import { WelcomeService } from "@app/welcome/welcome.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  formcontent: boolean = false;
  isWorkEmailValid: boolean = false;
  basicSetupForm: FormGroup;
  basicSetup: BasicSetup;
  lstEmployees: any[] = [];
  @Output() onClose = new EventEmitter<any>();
  @Input() nonRoutingModule: boolean = false;
  @Input() nonRoutingModuleInLogin: boolean = false;
  @Input() fromHomepageModule: boolean = false;
  @Input() showRegistration: boolean = false;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    public sharedService: SharedService,
    private welcomeService: WelcomeService
  ) {
    this.basicSetup = new BasicSetup();
    this.basicSetupForm = this.fb.group({
      title: new FormControl({ value: "", disabled: false }, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(150),
      ]),
      noOfEmployees: new FormControl({ value: "", disabled: false }, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(150),
      ]),
      workEmail: new FormControl({ value: "", disabled: false }, [
        Validators.required,
        Validators.minLength(1),
        Validators.email,
        Validators.maxLength(150),
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$"),
      ]),
      firstName: new FormControl({ value: "", disabled: false }, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern("^[a-zA-Z ]+$"),
      ]),
      lastName: new FormControl({ value: "", disabled: false }, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern("^[a-zA-Z ]+$"),
      ]),
      organizationName: new FormControl({ value: "", disabled: false }, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(500),
      ]),
      workPhone: new FormControl({ value: "", disabled: false }, [
        Validators.required,
        Validators.maxLength(14),
        Validators.pattern("^[0-9]{10,15}"),
      ]),
    });
  }

  ngOnInit(): void {
    this.formcontent = false;
    this.lstEmployees = [
      { value: "1-5", label: "1 - 5" },
      { value: "6-10", label: "6 - 10" },
      { value: "11-25", label: "11 - 25" },
      { value: "26-150", label: "26 - 150" },
      { value: "151+", label: "151+" },
    ];
  }
  onbackClick() {
    this.formcontent = false;
  }
  validateDomain() {
    this.welcomeService
      .validateDomain(this.basicSetupForm.get("workEmail").value)
      .subscribe((res) => {
        if (res.statusCode != 200) {
          this.isWorkEmailValid = false;
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        } else {
          this.isWorkEmailValid = true;
        }
      });
  }
  validateForm() {
    if (!this.basicSetupForm.invalid && this.isWorkEmailValid) {
      return false;
    } else {
      return true;
    }
  }
  onFormSubmit() {
    if (this.basicSetupForm.valid) {
      this.welcomeService
        .validateDomain(this.basicSetupForm.get("workEmail").value)
        .subscribe((res) => {
          if (res.statusCode != 200) {
            this.sharedService.add({
              severity: "error",
              summary: "Error",
              detail: res.message,
            });
          } else {
            this.basicSetup.noOfEmployees =
              this.basicSetupForm.get("noOfEmployees").value;
            this.basicSetup.title = this.basicSetupForm.get("title").value;
            this.basicSetup.workEmail =
              this.basicSetupForm.get("workEmail").value;
            this.basicSetup.firstName =
              this.basicSetupForm.get("firstName").value;
            this.basicSetup.lastName =
              this.basicSetupForm.get("lastName").value;
            this.basicSetup.organizationName =
              this.basicSetupForm.get("organizationName").value;
            this.basicSetup.workPhone =
              this.basicSetupForm.get("workPhone").value;
            this.welcomeService.basicSetUp(this.basicSetup).subscribe((res) => {
              if (res["message"] == "Basic Setup completed successfully") {
                this.sharedService.add({
                  severity: "success",
                  summary: "Success",
                  detail: res["message"],
                });
                this.basicSetup = new BasicSetup();
                this.basicSetupForm.reset();
                this.onbackClick();
                this.router.navigate(["/welcome"]);
                this.onClose.emit({ type: "close" });
              } else {
                this.sharedService.add({
                  severity: "error",
                  summary: "Error",
                  detail: res["message"],
                });
              }
            });
          }
        });
    }
  }
  formClick(item) {
    this.basicSetupForm.get("noOfEmployees").setValue(item.value);
    this.formcontent = true;
  }
}
