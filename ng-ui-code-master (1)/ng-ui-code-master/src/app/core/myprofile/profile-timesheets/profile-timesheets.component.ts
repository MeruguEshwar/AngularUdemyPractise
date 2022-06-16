import { Component, OnInit, Input } from "@angular/core";
import { User } from "@app/shared/models/user.model";
import { AuthService } from "@app/core/service/auth.service";
import { TimesheetsServices } from "@app/core/custommodules/timesheets/timesheets.services";

@Component({
  selector: "app-profile-timesheets",
  templateUrl: "./profile-timesheets.component.html",
  styleUrls: ["./profile-timesheets.component.css"],
})
export class ProfileTimesheetsComponent implements OnInit {
  @Input() userId: any;
  cols: any = [];
  allCols: any = [];
  state: any;
  user: User;
  loading: boolean = false;
  timesheetsHistoryList: any;
  employeeDetailsId: any;
  timesheetsType: string;
  recordData: any;
  selectedYear;
  yearLst: any;
  timesheetToogleType: number;

  constructor(
    private authService: AuthService,
    private timesheetsService: TimesheetsServices
  ) {}

  async ngOnInit() {
    this.cols = [
      { field: "timesheetPeriod", header: "Timesheet Peroid" },
      { field: "dateSubmitted", header: "Date Submitted" },
      { field: "totalLoggedTime", header: "Total Logged Time" },
      { field: "approvedBy", header: "Approved By" },
      { field: "status", header: "Status" },
    ];
    this.allCols = [
      { field: "employeeName", header: "Employee Name" },
      { field: "timesheetPeriod", header: "Timesheet Peroid" },
      { field: "dateSubmitted", header: "Date Submited" },
      { field: "totalLoggedTime", header: "Total Logged Time" },
      { field: "approvedBy", header: "Approved By" },
      { field: "status", header: "Status" },
    ];
    this.user = this.authService.currentUser;
    this.employeeDetailsId = this.userId;
    await this.getYears(this.employeeDetailsId);
    this.selectedYear = this.yearLst[0].value;
    this.timesheetToogleType = 0;
    this.getTimesheetsHistory(this.employeeDetailsId, this.selectedYear);
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
        }
      });
    });
  }
  handleChange(event) {
    if (event.index == 0) {
      this.timesheetToogleType = 0;
      this.getTimesheetsHistory(this.employeeDetailsId, this.selectedYear);
      return;
    }
    if (event.index == 1) {
      this.timesheetToogleType = 1;
      this.getAllTimesheetsHistory(this.selectedYear);
      return;
    }
  }
  getAllTimesheetsHistory(year) {
    this.timesheetsService.getAllTimesheetsHistory(year).subscribe((res) => {
      if (res.statusCode == 200) {
        this.timesheetsHistoryList = res.responsePayload;
      } else {
        this.timesheetsHistoryList = [];
      }
    });
  }
  getTimesheetsHistory(empId, year) {
    this.timesheetsService
      .getTimesheetsHistory(empId, year)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.timesheetsHistoryList = res.responsePayload;
        } else {
          this.timesheetsHistoryList = [];
        }
      });
  }
  showDialogToAdd() {
    this.timesheetsType = "Add";
  }
  ontimesheetsAddCloseClick(event) {
    if (this.timesheetToogleType == 0) {
      this.getTimesheetsHistory(this.employeeDetailsId, this.selectedYear);
    }
    if (this.timesheetToogleType == 1) {
      this.getAllTimesheetsHistory(this.selectedYear);
    }
    this.timesheetsType = "";
  }
  showDialogToEdit(rowData) {
    this.timesheetsType = "Edit";
    this.recordData = rowData;
  }
  getyear(event) {
    this.selectedYear = event.value;
    if (this.timesheetToogleType == 0) {
      this.getTimesheetsHistory(this.employeeDetailsId, this.selectedYear);
    }
    if (this.timesheetToogleType == 1) {
      this.getAllTimesheetsHistory(this.selectedYear);
    }
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
        return "Break";
    }
  }
}
