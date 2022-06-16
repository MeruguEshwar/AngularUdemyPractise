import { HttpResponse } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@app/core/service/auth.service";
import { InvoiceStatus } from "@app/shared/enums/invoiceStatus.enum";
import { SharedService } from "@app/shared/shared.service";
import { InvoicesService } from "../invoices.service";

@Component({
  selector: "app-ap-invoices",
  templateUrl: "./ap-invoices.component.html",
  styleUrls: ["./ap-invoices.component.css"],
})
export class ApInvoicesComponent implements OnInit {
  loading: boolean = false;
  toDate: any;
  fromDate: any;
  payment: Payment;
  selectedInvoice: any;
  organizationDetailsId: number;
  clientOptions: any;
  public model: string = "none";
  public statusViewModel: string = "none";
  modelType: string;
  rowData: any;
  comments: string;
  get InvoiceStatus() {
    return InvoiceStatus;
  }
  cols = [
    { field: "invoiceNumber", header: "#Invoice" },
    { field: "companyName", header: "Customer" },
    { field: "invoiceDate", header: "Recieved Date" },
    { field: "invoiceDueDate", header: "Due Date" },
    { field: "amount", header: "Total Amount" },
    { field: "amountPaid", header: "Amount Sent" },
    { field: "balanceAmount", header: "Balance" },
    { field: "paymentStatus", header: "Payment Status" },
    { field: "status", header: "Status" },
  ];
  invoiceList: any[];
  paymentList: any[];
  Paymentcols = [
    { field: "dateReceived", header: "Date Sent " },
    { field: "amount", header: "Amount Sent" },
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
  organizationCurrency: string;
  invoicesToogleType: number = 0;
  selectedInvoiceList: any;
  constructor(
    private invoicesService: InvoicesService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.authService.orgnizationCurrency) {
      this.organizationCurrency = this.authService.orgnizationCurrency;
    }
    this.payment = new Payment();
    this.organizationDetailsId =
      this.authService.currentUser.organizationDetailsId;
    this.getCompanyList(this.organizationDetailsId);
    this.getAllInvoices(Object);
    this.sharedService.openToggleMenu("invoicesToggleExternalContent");
  }
  handleChange(event) {
    let index = event.index;
    this.selectedInvoiceList = undefined;
    this.getInvoiceDetails(index, Object);
  }

  getAllInvoices(obj) {
    this.invoicesService.getAllAPInvoices(obj).subscribe((res) => {
      if (res.statusCode == 200) {
        this.invoiceList = res.responsePayload;
      } else {
        this.invoiceList = [];
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
    this.getAllInvoices(params);
  }
  addPayments(invoice) {
    this.selectedInvoice = invoice;
    this.getPayments(invoice);
  }

  getPayments(invoice) {
    let obj = {
      invoiceNumber: invoice.invoiceNumber,
    };
    this.invoicesService.getAPPayments(obj).subscribe((res) => {
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
    this.invoicesService.addAPPayments(this.payment).subscribe((res) => {
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
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
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
      case "payment":
        this.deletePaymentEntry(rowData);
        break;
      case "delete invoice":
        this.deleteInvoice(rowData);
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
      default:
        break;
    }
    this.closeUploadmodal();
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
  getInvoiceDetails(index, object) {
    if (index == 0) {
      this.invoicesToogleType = 0;
      this.getAllInvoices(object);
      return;
    }
    if (index == 1) {
      this.invoicesToogleType = 1;
      this.getDeletedAPInvoicesDetails();
      return;
    }
  }
  getDeletedAPInvoicesDetails() {
    this.invoicesService.getDeletedAPInvoicesDetails().subscribe((res) => {
      if (res.statusCode == 200) {
        this.invoiceList = res.responsePayload;
      } else {
        if (this.invoiceList) this.invoiceList = [];
      }
      this.selectedInvoiceList = undefined;
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
  delete(rowData, modelType) {
    this.model = "block";
    this.rowData = rowData;
    this.modelType = modelType;
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
  onPaymentOption(event) {
    this.payment.paymentType = event.value;
  }
  createInvoice() {
    this.router.navigate(["./ap_invoice"], { relativeTo: this.route });
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
