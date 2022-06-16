import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { SharedService } from "@app/shared/shared.service";
import { AuthService } from "@app/core/service/auth.service";
import { ActivatedRoute } from "@angular/router";
import { User } from "@app/shared/models/user.model";
import { I9 } from "@app/shared/models/i9-module.model";
import { NgForm } from "@angular/forms";
import { I9Service } from "./i9.services";
import { HttpResponse } from "@angular/common/http";
import { EmployeeService } from "../employeeinfo/employeeinfo.service";
import { I9FormStatus } from "@app/shared/enums/i9.enum";
import { SignatureDetailsModel } from "@app/shared/models/signature-module.model";

@Component({
  selector: "app-i9",
  templateUrl: "./i9.component.html",
  styleUrls: ["./i9.component.css"],
})
export class I9Component implements OnInit {
  @Input() isEmp: boolean = false;
  @Input() userId: number = -1;
  loading: boolean = false;
  userName: string;
  editType: string = "View";
  state: any;
  errorLabel: any;
  showUpload: boolean = false;
  i9: I9;
  webI9Details: I9;
  selectedWebI9Details: I9;
  i9DetailsHistory: I9[] = [];
  errLabel: string;
  perjury: string;
  signatureDetails: SignatureDetailsModel;
  date: Date = new Date();
  get Status() {
    return I9FormStatus;
  }
  isMiddleInitial: boolean = false;
  isLastNameUsed: boolean = false;
  isAPTNumber: boolean = false;
  isconfirm: boolean = false;
  showDeclaration: string = "none";
  showSignatureModel: boolean = false;
  currentDate: Date = new Date();
  digitalSignature: any;
  signatureStyle: string;
  signaturefullName: string;
  deleteConf: string;
  deleteDisplay: string = "none";
  constructor(
    public sharedService: SharedService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    private i9Services: I9Service,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.date.setDate(this.date.getDate() - 1);
    this.i9 = new I9();
    this.webI9Details = new I9();
    this.signatureDetails = new SignatureDetailsModel();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.state = window.history.state;
      if (this.state && this.state.userDetailsId) {
        this.userId = this.state.userDetailsId;
        this.getUser(this.userId);
      } else {
        this.userId = this.authService.currentUser.employeeDetailsId;
        this.userName =
          this.authService.currentUser.fistName +
          " " +
          this.authService.currentUser.lastName;
      }
    });
    if (this.userId) {
      this.getI9(this.userId);
    }
    await this.getSignatureConfig(this.userId);
    await this.getSignature(this.userId);
    this.sharedService.openToggleMenu("enforcementToggleExternalContent");

    this.cdr.detectChanges();
  }
  getUser(userId) {
    this.employeeService.getEmployee(userId).subscribe(
      (res) => {
        this.loading = false;
        if (res.statusCode == 200) {
          this.userName =
            res.responsePayload.firstName + " " + res.responsePayload.lastName;
        }
      },
      (error) => {
        this.loading = false;
      }
    );
  }
  getI9(userId) {
    this.i9Services.getI9Details(userId).subscribe((res) => {
      if (res.statusCode == 200) {
        this.webI9Details = res.responsePayload.webI9Details as I9;
        if (+this.webI9Details.citizenOfUs) {
          this.webI9Details.hasCitizenOfUs = "hasCitizenOfUs";
        }
        if (+this.webI9Details.nonCitizenNationalOfUs) {
          this.webI9Details.hasNonCitizenNationalOfUs =
            "hasNonCitizenNationalOfUs";
        }
        if (+this.webI9Details.lawfulPermanentResident) {
          this.webI9Details.hasLawfulPermanentResident =
            "hasLawfulPermanentResident";
        }
        if (+this.webI9Details.alienAuthorizedToWork) {
          this.webI9Details.hasAlienAuthorizedToWork =
            "hasAlienAuthorizedToWork";
        }
        if (res.responsePayload.i9DetailsHistory) {
          this.i9DetailsHistory = res.responsePayload.i9DetailsHistory as I9[];
          this.i9DetailsHistory.forEach((element, key) => {
            if (+element.citizenOfUs) {
              this.i9DetailsHistory[key].hasCitizenOfUs = "hasCitizenOfUs";
            }
            if (+element.nonCitizenNationalOfUs) {
              this.i9DetailsHistory[key].hasNonCitizenNationalOfUs =
                "hasNonCitizenNationalOfUs";
            }
            if (+element.lawfulPermanentResident) {
              this.i9DetailsHistory[key].hasLawfulPermanentResident =
                "hasLawfulPermanentResident";
            }
            if (+element.alienAuthorizedToWork) {
              this.i9DetailsHistory[key].hasAlienAuthorizedToWork =
                "hasAlienAuthorizedToWork";
            }
          });
        }
      }
    });
  }
  saveI9Details() {
    this.i9.employeeDetailsId = this.userId;
    this.i9.action = "1";
    if (this.perjury == "hasCitizenOfUs") {
      this.i9.citizenOfUs = "1";
    } else {
      this.i9.citizenOfUs = "0";
    }
    if (this.perjury == "hasNonCitizenNationalOfUs") {
      this.i9.nonCitizenNationalOfUs = "1";
    } else {
      this.i9.nonCitizenNationalOfUs = "0";
    }
    if (this.perjury == "hasLawfulPermanentResident") {
      this.i9.lawfulPermanentResident = "1";
    } else {
      this.i9.lawfulPermanentResident = "0";
      this.i9.lprAlienRegNoOrUscisNo = "";
    }
    if (this.perjury == "hasAlienAuthorizedToWork") {
      this.i9.alienAuthorizedToWork = "1";
    } else {
      this.i9.alienAuthorizedToWork = "0";
      this.i9.alienAuthorizationWorkExpirationDate = undefined;
      this.i9.alienRegNoOrUscisNo = undefined;
      this.i9.formI94AdmnNumber = undefined;
      this.i9.foreignPassportNumber = undefined;
      this.i9.countryOfIssuance = undefined;
    }
    this.i9Services.addI9(this.i9).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.i9.i9DetailsId = res.responsePayload.i9DetailsId;
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error!",
            detail: res.message,
          });
        }
      },
      (error) => {
        this.sharedService.add({
          severity: "error",
          summary: "Error!",
          detail: error,
        });
      }
    );
  }

  save() {
    this.i9.employeeDetailsId = this.userId;
    this.i9.action = null;
    if (this.perjury == "hasCitizenOfUs") {
      this.i9.citizenOfUs = "1";
    } else {
      this.i9.citizenOfUs = "0";
    }
    if (this.perjury == "hasNonCitizenNationalOfUs") {
      this.i9.nonCitizenNationalOfUs = "1";
    } else {
      this.i9.nonCitizenNationalOfUs = "0";
    }
    if (this.perjury == "hasLawfulPermanentResident") {
      this.i9.lawfulPermanentResident = "1";
    } else {
      this.i9.lawfulPermanentResident = "0";
      this.i9.lprAlienRegNoOrUscisNo = "";
    }
    if (this.perjury == "hasAlienAuthorizedToWork") {
      this.i9.alienAuthorizedToWork = "1";
    } else {
      this.i9.alienAuthorizedToWork = "0";
      this.i9.alienAuthorizationWorkExpirationDate = undefined;
      this.i9.alienRegNoOrUscisNo = undefined;
      this.i9.formI94AdmnNumber = undefined;
      this.i9.foreignPassportNumber = undefined;
      this.i9.countryOfIssuance = undefined;
    }
    this.i9Services.addI9(this.i9).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.getI9(this.userId);
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.editType = "View";
          this.clearCheckApplicable();
          this.closeDeclaration();
          this.i9 = new I9();
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error!",
            detail: res.message,
          });
        }
      },
      (error) => {
        this.sharedService.add({
          severity: "error",
          summary: "Error!",
          detail: error,
        });
      }
    );
  }
  showDialogToUpload() {
    this.showUpload = true;
  }
  onDeptAddCloseClick(event) {
    this.showUpload = false;
    if (event?.employeeDocumentUploadDetailsId) {
      this.i9.employeeDocumentUploadDetailsId =
        event.employeeDocumentUploadDetailsId;
    }
  }
  onVerifyCloseClick(event) {
    this.cancel();
  }
  downloadI9Form(employeeDocumentUploadDetailsId) {
    this.sharedService.add({
      severity: "info",
      summary: "Info!",
      detail: "File is preparing to download please wait",
    });
    this.i9Services
      .downloadI9Doc(employeeDocumentUploadDetailsId)
      .subscribe((resp: HttpResponse<Blob>) => {
        const blob = new Blob([resp.body], { type: resp.body.type });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let imageType = resp.body.type.substring(
          resp.body.type.lastIndexOf("/") + 1
        );
        link.download = `i9Document_${employeeDocumentUploadDetailsId}.${imageType}`;
        link.click();
        link.remove();
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: "File downloaded",
        });
      });
  }
  downloadI9PDFForm(i9DetailsId) {
    this.sharedService.add({
      severity: "info",
      summary: "Info!",
      detail: "File is preparing to download please wait",
    });
    this.i9Services
      .downloadI9PDFDoc(i9DetailsId)
      .subscribe((resp: HttpResponse<Blob>) => {
        const blob = new Blob([resp.body], { type: resp.body.type });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let imageType = resp.body.type.substring(
          resp.body.type.lastIndexOf("/") + 1
        );
        link.download = `i9Document_${i9DetailsId}.${imageType}`;
        link.click();
        link.remove();
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: "File downloaded",
        });
      });
  }
  showType() {
    this.i9 = new I9();
    this.editType = "Edit";
    this.i9.i9FormType = 1;
    var todayDate =
      this.currentDate.getMonth() +
      1 +
      "-" +
      this.currentDate.getDate() +
      "-" +
      this.currentDate.getFullYear();
    this.i9.dateSubmitted = todayDate;
    this.i9.dateSubmittedPreparer = todayDate;
    this.i9.preparedByEmployer = this.isEmp ? 1 : 2;
    this.clearCheckApplicable();
    // if (!this.isEmp) {
    //   console.log(this.signatureDetails);
    //   if (+this.signatureDetails.i9Config != 1) {
    //     if (this.digitalSignature) {
    //       this.i9.signatureOfTheEmployee = this.digitalSignature.signature;
    //       this.signaturefullName = this.digitalSignature.signature;
    //       this.signatureStyle = this.digitalSignature.signatureFont;
    //     } else {
    //       this.sharedService.add({
    //         severity: "error",
    //         summary: "Error",
    //         detail: "Please configure your signature from your profile",
    //       });
    //       this.cancel();
    //     }
    //   } else {
    //     this.i9.signatureOfTheEmployee = undefined;
    //   }
    // } else {
    //   this.i9.signatureOfTheEmployee = undefined;
    // }
  }
  showEditType() {
    this.i9 = new I9();
    this.editType = "Edit";
    this.i9 = this.webI9Details;
    if (+this.i9.citizenOfUs) {
      // this.i9.hasCitizenOfUs = "hasCitizenOfUs";
      this.perjury = "hasCitizenOfUs";
    }
    if (+this.i9.nonCitizenNationalOfUs) {
      //this.i9.hasNonCitizenNationalOfUs = "hasNonCitizenNationalOfUs";
      this.perjury = "hasNonCitizenNationalOfUs";
    }
    if (+this.i9.lawfulPermanentResident) {
      //this.i9.hasLawfulPermanentResident = "hasLawfulPermanentResident";
      this.perjury = "hasLawfulPermanentResident";
    }
    if (+this.i9.alienAuthorizedToWork) {
      //this.i9.hasAlienAuthorizedToWork = "hasAlienAuthorizedToWork";
      this.perjury = "hasAlienAuthorizedToWork";
    }
    this.i9.middleInitial == "NA"
      ? (this.isMiddleInitial = true)
      : (this.isMiddleInitial = false);
    this.i9.aptNumber == "NA"
      ? (this.isAPTNumber = true)
      : (this.isAPTNumber = false);
    this.i9.otherLastName == "NA"
      ? (this.isLastNameUsed = true)
      : (this.isLastNameUsed = false);
    //this.signatureDetails = new SignatureDetailsModel();
    // this.getSignatureConfig(this.userId);
  }
  getSignatureConfig(userId: number) {
    return new Promise<void>((resolve, reject) => {
      this.i9Services.getSignatureConfig(userId).subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.signatureDetails =
              res.responsePayload as SignatureDetailsModel;
          } else {
            this.errLabel = res.message;
          }
          resolve();
        },
        (error) => {
          resolve();
          this.errLabel = error;
        }
      );
    });
  }

  getSignature(employeeDetailsId) {
    return new Promise<void>((resolve, reject) => {
      this.i9Services.getDigitalSignature(employeeDetailsId).subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.digitalSignature = res.responsePayload;
            this.signatureStyle = this.digitalSignature.signatureFont;
          } else {
            this.digitalSignature = "";
            this.signaturefullName = "";
            this.signatureStyle = "";
          }
          resolve();
        },
        (error) => {
          resolve();
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: error,
          });
        }
      );
    });
  }
  onSignatureClick() {
    if (!this.isEmp) {
      if (+this.signatureDetails.i9Config != 1) {
        this.setSignature(this.digitalSignature)
          .then((result: any) => {
            this.i9.signatureOfTheEmployee = result.signature;
            this.i9.signatureFontOfTheEmployee = result.signatureFont;
          })
          .catch((err) => {});
      } else {
        this.i9.signatureOfTheEmployee = "";
        this.i9.signatureOfTheEmployee += this.i9.lastName
          ? this.i9.lastName + " "
          : "";
        this.i9.signatureOfTheEmployee += this.i9.firstName
          ? this.i9.firstName
          : "";
        this.signatureStyle = undefined;
      }
    } else {
      this.i9.signatureOfTheEmployee = undefined;
    }
  }
  setSignature(digitalSignature: any) {
    return new Promise<void>((resolve, reject) => {
      if (digitalSignature) {
        this.signatureStyle = digitalSignature.signatureFont;
        resolve(digitalSignature);
      } else {
        this.sharedService.add({
          severity: "error",
          summary: "Error",
          detail: "Please configure your signature from your profile",
        });
        reject();
      }
    });
  }
  cancel() {
    this.editType = "View";
    this.deleteConf = "";
    this.deleteDisplay = "none";
    this.getI9(this.userId);
    this.clearCheckApplicable();
  }
  checkType(data) {
    if (data == "1") {
      return "Yes";
    } else {
      return "No";
    }
  }
  checkApplicable(event, type) {
    switch (type) {
      case "isMiddleInitial":
        this.isMiddleInitial
          ? (this.i9.middleInitial = "NA")
          : (this.i9.middleInitial = undefined);
        break;
      case "isAPTNumber":
        this.isAPTNumber
          ? (this.i9.aptNumber = "NA")
          : (this.i9.aptNumber = undefined);
        break;
      case "isLastNameUsed":
        this.isLastNameUsed
          ? (this.i9.otherLastName = "NA")
          : (this.i9.otherLastName = undefined);
        break;
    }
  }
  clearCheckApplicable() {
    this.isMiddleInitial = false;
    this.isconfirm = false;
    this.isLastNameUsed = false;
    this.isAPTNumber = false;
  }
  verifyForm(data) {
    this.selectedWebI9Details = data;
    this.editType = "verify";
    this.clearCheckApplicable();
  }
  showDeclarationModel() {
    this.showDeclaration = "block";
    this.hiddenScroll();
  }
  closeDeclaration() {
    this.showDeclaration = "none";
    this.displayScroll();
  }
  hiddenScroll() {
    try {
      let bodyElement = document.getElementById("modalbody") as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.add("modal-open");
      }
    } catch (ex) {
      this.errorLabel(ex, "hiddenScroll");
    }
  }
  displayScroll() {
    try {
      let bodyElement = document.getElementById("modalbody") as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.remove("modal-open");
      }
    } catch (ex) {
      this.errorLabel(ex, "displayScroll");
    }
  }
  signatureVerificatonModel() {
    this.showSignatureModel = true;
  }
  onshowSignatureModel(event) {
    this.showSignatureModel = false;
    if (event?.type == "success") {
      this.showDeclarationModel();
    }
  }

  deleteConfPopUp(rowData) {
    this.selectedWebI9Details = rowData;
    this.deleteConf = "delete";
    this.deleteDisplay = "block";
  }
  deleteI9Details() {
    this.i9Services
      .deleteI9Details(this.selectedWebI9Details.i9DetailsId)
      .subscribe((res) => {
        this.deleteDisplay = "none";
        this.deleteConf = "";
        if (res.statusCode == 200) {
          this.getI9(this.userId);
        }
      });
  }
}
