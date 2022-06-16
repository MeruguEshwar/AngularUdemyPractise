import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  ViewChild,
  ChangeDetectorRef,
  ElementRef,
} from "@angular/core";
import { Paystubs } from "@app/shared/models/paystubs.model";
import { AuthService } from "@app/core/service/auth.service";
import { PaystubsServices } from "../paystubs.services";
import { SharedService } from "@app/shared/shared.service";
import { Employee } from "@app/shared/models/employee.model";
import { FormControl, NgForm } from "@angular/forms";
import { HttpResponse } from "@angular/common/http";
import { empty } from "rxjs";
import { filter, isEmpty } from "rxjs/operators";
declare let $: any;
@Component({
  selector: "app-add-paystub",
  templateUrl: "./add-paystub.component.html",
  styleUrls: ["./add-paystub.component.css"],
  providers: [Paystubs],
})
export class AddPaystubComponent implements OnInit {
  @ViewChild("minimumDate") minimumDate: ElementRef<HTMLInputElement>;
  @ViewChild(NgForm) f: NgForm;
  @ViewChild("fileInput")
  myInputVariable: ElementRef;
  public addPaystubDisplay: string = "none";
  public confirmModel: string = "none";
  @Output() onClose = new EventEmitter<any>();
  @Output() onReload = new EventEmitter<any>();
  @Input() paystubType: string;
  @Input() isEmp: boolean;
  @Input() rowObj: Paystubs;
  fileToUpload: any;
  @Input() empName: any;
  lstEmployes: any[];
  clientErrorMsg: any;
  grossEarnings: boolean;
  others: boolean;
  withHoldings: boolean;
  deductions: boolean;
  selectedYear: any;
  filteredCategory: any[];
  withholdingsNames: any = [];
  grossNames: any = [];
  otherNames: any = [];
  deductionsNames: any = [];
  currencyIcon: string = "$";
  newPayType: string = "";
  organizationCurrency: string;
  deductionType = [
    { label: "Hourly", value: "1" },
    { label: "Amount", value: "2" },
  ];
  otherType = [
    { label: "-", value: "0" },
    { label: "+", value: "1" },
  ];
  payTypes = [
    {
      label: "Direct Deposit",
      value: "Direct Deposit",
    },
    {
      label: "Cheque",
      value: "Cheque",
    },
    {
      label: "Cash",
      value: "Cash",
    },
    {
      label: "Other",
      value: "Other",
    },
  ];
  public paystubs: Paystubs;
  userName: any;
  grossEarningsList: any;
  filter: any;
  grossarray: any;
  grossEarningType: string;
  constructor(
    private authService: AuthService,
    private paystubService: PaystubsServices,
    public sharedService: SharedService,
    public ref: ChangeDetectorRef
  ) {
    this.paystubs = new Paystubs();
  }

