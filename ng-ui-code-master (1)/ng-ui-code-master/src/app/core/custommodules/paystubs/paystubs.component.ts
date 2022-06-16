import { Component, Input, OnInit } from "@angular/core";
import { PaystubsServices } from "./paystubs.services";
import { AuthService } from "@app/core/service/auth.service";
import { HttpResponse } from "@angular/common/http";
import { SharedService } from "@app/shared/shared.service";
import { Paystubs } from "@app/shared/models/paystubs.model";
import { Employee } from "@app/shared/models/employee.model";
import { UserActionServices } from "@app/shared/userAction.services";

@Component({
  selector: "app-paystubs",
  templateUrl: "./paystubs.component.html",
  styleUrls: ["./paystubs.component.css"],
})
export class PaystubsComponent implements OnInit {
  lstPaystubs;
  yearLst: any;
  cols: any[];
  @Input() userInfo: any = {};
  @Input() userId: number = 0;
  @Input() isEmp: boolean;
  selectedYear;
  viewType: boolean;
  paystubType;
  paystub: Paystubs;
  loading: boolean = false;
  userName: string;
  lstEmployes: any = [];
  selectedEmp: any;
  selectedEmployee: any;
  selectedEmployeeAction: any;
  organizationCurreny: string;
  constructor(
    private paystubService: PaystubsServices,
    private authService: AuthService,
    private userAction: UserActionServices,
    private sharedService: SharedService
  ) {}

  async ngOnInit() {
    this.cols = [
      { field: "checkDate", header: "Cheque Date" },
      { field: "grossEarnings", header: "Gross Earnings" },
      { field: "withHoldings", header: "Withholdings" },
      { field: "deductions", header: "Deductions" },
      { field: "netAmount", header: "Net Pay" },
      { field: "totalHours", header: "Hours" },
    ];
    await this.getEmployees();
    if (this.authService.orgnizationCurrency) {
      this.organizationCurreny = this.authService.orgnizationCurrency;
    }
    this.viewType = this.sharedService.getUserViewType();
    this.sharedService.openToggleMenu("employeePayHistory");
    if (!this.viewType) {
      this.selectedEmployee = this.authService.currentUser;
      this.selectedEmployeeAction = this.selectedEmployee;
      this.selectedEmployeeAction.fullName =
        this.selectedEmployee?.fistName + " " + this.selectedEmployee?.lastName;
    } else {
      if (
        this.userAction.payHistoryEmployeeSelected &&
        this.userAction.payHistoryEmployeeSelected.employeeDetailsId
      ) {
        let employee = this.lstEmployes.filter((res) => {
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
        this.selectedEmployeeAction = this.selectedEmployee;
      } else {
        this.selectedEmployee = {
          fullName: "All Employees",
          employeeDetailsId: 0,
        };
      }
    }
    if (this.isEmp) {
      let employee = this.lstEmployes.filter((res) => {
        return res.employeeDetailsId == this.userId;
      });
      if (employee.length) {
        this.selectedEmployee = employee[0];
        this.selectedEmployeeAction = this.selectedEmployee;
      }
    }
    await this.getYears(this.authService.currentUser.employeeDetailsId);
    this.getDetails(this.selectedEmployee);
  }

  getDetails(employee) {
    let employeeDetailsId = this.userId;
    if (employee && employee.fullName != "All Employees") {
      this.userAction.payHistoryEmployeeSelected = employee;
      this.selectedEmployeeAction = employee;
      employeeDetailsId = employee.employeeDetailsId;
    } else {
      this.userAction.payHistoryEmployeeSelected = employee;
      this.selectedEmployeeAction = employee;
    }
    this.getPaystubs(this.selectedYear, employeeDetailsId);
  }
  getEmployees(status: number = 1) {
    return new Promise<void>((resolve, reject) => {
      this.paystubService.getOnBoardedEmployees().subscribe((res) => {
        this.lstEmployes = [];
        if (res.statusCode == 200) {
          this.lstEmployes = res.responsePayload;
          this.lstEmployes.splice(0, 0, {
            fullName: "All Employees",
            employeeDetailsId: 0,
          });
          if (this.userInfo && this.userInfo.employeeDetailsId) {
            let employee = this.lstEmployes.filter((res) => {
              return res.employeeDetailsId == this.userInfo.employeeDetailsId;
            });
            if (employee.length) {
              this.selectedEmployee = employee[0];
            }
          }
        }
        resolve();
      });
    });
  }
  async getYears(employeeDetailsId) {
    return new Promise<void>((resolve, reject) => {
      this.paystubService.getYears(employeeDetailsId).subscribe((res) => {
        this.yearLst = [];
        if (res.statusCode == 200) {
          res.responsePayload.forEach((element, index) => {
            this.yearLst.push({ label: element, value: parseInt(element) });
          });
          this.selectedYear = this.yearLst[0].value;
          resolve();
        } else {
          var currYear = new Date().getFullYear();
          this.yearLst.push({
            label: currYear.toString(),
            value: currYear,
          });
          this.selectedYear = this.yearLst[0].value;
        }
      });
    });
  }
  getPaystubs(year, userId) {
    this.paystubService.getPaystubsDetails(userId, year).subscribe((res) => {
      if (res && res.statusCode == 200) {
        this.lstPaystubs = res.responsePayload;
      } else {
        this.lstPaystubs = [];
      }
    });
  }
  showDialogToAdd() {
    this.paystubType = "Add";
    //this.paystub = new Paystubs();
  }
  showDialogToEdit(rowData) {
    this.paystubType = "Edit";
    this.paystub = rowData;
  }
  showView(rowData) {
    this.paystubType = "View";
    this.paystub = rowData;
  }
  onPaystubCloseClick(event) {
    this.paystub = new Paystubs();
    this.paystubType = "";
  }
  onPaystubAddCloseClick(event) {
    this.paystubType = "";
  }
  getyear(event, userId) {
    this.selectedYear = event;
    this.getPaystubs(event, userId);
  }
  downloadFile(data) {
    this.sharedService.add({
      severity: "info",
      summary: "Info!",
      detail: "File is preparing to download please wait",
    });
    this.paystubService
      .downloadPaystub(data.employeeDetailsId)
      .subscribe((resp: HttpResponse<Blob>) => {
        const blob = new Blob([resp.body], { type: resp.body.type });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let imageType = resp.body.type.substring(
          resp.body.type.lastIndexOf("/") + 1
        );
        link.download = `paystub_${data.employeeDetailsId}.${imageType}`;
        link.click();
        link.remove();
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: "File downloaded",
        });
      });
  }
  onReload() {
    this.getPaystubs(
      this.selectedYear,
      this.selectedEmployee.employeeDetailsId
    );
  }
}
