import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Payment } from "../../invoices/invoices.component";
import { Location } from "@angular/common";
import { FormControl, NgForm } from "@angular/forms";
import { SharedService } from "@app/shared/shared.service";
import { CompanyService } from "../company.service";
import { AuthService } from "@app/core/service/auth.service";

@Component({
  selector: "app-company-payments",
  templateUrl: "./company-payments.component.html",
  styleUrls: ["./company-payments.component.css"],
})
export class CompanyPaymentsComponent implements OnInit {
  @Input() companyDetailsId: any;
  loading: boolean = false;
  payment: Payment;
  selectedPaymentOptions: any;
  confirmType: string;
  deleteRowData: any;
  clientErrorMsg: any;
  errorLabel: any;
  public addPaymentsModel: string = "none";
  public confirmModel: string = "none";
  public AttachmentFileInfo: string = "none";
  public uploadFileInfo: string = "none";
  paymentList: any[] = [];
  attachmentList: any[];
  fileToUpload: any;
  uploadedFileTitle: string;
  @ViewChild("fileInput")
  myInputVariable: ElementRef;
  seletctedPayment: Payment;
  organizationCurrency: string;
  paymentOptions: any = [
    { label: "Payment Type", value: null },
    { label: "Cash", value: "Cash" },
    { label: "Cheque", value: "Cheque" },
    { label: "Direct Deposit", value: "Direct Deposit" },
    { label: "Wire Trasfer", value: "Wire Trasfer" },
    { label: "Other", value: "Other" },
  ];
  attachmentCols = [
    { field: "documentTitle", header: "Name" },
    { field: "createdAt", header: "Created Date" },
  ];
  paymentsCols = [
    { field: "companyName", header: "Customer Name" },
    { field: "paymentType", header: "Payment Type" },
    { field: "dateReceived", header: "Received Date" },
    { field: "amount", header: "Received Amount" },
    { field: "invoiceNumber", header: "Invoice ID" },
  ];
  constructor(
    private location: Location,
    public sharedService: SharedService,
    private companyService: CompanyService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.orgnizationCurrency) {
      this.organizationCurrency = this.authService.orgnizationCurrency;
    }
    this.payment = new Payment();
    if (this.companyDetailsId) {
      this.getPayments(this.companyDetailsId);
    }
  }

  onPaymentOption(event) {
    this.payment.paymentType = event.value;
  }
  onAddPayments() {
    this.payment = new Payment();
    this.addPaymentsModel = "block";
    this.attachmentList = [];
    this.selectedPaymentOptions = undefined;
    this.hiddenScroll();
  }
  savePayments(form: NgForm) {
    this.savePayment(form)
      .then((res: any) => {
        this.closeAddmodal();
        this.getPayments(this.companyDetailsId);
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: res.message,
        });
        form.reset();
      })
      .catch((err) => {
        this.sharedService.add({
          severity: "error",
          summary: "Error",
          detail: err.message,
        });
      });
  }
  savePayment(form: NgForm) {
    return new Promise((resolve, reject) => {
      this.payment.companyDetailsId = this.companyDetailsId;
      this.companyService.addCompanyPayments(this.payment).subscribe((res) => {
        if (res.statusCode == 200) {
          resolve(res);
        } else {
          reject(res);
        }
      });
    });
  }
  getPayments(companyDetailsId) {
    this.companyService.getPayments(companyDetailsId).subscribe((res) => {
      if (res.statusCode == 200) {
        this.paymentList = res.responsePayload;
      }
    });
  }
  async editPayment(rowData) {
    this.payment = new Payment();
    this.addPaymentsModel = "block";
    let selectedPaymentOptions = this.paymentOptions.filter((res) => {
      if (res.value == rowData.paymentType) {
        return res;
      }
    });
    this.selectedPaymentOptions = selectedPaymentOptions[0];
    this.payment = rowData;
    this.getpaymentAttacment(this.payment.paymentDetailsId);
    this.cdr.detectChanges();
    this.hiddenScroll();
  }
  uploadAttachemnts() {
    this.uploadFileInfo = "block";
    this.hiddenScroll();
  }
  onDeleteAttachment(rowData) {
    this.confirmModel = "block";
    this.deleteRowData = rowData;
    this.confirmType = "attachment";
    this.hiddenScroll();
  }
  onDeletePayment(rowData) {
    this.confirmModel = "block";
    this.deleteRowData = rowData;
    this.confirmType = "payment";
    this.hiddenScroll();
  }
  saveUploadFile(form: NgForm) {
    if (this.payment.paymentDetailsId) {
      this.uploadFile(this.payment.paymentDetailsId, form);
    } else {
      this.savePayment(form)
        .then((res: any) => {
          this.payment.paymentDetailsId = res.responsePayload;
          this.uploadFile(res.responsePayload, form);
          form.reset();
        })
        .catch((err) => {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: err.message,
          });
        });
    }
  }
  uploadFile(paymentDetailsId, form: NgForm) {
    let imageType = this.fileToUpload.value.type.split("/")[1].toLowerCase();
    let fd = new FormData();
    fd.append("paymentDetailsId", paymentDetailsId);
    fd.append("fileToUpload", this.fileToUpload.value);
    fd.append("documentTitle", this.uploadedFileTitle);
    if (
      imageType == "jpeg" ||
      imageType == "jpg" ||
      imageType == "gif" ||
      imageType == "png" ||
      imageType == "pdf"
    ) {
      this.companyService.uploadPaymentAttachment(fd).subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.getPayments(this.companyDetailsId);
            this.getpaymentAttacment(paymentDetailsId);
            this.closeUploadFilemodal(form);
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
    } else {
      this.sharedService.add({
        severity: "error",
        summary: "Error!",
        detail: `Please upload file in 'PNG', 'JPEG', 'JPG', 'GIF',"PDF" format`,
      });
      this.myInputVariable.nativeElement.value = "";
    }
  }
  confirmDelete(type) {
    switch (type) {
      case "attachment":
        this.confirmOnDeleteAttachment(this.deleteRowData);
        break;
      case "payment":
        this.confirmOnDeletePayment(this.deleteRowData);
        break;
    }
  }
  confirmOnDeletePayment(seletctedPayment) {
    this.companyService
      .deletePayments(seletctedPayment.paymentDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getPayments(seletctedPayment.companyDetailsId);
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        }
        this.closeAddmodal();
      });
  }
  confirmOnDeleteAttachment(rowData) {
    this.companyService
      .deleteCompanyPaymentAttachment(rowData.paymentAttachmentDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getpaymentAttacment(rowData.paymentDetailsId);
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.confirmModel = "none";
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }
  getpaymentAttacment(paymentDetailsId) {
    this.companyService
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
      this.fileToUpload = new FormControl(file);
    } else {
      this.fileToUpload = undefined;
    }
  }
  clearFile() {
    this.myInputVariable.nativeElement.value = "";
    this.fileToUpload = undefined;
  }
  closeAddmodal() {
    this.uploadFileInfo = "none";
    this.addPaymentsModel = "none";
    this.confirmModel = "none";
    this.displayScroll();
  }
  closeUploadFilemodal(form: NgForm) {
    this.uploadedFileTitle = null;
    this.fileToUpload = null;
    this.myInputVariable.nativeElement.value = "";
    this.uploadFileInfo = "none";
    form.reset();
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
}