  async ngOnInit(): Promise<void> {
    if (this.authService.orgnizationCurrency) {
      this.organizationCurrency = this.authService.orgnizationCurrency;
    }

    if (this.paystubType == "Add") {
      this.paystubs.employeeDetailsId = this.empName.employeeDetailsId;
    }
    this.getEmployees();
    if (this.paystubType == "Edit") {
      this.paystubs = this.rowObj;
      if (
        this.rowObj.payType != "Direct Deposit" &&
        this.rowObj.payType != "Cheque" &&
        this.rowObj.payType != "Cash"
      ) {
        this.paystubs.payType = "Other";
      }
      if (this.rowObj.checkDate) {
        let date: string[] = this.rowObj.checkDate.split("-");
        this.paystubs.checkDateFormat = new Date(
          parseInt(date[2]),
          parseInt(date[0]) - 1,
          parseInt(date[1])
        );
      }
      await this.getPaystubDetails(this.rowObj.paystubDetailsId);
    }
    this.paystubs.organizationDetailsId =
      this.authService.currentUser.organizationDetailsId;
    this.showDialogToAdd();
    await this.getHoldingNames(this.paystubs.organizationDetailsId);
    await this.getGrossEarningNames(this.paystubs.organizationDetailsId);
    await this.getDeductionNames(this.paystubs.organizationDetailsId);
    await this.getOtherNames(this.paystubs.organizationDetailsId);
  }
  setUsername(userId) {
    if (this.lstEmployes) {
      this.lstEmployes.forEach((element) => {
        if (element.value == userId) {
          this.userName = element.label;
          this.empName = {
            fullName: element.label,
            employeeDetailsId: element.employeeDetailsId,
          };
        }
      });
    }
  }
  async getPaystubDetails(paystubDetailsId) {
    return new Promise<void>((resolve, reject) => {
      this.paystubService
        .getPaystubDetails(paystubDetailsId)
        .subscribe((res) => {
          //this.payPeriod = [];
          if (res.statusCode == 200) {
            // this.paystubs.payType = "Other";
            this.newPayType = res.responsePayload.payType;
            if (
              this.newPayType != "Direct Deposit" &&
              this.newPayType != "Cheque" &&
              this.newPayType != "Cash"
            ) {
              this.paystubs = res.responsePayload;
              this.paystubs.payType = "Other";
            } else {
              this.paystubs = res.responsePayload;
            }

            this.paystubs.organizationDetailsId = this.authService.currentUser.organizationDetailsId;
            this.paystubs.employeeDetailsId = res.responsePayload.employeeDetailsId;
            this.paystubs.grossEarningsList = res.responsePayload.grossEarningsList
              ? res.responsePayload.grossEarningsList
              : [];
            this.paystubs.withholdingsList = res.responsePayload
              .withholdingsList
              ? res.responsePayload.withholdingsList
              : [];
            this.paystubs.deductionsList = res.responsePayload.deductionsList
              ? res.responsePayload.deductionsList
              : [];
            this.paystubs.othersList = res.responsePayload.othersList
              ? res.responsePayload.othersList
              : [];
            this.setUsername(this.paystubs.employeeDetailsId);

            var _netPay = res.responsePayload.netAmount;
            var _totalGross = res.responsePayload.grossEarnings;
            var _totalDeductions = res.responsePayload.deductions;
            var _totalHoldings = res.responsePayload.withHoldings;

            if (_totalGross) {
              $(".paysummary-bar1").css(
                "width",
                _totalGross ? (_totalGross / _netPay) * 100 + "%" : "0%"
              );
            }
            if (_totalHoldings) {
              $(".paysummary-bar3").css(
                "width",
                _totalHoldings ? (_totalHoldings / _netPay) * 100 + "%" : "0%"
              );
            }
            if (_totalDeductions) {
              $(".paysummary-bar2").css(
                "width",
                _totalDeductions
                  ? (_totalDeductions / _netPay) * 100 + "%"
                  : "0%"
              );
            }
            this.ref.detectChanges();
            resolve();
          }
        });
    });
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
        this.setUsername(this.paystubs.employeeDetailsId);
      }
    });
  }

  async getHoldingNames(employeeDetailsId) {
    return new Promise<void>((resolve, reject) => {
      this.paystubService
        .getHoldingNames(employeeDetailsId)
        .subscribe((res) => {
          this.withholdingsNames = [];
          if (res.statusCode == 200) {
            res.responsePayload.forEach((element, index) => {
              this.withholdingsNames.push(element);
            });
            resolve();
          }
        });
    });
  }
  async getOtherNames(employeeDetailsId) {
    return new Promise<void>((resolve, reject) => {
      this.paystubService.getOtherNames(employeeDetailsId).subscribe((res) => {
        this.otherNames = [];
        if (res.statusCode == 200) {
          res.responsePayload.forEach((element, index) => {
            this.otherNames.push(element);
          });
          resolve();
        }
      });
    });
  }
  async getGrossEarningNames(employeeDetailsId) {
    return new Promise<void>((resolve, reject) => {
      this.paystubService
        .getGrossEarningNames(employeeDetailsId)
        .subscribe((res) => {
          this.grossNames = [];
          if (res.statusCode == 200) {
            res.responsePayload.forEach((element, index) => {
              this.grossNames.push(element);
            });
            resolve();
          }
        });
    });
  }
  async getDeductionNames(employeeDetailsId) {
    return new Promise<void>((resolve, reject) => {
      this.paystubService
        .getDeductionNames(employeeDetailsId)
        .subscribe((res) => {
          this.deductionsNames = [];
          if (res.statusCode == 200) {
            res.responsePayload.forEach((element, index) => {
              this.deductionsNames.push(element);
            });
            resolve();
          }
        });
    });
  }
  filterCategory(event, index, type) {
    let filtered: any[] = [];
    let query = event.query;
    if (type == "gross") {
      for (let i = 0; i < this.grossNames.length; i++) {
        let element = this.grossNames[i];
        if (element.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(element);
        }
      }
      this.filteredCategory = filtered;
    } else if (type == "holdings") {
      for (let i = 0; i < this.withholdingsNames.length; i++) {
        let element = this.withholdingsNames[i];
        if (element.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(element);
        }
      }
      this.filteredCategory = filtered;
    } else if (type == "deductions") {
      for (let i = 0; i < this.deductionsNames.length; i++) {
        let element = this.deductionsNames[i];
        if (element.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(element);
        }
      }
      this.filteredCategory = filtered;
    } else if (type == "others") {
      for (let i = 0; i < this.otherNames.length; i++) {
        let element = this.otherNames[i];
        if (element.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(element);
        }
      }
      this.filteredCategory = filtered;
    }
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
  save() {
    if (this.paystubs.checkDateFormat) {
      let day = this.paystubs.checkDateFormat.getDate();
      let month = this.paystubs.checkDateFormat.getMonth() + 1; // add 1 because months are indexed from 0
      let year = this.paystubs.checkDateFormat.getFullYear();
      this.paystubs.checkDate = month + "-" + day + "-" + year;
    }

    let imageType = this.fileToUpload
      ? this.fileToUpload.value.type.split("/")[1].toLowerCase()
      : "";
    this.paystubs.payType =
      this.paystubs.payType == "Other"
        ? this.newPayType
        : this.paystubs.payType;
    if (!this.fileToUpload) {
      this.addPaystub();
    } else if (
      this.fileToUpload &&
      (imageType == "pdf" ||
        imageType == "jpeg" ||
        imageType == "jpg" ||
        imageType == "gif" ||
        imageType == "png")
    ) {
      this.addPaystub();
    } else {
      this.fileToUpload = undefined;
      this.sharedService.add({
        severity: "error",
        summary: "Error!",
        detail: "Invalid File",
      });
    }
  }
  addPaystub() {
    this.paystubService.addPaystub(this.paystubs).subscribe((res) => {
      if (res && res.statusCode == 200) {
        if (
          this.fileToUpload &&
          this.fileToUpload.value &&
          res.responsePayload
        ) {
          let fd = new FormData();
          fd.append("paystubDetailsId", res.responsePayload);
          if (this.fileToUpload) {
            fd.append("paystubToUpload", this.fileToUpload.value);
          }
          this.paystubService.uploadPaystubs(fd).subscribe((res) => {
            if (res.statusCode == 200) {
              this.sharedService.add({
                severity: "success",
                summary: "Success",
                detail: res.message,
              });
              this.closeAddmodal();
              this.onReload.emit();
            } else {
              this.sharedService.add({
                severity: "error",
                summary: "Error!",
                detail: res.message,
              });
            }
          });
        } else {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.closeAddmodal();
          this.onReload.emit();
        }
      } else {
        this.sharedService.add({
          severity: "error",
          summary: "Error!",
          detail: res.message,
        });
      }
    });
  }
  getAmount(row, index) {
    this.paystubs.grossEarningsList[index]["hours"] = 0;
    this.paystubs.grossEarningsList[index]["rate"] = 0;
    this.paystubs.grossEarningsList[index]["amount"] = 0;
    this.paystubs.grossEarningsList[index]["grossEarningType"] =
      row.grossEarningType;
  }
  getOtherAmount(row, index) {
    this.paystubs.othersList[index]["otherType"] = row.otherType;
  }
  addGross() {
      this.paystubs.grossEarningsList.push({
      description: "",
      hours: 0,
      rate: 0,
      amount: 0.0,
      grossEarningType: "1",
      status: 1,
      paystubGrossEarningDetailsId: "",
    });
  }
  addHoldings() {
    this.paystubs.withholdingsList.push({
      description: "",
      withholdingAmount: 0,
      status: 1,
      paystubWithholdingDetailsId: "",
    });
  }
  addDeduction() {
    this.paystubs.deductionsList.push({
      description: "",
      deductionAmount: 0,
      status: 1,
      paystubDeductionDetailsId: "",
    });
  }
  addOthers() {
    this.paystubs.othersList.push({
      description: "",
      amount: 0,
      status: 1,
      otherType: "0",
    });
  }


  deleteGross(row, index, type) {
    this.paystubs.grossEarningsList = this.paystubs.grossEarningsList.filter(function(each){
        return each.description != '';
    })
      this.paystubs.grossEarningsList[index]["status"] = 0;
      this.onInputKeyUp(row, index, type);

  }

  deleteHoldings(row, index, type) {
    this.paystubs.withholdingsList[index]["status"] = 0;
    this.onInputKeyUp(row, index, type);
  }
  deleteDeduction(row, index, type) {
    this.paystubs.deductionsList[index]["status"] = 0;
    this.onInputKeyUp(row, index, type);
  }
  deleteOthers(row, index, type) {
    this.paystubs.othersList[index]["status"] = 0;
    this.onInputKeyUp(row, index, type);
  }
  onInputKeyUp(row, index, type) {
    if (type == "gross") {
      if (row.grossEarningType == "1") {
        var amount = row && row.hours && row.rate ? row.hours * row.rate : 0;
        this.paystubs.grossEarningsList[index]["hours"] = row.hours;
        this.paystubs.grossEarningsList[index]["rate"] = row.rate;
        this.paystubs.grossEarningsList[index]["amount"] = amount;
      } else {
        this.paystubs.grossEarningsList[index]["amount"] = row.amount;
      }
    }
    let netPay = 0;
    let totalGross = 0;
    let totalHoldings = 0;
    let totalDeductions = 0;
    let hours = 0;
    this.paystubs.grossEarningsList.forEach((element) => {
      if (element.status) {
        netPay += element.amount;
        totalGross += element.amount;
        hours += element.hours;
      }
    });
    this.paystubs.withholdingsList.forEach((element) => {
      if (element.status) {
        netPay -= element.withholdingAmount;
        totalHoldings += element.withholdingAmount;
      }
    });
    this.paystubs.deductionsList.forEach((element) => {
      if (element.status) {
        netPay -= element.deductionAmount;
        totalDeductions += element.deductionAmount;
      }
    });
    this.paystubs.othersList.forEach((element) => {
      if (element.status) {
        if (element.otherType == "1") {
          netPay += element.amount;
        } else {
          netPay -= element.amount;
        }
      }
    });
    this.paystubs.totalHours = hours;
    this.paystubs.netAmount = netPay;
    this.paystubs.grossEarnings = totalGross;
    this.paystubs.withHoldings = totalHoldings;
    this.paystubs.deductions = totalDeductions;
    if (totalGross) {
      $(".paysummary-bar1").css(
        "width",
        totalGross ? (totalGross / netPay) * 100 + "%" : "0%"
      );
    }
    if (totalHoldings) {
      $(".paysummary-bar3").css(
        "width",
        totalHoldings ? (totalHoldings / netPay) * 100 + "%" : "0%"
      );
    }
    if (totalDeductions) {
      $(".paysummary-bar2").css(
        "width",
        totalDeductions ? (totalDeductions / netPay) * 100 + "%" : "0%"
      );
    }
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
  selectedDeletedFile: any;
  deleteDownloadFile(rowData) {
    this.confirmModel = "block";
    this.selectedDeletedFile = rowData;
  }
  closeConfirmModel() {
    this.confirmModel = "none";
    this.selectedDeletedFile = undefined;
  }
  confirm() {
    this.paystubService
      .deletePaystubAttachment(this.selectedDeletedFile.paystubDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.paystubs.employeeDocumentUploadDetailsId = undefined;
          this.closeConfirmModel();
        }
      });
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
}
