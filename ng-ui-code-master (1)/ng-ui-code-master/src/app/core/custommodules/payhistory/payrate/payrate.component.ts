import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { AuthService } from "@app/core/service/auth.service";
import { PayRate } from "@app/shared/models/payRate.model";
import { SharedService } from "@app/shared/shared.service";
import { UserActionServices } from "@app/shared/userAction.services";
import { PayHistoryService } from "../payhistory.services";

@Component({
  selector: "app-payrate",
  templateUrl: "./payrate.component.html",
  styleUrls: ["./payrate.component.css"],
})
export class PayrateComponent implements OnInit {
  @ViewChild("minimumDate") minimumDate: ElementRef<HTMLInputElement>;
  cols: any = [];
  payRateList: PayRate[] = [];
  selectedEmployee: any;
  employeeSelectedToaddPayRate: any;
  employeeList: any;
  payRateModel: string = "none";
  errorLabel: string;
  clientErrorMsg: any;
  payRateDetails: PayRate;
  payrateMode: any;
  startDateError: string;
  viewType: boolean;

  constructor(
    private payHistoryService: PayHistoryService,
    public sharedService: SharedService,
    private userAction: UserActionServices,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  organizationCurrency: string;
  async ngOnInit(): Promise<void> {
    if (this.authService.orgnizationCurrency) {
      this.organizationCurrency = this.authService.orgnizationCurrency;
    }
    this.cols = [];
    this.payrateMode = [
      { label: "Rate", value: "1" },
      { label: "Salary", value: "2" },
    ];
    this.payRateDetails = new PayRate();
    if (this.authService.currentUser.roleId != 6) {
      await this.getEmployees();
    }
    this.viewType = this.sharedService.getUserViewType();
    this.sharedService.openToggleMenu("employeePayHistory");
    if (!this.viewType) {
      this.selectedEmployee = this.authService.currentUser;
      this.employeeSelectedToaddPayRate = this.selectedEmployee;
      this.employeeSelectedToaddPayRate.fullName =
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
          this.employeeSelectedToaddPayRate = employee[0];
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
      this.employeeSelectedToaddPayRate = employee;
      employeeDetailsId = employee.employeeDetailsId;
    } else {
      this.userAction.payHistoryEmployeeSelected = employee;
      this.employeeSelectedToaddPayRate = employee;
    }
    this.getCols(employeeDetailsId);
    this.payHistoryService
      .getPayRate(employee.employeeDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.payRateList = res.responsePayload;
        } else {
          this.payRateList = [];
        }
      });
  }
  getCols(employeeDetailsId) {
    if (employeeDetailsId) {
      this.cols = [
        { field: "rate", header: "Rate" },
        { field: "salary", header: "Salary" },
        { field: "startDate", header: "Start Date" },
        { field: "endDate", header: "End Date" },
        { field: "rateCodeDescription", header: "Description" },
      ];
    } else {
      this.cols = [
        { field: "employeeName", header: "Name" },
        { field: "rate", header: "Rate" },
        { field: "salary", header: "Salary" },
        { field: "startDate", header: "Start Date" },
        { field: "endDate", header: "End Date" },
        { field: "rateCodeDescription", header: "Description" },
      ];
    }
  }
  statusUpdate(rowData, type) {
    if (type == "activate") {
      this.payHistoryService
        .activatePayRate(rowData.employeePayRateDetailsId)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.getDetails(rowData);
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
          }
        });
    } else if (type == "deactivate") {
      this.payHistoryService
        .deactivatePayRate(rowData.employeePayRateDetailsId)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.getDetails(rowData);
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
          }
        });
    }
  }
  savePayRate(form) {
    if (this.payRateDetails.payRateType == "1") {
      this.payRateDetails.rateOrSalary = this.payRateDetails.rate;
    } else {
      this.payRateDetails.rateOrSalary = this.payRateDetails.salary;
    }
    this.payHistoryService
      .saveEmployeePayRate(this.payRateDetails)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          if (!this.selectedEmployee) {
            this.selectedEmployee = this.employeeSelectedToaddPayRate;
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
  selectEmployeeToAddPayRate() {
    this.payRateDetails.employeeDetailsId =
      this.employeeSelectedToaddPayRate.employeeDetailsId;
  }
  checkPayRateExists() {
    if (this.employeeSelectedToaddPayRate && this.payRateDetails.startDate) {
      this.payRateDetails.employeeDetailsId =
        this.employeeSelectedToaddPayRate.employeeDetailsId;
      this.payHistoryService
        .isPayRateExists(
          this.payRateDetails.employeeDetailsId,
          this.payRateDetails.startDate
        )
        .subscribe((res) => {
          if (res.statusCode != 200) {
            this.startDateError = res.message;
            this.payRateDetails.startDate = null;
            setTimeout(function () {
              this.startDateError = undefined;
            }, 3000);
          } else {
            this.startDateError = "";
          }
        });
    } else {
      this.startDateError = "Please Enter Valid Start Date";
      this.payRateDetails.startDate = null;
      setTimeout(function () {
        this.startDateError = undefined;
      }, 3000);
    }
  }
  showDialogToAdd() {
    this.payRateModel = "block";
    this.payRateDetails = new PayRate();
    this.payRateDetails.payRateType = "1";
    this.hiddenScroll();
  }
  showDialogToEdit(rowData) {
    this.payRateModel = "block";
    this.payRateDetails = rowData;
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
  closeUploadmodal() {
    this.payRateModel = "none";
    this.payRateDetails = new PayRate();
    this.employeeSelectedToaddPayRate = this.selectedEmployee;
    this.errorLabel = "";
    this.clientErrorMsg = "";
    this.displayScroll();
  }
}
