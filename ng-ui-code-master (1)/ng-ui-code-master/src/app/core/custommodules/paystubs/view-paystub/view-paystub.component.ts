import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { PaystubsServices } from "../paystubs.services";
import { AuthService } from "@app/core/service/auth.service";
import { HttpResponse } from "@angular/common/http";
import { SharedService } from "@app/shared/shared.service";
import { Paystubs } from "@app/shared/models/paystubs.model";
import { Input } from "@angular/core";
import { Employee } from "@app/shared/models/employee.model";
declare let $: any;
@Component({
  selector: "app-view-paystub",
  templateUrl: "./view-paystub.component.html",
  styleUrls: ["./view-paystub.component.css"],
})
export class ViewPaystubComponent implements OnInit {
  lstPaystubs;
  yearLst: any;
  cols: any[];
  selectedYear;
  @Input() paystubType: string;
  @Input() paystub: Paystubs;
  loading: boolean = false;
  userName: string;
  userId: any;
  grossList: any = [
    {
      description: "",
      quantity: 0,
      rate: 0,
      amount: 0,
      status: 1,
      paystubGrossEarningDetailsId: "",
    },
  ];
  withholdingsList: any = [
    {
      description: "",
      withholdingAmount: 0,
      status: 1,
      paystubWithholdingDetailsId: "",
    },
  ];
  deductionsList: any = [
    {
      description: "",
      deductionAmount: 0,
      status: 1,
      paystubDeductionDetailsId: "",
    },
  ];
  othersList: any[] = [
    { description: "", amount: 0.0, status: 1, otherType: "0" },
  ];
  netPay: number = 0.0;
  hours: number = 0.0;
  totalGross: number = 0;
  totalHoldings: number = 0;
  totalDeductions: number = 0;
  grossEarnings: boolean;
  withHoldings: boolean;
  deductions: boolean;
  addPaystubDisplay: string;
  clientErrorMsg: any;
  @Output() onClose = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  lstEmployes: any[];
  organizationCurrency: string;
  viewType: Boolean;

  constructor(
    private paystubService: PaystubsServices,
    private authService: AuthService,
    private sharedService: SharedService
  ) {}

  async ngOnInit() {
    this.viewType = this.sharedService.getUserViewType();
    if (this.authService.orgnizationCurrency) {
      this.organizationCurrency = this.authService.orgnizationCurrency;
    }
    this.cols = [
      // { field: 'departmentDetailsId', header: 'ID' },
      { field: "checkDate", header: "Check Date" },
      { field: "payType", header: "Pay Type" },
      { field: "checkNumber", header: "Check / VCR" },
      { field: "netAmount", header: "Net Amount" },
    ];
    this.userId = this.paystub.employeeDetailsId;
    this.getPaystub(this.userId);
    this.showDialogToAdd();
    this.getEmployees();
  }
  setUsername(userId) {
    if (this.lstEmployes) {
      this.lstEmployes.forEach((element) => {
        if (element.value == userId) {
          this.userName = element.label;
        }
      });
    }
  }
  getEmployees(status: number = 1) {
    this.paystubService.getAllEmployees(status).subscribe((res) => {
      this.lstEmployes = [];
      if (res.statusCode == 200) {
        for (let index = 0; index < res.responsePayload.length; index++) {
          const element: Employee = res.responsePayload[index];
          this.lstEmployes.push({
            label: element.fullName,
            value: element.employeeDetailsId,
          });
        }
        this.setUsername(this.paystub.employeeDetailsId);
      }
    });
  }
  getPaystub(year) {
    this.paystubService
      .getPaystubDetails(this.paystub.paystubDetailsId)
      .subscribe((res) => {
        if (res && res.statusCode == 200) {
          this.paystub = res.responsePayload;
          this.paystub.organizationDetailsId =
            this.authService.currentUser.organizationDetailsId;
          this.selectedYear = res.responsePayload.payPeriod;
          this.netPay = res.responsePayload.netAmount;
          this.hours = res.responsePayload.totalHours;
          this.grossList = res.responsePayload.grossEarningsList;
          this.withholdingsList = res.responsePayload.withholdingsList;
          this.deductionsList = res.responsePayload.deductionsList;
          this.othersList = res.responsePayload.othersList;
          this.totalGross = res.responsePayload.grossEarnings;
          this.totalDeductions = res.responsePayload.deductions;
          this.totalHoldings = res.responsePayload.withHoldings;
        } else {
          this.lstPaystubs = [];
        }
      });
  }
  showDialogToAdd() {
    this.addPaystubDisplay = "block";
    this.hiddenScroll();
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
  showEdit(data) {
    this.onEdit.emit(data);
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
  closeAddmodal() {
    this.addPaystubDisplay = "none";
    this.displayScroll();
    this.onClose.emit({ type: "cancel" });
  }
  downloadFile(data) {
    this.sharedService.add({
      severity: "info",
      summary: "Info!",
      detail: "File is preparing to download please wait",
    });
    this.paystubService
      .downloadPaystub(data.paystubDetailsId)
      .subscribe((resp: HttpResponse<Blob>) => {
        const blob = new Blob([resp.body], { type: resp.body.type });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let imageType = resp.body.type.substring(
          resp.body.type.lastIndexOf("/") + 1
        );
        link.download = `paystub_${data.paystubDetailsId}.${imageType}`;
        link.click();
        link.remove();
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: "File downloaded",
        });
      });
  }
  downloadPDFFile(data) {
    this.sharedService.add({
      severity: "info",
      summary: "Info!",
      detail: "File is preparing to download please wait",
    });
    this.paystubService
      .downloadPaystubPDF(data.paystubDetailsId)
      .subscribe((resp: HttpResponse<Blob>) => {
        const blob = new Blob([resp.body], { type: resp.body.type });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let imageType = resp.body.type.substring(
          resp.body.type.lastIndexOf("/") + 1
        );
        link.download = `paystub_${data.paystubDetailsId}.${imageType}`;
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
