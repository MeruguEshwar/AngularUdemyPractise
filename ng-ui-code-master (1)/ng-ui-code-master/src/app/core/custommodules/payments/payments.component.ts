import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormControl, NgForm } from "@angular/forms";
import { AuthService } from "@app/core/service/auth.service";
import { SharedService } from "@app/shared/shared.service";
import { PaymentService } from "./payments.service";

@Component({
  selector: "app-payments",
  templateUrl: "./payments.component.html",
  styleUrls: ["./payments.component.css"],
})
export class PaymentsComponent implements OnInit {
  @ViewChild("minimumDate") minimumDate: ElementRef<HTMLInputElement>;
  loading: boolean = false;
  payment: Payment;
  clientErrorMsg: any;
  customerOptions: any;
  selectedCustomerOptions: any;
  public addPaymentsModel: string = "none";
  public confirmModel: string = "none";
  public uploadFileInfo: string = "none";
  uploadedFileTitle: string;
  fileToUpload: any;
  @ViewChild("fileInput")
  myInputVariable: ElementRef;
  @ViewChild("paymentForm")
  paymentForm: ElementRef;
  seletctedPayment: Payment;
  organizationDetailsId: any;
  toDate: string;
  fromDate: string;
  invoiceNumber: string;
  attachmentList: any[];
  organizationCurrency: string;
  attachmentCols = [
    { field: "documentTitle", header: "Name" },
    { field: "createdAt", header: "Created Date" },
  ];
  cols = [
    { field: "companyName", header: "Customer Name" },
    { field: "invoiceNumber", header: "Invoice Number" },
    { field: "paymentType", header: "Payment Type" },
    { field: "dateReceived", header: "Received Date" },
    { field: "amount", header: "Received Amount" },
  ];
  paymentOptions: any = [
    { label: "Payment Type", value: null },
    { label: "Cash", value: "Cash" },
    { label: "Cheque", value: "Cheque" },
    { label: "Direct Deposit", value: "Direct Deposit" },
    { label: "Wire Transfer", value: "Wire Transfer" },
    { label: "Other", value: "Other" },
  ];
  selectedPaymentOptions: any;
  paymentList: any[];
  errorLabel: string;
  confirmType: string;
  deleteRowData: any;
  selectedPaymentList: any;
  paymentToogleType: number = 0;
  constructor(
    private paymentService: PaymentService,
    private authService: AuthService,
    public sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.authService.orgnizationCurrency) {
      this.organizationCurrency = this.authService.orgnizationCurrency;
    }
    this.payment = new Payment();
    this.organizationDetailsId =
      this.authService.currentUser.organizationDetailsId;
    this.getPayments(Object);
    this.getCompanyList(this.organizationDetailsId);
    this.sharedService.openToggleMenu("roleMenuToggleExternalContent");
  }
  search(fromDate, toDate, invoiceNumber, selectedClientOptions) {
    let searchByCompany = null;
    if (selectedClientOptions) {
      searchByCompany = selectedClientOptions.companyDetailsId;
    }
    if (fromDate && (toDate == null || toDate == undefined)) {
      this.sharedService.add({
        severity: "error",
        summary: "Error",
        detail: "Please select end Date",
      });
    }
    if (toDate && (fromDate == null || fromDate == undefined)) {
      this.sharedService.add({
        severity: "error",
        summary: "Error",
        detail: "Please select from Date",
      });
    }
    let params = new Params();
    if (fromDate && toDate) {
      params.startDate = fromDate;
      params.endDate = toDate;
    }
    if (invoiceNumber) {
      params.invoiceNumber = invoiceNumber;
    }
    if (searchByCompany) {
      params.companyDetailsId = searchByCompany;
    }
    this.getPayments(params);
  }
  handleChange(event) {
    let index = event.index;
    this.selectedPaymentList = undefined;
    this.getPaymentDetails(index, Object);
  }
  getPaymentDetails(index, object) {
    this.paymentToogleType = index;
    switch (index) {
      case 0:
        this.getPayments(object);
        break;
      case 1:
        this.getDeletedPayments();
        break;
      default:
        break;
    }
  }
  getPayments(obj) {
    this.paymentService.getPayments(obj).subscribe((res) => {
      if ((res.statusCode = 200)) {
        this.paymentList = res.responsePayload;
      } else {
        this.paymentList = [];
      }
    });
  }
  getDeletedPayments() {
    this.paymentService.getDeletedCreditPayments().subscribe((res) => {
      if ((res.statusCode = 200)) {
        this.paymentList = res.responsePayload;
      } else {
        this.paymentList = [];
      }
    });
  }
  getCompanyList(organizationDetailsId) {
    return new Promise<void>((resolve, reject) => {
      this.paymentService
        .getCompanyList(organizationDetailsId)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.customerOptions = res.responsePayload;
            this.customerOptions.splice(0, 0, {
              companyName: "Select Customer",
              value: null,
            });
            resolve();
          }
        });
    });
  }
  addPayments() {
    this.payment = new Payment();
    this.addPaymentsModel = "block";
    this.hiddenScroll();
  }
  savePayments(form: NgForm) {
    if (!this.payment.paymentDetailsId) {
      this.savePayment(form)
        .then((res: any) => {
          this.getPayments(Object);
          this.closeModal(form);
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
    } else {
      this.getPayments(Object);
      this.closeModal(form);
    }
  }
  savePayment(form: NgForm) {
    return new Promise((resolve, reject) => {
      this.payment.companyDetailsId =
        this.selectedCustomerOptions?.companyDetailsId;
      this.paymentService.addPayments(this.payment).subscribe((res) => {
        if (res.statusCode == 200) {
          resolve(res);
        } else {
          reject(res);
        }
      });
    });
  }
  async editPayment(rowData) {
    this.payment = new Payment();
    this.addPaymentsModel = "block";
    await this.getCompanyList(this.organizationDetailsId);

    let selectedCustomerOptions = this.customerOptions.filter((res) => {
      if (res.companyDetailsId == rowData.companyDetailsId) {
        return res;
      }
    });
    let selectedPaymentOptions = this.paymentOptions.filter((res) => {
      if (res.value == rowData.paymentType) {
        return res;
      }
    });
    this.selectedPaymentOptions = selectedPaymentOptions[0];
    this.selectedCustomerOptions = selectedCustomerOptions[0];
    this.payment = rowData;
    this.cdr.detectChanges();
    this.hiddenScroll();
  }
  onDeletePayment(rowData, confirmType) {
    this.confirmModel = "block";
    this.seletctedPayment = rowData;
    this.confirmType = confirmType;
    this.hiddenScroll();
  }
  onDeleteAttachment(rowData) {
    this.confirmModel = "block";
    this.deleteRowData = rowData;
    this.confirmType = "attachment";
    this.hiddenScroll();
  }
  onCompanyList(event) {
    if (event && event.companyName == "Select Customer") {
      this.cdr.detectChanges();
      this.selectedCustomerOptions = undefined;
    }
  }
  confirmDelete(type) {
    switch (type) {
      case "Undo Payments":
        this.confirmUndoPayments();
        break;
      case "Delete Payments Permanantly":
        this.confirmDeletePaymentsPermanantly();
        break;
      case "Delete Payments":
        this.confirmDeletePayments();
        break;
      case "Undo Payment":
        this.confirmUndoPayment(this.seletctedPayment);
        break;
      case "Delete Payment":
        this.confirmDeletePayment(this.seletctedPayment);
        break;
      case "Delete Payment Permanantly":
        this.confirmDeletePaymentPermanantly(this.seletctedPayment);
        break;
      case "attachment":
        this.confirmOnDeleteAttachment(this.deleteRowData);
        break;
    }
    this.closeModal();
  }
  confirmDeletePayments() {
    let paymentDetailsIds: any[] = [];
    this.selectedPaymentList.forEach((element) => {
      paymentDetailsIds.push(element.paymentDetailsId);
    });
    this.paymentService
      .deleteInvoicePayments(paymentDetailsIds)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.search(
            this.fromDate,
            this.toDate,
            this.invoiceNumber,
            this.selectedCustomerOptions
          );
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
  confirmDeletePayment(seletctedPayment) {
    this.paymentService
      .deleteInvoicePayment(seletctedPayment.paymentDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.search(
            this.fromDate,
            this.toDate,
            this.invoiceNumber,
            this.selectedCustomerOptions
          );
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        }
      });
  }
  confirmDeletePaymentsPermanantly() {
    let paymentDetailsIds: any[] = [];
    this.selectedPaymentList.forEach((element) => {
      paymentDetailsIds.push(element.paymentDetailsId);
    });
    this.paymentService
      .deleteInvoicePaymentsPermanently(paymentDetailsIds)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getPaymentDetails(this.paymentToogleType, Object);
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
  confirmDeletePaymentPermanantly(seletctedPayment) {
    this.paymentService
      .deleteInvoicePaymentPermanently(seletctedPayment.paymentDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getPaymentDetails(this.paymentToogleType, Object);
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
  confirmUndoPayments() {
    let paymentDetailsIds: any[] = [];
    this.selectedPaymentList.forEach((element) => {
      paymentDetailsIds.push(element.paymentDetailsId);
    });
    this.paymentService.undoPayments(paymentDetailsIds).subscribe((res) => {
      if (res.statusCode == 200) {
        this.getPaymentDetails(this.paymentToogleType, Object);
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
  confirmUndoPayment(seletctedPayment) {
    this.paymentService
      .undoPayment(seletctedPayment.paymentDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getPaymentDetails(this.paymentToogleType, Object);
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
  uploadAttachemnts() {
    this.uploadFileInfo = "block";
    this.hiddenScroll();
  }
  uploadFile(paymentDetailsId) {
    let fd = new FormData();
    fd.append("paymentDetailsId", paymentDetailsId);
    fd.append("fileToUpload", this.fileToUpload);
    fd.append("documentTitle", this.uploadedFileTitle);
    this.paymentService.uploadPaymentAttachment(fd).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.getpaymentAttacment(paymentDetailsId);
          this.uploadedFileTitle = null;
          this.myInputVariable.nativeElement.value = "";
          this.uploadFileInfo = "none";
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
  saveUploadFile(form: NgForm) {
    if (this.payment.paymentDetailsId) {
      this.uploadFile(this.payment.paymentDetailsId);
    } else {
      this.savePayment(form)
        .then((res: any) => {
          this.payment.paymentDetailsId = res.responsePayload;
          this.uploadFile(res.responsePayload);
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
  closeModal(paymentForm?: NgForm) {
    this.addPaymentsModel = "none";
    this.confirmModel = "none";
    this.uploadFileInfo = "none";
    this.errorLabel = "";
    this.selectedPaymentOptions = undefined;
    this.selectedCustomerOptions = undefined;
    this.selectedPaymentList = undefined;
    this.seletctedPayment = undefined;
    this.deleteRowData = undefined;
    if (paymentForm) {
      paymentForm.reset();
    }
    this.displayScroll();
    // this.getPayments(Object);
  }
  closeUploadFileInfoModal(form?: NgForm) {
    this.uploadFileInfo = "none";
    form.reset();
    this.fileToUpload = undefined;
    this.myInputVariable.nativeElement.value = "";
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
  onPaymentOption(event) {
    this.payment.paymentType = event.value;
  }
}
export class Payment {
  paymentDetailsId: number;
  companyDetailsId: number;
  companyName: string;
  paymentType: string;
  dateReceived: string;
  amount: number;
  description: string;
  invoiceNumber: string;
  employeeDetailsId: string;
  employeeName: string;
  status: string;
}
export class Params {
  startDate: string;
  endDate: string;
  invoiceNumber: string;
  companyDetailsId: number;
}
