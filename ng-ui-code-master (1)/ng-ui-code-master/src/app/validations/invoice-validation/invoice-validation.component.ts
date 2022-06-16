import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SharedService } from "@app/shared/shared.service";
import { InvoiceValidationServices } from "../invoice-validation-services.service";

@Component({
  selector: "app-invoice-validation",
  templateUrl: "./invoice-validation.component.html",
  styleUrls: ["./invoice-validation.component.css"],
})
export class InvoiceValidationComponent implements OnInit {
  token: any;
  isAuthPage: boolean = false;
  isRestPage: boolean = false;
  isInvoicePage: boolean = false;
  errorMessagePage: boolean = false;
  errLablMsg: string = "";
  sussLblMsg: string = "";
  shortErrorMessage: string = "You are not authorized to approve Invoice";
  fullErrorMessage: string = "";
  invoiceDetailsId: any;
  organizationDetailsId: any;
  approverEmail: string = "";
  authorizationCode: string = "";
  invoiceDetails: any 
  commentInfo: string = "none";
  comments: string = "";
  submitStatusType: string;
  cols = [
    { field: "entryDate", header: "Date" },
    { field: "entryType", header: "Entry Type" },
    { field: "loggedTime", header: "Logged Time" },
    { field: "description", header: "Description" },
  ];
  clientErrorMsg: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invoiceValidationService: InvoiceValidationServices,
    private sharedService: SharedService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.token = params["token"];
    });
    this.authAuthCode(this.token);
  }
  authAuthCode(token) {
    this.invoiceValidationService.validateInvoiceAccessToken(token).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.isAuthPage = true;
          this.isRestPage = false;
          this.errorMessagePage = false;
          this.isInvoicePage = false;
          this.invoiceDetailsId = res.responsePayload.invoiceDetailsId;
          this.organizationDetailsId =
            res.responsePayload.organizationDetailsId;
        } else {
          this.isAuthPage = false;
          this.isRestPage = false;
          this.errorMessagePage = true;
          this.isInvoicePage = false;
          this.fullErrorMessage = res.message;
        }
      },
      (error) => {
        this.isAuthPage = false;
        this.isRestPage = false;
        this.errorMessagePage = true;
        this.isInvoicePage = false;
        this.fullErrorMessage =
          "Somthing whent Wrong..!! Please try again later";
      }
    );
  }
  submitAuthCode() {
    let reqObj = {
      organizationDetailsId: this.organizationDetailsId,
      invoiceDetailsId: this.invoiceDetailsId,
      authorizationCode: this.authorizationCode,
    };
    this.invoiceValidationService
      .validateInvoiceAuthCode(reqObj)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.isAuthPage = false;
          this.isRestPage = false;
          this.errorMessagePage = false;
          this.isInvoicePage = true;
          this.invoiceDetails = res.responsePayload;
          this.cdRef.detectChanges();
        } else {
          this.isAuthPage = false;
          this.isRestPage = false;
          this.errorMessagePage = true;
          this.isInvoicePage = false;
          this.fullErrorMessage = res.message;
        }
      });
  }
  getSubmitModel() {
    this.isAuthPage = true;
    this.isRestPage = false;
    this.errorMessagePage = false;
    this.isInvoicePage = false;
  }
  getResetModel() {
    this.isRestPage = true;
    this.isAuthPage = false;
    this.errorMessagePage = false;
    this.isInvoicePage = false;
  }

  resetAuthCodeSubmit() {
    this.invoiceValidationService
      .resendInvoiceAuthCode(this.approverEmail, this.organizationDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.isAuthPage = true;
          this.isRestPage = false;
          this.errorMessagePage = false;
          this.isInvoicePage = false;
          this.sussLblMsg = res.message;
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        } else {
          this.errLablMsg = res.message;
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }
  submitStatus() {
    let reqobj = {
      authorizationCode: this.authorizationCode,
      invoiceDetailsId: this.invoiceDetailsId,
      comments: this.comments,
      status: this.submitStatusType,
    };
    this.invoiceValidationService.statusUpdate(reqobj).subscribe((res) => {
      if (res.statusCode == 200) {
        this.closeCommentmodal();
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
  }
  reseterrorMessages() {
    this.errLablMsg = "";
    this.sussLblMsg = "";
    this.shortErrorMessage = "You are not authorized to approve timesheet";
    this.fullErrorMessage = "";
  }
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
  getTotal(obj) {
    let amount = 0;
    if (obj) {
      obj.forEach((element) => {
        amount += +element.amount;
      });
    }
    return amount;
  }
  openCommentPopUp(submitStatus) {
    this.commentInfo = "block";
    this.submitStatusType = submitStatus;
    this.hiddenScroll();
  }
  closeCommentmodal() {
    this.commentInfo = "none";
    this.comments = "";
    this.displayScroll();
  }
}
