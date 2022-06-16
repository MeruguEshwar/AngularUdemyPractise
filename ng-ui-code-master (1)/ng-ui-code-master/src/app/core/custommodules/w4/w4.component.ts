import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ChangeDetectorRef,
} from "@angular/core";

import { W4 } from "@app/shared/models/w4-module.model";
import { W4Service } from "./w4.service";
import { AuthService } from "@app/core/service/auth.service";
import { EmployeeService } from "../employeeinfo/employeeinfo.service";
import { SharedService } from "@app/shared/shared.service";
import { HttpResponse } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FillingStatus,
  Residency,
  Taxability,
  W4FormStatus,
  W4FormType,
  YesNo,
} from "@app/shared/enums/w4.enum";
import { SignatureDetailsModel } from "@app/shared/models/signature-module.model";

@Component({
  selector: "app-w4",
  templateUrl: "./w4.component.html",
  styleUrls: ["./w4.component.css"],
})
export class W4Component implements OnInit, OnDestroy {
  value: boolean;

  editType: string = "View";
  @Input() isEmp: boolean;
  @Input() userId: number = -1;
  userName: string;
  w4: W4;
  webW4Details: W4;
  w4DetailsHistory: W4[] = [];
  loading: boolean = false;
  errLabel: string;
  showUpload: boolean = false;
  showSignatureModel: boolean = false;
  blob: Blob;
  state: any;
  loggedType: number;
  organizationCurrency: string;
  verifyDisplay: string = "none";
  messageDisplay: string = "none";
  deleteDisplay: string = "none";
  verifyDetails: VerifyDetails;
  signatureDetails: SignatureDetailsModel;
  currentDate: Date = new Date();
  digitalSignature: any;
  signatureStyle: string;
  signaturefullName: string;
  get W4FormType() {
    return W4FormType;
  }
  get Residency() {
    return Residency;
  }
  get FillingStatus() {
    return FillingStatus;
  }
  get Taxability() {
    return Taxability;
  }
  get YesNo() {
    return YesNo;
  }
  get Status() {
    return W4FormStatus;
  }
  constructor(
    private w4Services: W4Service,
    private authService: AuthService,
    private employeeService: EmployeeService,
    public sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.verifyDetails = new VerifyDetails();
    if (this.authService.orgnizationCurrency) {
      this.organizationCurrency = this.authService.orgnizationCurrency;
    }
    this.w4 = new W4();
    this.webW4Details = new W4();
    this.loggedType = this.authService.currentUser.roleId;
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
      this.getW4(this.userId);
    }
    await this.getSignatureConfig(this.userId);
    await this.getSignature(this.userId);
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
  getW4(userId) {
    this.w4Services.getW4Details(userId).subscribe(
      (res) => {
        this.loading = false;
        if (res.statusCode == 200) {
          console.log(res.responsePayload);
          this.webW4Details = res.responsePayload.webW4Details as W4;
          if (+this.webW4Details.multipleJobsOrSpouseWorks) {
            this.webW4Details.hasMultipleJobsOrSpouseWorks = true;
          }
          if (res.responsePayload.w4DetailsHistory) {
            this.w4DetailsHistory = res.responsePayload
              .w4DetailsHistory as W4[];
            this.w4DetailsHistory.forEach((element, key) => {
              if (+element.lastNameDiffers) {
                this.w4DetailsHistory[key].hasLastNameDiffers = true;
              }
            });
          }
        } else {
          this.w4.w4FormType = 1;
        }
      },
      (error) => {
        this.loading = false;
      }
    );
  }
  onSaveUsernameChanged(value: boolean) {
    if (value) {
      this.w4.nameSSNStatus = "1";
    } else {
      this.w4.nameSSNStatus = "0";
    }
  }
  saveW4Details() {
    this.w4.employeeDetailsId = this.userId;
    this.w4.action = "1";
    if (this.loggedType == 6) {
      this.w4.taxability = 1;
    }
    if (this.w4.hasMultipleJobsOrSpouseWorks) {
      this.w4.multipleJobsOrSpouseWorks = "1";
    }
    if (this.w4.hasLastNameDiffers) {
      this.w4.lastNameDiffers = "1";
    }
    this.w4Services.addW4(this.w4).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.w4.w4DetailsId = res.responsePayload.w4DetailsId;
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
  }
  save() {
    this.w4.employeeDetailsId = this.userId;
    this.w4.action = null;
    if (this.loggedType == 6) {
      this.w4.taxability = 1;
    }
    if (this.w4.hasMultipleJobsOrSpouseWorks) {
      this.w4.multipleJobsOrSpouseWorks = "1";
    }
    if (this.w4.hasLastNameDiffers) {
      this.w4.lastNameDiffers = "1";
    }
    this.w4Services.addW4(this.w4).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.getW4(this.userId);
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.editType = "View";
          this.w4 = new W4();
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

    // if (this.w4.w4DetailsId != null || this.w4.w4DetailsId != undefined) {
    //   this.w4Services.updateW4(this.w4).subscribe(
    //     (res) => {
    //       if (res.statusCode == 200) {
    //         this.sharedService.add({
    //           severity: "success",
    //           summary: "Success",
    //           detail: res.message,
    //         });
    //         this.editType = "View";
    //       } else {
    //         this.errLabel = res.message;
    //       }
    //     },
    //     (error) => {
    //       this.errLabel = error;
    //     }
    //   );
    // } else {
    //   this.w4Services.addW4(this.w4).subscribe(
    //     (res) => {
    //       if (res.statusCode == 200) {
    //         this.sharedService.add({
    //           severity: "success",
    //           summary: "Success",
    //           detail: res.message,
    //         });
    //         this.editType = "View";
    //       } else {
    //         this.errLabel = res.message;
    //       }
    //     },
    //     (error) => {
    //       this.errLabel = error;
    //     }
    //   );
    // }
  }
  w4DetailsId: number;
  w4HistoryIndex: number;
  deleteW4Details() {
    console.log(this.w4DetailsId);
    console.log(typeof this.w4DetailsId);
    this.w4Services.deleteW4Details(this.w4DetailsId).subscribe((res) => {
      this.deleteDisplay = "none";
      this.deleteConf = "";
      if (res.statusCode == 200) {
        this.w4DetailsHistory.splice(this.w4HistoryIndex, 1);
        console.log(res);
      }
    });
  }
  onDeptAddCloseClick(event) {
    this.showUpload = false;
    if (event?.employeeDocumentUploadDetailsId) {
      this.w4.employeeDocumentUploadDetailsId =
        event.employeeDocumentUploadDetailsId;
    }
  }
  showDialogToUpload() {
    this.showUpload = true;
  }
  downloadW4Form(employeeDocumentUploadDetailsId) {
    this.w4Services
      .downloadW4Doc(employeeDocumentUploadDetailsId)
      .subscribe((resp: HttpResponse<Blob>) => {
        const blob = new Blob([resp.body], { type: resp.body.type });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let imageType = resp.body.type.substring(
          resp.body.type.lastIndexOf("/") + 1
        );
        link.download = `w4Document_${employeeDocumentUploadDetailsId}.${imageType}`;
        link.click();
        link.remove();
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: "File downloaded",
        });
      });
  }
  downloadW4PDFForm(w4DetailsId) {
    this.w4Services
      .downloadW4PDFDoc(w4DetailsId)
      .subscribe((resp: HttpResponse<Blob>) => {
        const blob = new Blob([resp.body], { type: resp.body.type });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let imageType = resp.body.type.substring(
          resp.body.type.lastIndexOf("/") + 1
        );
        link.download = `w4Document_${w4DetailsId}.${imageType}`;
        link.click();
        link.remove();
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: "File downloaded",
        });
      });
  }
  ngOnDestroy() {
    this.w4Services.setUserToEdit(null);
  }
  onSelect() {
    console.log("onselect");
  }
  async showType() {
    this.w4 = new W4();
    this.editType = "Edit";
    this.w4.w4FormType = 1;
    this.w4.dateSubmitted =
      this.currentDate.getMonth() +
      1 +
      "-" +
      this.currentDate.getDate() +
      "-" +
      this.currentDate.getFullYear();
    // if (!this.isEmp) {
    //   if (+this.signatureDetails.w4Config != 1) {
    //     if (this.digitalSignature) {
    //       this.w4.signatureOfTheEmployee = this.digitalSignature.signature;
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
    //     this.w4.signatureOfTheEmployee = undefined;
    //   }
    // } else {
    //   this.w4.signatureOfTheEmployee = undefined;
    // }
  }
  showEditType() {
    this.w4 = new W4();
    this.editType = "Edit";
    this.w4 = this.webW4Details;
    // this.signatureDetails = new SignatureDetailsModel();
    // this.getSignatureConfig(this.userId);
  }
  onSignatureClick() {
    if (!this.isEmp) {
      if (+this.signatureDetails.i9Config != 1) {
        this.setSignature(this.digitalSignature)
          .then((result: any) => {
            this.w4.signatureOfTheEmployee = result.signature;
            this.w4.signatureFontOfTheEmployee = result.signatureFont;
          })
          .catch((err) => {});
      } else {
        this.w4.signatureOfTheEmployee = "";
        this.w4.signatureOfTheEmployee += this.w4.lastName
          ? this.w4.lastName + " "
          : "";
        this.w4.signatureOfTheEmployee += this.w4.firstNameAndMiddileInitial
          ? this.w4.firstNameAndMiddileInitial
          : "";
        this.signatureStyle = undefined;
      }
    } else {
      this.w4.signatureOfTheEmployee = undefined;
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
    this.deleteDisplay = "none";
    this.verifyDisplay = "none";
    this.editType = "View";
    this.deleteConf = "";
    this.getW4(this.userId);
  }
  addMessageCancel() {
    this.verifyDetails.rejectReason = "";
    this.messageDisplay = "none";
    //this.editType = 'View';
  }
  verify() {
    this.verifyDisplay = "block";
    this.editType = "verify";
  }
  approve() {
    this.verifyDetails.updateStatus = "2";
    this.approveOrReject();
  }
  addMessage: string;
  reject() {
    this.verifyDetails.updateStatus = "3";
    this.verifyDisplay = "block";
    this.messageDisplay = "block";
    this.addMessage = "message";
  }
  submit() {
    this.approveOrReject();
    this.addMessage = "";
  }
  deleteConf: string;
  deleteConfPopUp(w4DetailsId: number, index) {
    this.w4DetailsId = w4DetailsId;
    this.w4HistoryIndex = index;
    console.log(">>>>>>>>>>>>>>delete");
    this.deleteConf = "delete";
    this.deleteDisplay = "block";
  }
  approveOrReject() {
    this.verifyDetails.w4DetailsId = this.webW4Details.w4DetailsId;
    this.w4Services.verifyW4Details(this.verifyDetails).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.verifyDisplay = "none";
          this.messageDisplay = "none";
          this.cancel();
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          if (this.userId) {
            this.getW4(this.userId);
          }
        } else {
          this.errLabel = res.message;
        }
      },
      (error) => {
        this.errLabel = error;
      }
    );
  }
  getSignatureConfig(userId: number) {
    return new Promise<void>((resolve, reject) => {
      this.w4Services.getSignatureConfig(userId).subscribe(
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
      this.w4Services.getDigitalSignature(employeeDetailsId).subscribe(
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
  signatureVerificatonModel() {
    this.showSignatureModel = true;
  }
  onshowSignatureModel(event) {
    this.showSignatureModel = false;
    if (event?.type == "success") {
      this.save();
    }
  }
}
export class VerifyDetails {
  w4DetailsId: number;
  employerNameAndAddress: string;
  firstDateOfEmployment: string;
  updateStatus: string;
  einNumber: string;
  rejectReason: string;
}
