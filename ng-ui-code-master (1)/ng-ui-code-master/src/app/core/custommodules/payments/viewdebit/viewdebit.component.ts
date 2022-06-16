import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { NgForm, FormControl } from "@angular/forms";
import { AuthService } from "@app/core/service/auth.service";
import { SharedService } from "@app/shared/shared.service";
import { Payment } from "../debit/debit.component";
import { PaymentService } from "../payments.service";
import { Location } from "@angular/common";

@Component({
  selector: "app-viewdebit",
  templateUrl: "./viewdebit.component.html",
  styleUrls: ["./viewdebit.component.css"],
})
export class ViewdebitComponent implements OnInit {
  loading: boolean = false;
  state: any;
  paymentDetailsId: any;
  payment: Payment;
  public addPaymentsModel: string = "none";
  organizationDetailsId: any;
  paymentOptions: any = [
    // { label: "Payment Type", value: null },
    { label: "Cash", value: "Cash" },
    { label: "Cheque", value: "Cheque" },
    { label: "Direct Deposit", value: "Direct Deposit" },
    { label: "Wire Trasfer", value: "Wire Trasfer" },
    { label: "Other", value: "Other" },
  ];
  customerOptions: any;
  selectedPaymentOptions: any;
  selectedCustomerOptions: any;
  clientErrorMsg: any;
  uploadedFileTitle: string;
  fileToUpload: any;
  uploadFileInfo: string = "none";
  errorLabel: any;
  @ViewChild("fileInput")
  myInputVariable: ElementRef;
  attachmentList: any[];
  attachmentCols = [
    { field: "documentTitle", header: "Name" },
    { field: "createdAt", header: "Created Date" },
  ];
  deleteRowData: any;
  confirmType: string;
  paymentType: String;

  constructor(
    private location: Location,
    private paymentService: PaymentService,
    private authService: AuthService,
    public sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  organizationCurrency: string;
  async ngOnInit(): Promise<void> {
    if (this.authService.orgnizationCurrency) {
      this.organizationCurrency = this.authService.orgnizationCurrency;
    }

    this.payment = new Payment();
    this.state = window.history.state;
    if (this.state && this.state.paymentDetailsId) {
      this.paymentDetailsId = this.state.paymentDetailsId;
      this.organizationDetailsId =
        this.authService.currentUser.organizationDetailsId;
    }
    if (this.paymentDetailsId) {
      this.getpaymentsDetails(this.paymentDetailsId);
      this.getpaymentAttacment(this.paymentDetailsId);
    } else {
      this.location.back();
    }
  }
  getpaymentsDetails(paymentDetailsId) {
    this.paymentService.getPaymentDetail(paymentDetailsId).subscribe((res) => {
      if (res.statusCode == 200) {
        this.payment = res.responsePayload;
        this.paymentType = this.payment.paymentType;
      } else {
        this.payment = new Payment();
      }
    });
  }
  async editPayment(rowData) {
    this.payment = rowData;
    this.cdr.detectChanges();
    this.addPaymentsModel = "block";
    this.hiddenScroll();
  }
  savePayments(form: NgForm) {
    this.paymentService.addDebits(this.payment).subscribe((res) => {
      if (res.statusCode == 200) {
        this.getpaymentsDetails(this.paymentDetailsId);
        this.closeModal(form);
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: res.message,
        });
      } else {
        this.sharedService.add({
          severity: "error",
          summary: "Error",
          detail: res.message,
        });
      }
    });
  }
  uploadAttachemnts() {
    this.uploadFileInfo = "block";
    this.hiddenScroll();
  }
  onPaymentOption(event) {
    this.payment.paymentType = event.value;
  }
  saveUploadFile() {
    let fd = new FormData();
    fd.append("paymentDetailsId", this.paymentDetailsId.toString());
    fd.append("fileToUpload", this.fileToUpload);
    fd.append("documentTitle", this.uploadedFileTitle);
    this.paymentService.uploadPaymentAttachment(fd).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.getpaymentAttacment(this.paymentDetailsId);
          this.closeModal();
          this.uploadedFileTitle = null;
          this.myInputVariable.nativeElement.value = "";
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error!",
            detail: res.message,
          });
        }
      },
      (error) => {
        this.errorLabel = error;
      }
    );
  }
  getpaymentAttacment(paymentDetailsId) {
    this.paymentService
      .getPaymentAttachment(paymentDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.attachmentList = res.responsePayload;
        } else {
          this.attachmentList = [];
        }
      });
  }
  onFileChange(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      let imageType = file.type.split("/")[1].toLowerCase();
      console.log(imageType);
      if (
        imageType == "jpeg" ||
        imageType == "jpg" ||
        imageType == "gif" ||
        imageType == "png" ||
        imageType == "pdf"
      ) {
        this.fileToUpload = file;
      } else {
        this.sharedService.add({
          severity: "error",
          summary: "Error!",
          detail: `Please upload file in 'PNG', 'JPEG', 'JPG', 'GIF',"PDF" format`,
        });
        this.fileToUpload = undefined;
        this.myInputVariable.nativeElement.value = "";
      }
    } else {
      this.fileToUpload = undefined;
    }
  }
  clearFile() {
    this.myInputVariable.nativeElement.value = "";
    this.fileToUpload = undefined;
  }
  onDeleteAttachment(rowData) {
    this.deleteRowData = rowData;
    this.confirmType = "attachment";
    this.hiddenScroll();
  }
  confirm(type) {
    switch (type) {
      case "attachment":
        this.confirmOnDeleteAttachment(this.deleteRowData);
        break;
    }
  }
  confirmOnDeleteAttachment(rowData) {
    this.paymentService
      .deletePaymentAttachment(rowData.paymentAttachmentDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getpaymentAttacment(rowData.paymentDetailsId);
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }
  closeModal(form?: NgForm) {
    this.addPaymentsModel = "none";
    this.uploadFileInfo = "none";
    if (form) {
      form.reset();
    }
    this.fileToUpload = undefined;
    this.myInputVariable.nativeElement.value = "";
    this.getpaymentsDetails(this.paymentDetailsId);
    this.getpaymentAttacment(this.paymentDetailsId);
    this.displayScroll();
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
}
