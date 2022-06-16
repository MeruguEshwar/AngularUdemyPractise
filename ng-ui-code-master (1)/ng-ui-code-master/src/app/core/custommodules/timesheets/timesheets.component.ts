import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { User } from "@app/shared/models/user.model";
import { AuthService } from "@app/core/service/auth.service";
import { TimesheetsServices } from "./timesheets.services";
import { SharedService } from "@app/shared/shared.service";
import { UserActionServices } from "@app/shared/userAction.services";
import { NgForm } from "@angular/forms";
import { TimesheetDetails } from "@app/shared/models/timesheetDeatils.model";
import { HttpResponse } from "@angular/common/http";

@Component({
  selector: "app-timesheets",
  templateUrl: "./timesheets.component.html",
  styleUrls: ["./timesheets.component.css"],
})
export class TimesheetsComponent implements OnInit {
  cols: any = [];
  allCols: any = [];
  state: any;
  user: User;
  loading: boolean = false;
  timesheetsHistoryList: TimesheetDetails;
  timesheetsType: string;
  recordData: any;
  selectedYear;
  yearLst: any;
  timesheetToogleType: number = 0;
  public statusViewModel: string = "none";
  comments: string;
  @Input() isEmp: boolean;
  @Input() userId: number = -1;
  selectedUserId: number;
  employeeList: any;
  selectedEmployee: any;
  switchedView: boolean = false;
  showFromToSearch: boolean = false;
  showButton: boolean = true;
  @Input() userName: string;
  confirmType: string;
  statusUpdateType: string;
  rowData: any;
  statusComments: string;
  toDate: any = null;
  fromDate: any = null;
  allTimesheetDetailsId: any[] = [];
  constructor(
    public authService: AuthService,
    private timesheetsService: TimesheetsServices,
    public sharedService: SharedService,
    private userAction: UserActionServices,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.timesheetsHistoryList = new TimesheetDetails();
    this.user = this.authService.currentUser;
    this.switchedView = this.sharedService.getUserViewType();
    if (this.userId == -1) {
      this.userId = this.authService.currentUser.employeeDetailsId;
      this.userName =
        this.authService.currentUser.fistName +
        " " +
        this.authService.currentUser.lastName;
    }
    if (this.switchedView && !this.isEmp) {
      this.userName = "All Employee";
      this.getEmployees();
    }
    await this.getYears(this.userId);
    this.selectedYear = this.yearLst[0].value;
    this.getTimesheetDetails(this.fromDate, this.toDate);
    this.userAction.switcheddView.subscribe((res: boolean) => {
      this.getTimesheetDetails(this.fromDate, this.toDate);
      this.switchedView = res;
    });
    this.cdr.detectChanges();
  }
  getDetails(employee, timesheetToogleType, fromDate?: any, toDate?: any) {
    if (employee && employee.fullName != "All Employees") {
      this.userName = employee.fullName;
      switch (timesheetToogleType) {
        case 0:
          this.getTimesheetsHistory(
            employee.employeeDetailsId,
            this.selectedYear,
            fromDate,
            toDate
          );
          this.userId = employee.employeeDetailsId;
          this.showButton = false;
          break;
        case 1:
          this.getTimesheetsApproval(
            employee.employeeDetailsId,
            this.selectedYear
          );
          this.userId = employee.employeeDetailsId;
          this.showButton = false;
        case 2:
          this.getTimesheetsApprovedDenied(
            employee.employeeDetailsId,
            this.selectedYear
          );
          this.userId = employee.employeeDetailsId;
          this.showButton = false;
      }
    } else {
      switch (timesheetToogleType) {
        case 0:
          this.getAllTimesheetsHistory(this.selectedYear, fromDate, toDate);
          this.showButton = true;
          break;
        case 1:
          this.getAllTimesheetsApproval(this.selectedYear);
          this.showButton = true;
        case 2:
          this.getAllTimesheetsApprovedDenied(this.selectedYear);
          this.showButton = true;
      }
    }
  }
  getTimesheetDetails(fromDate?: any, toDate?: any) {
    if (this.switchedView && !this.isEmp) {
      if (this.selectedEmployee) {
        if (!this.selectedEmployee.employeeDetailsId) {
          this.selectedEmployee = {
            fullName: "All Employees",
            employeeDetailsId: 0,
          };
          this.getAllTimesheetsHistory(this.selectedYear, fromDate, toDate);
        } else {
          this.getTimesheetsHistory(
            this.selectedEmployee.employeeDetailsId,
            this.selectedYear,
            fromDate,
            toDate
          );
        }
      } else {
        this.getAllTimesheetsHistory(this.selectedYear, fromDate, toDate);
      }
    } else {
      this.showButton = false;
      this.getTimesheetsHistory(
        this.userId,
        this.selectedYear,
        fromDate,
        toDate
      );
      this.selectedEmployee = undefined;
    }
    this.cdr.detectChanges();
  }
  getTimesheetAprovalDetails() {
    if (this.switchedView && !this.isEmp) {
      if (this.selectedEmployee) {
        if (!this.selectedEmployee.employeeDetailsId) {
          this.selectedEmployee = {
            fullName: "All Employees",
            employeeDetailsId: 0,
          };
          this.getAllTimesheetsApproval(this.selectedYear);
        } else {
          this.getTimesheetsApproval(
            this.selectedEmployee.employeeDetailsId,
            this.selectedYear
          );
        }
      } else {
        this.getAllTimesheetsApproval(this.selectedYear);
      }
    } else {
      this.showButton = false;
      this.getTimesheetsApproval(this.userId, this.selectedYear);
      this.selectedEmployee = undefined;
    }
  }
  getTimesheetApprovedDeniedDetails() {
    if (this.switchedView && !this.isEmp) {
      if (this.selectedEmployee) {
        if (!this.selectedEmployee.employeeDetailsId) {
          this.selectedEmployee = {
            fullName: "All Employees",
            employeeDetailsId: 0,
          };
          this.getAllTimesheetsApprovedDenied(this.selectedYear);
        } else {
          this.getTimesheetsApprovedDenied(
            this.selectedEmployee.employeeDetailsId,
            this.selectedYear
          );
        }
      } else {
        this.getAllTimesheetsApprovedDenied(this.selectedYear);
      }
    } else {
      this.showButton = false;
      this.getTimesheetsApprovedDenied(this.userId, this.selectedYear);
      this.selectedEmployee = undefined;
    }
  }

