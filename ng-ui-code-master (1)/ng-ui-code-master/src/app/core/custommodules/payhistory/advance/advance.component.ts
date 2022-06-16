import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { AuthService } from "@app/core/service/auth.service";
import { AdvancePayRate } from "@app/shared/models/advance-pay-rate.model";
import { SharedService } from "@app/shared/shared.service";
import { UserActionServices } from "@app/shared/userAction.services";
import { PayHistoryService } from "../payhistory.services";

@Component({
  selector: "app-advance",
  templateUrl: "./advance.component.html",
  styleUrls: ["./advance.component.css"],
})
export class AdvanceComponent implements OnInit {
  @ViewChild("minimumDate") minimumDate: ElementRef<HTMLInputElement>;
  cols: any = [];
  employeeList: any = [];
  errorLabel: string;
  clientErrorMsg: any;
  selectedEmployee: any;
  advanceModel: string = "none";
  advancesPayRateList: any[] = [];
  employeeSelectedToaddAdvancePayRate: any;
  advancePayRateDetails: AdvancePayRate;
  confirmType: string;
  statusUpdateType: string;
  rowData: any;
  viewType: boolean;

  constructor(
    private payHistoryService: PayHistoryService,
    public sharedService: SharedService,
    private userAction: UserActionServices,
    private authService: AuthService
  ) {}

  organizationCurrency: string;
  async ngOnInit(): Promise<void> {
    if (this.authService.orgnizationCurrency) {
      this.organizationCurrency = this.authService.orgnizationCurrency;
    }
    this.cols = [];
    this.advancePayRateDetails = new AdvancePayRate();
    this.viewType = this.sharedService.getUserViewType();
    if (this.authService.currentUser.roleId != 6) {
      await this.getEmployees();
    }
    this.sharedService.openToggleMenu("employeePayHistory");
    if (!this.viewType) {
      this.selectedEmployee = this.authService.currentUser;
      this.employeeSelectedToaddAdvancePayRate = this.selectedEmployee;
      this.employeeSelectedToaddAdvancePayRate.fullName =
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
        this.employeeSelectedToaddAdvancePayRate = this.selectedEmployee;
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
  showDialogToAdd() {
    this.advancePayRateDetails = new AdvancePayRate();
    this.advanceModel = "block";
    this.hiddenScroll();
  }
  showDialogToEdit(rowData) {
    this.advancePayRateDetails = rowData;
    this.advanceModel = "block";
    this.hiddenScroll();
  }
  getDetails(employee) {
    let employeeDetailsId = 0;
    if (employee && employee.fullName != "All Employees") {
      this.userAction.payHistoryEmployeeSelected = employee;
      this.employeeSelectedToaddAdvancePayRate = employee;
      employeeDetailsId = employee.employeeDetailsId;
    } else {
      this.userAction.payHistoryEmployeeSelected = employee;
      this.employeeSelectedToaddAdvancePayRate = employee;
    }
    this.getCols(employeeDetailsId);
    this.payHistoryService.getAdvances(employeeDetailsId).subscribe((res) => {
      if (res.statusCode == 200) {
        this.advancesPayRateList = res.responsePayload;
      } else {
        this.advancesPayRateList = [];
      }
    });
  }
  getCols(employeeDetailsId) {
    if (employeeDetailsId) {
      this.cols = [
        { field: "advanceRequestedDate", header: "Requested Date" },
        { field: "advancePaidDate", header: "Paid Date" },
        { field: "advanceAmount", header: "Amount" },
        { field: "description", header: "Description" },
        { field: "status", header: "Status" },
      ];
    } else {
      this.cols = [
        { field: "employeeName", header: "Name" },
        { field: "advanceRequestedDate", header: "Requested Date" },
        { field: "advancePaidDate", header: "Paid Date" },
        { field: "advanceAmount", header: "Amount" },
        { field: "description", header: "Description" },
        { field: "status", header: "Status" },
      ];
    }
  }
  selectEmployeeToAddAdvancePayRate() {
    this.advancePayRateDetails.employeeDetailsId =
      this.employeeSelectedToaddAdvancePayRate.employeeDetailsId;
  }
  save(form) {
    if (this.employeeSelectedToaddAdvancePayRate) {
      this.advancePayRateDetails.employeeDetailsId =
        this.employeeSelectedToaddAdvancePayRate.employeeDetailsId;
    }
    this.payHistoryService
      .saveAdvanceEmployeePayRate(this.advancePayRateDetails)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          if (!this.selectedEmployee) {
            this.selectedEmployee = this.employeeSelectedToaddAdvancePayRate;
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
  statusUpdate(rowData, status, type) {
    this.statusUpdateType = status;
    this.rowData = rowData;
    this.confirmType = type;
  }
  confirm() {
    this.payHistoryService
      .advanceStatusUpdate(
        this.rowData.employeeAdvanceDetailsId,
        this.statusUpdateType
      )
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getDetails(this.employeeSelectedToaddAdvancePayRate);
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        }
      });
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
    this.advanceModel = "none";
    this.employeeSelectedToaddAdvancePayRate = this.selectedEmployee;
    this.errorLabel = "";
    this.clientErrorMsg = "";
    this.displayScroll();
  }
}
