import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { AuthService } from "@app/core/service/auth.service";
import {
  ExpancesPayRate,
  ExpancesPayRateItemList,
} from "@app/shared/models/expences-pay-rate.model";
import { SharedService } from "@app/shared/shared.service";
import { UserActionServices } from "@app/shared/userAction.services";
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";
import { PayHistoryService } from "../payhistory.services";

@Component({
  selector: "app-expences",
  templateUrl: "./expences.component.html",
  styleUrls: ["./expences.component.css"],
})
export class ExpencesComponent implements OnInit {
  cols: any = [];
  employeeList: any;
  errorLabel: string;
  clientErrorMsg: any;
  selectedEmployee: any;
  expenseModel: string = "none";
  expensesPayRateList: any[] = [];
  expensesEntries: any[] = [];
  descriptionOption: any = [];
  expensesOption: any = [];
  filteredDescriptions: any;
  filteredExpenses: any;
  employeeSelectedToaddexpensesPayRate: any;
  expensesPayRateDetails: ExpancesPayRate;
  organizationDetailsId: any;
  rowData: any;

  constructor(
    private payHistoryService: PayHistoryService,
    public sharedService: SharedService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private userAction: UserActionServices
  ) {}

  organizationCurrency: string;
  ngOnInit(): void {
    if (this.authService.orgnizationCurrency) {
      this.organizationCurrency = this.authService.orgnizationCurrency;
    }
    this.organizationDetailsId =
      this.authService.currentUser.organizationDetailsId;

    this.cols = [];
    this.expensesPayRateDetails = new ExpancesPayRate();
    this.getEmployees();
    this.onAddexpenseLineItem();
    this.sharedService.openToggleMenu("employeePayHistory");
    this.selectedEmployee = this.userAction.payHistoryEmployeeSelected;
    if (this.selectedEmployee && this.selectedEmployee.employeeDetailsId) {
      this.employeeSelectedToaddexpensesPayRate = this.selectedEmployee;
    } else {
      this.selectedEmployee = {
        fullName: "All Employees",
        employeeDetailsId: 0,
      };
    }
    this.getDetails(this.selectedEmployee);
  }
  getEmployees() {
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
    });
  }
  filterDescription(event) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.descriptionOption.length; i++) {
      let element = this.descriptionOption[i];
      if (element.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(element);
      }
    }
    this.filteredDescriptions = filtered;
  }
  filterExpenses(event) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.expensesOption.length; i++) {
      let element = this.expensesOption[i];
      if (element.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(element);
      }
    }
    this.filteredExpenses = filtered;
  }
  showDialogToAdd() {
    this.expensesPayRateDetails = new ExpancesPayRate();
    this.expensesEntries = [];
    this.onAddexpenseLineItem();
    this.getDescriptionList(this.organizationDetailsId);
    this.getExpensesNameList(this.organizationDetailsId);
    this.expenseModel = "block";
    this.hiddenScroll();
  }
  showDialogToEdit(rowData) {
    let details = rowData;
    this.expensesPayRateDetails = details;
    this.expensesEntries = details.expenseLineItems;
    this.getDescriptionList(this.organizationDetailsId);
    this.getExpensesNameList(this.organizationDetailsId);
    this.expenseModel = "block";
    this.hiddenScroll();
  }
  getDetails(employee) {
    let employeeDetailsId = 0;
    if (employee && employee.fullName != "All Employees") {
      this.userAction.payHistoryEmployeeSelected = employee;
      this.employeeSelectedToaddexpensesPayRate = employee;
      employeeDetailsId = employee.employeeDetailsId;
    } else {
      this.userAction.payHistoryEmployeeSelected = employee;
      this.employeeSelectedToaddexpensesPayRate = employee;
    }
    this.getCols(employeeDetailsId);
    this.payHistoryService
      .getExpenses(employee.employeeDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.expensesPayRateList = res.responsePayload;
        } else {
          this.expensesPayRateList = [];
        }
      });
  }
  getCols(employeeDetailsId) {
    if (employeeDetailsId) {
      this.cols = [
        { field: "expenseName", header: "Expense Name" },
        { field: "expenseDate", header: "Expense Date" },
        { field: "totalAmount", header: "Total Amount" },
      ];
    } else {
      this.cols = [
        { field: "employeeName", header: "Name" },
        { field: "expenseName", header: "Expense Name" },
        { field: "expenseDate", header: "Expense Date" },
        { field: "totalAmount", header: "Total Amount" },
      ];
    }
  }
  getDescriptionList(organizationDetailsId) {
    this.payHistoryService
      .getExpensesDescription(organizationDetailsId)
      .subscribe(async (res) => {
        if (res.statusCode == 200) {
          this.descriptionOption = res.responsePayload;
          this.cdr.detectChanges();
        } else {
          this.descriptionOption = [];
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }
  getExpensesNameList(organizationDetailsId) {
    this.payHistoryService
      .getExpensesNames(organizationDetailsId)
      .subscribe(async (res) => {
        if (res.statusCode == 200) {
          this.expensesOption = res.responsePayload;
          this.cdr.detectChanges();
        } else {
          this.expensesOption = [];
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }
  selectEmployeeToAddexpensesPayRate() {
    this.expensesPayRateDetails.employeeDetailsId =
      this.employeeSelectedToaddexpensesPayRate.employeeDetailsId;
  }
  save(form) {
    if (this.employeeSelectedToaddexpensesPayRate) {
      this.expensesPayRateDetails.employeeDetailsId =
        this.employeeSelectedToaddexpensesPayRate.employeeDetailsId;
    }
    this.expensesPayRateDetails.expenseLineItems = this.expensesEntries;
    this.payHistoryService
      .saveExpencesEmployeePayRate(this.expensesPayRateDetails)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          if (!this.selectedEmployee) {
            this.selectedEmployee = this.employeeSelectedToaddexpensesPayRate;
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
  onAddexpenseLineItem() {
    let expenseLineIteamDetails = Object.assign(
      {},
      new ExpancesPayRateItemList()
    );
    this.expensesEntries.push(expenseLineIteamDetails);
  }
  onRemoveexpenseLineItem(expense, index) {
    if (this.expensesEntries.length > 1) {
      if (expense.employeeExpenseLineItemDetailsId) {
        this.expensesEntries[index].status = "0";
      } else {
        this.expensesEntries.splice(index, 1);
      }
    }
    this.getAmount(this.expensesEntries);
    this.cdr.detectChanges();
  }
  onResetDescription(expense, i) {
    this.expensesEntries[i].descriptionType = {
      label: "Select Description",
      value: null,
    };
  }
  statusUpdate(rowData) {
    this.rowData = rowData;
  }
  confirm() {
    this.payHistoryService
      .deactivateExpensePayRate(this.rowData.employeeExpenseDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getDetails(this.rowData);
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        }
      });
  }
  getAmount(obj) {
    let amount = 0;
    obj.forEach((element) => {
      if (+element.status) {
        amount += +element.amount;
      }
    });
    if (amount > 0) {
      this.expensesPayRateDetails.totalAmount = amount;
    } else {
      this.expensesPayRateDetails.totalAmount = 0;
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
    this.expenseModel = "none";
    this.employeeSelectedToaddexpensesPayRate = this.selectedEmployee;
    this.errorLabel = "";
    this.clientErrorMsg = "";
    this.displayScroll();
  }
  onInputKeyUp(event, expensesEntries) {
    this.getAmount(expensesEntries);
  }
}
