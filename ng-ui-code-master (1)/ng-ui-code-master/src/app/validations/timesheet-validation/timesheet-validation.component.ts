import { ChangeDetectorRef } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SharedService } from "@app/shared/shared.service";
import { TimesheetValidationServices } from "../timesheet-validation-services.service";

@Component({
  selector: "app-timesheet-validation",
  templateUrl: "./timesheet-validation.component.html",
  styleUrls: ["./timesheet-validation.component.css"],
})
export class TimesheetValidationComponent implements OnInit {
  token: any;
  commentInfo: string = "none";
  comments: string = "";
  submitStatusType: string;
  isAuthPage: boolean = false;
  isRestPage: boolean = false;
  isTimesheetPage: boolean = false;
  errorMessagePage: boolean = false;
  errLablMsg: string = "";
  sussLblMsg: string = "";
  shortErrorMessage: string = "You are not authorized to approve timesheet";
  fullErrorMessage: string = "";
  timesheetDetailsId: any;
  organizationDetailsId: any;
  approverEmail: string = "";
  authorizationCode: string = "";
  timesheetDetails: any;
  totalLoggedTime: any = 0;

  totalRegularTime: any = 0;
  totalOvertimeTime: any = 0;
  totalSickTime: any = 0;
  totalOTPTime: any = 0;
  totalBreakTime: any = 0;
  cols = [
    { field: "entryDate", header: "Date" },
    { field: "entryType", header: "Entry Type" },
    { field: "loggedTime", header: "Logged Time" },
    { field: "description", header: "Description" },
  ];
  clientErrorMsg: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private timesheetValidationService: TimesheetValidationServices,
    private sharedService: SharedService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.token = params["token"];
    });
    this.authAuthCode(this.token);
  }
  authAuthCode(token) {
    this.timesheetValidationService
      .validateTimesheetAccessToken(token)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.isAuthPage = true;
          this.isRestPage = false;
          this.errorMessagePage = false;
          this.isTimesheetPage = false;
          this.timesheetDetailsId = res.responsePayload.timesheetDetailsId;
          this.organizationDetailsId =
            res.responsePayload.organizationDetailsId;
        } else {
          this.isAuthPage = false;
          this.isRestPage = false;
          this.errorMessagePage = true;
          this.isTimesheetPage = false;
          this.fullErrorMessage = res.message;
        }
      });
  }
  submitAuthCode() {
    let reqObj = {
      organizationDetailsId: this.organizationDetailsId,
      timesheetDetailsId: this.timesheetDetailsId,
      authorizationCode: this.authorizationCode,
    };
    this.timesheetValidationService
      .validateTimesheetAuthCode(reqObj)
      .subscribe(async (res) => {
        if (res.statusCode == 200) {
          this.isAuthPage = false;
          this.isRestPage = false;
          this.errorMessagePage = false;
          this.isTimesheetPage = true;
          this.totalLoggedTime = await this.getTotalLoggedTime(
            res.responsePayload?.timesheetEntries
          );
          this.totalRegularTime = await this.getTotalloggedTimeByEntryType(
            res.responsePayload?.timesheetEntries,
            "1"
          );
          this.totalOvertimeTime = await this.getTotalloggedTimeByEntryType(
            res.responsePayload?.timesheetEntries,
            "2"
          );
          this.totalSickTime = await this.getTotalloggedTimeByEntryType(
            res.responsePayload?.timesheetEntries,
            "3"
          );
          this.totalOTPTime = await this.getTotalloggedTimeByEntryType(
            res.responsePayload?.timesheetEntries,
            "4"
          );
          this.totalBreakTime = await this.getTotalloggedTimeByEntryType(
            res.responsePayload?.timesheetEntries,
            "5"
          );
          this.timesheetDetails = res.responsePayload;
          this.cdRef.detectChanges();
        } else {
          this.isAuthPage = false;
          this.isRestPage = false;
          this.errorMessagePage = true;
          this.isTimesheetPage = false;
          this.fullErrorMessage = res.message;
        }
      });
  }
  getSubmitModel() {
    this.isAuthPage = true;
    this.isRestPage = false;
    this.errorMessagePage = false;
    this.isTimesheetPage = false;
  }
  getResetModel() {
    this.isRestPage = true;
    this.isAuthPage = false;
    this.errorMessagePage = false;
    this.isTimesheetPage = false;
  }

  resetAuthCodeSubmit() {
    this.timesheetValidationService
      .resendTimesheetAuthCode(this.approverEmail, this.organizationDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.isAuthPage = true;
          this.isRestPage = false;
          this.errorMessagePage = false;
          this.isTimesheetPage = false;
          this.sussLblMsg = res.message;
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        } else {
          this.errLablMsg = res.message;
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }
  reseterrorMessages() {
    this.errLablMsg = "";
    this.sussLblMsg = "";
    this.shortErrorMessage = "You are not authorized to approve timesheet";
    this.fullErrorMessage = "";
  }
  openCommentPopUp(submitStatus) {
    this.commentInfo = "block";
    this.submitStatusType = submitStatus;
    this.hiddenScroll();
  }
  closeCommentmodal() {
    this.commentInfo = "none";
    this.comments = "";
    this.displayScroll();
  }
  submitStatus() {
    let reqobj = {
      authorizationCode: this.authorizationCode,
      timesheetDetailsId: this.timesheetDetailsId,
      comments: this.comments,
      status: this.submitStatusType,
    };
    this.timesheetValidationService.statusUpdate(reqobj).subscribe((res) => {
      if (res.statusCode == 200) {
        this.closeCommentmodal();
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: res.message,
        });
        this.router.navigate(["/"]);
      } else {
        this.sharedService.add({
          severity: "error",
          summary: "Error",
          detail: res.message,
        });
      }
    });
  }
  getStatus(data) {
    switch (+data) {
      case 1:
        return "Saved";
      case 2:
        return "Submitted";
      case 3:
        return "Approved";
      case 4:
        return "Rejected";
      case 5:
        return "Request Modify";
    }
  }
  getEntryType(data) {
    switch (+data) {
      case 1:
        return "Regular";
      case 2:
        return "Overtime";
      case 3:
        return "Sick";
      case 4:
        return "PTO";
      case 5:
        return "Break";
    }
  }
  getTotalloggedTimeByEntryType(timelistObj, entryType) {
    return new Promise(async (resolve, reject) => {
      let abc = [...timelistObj];
      let shortedObj = abc.filter(function (a, b) {
        return a.entryType == entryType;
      });
      this.getTotalLoggedTime(shortedObj).then((res) => {
        resolve(res);
      });
    });
  }
  getTotalLoggedTime(timelistObj) {
    return new Promise(async (resolve, reject) => {
      let totalseconds = 0;
      await timelistObj.forEach(async (element) => {
        await this.convertIntoSec(element.loggedTime).then((res: number) => {
          totalseconds += res;
        });
      });
      resolve(totalseconds);
    });
  }
  convertIntoSec(loggedTime) {
    return new Promise((resolve, rejects) => {
      let totalseconds = 0;
      if (loggedTime) {
        if (loggedTime.includes(":")) {
          let hoursAndMinutes = loggedTime.split(":");
          totalseconds = parseInt(hoursAndMinutes[0]) * 60;
          if (hoursAndMinutes[1] != "") {
            totalseconds += parseInt(hoursAndMinutes[1]);
          }
        } else {
          totalseconds = parseInt(loggedTime) * 60;
        }
      }
      resolve(totalseconds);
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
}
