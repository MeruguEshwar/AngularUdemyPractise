import { Component, OnInit } from "@angular/core";
import { AuthService } from "@app/core/service/auth.service";
import { PayDeduction } from "@app/shared/models/paydeduction.model";
import { SharedService } from "@app/shared/shared.service";
import { UserActionServices } from "@app/shared/userAction.services";
import { promise } from "protractor";
import { PayHistoryService } from "../payhistory.services";

@Component({
  selector: "app-deductions",
  templateUrl: "./deductions.component.html",
  styleUrls: ["./deductions.component.css"],
})
export class DeductionsComponent implements OnInit {
  cols: any = [];
  deductionPayRateList: PayDeduction[] = [];
  selectedEmployee: any;
  selectedEmployeeAction: any;
  employeeList: any;
  deductionModel: string = "none";
  errorLabel: string;
  clientErrorMsg: any;
  deductionOptionList: any;
  deductionPayRateDetails: PayDeduction;
  deductionMode: any;
  selectedDeductionMode: any = "Rate";
  deductionList: any[] = [];
  selecteddeductionList: any;
  loading: boolean = false;
  deductionCols: any[] = [];
  disableAmount: boolean = true;
  disableDeductionType: boolean = true;
  employeeSelectedToAddDeductionPayRate: any;
  status: any;
  rowData: any;
  viewType: boolean;
  constructor(
    private sharedService: SharedService,
    private payHistoryService: PayHistoryService,
    private userAction: UserActionServices,
    private authService: AuthService
  ) {}

