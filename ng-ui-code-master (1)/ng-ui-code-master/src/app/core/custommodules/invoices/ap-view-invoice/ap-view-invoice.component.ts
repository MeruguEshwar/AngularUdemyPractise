import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { InvoicesDetails } from "@app/shared/models/invoicePaymentDetailsmodel.";
import { InvoicesService } from "../invoices.service";
import * as country_details from "../../../../../assets/country_details.json";
import { Location } from "@angular/common";
import { SharedService } from "@app/shared/shared.service";
import { Payment } from "../invoices.component";
import { AuthService } from "@app/core/service/auth.service";
import { FormControl, NgForm } from "@angular/forms";
import { HttpResponse } from "@angular/common/http";

@Component({
  selector: "app-ap-view-invoice",
  templateUrl: "./ap-view-invoice.component.html",
  styleUrls: ["./ap-view-invoice.component.css"],
})
export class ApViewInvoiceComponent implements OnInit {
  clientErrorMsg: any;
  loading: boolean = false;
  state: any;
  invoiceDetailsId: number;
  organizationDetailsId: any;
  invoiceDetails: InvoicesDetails;
  countryDetails = country_details.rows;
  currencyIcon: string;
  paymentsCols = [
    { field: "invoiceNumber", header: "Invoice ID" },
    { field: "companyName", header: "Customer Name" },
    { field: "paymentType", header: "Payment Type" },
    { field: "dateReceived", header: "Sent Date" },
    { field: "amount", header: "Sent Amount" },
  ];
  attachmentCols = [
    { field: "documentTitle", header: "Name" },
    { field: "createdAt", header: "Created Date" },
  ];
  messageType = [
    { label: "Private", value: "1" },
    { label: "Customer", value: "2" },
  ];
  commentList: InvoiceComment[];
  paymentList: any[];
  attachmentList: any[];
  paymentsAttachmentList: any[];
  deleteRowData: any;
  confirmType: string;
  uploadType: string;
  payment: Payment;
  commentDetails: InvoiceComment;
  public addPaymentsModel: string = "none";
  customerOptions: any;
  organizationCurrency: string;