  getEmployees() {
    this.timesheetsService.getOnBoardedEmployees().subscribe((res) => {
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
  async getYears(employeeDetailsId) {
    return new Promise<void>((resolve, reject) => {
      this.timesheetsService.getYears(employeeDetailsId).subscribe((res) => {
        this.yearLst = [];
        if (res.statusCode == 200) {
          res.responsePayload.forEach((element, index) => {
            this.yearLst.push({ label: element, value: parseInt(element) });
          });
          resolve();
        } else {
          var currYear = new Date().getFullYear();
          this.yearLst.push({
            label: currYear.toString(),
            value: currYear,
          });
          resolve();
        }
      });
    });
  }
  handleChange(event) {
    if (event.index == 0) {
      this.timesheetToogleType = 0;
      this.getTimesheetDetails();
      return;
    }
    if (event.index == 1) {
      this.timesheetToogleType = 1;
      this.getTimesheetAprovalDetails();
      return;
    }
    if (event.index == 2) {
      this.timesheetToogleType = 2;
      this.getTimesheetApprovedDeniedDetails();
      return;
    }
  }

  getAllTimesheetsHistory(year, fromDate?: any, toDate?: any) {
    this.cols = [
      { field: "timesheetPeriod", header: "Timesheet Peroid" },
      { field: "employeeName", header: "Employee Name" },
      { field: "dateSubmitted", header: "Date Submited" },
      { field: "totalLoggedTime", header: "Logged Hours" },
      { field: "totalLoggedTimeWithFraction", header: "Logged Hours" },
      { field: "approvedBy", header: "Approved By" },
      { field: "status", header: "Status" },
    ];
    this.timesheetsService
      .getAllTimesheetsHistory(year, fromDate, toDate)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.timesheetsHistoryList = res.responsePayload;
          this.timesheetsHistoryList.timesheets.forEach((element) => {
            this.allTimesheetDetailsId.push(element.timesheetDetailsId);
          });
        } else {
          this.timesheetsHistoryList.timesheets = [];
          this.allTimesheetDetailsId = [];
        }
        this.cdr.detectChanges();
      });
  }
  getTimesheetsHistory(empId, year, fromDate?: any, toDate?: any) {
    this.cols = [
      { field: "timesheetPeriod", header: "Timesheet Peroid" },
      { field: "dateSubmitted", header: "Date Submited" },
      { field: "totalLoggedTime", header: "Logged Hours" },
      { field: "totalLoggedTimeWithFraction", header: "Logged Hours" },
      { field: "approvedBy", header: "Approved By" },
      { field: "status", header: "Status" },
    ];
    this.timesheetsService
      .getTimesheetsHistory(empId, year, fromDate, toDate)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.timesheetsHistoryList = res.responsePayload;
        } else {
          this.timesheetsHistoryList.timesheets = [];
        }
        this.cdr.detectChanges();
      });
  }
  getAllTimesheetsApproval(year) {
    this.cols = [
      { field: "timesheetPeriod", header: "Timesheet Peroid" },
      { field: "employeeName", header: "Employee Name" },
      { field: "dateSubmitted", header: "Date Submited" },
      { field: "totalLoggedTime", header: "Logged Hours" },
      { field: "totalLoggedTimeWithFraction", header: "Logged Hours" },
      { field: "approvedBy", header: "Approved By" },
      { field: "status", header: "Status" },
    ];
    this.timesheetsService.getAllTimesheetsApproval(year).subscribe((res) => {
      if (res.statusCode == 200) {
        this.timesheetsHistoryList = res.responsePayload;
      } else {
        this.timesheetsHistoryList.timesheets = [];
      }
    });
    this.cdr.detectChanges();
  }
  getTimesheetsApproval(empId, year) {
    this.cols = [
      { field: "timesheetPeriod", header: "Timesheet Peroid" },
      { field: "dateSubmitted", header: "Date Submited" },
      { field: "totalLoggedTime", header: "Logged Hours" },
      { field: "totalLoggedTimeWithFraction", header: "Logged Hours" },
      { field: "approvedBy", header: "Approved By" },
      { field: "status", header: "Status" },
    ];
    this.timesheetsService
      .getTimesheetsApproval(empId, year)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.timesheetsHistoryList = res.responsePayload;
        } else {
          this.timesheetsHistoryList.timesheets = [];
        }
      });
  }
  getAllTimesheetsApprovedDenied(year) {
    this.cols = [
      { field: "timesheetPeriod", header: "Timesheet Peroid" },
      { field: "employeeName", header: "Employee Name" },
      { field: "dateSubmitted", header: "Date Submited" },
      { field: "totalLoggedTime", header: "Logged Hours" },
      { field: "totalLoggedTimeWithFraction", header: "Logged Hours" },
      { field: "approvedBy", header: "Approved By" },
      { field: "status", header: "Status" },
    ];
    this.timesheetsService
      .getAllTimesheetsApprovedDenied(year)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.timesheetsHistoryList = res.responsePayload;
        } else {
          this.timesheetsHistoryList.timesheets = [];
        }
      });
  }
  getTimesheetsApprovedDenied(empId, year) {
    this.cols = [
      { field: "timesheetPeriod", header: "Timesheet Peroid" },
      { field: "dateSubmitted", header: "Date Submited" },
      { field: "totalLoggedTime", header: "Logged Hours" },
      { field: "totalLoggedTimeWithFraction", header: "Logged Hours" },
      { field: "approvedBy", header: "Approved By" },
      { field: "status", header: "Status" },
    ];
    this.timesheetsService
      .getTimesheetsApprovedDenied(empId, year)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.timesheetsHistoryList = res.responsePayload;
        } else {
          this.timesheetsHistoryList.timesheets = [];
        }
      });
  }
  showDialogToAdd() {
    this.timesheetsType = "Add";
  }
  showDialogToEdit(rowdata) {
    this.selectedUserId = rowdata.employeeDetailsId;
    this.timesheetsService
      .getTimesheetDetailsById(rowdata.timesheetDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.recordData = res.responsePayload;
          this.timesheetsType = "Edit";
        }
      });
  }
  statusUpdate(rowData, status, type) {
    this.statusUpdateType = status;
    this.rowData = rowData;
    this.confirmType = type;
  }
  confirm(f: NgForm) {
    console.log(this.rowData.timesheetDetailsId);
    let formData = new StatusUpdate();
    if (this.statusComments) {
      formData.timesheetDetailsId = this.rowData.timesheetDetailsId;
      formData.status = this.statusUpdateType;
      formData.comments = this.statusComments;
      this.timesheetsService
        .timesheetStatusUpdate(formData)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            f.reset();
            this.getTimesheetAprovalDetails();
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
  search(fromDate, toDate) {
    this.getTimesheetDetails(fromDate, toDate);
  }
  export() {
    this.timesheetsService
      .downloadTimesheetAsExcel(this.allTimesheetDetailsId)
      .subscribe((resp: HttpResponse<Blob>) => {
        const blob = new Blob([resp.body], { type: resp.body.type });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let imageType = resp.body.type.substring(
          resp.body.type.lastIndexOf("/") + 1
        );
        console.log(resp.body);
        link.download = `TIMESHEETS_DATA.${imageType}`;
        link.click();
        link.remove();
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: "File downloaded",
        });
      });
  }
  ontimesheetsAddCloseClick(event) {
    this.getTimesheetDetails(this.fromDate, this.toDate);
    this.timesheetsType = "";
  }
  getyear(event) {
    this.selectedYear = event.value;
    this.getTimesheetDetails(this.fromDate, this.toDate);
  }
  getStatus(data) {
    switch (data) {
      case "1":
        return "Saved";
      case "2":
        return "Submitted";
      case "3":
        return "Approved";
      case "4":
        return "Rejected";
      case "5":
        return "Request Modify";
    }
  }
  viewStatusComment(comments) {
    this.statusViewModel = "block";
    this.comments = comments;
  }
  closeUploadmodal() {
    this.statusViewModel = "none";
  }
}
class StatusUpdate {
  timesheetDetailsId: number;
  status: string;
  comments: string;
}