  organizationCurrency: string;
  async ngOnInit(): Promise<void> {
    if (this.authService.orgnizationCurrency) {
      this.organizationCurrency = this.authService.orgnizationCurrency;
    }
    this.cols = [];
    this.deductionOptionList = [
      { label: "Select", value: null },
      { label: "Advance Deduction", value: "Advance Deduction" },
      { label: "Expense Deduction", value: "Expense Deduction" },
      { label: "Other", value: "Other" },
    ];

    this.deductionPayRateDetails = new PayDeduction();
    if (this.authService.currentUser.roleId != 6) {
      await this.getEmployees();
    }
    this.viewType = this.sharedService.getUserViewType();
    this.sharedService.openToggleMenu("employeePayHistory");
    if (!this.viewType) {
      this.selectedEmployee = this.authService.currentUser;
      this.employeeSelectedToAddDeductionPayRate = this.selectedEmployee;
      this.employeeSelectedToAddDeductionPayRate.fullName =
        this.selectedEmployee?.fistName + " " + this.selectedEmployee?.lastName;
    } else {
      if (
        this.userAction.payHistoryEmployeeSelected &&
        this.userAction.payHistoryEmployeeSelected.employeeDetailsId
      ) {
        let employee = this.employeeList.filter((res) => {
          return (
            res.employeeDetailsId ==
            this.userAction.payHistoryEmployeeSelected.employeeDetailsId
          );
        });
        if (employee.length) {
          this.selectedEmployee = employee[0];
        }
      }
      if (this.selectedEmployee && this.selectedEmployee.employeeDetailsId) {
        let employee = this.employeeList.filter((res) => {
          return (
            res.employeeDetailsId == this.selectedEmployee.employeeDetailsId
          );
        });
        if (employee.length) {
          this.employeeSelectedToAddDeductionPayRate = employee[0];
        }
      } else {
        this.selectedEmployee = {
          fullName: "All Employees",
          employeeDetailsId: 0,
        };
      }
    }

    this.getDetails(this.selectedEmployee);
  }
  getEmployees() {
    return new Promise<void>((resolve, reject) => {
      this.payHistoryService.getOnBoardedEmployees().subscribe((res) => {
        if (res.statusCode == 200) {
          this.employeeList = res.responsePayload;
          this.employeeList.splice(0, 0, {
            fullName: "All Employees",
            employeeDetailsId: 0,
          });
        } else {
          this.employeeList = [];
        }
        resolve();
      });
    });
  }
  getDetails(employee) {
    let employeeDetailsId = 0;
    if (employee && employee.fullName != "All Employees") {
      this.userAction.payHistoryEmployeeSelected = employee;
      this.employeeSelectedToAddDeductionPayRate = employee;
      employeeDetailsId = employee.employeeDetailsId;
    } else {
      this.userAction.payHistoryEmployeeSelected = employee;
      this.employeeSelectedToAddDeductionPayRate = employee;
    }
    this.getCols(employeeDetailsId);
    this.getDeductions(employeeDetailsId);
  }
  getDeductions(employeeDetailsId: number) {
    this.payHistoryService.getDeduction(employeeDetailsId).subscribe((res) => {
      if (res.statusCode == 200) {
        this.deductionPayRateList = res.responsePayload;
      } else {
        this.deductionPayRateList = [];
      }
    });
  }
  getCols(employeeDetailsId: number) {
    if (employeeDetailsId) {
      this.cols = [
        { field: "deductionType", header: "Deduction Type" },
        { field: "deductionAmountPerCycle", header: "Amount Per Cycle" },
        { field: "totalDeductionAmount", header: "Amount" },
        { field: "deductionUpdatedDate", header: "Date Taken" },
        { field: "status", header: "Status" },
      ];
    } else {
      this.cols = [
        { field: "employeeName", header: "Name" },
        { field: "deductionType", header: "Deduction Type" },
        { field: "deductionAmountPerCycle", header: "Amount Per Cycle" },
        { field: "totalDeductionAmount", header: "Amount" },
        { field: "deductionUpdatedDate", header: "Date Taken" },
        { field: "status", header: "Status" },
      ];
    }
  }
  statusUpdate(rowData, status) {
    this.rowData = rowData;
    this.status = status;
  }
  confirm() {
    this.payHistoryService
      .statusUpdateDeductionPayRate(
        this.rowData.employeeDeductionDetailsId,
        this.status
      )
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getDetails(this.employeeSelectedToAddDeductionPayRate);
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        }
      });
  }
  getStatus(status) {
    if (status == "Active") {
      return "1";
    } else {
      return "0";
    }
  }
  saveDeduction(form) {
    let deduction: any = [];
    if (this.employeeSelectedToAddDeductionPayRate) {
      this.deductionPayRateDetails.employeeDetailsId =
        this.employeeSelectedToAddDeductionPayRate.employeeDetailsId;
    }
    if (this.deductionPayRateDetails.deductionType.toLowerCase() == "other") {
      this.deductionPayRateDetails.deductionType =
        this.deductionPayRateDetails.customeDeductionType;
    }
    if (this.deductionPayRateDetails.deductionType == "Advance Deduction") {
      this.selecteddeductionList.forEach((element) => {
        if (element.employeeDeductionAdvanceDetailsId) {
          deduction.push({
            employeeAdvanceDetailsId: element.employeeAdvanceDetailsId,
            status: "1",
            employeeDeductionAdvanceDetailsId:
              element.employeeDeductionAdvanceDetailsId,
          });
        } else {
          deduction.push({
            employeeAdvanceDetailsId: element.employeeAdvanceDetailsId,
            status: "1",
          });
        }
      });
      this.deductionPayRateDetails.deductionAdvances = deduction;
      this.deductionPayRateDetails.deductionExpenses = undefined;
    }
    if (this.deductionPayRateDetails.deductionType == "Expense Deduction") {
      this.selecteddeductionList.forEach((element) => {
        if (element.employeeDeductionAdvanceDetailsId) {
          deduction.push({
            employeeExpenseLineItemDetailsId:
              element.employeeExpenseLineItemDetailsId,
            status: "1",
            employeeDeductionExpenseDetailsId:
              element.employeeDeductionExpenseDetailsId,
          });
        } else {
          deduction.push({
            employeeExpenseLineItemDetailsId:
              element.employeeExpenseLineItemDetailsId,
            status: "1",
          });
        }
      });
      this.deductionPayRateDetails.deductionExpenses = deduction;
      this.deductionPayRateDetails.deductionAdvances = undefined;
    }
    this.payHistoryService
      .saveDeductionEmployeePayRate(this.deductionPayRateDetails)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.deductionPayRateDetails.employeeDetailsId =
            this.employeeSelectedToAddDeductionPayRate.employeeDetailsId;
          if (!this.selectedEmployee) {
            this.selectedEmployee = this.employeeSelectedToAddDeductionPayRate;
          }
          this.getDetails(this.selectedEmployee);
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.closeUploadmodal();
          form.reset();
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }
  showDialogToAdd() {
    this.deductionModel = "block";
    this.deductionPayRateDetails = new PayDeduction();
    if (this.employeeSelectedToAddDeductionPayRate) {
      this.disableDeductionType = false;
    }
    this.hiddenScroll();
  }
  showDialogToEdit(rowData) {
    if (this.selectedEmployee) {
      this.disableDeductionType = false;
    }
    this.payHistoryService
      .getExpenseDeductionDetails(rowData.employeeDeductionDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          let details = res.responsePayload;
          this.onDeductionType(details.deductionType);
          if (details.deductionType == "Advance Deduction") {
            this.selecteddeductionList = this.getSlectedDeductionList(
              details.employeeDeductionAdvances,
              rowData
            );
          }
          if (details.deductionType == "Expense Deduction") {
            this.selecteddeductionList = this.getSlectedDeductionList(
              details.employeeDeductionExpenses,
              rowData
            );
          }
          this.deductionPayRateDetails = details;
          // if(details.deductionType != 'Advance' ||details.deductionType == "Expense Deduction" ){
          //   this.deductionPayRateDetails.customeDeductionType =
          // }
          this.deductionModel = "block";
          this.hiddenScroll();
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }
  getSlectedDeductionList(selecteddeductionList, typeId) {
    // return selecteddeductionList.forEach((element) => {
    //   if (element[typeId] == typeId) {
    //     return element;
    //   }
    // });
  }
  getAdvanses(employeeDetailsId) {
    return new Promise<void>((result, reject) => {
      this.payHistoryService.getAdvances(employeeDetailsId).subscribe((res) => {
        if (res.statusCode == 200) {
          this.deductionList = res.responsePayload;
          result();
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
          this.deductionList = [];
          result();
        }
      });
    });
  }
  getExpenses(employeeDetailsId) {
    return new Promise<void>((result, reject) => {
      this.payHistoryService
        .getExpencesLineitem(employeeDetailsId)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.deductionList = res.responsePayload;
            result();
          } else {
            this.sharedService.add({
              severity: "error",
              summary: "Error",
              detail: res.message,
            });
            this.deductionList = [];
            result();
          }
        });
    });
  }
  async onDeductionType(event) {
    this.deductionPayRateDetails.totalDeductionAmount = undefined;
    this.selecteddeductionList = undefined;
    this.deductionList = [];
    this.errorLabel = "";
    let employeeDetailsId;
    if (this.employeeSelectedToAddDeductionPayRate) {
      employeeDetailsId =
        this.employeeSelectedToAddDeductionPayRate.employeeDetailsId;
    }
    if (event == "Other") {
      this.disableAmount = false;
    }
    if (event == "Advance Deduction") {
      this.disableAmount = true;
      this.deductionCols = [
        { field: "advanceRequestedDate", header: "Requested Date" },
        { field: "advancePaidDate", header: "Paid Date" },
        { field: "advanceAmount", header: "Amount" },
        { field: "description", header: "Description" },
        { field: "status", header: "Status" },
      ];
      if (employeeDetailsId) {
        await this.getAdvanses(employeeDetailsId);
      } else {
        this.errorLabel = "Please select employee";
      }
    }
    if (event == "Expense Deduction") {
      this.disableAmount = true;
      this.deductionCols = [
        { field: "expenseName", header: "Expense Name" },
        { field: "expenseDate", header: "Expense Date" },
        { field: "amount", header: "Amount " },
        { field: "description", header: "Description " },
      ];
      if (employeeDetailsId) {
        await this.getExpenses(employeeDetailsId);
      } else {
        this.errorLabel = "Please select employee";
      }
    }
  }
  resetType() {
    this.deductionPayRateDetails.deductionType = null;
    this.deductionPayRateDetails.customeDeductionType = null;
    this.disableAmount = true;
  }
  onRowSelect(event) {
    this.deductionPayRateDetails.totalDeductionAmount =
      this.getTotalDeductionAmount(this.selecteddeductionList);
  }
  onRowUnselect(event) {
    this.deductionPayRateDetails.totalDeductionAmount =
      this.getTotalDeductionAmount(this.selecteddeductionList);
  }
  getTotalDeductionAmount(obj) {
    let amount = 0;
    obj.forEach((element) => {
      if (element.advanceAmount) {
        amount += element.advanceAmount;
      } else if (element.amount) {
        amount += element.amount;
      }
    });
    return amount;
  }
  onAllRowSelect(selecteddeductionList) {
    this.deductionPayRateDetails.totalDeductionAmount =
      this.getTotalDeductionAmount(selecteddeductionList);
  }
  onEmployeeSelectToAddDeductionPayRate(value) {
    if (value.fullName == "Select Employee") {
      this.deductionPayRateDetails.deductionType = undefined;
      this.disableDeductionType = true;
      this.disableAmount = true;
    } else {
      this.disableDeductionType = false;
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
  closeUploadmodal() {
    this.selecteddeductionList = undefined;
    this.disableAmount = true;
    this.deductionModel = "none";
    this.employeeSelectedToAddDeductionPayRate = this.selectedEmployee;
    this.errorLabel = "";
    this.clientErrorMsg = "";
    this.displayScroll();
  }
}