  paymentOptions: any = [
    { label: "Payment Type", value: null },
    { label: "Cash", value: "Cash" },
    { label: "Cheque", value: "Cheque" },
    { label: "Direct Deposit", value: "Direct Deposit" },
    { label: "Wire Transfer", value: "Wire Transfer" },
    { label: "Other", value: "Other" },
  ];
  selectedPaymentOptions: any;
  selectedCustomerOptions: any;
  uploadedFileTitle: string;
  fileToUpload: any;
  uploadFileInfo: string = "none";
  errorLabel: any;
  @ViewChild("fileInput")
  myInputVariable: ElementRef;
  constructor(
    private invoicesService: InvoicesService,
    private location: Location,
    private sharedService: SharedService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.authService.orgnizationCurrency) {
      this.organizationCurrency = this.authService.orgnizationCurrency;
    }
    this.invoiceDetails = new InvoicesDetails();
    this.commentDetails = new InvoiceComment();
    this.organizationDetailsId =
      this.authService.currentUser.organizationDetailsId;
    this.payment = new Payment();
    this.state = window.history.state;
    if (this.state && this.state.invoiceDetailsId) {
      this.invoiceDetailsId = this.state.invoiceDetailsId;
    }
    if (this.invoiceDetailsId) {
      await this.getInvoiceDetails(this.invoiceDetailsId);
      this.getPayments({ invoiceNumber: this.invoiceDetails.invoiceNumber });
      this.getInvoiceAttacment(this.invoiceDetailsId);
      this.getInvoiceComments(this.invoiceDetailsId);
    } else {
      this.location.back();
    }
  }
  async getInvoiceDetails(invoiceDetailsId) {
    return new Promise((resolve, reject) => {
      this.invoicesService
        .getInvoiceDetails(invoiceDetailsId)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.invoiceDetails = res.responsePayload;
            // const countryName = this.countryDetails.filter((element) => {
            //   return (
            //     element.country_details_id ==
            //     res.responsePayload.organizationRemittanceDetails.country
            //   );
            // });
            // this.invoiceDetails.organizationRemittanceDetails.countryName =
            //   countryName[0].name;
            // this.currencyIcon = countryName[0].currency_icon;
            resolve(this.invoiceDetails);
          } else {
            this.invoiceDetails = new InvoicesDetails();
            resolve(this.invoiceDetails);
          }
        });
    });
  }
  getPayments(obj) {
    this.invoicesService.getAPPayments(obj).subscribe((res) => {
      if ((res.statusCode = 200)) {
        this.paymentList = res.responsePayload;
      } else {
        this.paymentList = [];
      }
    });
  }
  getCompanyList(organizationDetailsId) {
    return new Promise<void>((resolve, reject) => {
      this.invoicesService
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
  onDeletePayment(rowData) {
    this.deleteRowData = rowData;
    this.confirmType = "deletePayment";
    this.hiddenScroll();
  }
  getInvoiceAttacment(invoiceDetailsId) {
    this.invoicesService
      .getInvoiceAttachment(invoiceDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.attachmentList = res.responsePayload;
        } else {
          this.attachmentList = [];
        }
      });
  }
  getpaymentAttacment(paymentDetailsId) {
    this.invoicesService
      .getPaymentAttachment(paymentDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.paymentsAttachmentList = res.responsePayload;
        } else {
          this.paymentsAttachmentList = [];
        }
      });
  }
  getInvoiceComments(invoiceDetailsId) {
    this.invoicesService
      .getInvoiceComments(invoiceDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.commentList = res.responsePayload;
        } else {
          this.commentList = [];
        }
      });
  }
  onPaymentOption(event) {
    this.payment.paymentType = event.value;
  }
  addPayments() {
    this.addPaymentsModel = "block";
    this.payment = new Payment();
    this.payment.companyDetailsId = this.invoiceDetails.companyDetailsId;
    // this.getCompanyList(this.organizationDetailsId);
    this.hiddenScroll();
  }
  async editPayment(rowData) {
    this.payment = new Payment();
    this.addPaymentsModel = "block";
    // await this.getCompanyList(this.organizationDetailsId);

    // let selectedCustomerOptions = this.customerOptions.filter((res) => {
    //   if (res.companyDetailsId == rowData.companyDetailsId) {
    //     return res;
    //   }
    // });
    let selectedPaymentOptions = this.paymentOptions.filter((res) => {
      if (res.value == rowData.paymentType) {
        return res;
      }
    });
    this.selectedPaymentOptions = selectedPaymentOptions[0];
    // this.selectedCustomerOptions = selectedCustomerOptions[0];
    this.payment = rowData;
    this.getpaymentAttacment(rowData.paymentDetailsId);
    this.cdr.detectChanges();
    this.hiddenScroll();
  }

  savePayments(form: NgForm) {
    if (!this.payment.paymentDetailsId) {
      this.savePayment(form)
        .then((res: any) => {
          this.getPayments({
            invoiceNumber: this.invoiceDetails.invoiceNumber,
          });
          this.closePaymentsModal(form);
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        })
        .catch((err) => {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: err.message,
          });
        });
    } else {
      this.getPayments({ invoiceNumber: this.invoiceDetails.invoiceNumber });
      this.closeModal();
    }
  }
  savePayment(form: NgForm) {
    return new Promise((resolve, reject) => {
      // this.payment.companyDetailsId = this.selectedCustomerOptions?.companyDetailsId;
      this.payment.invoiceNumber = this.invoiceDetails.invoiceNumber;
      this.invoicesService.addAPPayments(this.payment).subscribe((res) => {
        if (res.statusCode == 200) {
          resolve(res);
        } else {
          reject(res);
        }
      });
    });
  }
  confirm(type) {
    switch (type) {
      case "deletetAttachment":
        this.confirmOnDeleteAttachment(this.deleteRowData);
        break;
      case "deletePayment":
        this.confirmDeletePayment(this.deleteRowData);
        break;
      case "deleteComment":
        this.confirmDeleteComment(this.deleteRowData);
        break;
    }
  }
  onDeleteAttachment(rowData) {
    this.deleteRowData = rowData;
    this.confirmType = "deletetAttachment";
  }
  confirmOnDeleteAttachment(rowData) {
    this.invoicesService
      .deleteInvoiceAttachment(rowData.invoiceAttachmentDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getInvoiceAttacment(rowData.invoiceDetailsId);
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
    this.invoicesService
      .deleteInvoicePayments(seletctedPayment.paymentDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getPayments({
            invoiceNumber: this.invoiceDetails.invoiceNumber,
          });
          this.closeModal();
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
  confirmDeleteComment(rowData) {
    this.invoicesService
      .deleteInvoiceComment(rowData.invoiceCommentDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getInvoiceComments(rowData.invoiceDetailsId);
          this.closeModal();
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
  uploadAttachemnts(type) {
    this.uploadFileInfo = "block";
    this.hiddenScroll();
    this.uploadType = type;
  }
  uploadPaymentFile(paymentDetailsId) {
    let fd = new FormData();
    fd.append("paymentDetailsId", paymentDetailsId);
    fd.append("fileToUpload", this.fileToUpload);
    fd.append("documentTitle", this.uploadedFileTitle);
    this.invoicesService.uploadPaymentAttachment(fd).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.getpaymentAttacment(paymentDetailsId);
          this.getPayments({
            invoiceNumber: this.invoiceDetails.invoiceNumber,
          });
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
  saveUploadFile(form: NgForm, type: string) {
    switch (type) {
      case "paymentAttachment":
        this.savePaymentAttachment(form);
        break;
      case "attachment":
        this.saveInvoiceAttachment();
        break;
    }
  }
  saveInvoiceAttachment() {
    let invoiceDetailsId = this.invoiceDetails.invoiceDetailsId;
    let fd = new FormData();
    fd.append("invoiceDetailsId", invoiceDetailsId.toString());
    fd.append("fileToUpload", this.fileToUpload);
    fd.append("documentTitle", this.uploadedFileTitle);
    this.invoicesService.uploadInvoiceAttachment(fd).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.getInvoiceAttacment(invoiceDetailsId);
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
  saveComment(comment) {
    console.log(comment);
    if (comment.comment) {
      this.commentDetails.invoiceDetailsId = this.invoiceDetailsId;
      this.invoicesService.saveInvoiceComment(comment).subscribe((res) => {
        if (res.statusCode == 200) {
          this.getInvoiceComments(comment.invoiceDetailsId);
          this.commentDetails = new InvoiceComment();
        }
      });
    }
  }
  savePaymentAttachment(form: NgForm) {
    if (this.payment.paymentDetailsId) {
      this.uploadPaymentFile(this.payment.paymentDetailsId);
    } else {
      this.savePayment(form)
        .then((res: any) => {
          this.payment.paymentDetailsId = res.responsePayload;
          this.uploadPaymentFile(res.responsePayload);
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
  editInvoiceComment(rowData) {
    this.commentDetails = rowData;
  }
  deleteInvoiceComment(rowData) {
    this.deleteRowData = rowData;
    this.confirmType = "deleteComment";
    this.hiddenScroll();
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
  getSubtotal(obj) {
    let sum = 0;
    if (obj) {
      obj.forEach((element) => {
        sum += +element.amount;
      });
    }
    return sum;
  }
  getTax(obj) {
    let tax = 0;
    let amount = 0;
    if (obj) {
      obj.forEach((element) => {
        amount = element.rate * element.quantity;
        if (+element.taxType == 2) {
          tax += (amount * element.tax) / 100;
        } else if (+element.taxType == 1) {
          tax += element.tax;
        }
      });
    }
    return tax;
  }
  getDiscount(obj) {
    let discount = 0;
    let amount = 0;
    if (obj) {
      obj.forEach((element) => {
        amount = element.rate * element.quantity;
        if (+element.discountType == 2) {
          discount += (amount * element.discount) / 100;
        } else if (+element.discountType == 1) {
          discount += element.discount;
        }
      });
    }
    return discount;
  }
  getTotal(obj) {
    let total = 0;
    let tax = 0;
    let discount = 0;
    let amount = 0;
    obj.forEach((element) => {
      console.log(element);
      amount = element.rate * element.quantity;
      if (element.taxAmount) {
        tax += element.taxAmount;
      } else {
        if (+element.taxType == 2) {
          tax += (amount * element.tax) / 100;
        } else if (+element.taxType == 1) {
          tax += element.tax;
        }
      }
      if (element.discountAmount) {
        discount += element.discountAmount;
      } else {
        if (+element.discountType == 2) {
          discount += (amount * element.discount) / 100;
        } else if (+element.discountType == 1) {
          discount += element.discount;
        }
      }
      total += element.amount;
    });
    return total;
  }
  closeModal(form?: NgForm) {
    this.uploadFileInfo = "none";
    if (form) {
      form.reset();
    }
    this.fileToUpload = undefined;
    this.myInputVariable.nativeElement.value = "";
    this.displayScroll();
  }
  closePaymentsModal(form?: NgForm) {
    this.addPaymentsModel = "none";
    this.uploadFileInfo = "none";
    if (form) {
      form.reset();
    }
    this.uploadedFileTitle = null;
    this.myInputVariable.nativeElement.value = "";
    this.displayScroll();
  }
  downloadInvoicePDF(invoiceDetailsId) {
    this.invoicesService
      .downloadInvoicePDF(invoiceDetailsId)
      .subscribe((resp: HttpResponse<Blob>) => {
        const blob = new Blob([resp.body], { type: resp.body.type });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let imageType = resp.body.type.substring(
          resp.body.type.lastIndexOf("/") + 1
        );
        link.download = `${this.invoiceDetails?.invoiceNumber}.${imageType}`;
        link.click();
        link.remove();
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: "File downloaded",
        });
      });
  }
  downloadInvoiceAttachment(rowData) {
    this.invoicesService
      .downloadInvoiceAttachment(rowData.invoiceAttachmentDetailsId)
      .subscribe((resp: HttpResponse<Blob>) => {
        const blob = new Blob([resp.body], { type: resp.body.type });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let imageType = resp.body.type.substring(
          resp.body.type.lastIndexOf("/") + 1
        );
        link.download = `Invoice Attachment.${imageType}`;
        link.click();
        link.remove();
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: "File downloaded",
        });
      });
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
export class InvoiceComment {
  "invoiceCommentDetailsId": number;
  "comment": string;
  "commentType": string = "1";
  "employeeDetailsId": number;
  "employeeName": string;
  "invoiceDetailsId": number;
  "status": string;
  "commentDateTime": string;
}
