import { HttpResponse } from "@angular/common/http";
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@app/core/service/auth.service";
import { InvoiceStatus } from "@app/shared/enums/invoiceStatus.enum";
import { InvoicesDetails } from "@app/shared/models/invoicePaymentDetailsmodel.";
import { SharedService } from "@app/shared/shared.service";
import { InvoicesService } from "./invoices.service";

@Component({
  selector: "app-invoices",
  templateUrl: "./invoices.component.html",
  styleUrls: ["./invoices.component.css"],
})
export class InvoicesComponent implements OnInit {
  @ViewChild("minimumDate") minimumDate: ElementRef<HTMLInputElement>;
  loading: boolean = false;
  toDate: any;
  fromDate: any;
  payment: Payment;
  selectedInvoice: any;
  organizationDetailsId: number;
  clientOptions: any;
  public model: string = "none";
  public statusViewModel: string = "none";
  @Input() isEmp: boolean;
  modelType: string;
  rowData: any;
  comments: string;
  invoicesToogleType: number = 0;
  statusUpdateType: string;
  confirmType: string;
  statusComments: string;
  invoiceDetails: InvoicesDetails;
  state: any;
  invoiceDetailsId: number;
  get InvoiceStatus() {
    return InvoiceStatus;
  }
  cols = [
    { field: "invoiceNumber", header: "#Invoice" },
    { field: "companyName", header: "Customer" },
    { field: "invoiceDate", header: "Created Date" },
    { field: "invoiceDueDate", header: "Due Date" },
    { field: "amount", header: "Total Amount" },
    // { field: 'amountPaid', header: 'Amount Received' },
    { field: "balanceAmount", header: "Balance" },
    { field: "aging", header: "Aging" },
    { field: "paymentStatus", header: "Payment Status" },
    { field: "status", header: "Status" },
  ];
  invoiceList: any;
  selectedInvoiceList: any;
  paymentList: any;
  Paymentcols = [
    { field: "dateReceived", header: "Date Received " },
    { field: "amount", header: "Amount Received" },
    { field: "employeeName", header: "Submitted By" },
    { field: "description", header: "Description" },
  ];
  statusOptions = [
    { label: "Select Status", value: null },
    { label: "Over Paid", value: "Over Paid" },
    { label: "Paid", value: "Paid" },
    { label: "Partially Paid", value: "Partially Paid" },
    { label: "Due Date Passed", value: "Due Date Passed" },
    { label: "Waiting", value: "Waiting" },
  ];
  paymentOptions: any = [
    { label: "Payment Type", value: null },
    { label: "Cash", value: "Cash" },
    { label: "Cheque", value: "Cheque" },
    { label: "Direct Deposit", value: "Direct Deposit" },
    { label: "Wire Transfer", value: "Wire Trasfer" },
    { label: "Other", value: "Other" },
  ];
  selectedPaymentOptions: any;
  selectedClientOptions: any;
  selectedStatusOption: any;
  constructor(
    private invoicesService: InvoicesService,
    private activatedRoute: ActivatedRoute,
    public sharedService: SharedService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  organizationCurrency: string;
  ngOnInit(): void {
    if (this.authService.orgnizationCurrency) {
      this.organizationCurrency = this.authService.orgnizationCurrency;
    }

    this.invoiceDetails = new InvoicesDetails();
    this.payment = new Payment();
    this.organizationDetailsId =
      this.authService.currentUser.organizationDetailsId;
    this.getCompanyList(this.organizationDetailsId);
    this.getInvoiceDetails(this.invoicesToogleType, Object);
    this.sharedService.openToggleMenu("invoicesToggleExternalContent");
    this.state = window.history.state;
    if (this.state && this.state.invoiceDetailsId) {
      this.invoiceDetailsId = this.state.invoiceDetailsId;
    }
  }

  getAllInvoices(obj) {
    this.invoicesService.getAllInvoices(obj).subscribe((res) => {
      if (res.statusCode == 200) {
        this.invoiceList = res.responsePayload;
      } else {
        if (this.invoiceList) this.invoiceList.invoices = [];
      }
      this.selectedInvoiceList = undefined;
    });
  }
  getARInvoicesAprovalDetails() {
    this.invoicesService.getARInvoicesAprovalDetails().subscribe((res) => {
      if (res.statusCode == 200) {
        this.invoiceList = res.responsePayload;
      } else {
        if (this.invoiceList) this.invoiceList.invoices = [];
      }
      this.selectedInvoiceList = undefined;
    });
  }
  getARInvoicesApprovedDeniedDetails() {
    this.invoicesService
      .getARInvoicesApprovedDeniedDetails()
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.invoiceList = res.responsePayload;
        } else {
          if (this.invoiceList) this.invoiceList.invoices = [];
        }
        this.selectedInvoiceList = undefined;
      });
  }
  getDeletedARInvoicesDetails() {
    this.invoicesService.getDeletedARInvoicesDetails().subscribe((res) => {
      if (res.statusCode == 200) {
        this.invoiceList = res.responsePayload;
      } else {
        if (this.invoiceList) this.invoiceList.invoices = [];
      }
      this.selectedInvoiceList = undefined;
    });
  }
  getCompanyList(organizationDetailsId) {
    this.invoicesService
      .getCompanyList(organizationDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.clientOptions = res.responsePayload;
          this.clientOptions.splice(0, 0, {
            companyName: "Customer Name",
            value: null,
          });
        }
      });
  }
  search(fromDate, toDate, selectedClientOptions, selectedStatusOption) {
    let companyDetailsId;
    if (selectedClientOptions) {
      companyDetailsId = selectedClientOptions.companyDetailsId;
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
    if (selectedStatusOption) {
      params.paymentStatus = selectedStatusOption.value.toUpperCase();
    }
    if (companyDetailsId) {
      params.companyDetailsId = companyDetailsId;
    }
    this.getInvoiceDetails(this.invoicesToogleType, params);
  }
  addPayments(invoice) {
    this.selectedInvoice = invoice;
    this.getPayments(invoice);
  }

  getPayments(invoice) {
    let obj = {
      invoiceNumber: invoice.invoiceNumber,
    };
    this.invoicesService.getPayments(obj).subscribe((res) => {
      if ((res.statusCode = 200)) {
        this.paymentList = res.responsePayload;
      } else {
        this.paymentList = [];
      }
    });
  }
  savePayments(selectedInvoice, form: NgForm) {
    this.payment.invoiceNumber = selectedInvoice.invoiceNumber;
    this.payment.companyDetailsId = selectedInvoice.companyDetailsId;
    this.invoicesService.addPayments(this.payment).subscribe((res) => {
      if (res.statusCode == 200) {
        this.getPayments(selectedInvoice);
        this.cdr.detectChanges();
        this.payment = new Payment();
        form.form.reset();
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
  editPaymentEntry(rowData) {
    this.payment = rowData;
    let selectedPaymentOptions = this.paymentOptions.filter((res) => {
      if (res.value == rowData.paymentType) {
        return res;
      }
    });
    this.selectedPaymentOptions = selectedPaymentOptions[0];
  }
  deletePaymentEntry(rowData) {
    this.invoicesService
      .deleteInvoicePayments(rowData.paymentDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getPayments(rowData);
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.closeUploadmodal();
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }
  deleteInvoice(rowData) {
    this.invoicesService
      .deleteInvoice(rowData.invoiceDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          let companyDetailsId;
          if (this.selectedClientOptions) {
            companyDetailsId = this.selectedClientOptions.organizationDetailsId;
          }
          let obj = {
            startDate: this.fromDate,
            endDate: this.toDate,
            companyDetailsId: companyDetailsId,
          };
          if (obj.startDate && obj.endDate) {
            this.getAllInvoices(obj);
          } else if (obj.companyDetailsId) {
            this.getAllInvoices(obj);
          } else {
            this.getAllInvoices(Object);
          }
          this.closeUploadmodal();
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }
  deletePermanantlyInvoice(rowData) {
    this.invoicesService
      .deletePermanantlyInvoice(rowData.invoiceDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getInvoiceDetails(this.invoicesToogleType, Object);
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
  undoInvoice(rowData) {
    this.invoicesService
      .undoInvoice(rowData.invoiceDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getInvoiceDetails(this.invoicesToogleType, Object);
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
  undoInvoices() {
    let invoiceDetailsIds: any[] = [];
    this.selectedInvoiceList.forEach((element) => {
      invoiceDetailsIds.push(element.invoiceDetailsId);
    });
    this.invoicesService.undoInvoices(invoiceDetailsIds).subscribe((res) => {
      if (res.statusCode == 200) {
        this.getInvoiceDetails(this.invoicesToogleType, Object);
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: res.message,
        });
      }
    });
  }
  viewStatusComment(comments) {
    this.statusViewModel = "block";
    this.comments = comments;
  }
  confirm(rowData, modelType) {
    switch (modelType) {
      case "delete payment":
        this.deletePaymentEntry(rowData);
        break;
      case "delete invoice":
        this.deleteInvoice(rowData);
        break;
      case "Send Notification":
        this.sendEmailnotification();
        break;
      case "Delete":
        this.deleteMultipleInvoices();
        break;
      case "Delete Permanantly":
        this.deletePermanantlyMultipleInvoices();
        break;
      case "delete permanantly":
        this.deletePermanantlyInvoice(rowData);
        break;
      case "undo invoice":
        this.undoInvoice(rowData);
        break;
      case "undo invoices":
        this.undoInvoices();
        break;
    }
    this.closeUploadmodal();
  }
  delete(rowData, modelType) {
    this.model = "block";
    this.rowData = rowData;
    this.modelType = modelType;
  }
  sendEmail(rowData, modelType) {
    this.model = "block";
    this.rowData = rowData;
    this.modelType = modelType;
  }
  handleChange(event) {
    let index = event.index;
    this.selectedInvoiceList = undefined;
    this.getInvoiceDetails(index, Object);
  }
  getInvoiceDetails(index, object) {
    if (index == 0) {
      this.invoicesToogleType = 0;
      this.getAllInvoices(object);
      return;
    }
    if (index == 1) {
      this.invoicesToogleType = 1;
      this.getARInvoicesAprovalDetails();
      return;
    }
    if (index == 2) {
      this.invoicesToogleType = 2;
      this.getARInvoicesApprovedDeniedDetails();
      return;
    }
    if (index == 3) {
      this.invoicesToogleType = 3;
      this.getDeletedARInvoicesDetails();
      return;
    }
  }
  statusUpdate(rowData, status, type) {
    this.statusUpdateType = status;
    this.rowData = rowData;
    this.confirmType = type;
  }
  closeUploadmodal() {
    this.model = "none";
    this.statusViewModel = "none";
    this.comments = null;
    this.rowData = undefined;
    this.modelType = undefined;
  }
  closePaymentsModal(form: NgForm) {
    form.form.reset();
    this.payment = new Payment();
    this.search(
      this.fromDate,
      this.toDate,
      this.selectedClientOptions,
      this.selectedStatusOption
    );
  }
  statusConfirm(f: NgForm) {
    let formData = new StatusUpdate();
    if (this.statusComments) {
      formData.invoiceDetailsId = this.rowData.invoiceDetailsId;
      formData.status = this.statusUpdateType;
      formData.notes = this.statusComments;
      this.invoicesService.invoiceStatusUpdate(formData).subscribe((res) => {
        if (res.statusCode == 200) {
          f.reset();
          this.getInvoiceDetails(this.invoicesToogleType, Object);
          this.statusComments = undefined;
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        }
      });
    } else {
      this.sharedService.add({
        severity: "error",
        summary: "Error",
        detail: "Please provide comments",
      });
    }
  }
  onPaymentOption(event) {
    this.payment.paymentType = event.value;
  }
  createInvoice() {
    this.router.navigate(["./invoice"], { relativeTo: this.route });
  }
  sendEmailnotification() {
    let invoiceDetailsIds: any[] = [];
    this.selectedInvoiceList.forEach((element) => {
      invoiceDetailsIds.push(element.invoiceDetailsId);
    });
    this.invoicesService
      .sendNotificationInvoices(invoiceDetailsIds)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getInvoiceDetails(this.invoicesToogleType, Object);
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        }
      });
  }
  deleteMultipleInvoices() {
    let invoiceDetailsIds: any[] = [];
    this.selectedInvoiceList.forEach((element) => {
      invoiceDetailsIds.push(element.invoiceDetailsId);
    });
    this.invoicesService
      .deleteMultipleInvoices(invoiceDetailsIds)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getInvoiceDetails(this.invoicesToogleType, Object);
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        }
      });
  }
  deletePermanantlyMultipleInvoices() {
    let invoiceDetailsIds: any[] = [];
    this.selectedInvoiceList.forEach((element) => {
      invoiceDetailsIds.push(element.invoiceDetailsId);
    });
    this.invoicesService
      .deletePermanantlyMultipleInvoices(invoiceDetailsIds)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getInvoiceDetails(this.invoicesToogleType, Object);
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        }
      });
  }
  downloadInvoicePDF(rowData) {
    this.invoicesService
      .downloadInvoicePDF(rowData.invoiceDetailsId)
      .subscribe((resp: HttpResponse<Blob>) => {
        const blob = new Blob([resp.body], { type: resp.body.type });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let imageType = resp.body.type.substring(
          resp.body.type.lastIndexOf("/") + 1
        );
        link.download = `${rowData.invoiceNumber}.${imageType}`;
        link.click();
        link.remove();
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: "File downloaded",
        });
      });
  }
}
export class Params {
  startDate: string;
  endDate: string;
  paymentStatus: string;
  companyDetailsId: number;
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

class StatusUpdate {
  invoiceDetailsId: number;
  status: string;
  notes: string;
}
