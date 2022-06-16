import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { ChangeDetectorRef } from "@angular/core";
import { AuthService } from "@app/core/service/auth.service";
import { TimesheetsServices } from "../timesheets.services";
import { HttpResponse } from "@angular/common/http";
import { SharedService } from "@app/shared/shared.service";

@Component({
  selector: "app-view-timesheet",
  templateUrl: "./view-timesheet.component.html",
  styleUrls: ["./view-timesheet.component.css"],
})
export class ViewTimesheetComponent implements OnInit {
  state: any;
  timesheetDetailsId: any;
  timesheetDetails: any;
  timesheetsType: string;
  employeeDetailsId: any;
  cols = [
    { field: "entryDate", header: "Date" },
    { field: "entryType", header: "Entry Type" },
    { field: "startTime", header: "Start Time" },
    { field: "endTime", header: "End Time" },
    { field: "loggedTime", header: "Logged Time" },
    { field: "loggedTimeWithFraction", header: "Logged Time" },
    { field: "description", header: "Description" },
  ];
  viewImage: boolean = false;
  imageBlob: HttpResponse<Blob>;
  totalLoggedTime: any = 0;
  totalRegularTime: any = 0;
  totalOvertimeTime: any = 0;
  totalDoubleOverTime: any = 0;
  totalSickTime: any = 0;
  totalOTPTime: any = 0;
  totalBreakTime: any = 0;
  totalMealPremiumTime: any = 0;
  constructor(
    private location: Location,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private timesheetService: TimesheetsServices,
    private sharedService: SharedService
  ) {}

  async ngOnInit(): Promise<void> {
    this.state = window.history.state;
    if (this.state && this.state.timesheetDetails?.timesheetDetailsId) {
      this.employeeDetailsId = this.state.timesheetDetails.employeeDetailsId;
      this.timesheetDetailsId = this.state.timesheetDetails.timesheetDetailsId;
      this.timesheetDetails = await this.getTimesheetDetails(
        this.timesheetDetailsId
      );
      await this.changeLoggedTimeCalculation(
        this.timesheetDetails?.timesheetEntries
      );
    }
    if (!this.timesheetDetailsId) {
      this.location.back();
    }
    this.cdr.detectChanges();
  }
  showDialogToEdit(rowData) {
    this.timesheetsType = "Edit";
  }
  async ontimesheetsAddCloseClick(event) {
    this.timesheetsType = "";
    this.timesheetDetails = await this.getTimesheetDetails(
      this.timesheetDetailsId
    );
  }
  getTimesheetDetails(timesheetDetailsId) {
    return new Promise((resolve, reject) => {
      this.timesheetService
        .getTimesheetDetailsById(timesheetDetailsId)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            resolve(res.responsePayload);
            console.log(res.responsePayload);
          }
        });
    });
  }
  getEntryType(key) {
    switch (+key) {
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
      case 6:
        return "Double Overtime";
      case 7:
        return "Meal Premium";
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
        return "Request Modify";
    }
  }
  getStatusColor(data) {
    switch (data) {
      case "1":
        return "info";
      case "2":
        return "warning";
      case "3":
        return "success";
      case "4":
        return "danger";
      case "5":
        return "danger";
    }
  }
  onImageViewCloseClick(event) {
    if (event.type == "cancel") {
      this.imageBlob = null;
      this.viewImage = false;
    }
  }
  async onImageViewOpenClick() {
    this.timesheetService
      .downloadTimesheet(this.timesheetDetailsId)
      .subscribe((resp: HttpResponse<Blob>) => {
        this.imageBlob = resp;
        this.viewImage = true;
      });
  }
  downloadAttachment(data) {
    this.timesheetService
      .downloadTimesheet(data.timesheetDetailsId)
      .subscribe((resp: HttpResponse<Blob>) => {
        this.imageBlob = resp;
        const blob = new Blob([resp.body], { type: resp.body.type });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let imageType = resp.body.type.substring(
          resp.body.type.lastIndexOf("/") + 1
        );
        link.download = `timesheet${data.employeeDetailsId}.${imageType}`;
        link.click();
        link.remove();
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: "File downloaded",
        });
      });
  }
  async changeLoggedTimeCalculation(listOfDates, rowIndex?) {
    this.totalLoggedTime = 0;
    this.totalRegularTime = 0;
    this.totalOvertimeTime = 0;
    this.totalSickTime = 0;
    this.totalOTPTime = 0;
    this.totalBreakTime = 0;
    this.totalDoubleOverTime = 0;
    this.totalMealPremiumTime = 0;
    this.totalLoggedTime = await this.getTotalLoggedTime(listOfDates);
    this.totalRegularTime = await this.getTotalloggedTimeByEntryType(
      listOfDates,
      "1"
    );
    this.totalOvertimeTime = await this.getTotalloggedTimeByEntryType(
      listOfDates,
      "2"
    );
    this.totalDoubleOverTime = await this.getTotalloggedTimeByEntryType(
      listOfDates,
      "6"
    );
    this.totalSickTime = await this.getTotalloggedTimeByEntryType(
      listOfDates,
      "3"
    );
    this.totalOTPTime = await this.getTotalloggedTimeByEntryType(
      listOfDates,
      "4"
    );
    this.totalBreakTime = await this.getTotalloggedTimeByEntryType(
      listOfDates,
      "5"
    );
    this.totalMealPremiumTime = await this.getTotalloggedTimeByEntryType(
      listOfDates,
      "7"
    );
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
  back() {
    this.location.back();
  }
  downloadScreenShot(data) {
    this.timesheetService
      .downloadTimesheetById(data.timesheetAttachmentDetailsId)
      .subscribe((resp: HttpResponse<Blob>) => {
        this.imageBlob = resp;
        const blob = new Blob([resp.body], { type: resp.body.type });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let imageType = resp.body.type.substring(
          resp.body.type.lastIndexOf("/") + 1
        );
        link.download = `timesheet${data.timesheetDetailsId}.${imageType}`;
        link.click();
        link.remove();
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: "File downloaded",
        });
      });
  }

  downloadTimeSheetPDF(timeSheetDetailsId) {
    this.timesheetService
      .downloadTimeSheetPDF(timeSheetDetailsId)
      .subscribe((resp: HttpResponse<Blob>) => {
        const blob = new Blob([resp.body], { type: resp.body.type });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let imageType = resp.body.type.substring(
          resp.body.type.lastIndexOf("/") + 1
        );
        link.download = `Timesheet_${this.timesheetDetails?.employeeName}.${imageType}`;
        link.click();
        link.remove();
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: "File downloaded",
        });
      });
  }
  calculateTotalLoggedTimeInFraction(secs) {
    let time: any = (secs / 60).toString();
    let hh: any = "00";
    let mm: any = "00";
    if (time.indexOf(".") !== -1) {
      let [hours, minutes] = time.split(".");
      hh = hours.length < 2 ? "0" + hours : hours;
      mm = minutes.length < 2 ? "0" + minutes : minutes.slice(0, 2);
    } else {
      hh = time.length < 2 ? "0" + time : time;
    }
    return hh + "." + mm;
  }
}
