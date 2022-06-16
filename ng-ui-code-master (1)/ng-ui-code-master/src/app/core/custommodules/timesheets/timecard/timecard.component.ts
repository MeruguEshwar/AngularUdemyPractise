import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from "@angular/core";
import { TimesheetsServices } from "../timesheets.services";
import { SharedService } from "@app/shared/shared.service";
import { FormControl, NgForm } from "@angular/forms";
import { HttpResponse } from "@angular/common/http";
import { filter } from "rxjs/operators";
import { promise } from "protractor";
import { resolve } from "dns";

@Component({
  selector: "app-timecard",
  templateUrl: "./timecard.component.html",
  styleUrls: ["./timecard.component.css"],
})
export class TimecardComponent implements OnInit {
  public timecardDisplay: string = "none";
  @Output() onClose = new EventEmitter<any>();
  @Input() userId: any;
  @Input() timesheetType: string;
  @Input() recordData: any;
  unSavedModel: string = "none";
  customEmailModel: string = "none";
  confirmModel: string = "none";
  clientErrorMsg: any;
  timesheetsDates: any;
  listOfDates: any;
  selectedPeriod: string;
  entryType: any;
  cols: any;
  loading: boolean = false;
  errLabel: any;
  timesheetsDetails: any;
  fileToUpload: any;
  @ViewChild("fileInput") myInputVariable: any;
  @ViewChild("f") f: NgForm;
  @ViewChild("customeEmailForm") customeEmailForm: NgForm;
  @ViewChild("customeEmailForm") uploadFileInfoForm: NgForm;
  uploadFileInfo: string = "none";
  uploadedFileTitle: string;

  approverInfo: string = "none";
  errorLabel: string = "";
  assignProjects: any;
  selectedProjectId: any;
  status: any;
  projectDetails: any;
  totalLoggedTime: any = 0;
  totalRegularTime: any = 0;
  totalOvertimeTime: any = 0;
  totalDoubleOverTime: any = 0;
  totalSickTime: any = 0;
  totalOTPTime: any = 0;
  totalBreakTime: any = 0;
  totalMealPremiumTime: any = 0;
  approverEmailList: any = [];
  selectedApproverEmailList: string[] = [];
  checkedApproverEmailList: any[];
  imageBlob: HttpResponse<Blob>;
  viewImage: boolean = false;
  isCustomEmail: boolean = false;
  customEmail: string;
  deleteAttachmentRowData: any;
  deleteAttachmentRowDataIndex: any;
  constructor(
    private timesheetService: TimesheetsServices,
    public sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.cols = [
      { field: "entryDate", header: "Date" },
      { field: "entryType", header: "Entry Type" },
      { field: "startTime", header: "Start Time" },
      { field: "endTime", header: "End Time" },
      { field: "loggedTime", header: "Logged Time" },
      { field: "loggedTimeWithFraction", header: "Logged Time" },
      { field: "description", header: "Description" },
    ];
    this.entryType = [
      {
        label: "Regular ",
        value: "1",
      },
      {
        label: "Overtime  ",
        value: "2",
      },
      {
        label: "Double Overtime ",
        value: "6",
      },
      {
        label: "Sick  ",
        value: "3",
      },
      {
        label: "PTO ",
        value: "4",
      },
      {
        label: "Break ",
        value: "5",
      },
      {
        label: "Meal Premium ",
        value: "7",
      },
    ];
    this.showDialogToAdd();
    if (this.timesheetType == "Add") {
      await this.getTimesheetsDates(this.userId, 0);
      if (this.selectedPeriod == "") {
        this.selectedPeriod = this.timesheetsDates[0].value;
      }
    }
    if (this.timesheetType == "Edit") {
      await this.getTimesheetsDates(
        this.userId,
        this.recordData.timesheetDetailsId
      );
    }
    await this.getTimesheetDetails(this.userId, this.selectedPeriod);
    if (this.timesheetsDetails?.projectDetailsId) {
      this.approverList(this.timesheetsDetails.projectDetailsId, "1");
    }
    this.calculateTotalLoggedTimeInHours(this.listOfDates);
    await this.onfocus(Event, this.selectedApproverEmailList);
  }

  getTimesheetsDates(empid, timesheetDetailsId) {
    return new Promise<void>((resolve, rejects) => {
      this.timesheetService
        .getTimesheetsDates(empid, timesheetDetailsId)
        .subscribe((res) => {
          this.timesheetsDates = [];
          if (res.statusCode == 200) {
            res.responsePayload.timesheetDates.forEach((element, index) => {
              this.timesheetsDates.push({
                label: element,
                value: element,
              });
            });
            this.selectedPeriod = res.responsePayload.timesheetPeriodToSelect;
            this.timesheetService
              .getProjectAssignments(empid)
              .subscribe((res) => {
                this.assignProjects = [
                  { label: "Select Project", value: null },
                ];
                if (res.statusCode == 200) {
                  this.projectDetails = res.responsePayload;
                  res.responsePayload.forEach((element) => {
                    this.assignProjects.push({
                      label: element.projectName,
                      value: element.projectDetailsId,
                    });
                  });
                } else {
                  this.closeAddmodal();
                  this.f.reset();
                  this.sharedService.add({
                    severity: "error",
                    summary: "Error",
                    detail: res.message,
                  });
                }
              });
            resolve();
          } else {
            this.closeAddmodal();
            this.sharedService.add({
              severity: "error",
              summary: "Error",
              detail: res.message,
            });
          }
        });
    });
  }
  async getperiod(event) {
    await this.getTimesheetDetails(this.userId, event.value);
    this.calculateTotalLoggedTimeInHours(this.listOfDates);
    // this.totalLoggedTime = await this.getTotalLoggedTime(this.listOfDates);
  }
  getTimesheetDetails(userId, period) {
    return new Promise<void>((resolve, reject) => {
      const dates = period.split(" - ");
      const fromDate = dates[0];
      const toDate = dates[1];
      this.timesheetService
        .getTimesheetDetails(userId, period)
        .subscribe(async (res) => {
          const days = this.getDays(fromDate, toDate);
          this.listOfDates = [];
          this.selectedApproverEmailList = [];
          this.approverEmailList = [];
          this.selectedProjectId = null;
          this.timesheetsDetails = res.responsePayload;
          this.status = this.getStatus(res.responsePayload?.status);
          this.selectedProjectId = res.responsePayload?.projectDetailsId;
          if (this.selectedProjectId) {
            await this.approverList(this.selectedProjectId, "1");
          }
          if (res.statusCode == 200) {
            this.listOfDates = res.responsePayload.timesheetEntries;
            if (res.responsePayload.approverEmailIds) {
              this.selectedApproverEmailList =
                res.responsePayload.approverEmailIds;
            }
            resolve();
          } else {
            days.forEach((element) => {
              this.listOfDates.push({
                entryDate: element,
                entryType: "1",
                startTime: undefined,
                endTime: undefined,
                loggedTime: "00:00",
                loggedTimeWithFraction: "00.00",
                description: " ",
                status: "1",
              });
            });
            resolve();
          }
        });
    });
  }
  getSelectedEmailIds(list, email) {
    let emailId = list.filter((res) => {
      return list.approverEmail == email;
    });
    return emailId[0];
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
      default:
        return "New";
    }
  }
  getStatusColor(data) {
    switch (data) {
      case "Saved":
        return "info";
      case "Submitted":
        return "warning";
      case "Approved":
        return "success";
      case "Rejected":
        return "danger";
      case "Request Modify":
        return "danger";
    }
  }
  getDays(start, end) {
    var dateArray = [];
    var currentDate = new Date(start);
    var stopDate = new Date(end);
    while (currentDate <= stopDate) {
      let day = (currentDate.getDate() < 10 ? "0" : "") + currentDate.getDate();
      let month =
        (currentDate.getMonth() + 1 < 10 ? "0" : "") +
        (currentDate.getMonth() + 1); // add 1 because months are indexed from 0
      let year = currentDate.getFullYear();
      let dt = month + "-" + day + "-" + year;
      dateArray.push(dt);
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }
    return dateArray;
  }
  showDialogToAdd() {
    this.timecardDisplay = "block";
    this.hiddenScroll();
  }
  addRecord(rowdata, index) {
    let newObj = [...this.listOfDates];
    this.listOfDates = [];
    newObj.splice(index + 1, 0, {
      entryDate: rowdata.entryDate,
      entryType: "1",
      startTime: undefined,
      endTime: undefined,
      loggedTime: "00:00",
      loggedTimeWithFraction: "00.00",
      description: " ",
      status: "1",
    });
    this.cdr.detectChanges();
    this.listOfDates = [...newObj];
  }
  hasDuplicates(obj, rowdata) {
    var objVal = obj.map((item) => {
      return item;
    });
    var isDublicate = objVal.filter((item, index) => {
      return (
        item.entryDate == rowdata.entryDate && item.status == rowdata.status
      );
    });
    if (isDublicate.length > 1) {
      return true;
    } else {
      return false;
    }
  }
  removeRecord(rowdata, index) {
    let newObj = [...this.listOfDates];
    this.listOfDates = [];
    if (rowdata?.timesheetDetailsId) {
      newObj[index].status = "0";
    } else {
      newObj.splice(index, 1);
    }
    this.cdr.detectChanges();
    this.listOfDates = [...newObj];
  }
  save() {
    //     if(this.customeEmailId){
    // this.selectedApproverEmailList.push(this.customeEmailId)
    //     }
    let reqObj = {
      timesheetPeriod: this.selectedPeriod,
      approverEmailIds: this.selectedApproverEmailList,
      employeeDetailsId: this.userId,
      timesheetEntries: this.listOfDates,
      timesheetDetailsId: null,
      projectDetailsId: this.selectedProjectId,
      totalLoggedTimeWithFraction: this.calculateTotalLoggedTimeInFraction(
        this.totalLoggedTime
      ),
    };
    if (this.timesheetsDetails != null) {
      reqObj.timesheetDetailsId = this.timesheetsDetails.timesheetDetailsId;
      this.timesheetService.updateTimesheet(reqObj).subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.f.reset();
            this.closeAddmodal();
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
          } else {
            this.errLabel = res.message;
          }
        },
        (error) => {
          this.errLabel = error;
        }
      );
    } else {
      this.timesheetService.saveTimesheet(reqObj).subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.f.reset();
            this.closeAddmodal();
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
          } else {
            this.errLabel = res.message;
          }
        },
        (error) => {
          this.errLabel = error;
        }
      );
    }
  }
  submitTimesheet() {
    let reqObj = {
      timesheetPeriod: this.selectedPeriod,
      approverEmailIds: this.selectedApproverEmailList,
      employeeDetailsId: this.userId,
      timesheetEntries: this.listOfDates,
      timesheetDetailsId: null,
      projectDetailsId: this.selectedProjectId,
      totalLoggedTimeWithFraction: this.calculateTotalLoggedTimeInFraction(
        this.totalLoggedTime
      ),
    };
    if (this.timesheetsDetails?.timesheetDetailsId) {
      reqObj.timesheetDetailsId = this.timesheetsDetails.timesheetDetailsId;
    }
    this.timesheetService.submitTimesheet(reqObj).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.f.reset();
          this.closeAddmodal();
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        } else {
          this.errLabel = res.message;
        }
      },
      (error) => {
        this.errLabel = error;
      }
    );
  }
  uploadScreenshot() {
    this.uploadedFileTitle = "";
    this.myInputVariable.nativeElement.value = "";
    this.fileToUpload = undefined;
    this.cdr.detectChanges();
    if (this.timesheetsDetails?.timesheetDetailsId) {
      this.uploadFileInfo = "block";
    } else {
      let reqObj = {
        timesheetPeriod: this.selectedPeriod,
        approverEmailIds: this.selectedApproverEmailList,
        employeeDetailsId: this.userId,
        timesheetEntries: this.listOfDates,
        timesheetDetailsId: null,
        projectDetailsId: this.selectedProjectId,
        totalLoggedTimeWithFraction: this.calculateTotalLoggedTimeInFraction(
          this.totalLoggedTime
        ),
      };
      this.timesheetService.saveTimesheet(reqObj).subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.getTimesheetDetails(this.userId, this.selectedPeriod);
            this.uploadFileInfo = "block";
          } else {
            this.sharedService.add({
              severity: "error",
              summary: "Error",
              detail: res.message,
            });
          }
        },
        (error) => {
          this.errLabel = error;
        }
      );
    }
  }
  closeUploadmodal(form?: NgForm) {
    this.cdr.detectChanges();
    this.onfocus(Event, this.selectedApproverEmailList);
    this.uploadFileInfo = "none";
    this.approverInfo = "none";
    this.customEmailModel = "none";
    this.confirmModel = "none";
    this.customEmail = "";
    this.customeEmailForm.reset();
    this.uploadFileInfoForm.reset();
    this.myInputVariable.nativeElement.value = "";
    this.fileToUpload = undefined;
    this.uploadedFileTitle = "";
    if (form) {
      form.reset();
    }
    // this.displayScroll();
  }
  saveUploadFile(form: NgForm) {
    let imageType: any;
    let fd = new FormData();
    if (this.fileToUpload) {
      imageType = this.fileToUpload.value.type.split("/")[1].toLowerCase();
      fd.append(
        "timesheetDetailsId",
        this.timesheetsDetails.timesheetDetailsId
      );
      fd.append("fileToUpload", this.fileToUpload.value);
      fd.append("documentTitle", this.uploadedFileTitle);
    }
    if (
      imageType == "jpeg" ||
      imageType == "jpg" ||
      imageType == "gif" ||
      imageType == "png" ||
      imageType == "pdf"
    ) {
      this.timesheetService.uploadTimesheet(fd).subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.getTimesheetDetails(this.userId, this.selectedPeriod);
            this.closeUploadmodal(form);
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
          } else {
            this.sharedService.add({
              severity: "error",
              summary: "Error!",
              detail: res.message,
            });
          }
        },
        (error) => {
          this.errorLabel = error;
        }
      );
    } else {
      this.sharedService.add({
        severity: "error",
        summary: "Error!",
        detail: `Please upload file in 'PNG', 'JPEG', 'JPG', 'GIF',"PDF" format`,
      });
      this.myInputVariable.nativeElement.value = "";
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
  getproject(event) {
    this.approverList(event.value, "1");
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
    if (!this.f.dirty) {
      this.timecardDisplay = "none";
      this.displayScroll();
      this.onClose.emit({ type: "cancel" });
    } else {
      this.unSavedModel = "block";
      //this.hiddenScroll();
    }
  }
  unSavedConfirm(type: boolean) {
    if (!type) {
      this.unSavedModel = "none";
      //this.displayScroll();
    } else {
      this.unSavedModel = "none";
      this.timecardDisplay = "none";
      this.displayScroll();
      this.onClose.emit({ type: "cancel" });
    }
  }
  async calculateTotalLoggedTimeInHours(listOfDates, rowIndex?) {
    this.totalLoggedTime = 0;
    this.totalRegularTime = 0;
    this.totalOvertimeTime = 0;
    this.totalSickTime = 0;
    this.totalOTPTime = 0;
    this.totalBreakTime = 0;
    this.totalDoubleOverTime = 0;
    this.totalMealPremiumTime = 0;
    await this.noOfHourIncrese(listOfDates, rowIndex);
    this.totalLoggedTime = await this.getTotalLoggedTime(listOfDates);
    this.totalRegularTime = await this.getTotalloggedTimeByEntryType(
      this.listOfDates,
      "1"
    );
    this.totalOvertimeTime = await this.getTotalloggedTimeByEntryType(
      this.listOfDates,
      "2"
    );
    this.totalDoubleOverTime = await this.getTotalloggedTimeByEntryType(
      this.listOfDates,
      "6"
    );
    this.totalSickTime = await this.getTotalloggedTimeByEntryType(
      this.listOfDates,
      "3"
    );
    this.totalOTPTime = await this.getTotalloggedTimeByEntryType(
      this.listOfDates,
      "4"
    );
    this.totalBreakTime = await this.getTotalloggedTimeByEntryType(
      this.listOfDates,
      "5"
    );
    this.totalMealPremiumTime = await this.getTotalloggedTimeByEntryType(
      this.listOfDates,
      "7"
    );
  }

  noOfHourIncrese(listOfDates, rowIndex) {
    return new Promise<void>(async (resolve, reject) => {
      for (let index = 0; index < listOfDates.length; index++) {
        let totalSec = await this.checkDateHours(
          listOfDates,
          listOfDates[index].entryDate
        );
        if (totalSec > 1439) {
          this.listOfDates[rowIndex].loggedTime = "00:00";
        }
      }
      resolve();
    });
  }
  checkDateHours(listOfDates, date) {
    let list = [...listOfDates];
    return new Promise(async (resolve, reject) => {
      let shortedObj = list.filter((a, b) => {
        return a.entryDate == date;
      });
      await this.getTotalLoggedTime(shortedObj).then((res) => {
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
  calculateTotalLoggedTimeInFraction(secs) {
    let time: any = (secs / 60).toString();
    console.log("secs" + secs);
    console.log("time" + time);

    let hh: any = "00";
    let mm: any = "00";
    if (time.indexOf(".") !== -1) {
      let [hours, minutes] = time.split(".");
      hh = hours.length < 2 ? "0" + hours : hours;
      mm = minutes.length < 2 ? minutes + "0" : minutes.slice(0, 2);
    } else {
      hh = time.length < 2 ? "0" + time : time;
    }
    return hh + "." + mm;
  }
  parseTime(time) {
    return new Promise((resolve, reject) => {
      let part = time.match(/(\d+):(\d+)(?: )?(am|pm)?/i);
      let hh = parseInt(part[1], 10);
      let mm = parseInt(part[2], 10);
      let ap = part[3] ? part[3].toUpperCase() : null;
      if (ap === "AM") {
        if (hh == 12) {
          hh = 0;
        }
      }
      if (ap === "PM") {
        if (hh != 12) {
          hh += 12;
        }
      }
      resolve({ hh: hh, mm: mm });
    });
  }

  calculateTimeInHoursMinuts(from: any, to: any) {
    return new Promise((resolve, reject) => {
      if (from && to) {
        let date1: any = new Date(2021, 7, 8, from.hh, from.mm);
        let date2: any = new Date(2021, 7, 8, to.hh, to.mm);
        // the following is to handle cases where the times are on the opposite side of
        // midnight e.g. when you want to get the difference between 9:00 PM and 5:00 AM
        if (date2 < date1) {
          date2.setDate(date2.getDate() + 1);
        }
        let msec = date2 - date1;
        let hh: any = Math.floor(msec / 1000 / 60 / 60);
        msec -= hh * 1000 * 60 * 60;
        let mm: any = Math.floor(msec / 1000 / 60);
        hh = hh < 10 ? "0" + hh : hh;
        mm = mm < 10 ? "0" + mm : mm;
        resolve(hh + ":" + mm);
      } else {
        resolve("00:00");
      }
    });
  }
  calculateLoggedTimeInHours(loggedTimeInFraction) {
    console.log(loggedTimeInFraction);
    return new Promise((resolve, reject) => {
      if (loggedTimeInFraction) {
        let [hours, fraction] = loggedTimeInFraction.split(".");
        let minutes: any = "00";
        fraction = "0." + fraction;
        let value = fraction * 60;
        minutes = Math.round(value);
        console.log(minutes);
        minutes = minutes.length < 2 ? "0" + minutes : minutes;
        hours = hours.length < 2 ? "0" + hours : hours;
        resolve(hours + ":" + minutes);
      } else {
        resolve("00:00");
      }
    });
  }
  calculateLoggedTimeInFraction(loggedTimeInHours) {
    console.log(loggedTimeInHours);
    return new Promise((resolve, reject) => {
      if (loggedTimeInHours) {
        let xyz = String(loggedTimeInHours);
        let hours, minutes;
        if (xyz.includes(":")) {
          [hours, minutes] = loggedTimeInHours.split(":");
        }
        if (xyz.includes(".")) {
          [hours, minutes] = loggedTimeInHours.split(".");
        }
        let fraction = minutes / 60;
        let decimal = "00";
        if (fraction) {
          let fraction1 = fraction.toFixed(2);
          console.log("fraction2:" + fraction1);
          decimal = fraction1.toString().split(".")[1]; //pickup decimal
        }
        console.log("decimal: " + decimal);
        hours = hours.length < 2 ? "0" + hours : hours;
        resolve(hours + "." + decimal);
      } else {
        resolve("00.00");
      }
    });
  }
  async onLoggedTimeChange(rowData, rowIndex) {
    if (rowData.startTime && rowData.endTime) {
      let startTime = await this.parseTime(rowData.startTime);
      let endTime = await this.parseTime(rowData.endTime);
      let loggedTimeInHours = await this.calculateTimeInHoursMinuts(
        startTime,
        endTime
      );
      if (loggedTimeInHours != rowData.loggedTime) {
        this.listOfDates[rowIndex].startTime = undefined;
        this.listOfDates[rowIndex].endTime = undefined;
        this.listOfDates[rowIndex].loggedTimeWithFraction =
          await this.calculateLoggedTimeInFraction(rowData.loggedTime);
      }
    } else {
      this.listOfDates[rowIndex].loggedTimeWithFraction =
        await this.calculateLoggedTimeInFraction(rowData.loggedTime);
    }
  }
  async onLoggedFractionTimeChange(rowData, rowIndex) {
    if (rowData.startTime && rowData.endTime) {
      let startTime = await this.parseTime(rowData.startTime);
      let endTime = await this.parseTime(rowData.endTime);
      let loggedTimeInHours = await this.calculateTimeInHoursMinuts(
        startTime,
        endTime
      );
      let loggedTimeInFraction = await this.calculateLoggedTimeInFraction(
        loggedTimeInHours
      );
      if (loggedTimeInFraction != rowData.loggedTimeWithFraction) {
        this.listOfDates[rowIndex].startTime = undefined;
        this.listOfDates[rowIndex].endTime = undefined;
        this.listOfDates[rowIndex].loggedTime =
          await this.calculateLoggedTimeInHours(rowData.loggedTimeWithFraction);
        this.listOfDates[rowIndex].loggedTimeWithFraction =
          await this.calculateLoggedTimeInFraction(rowData.loggedTime);
      }
    } else {
      this.listOfDates[rowIndex].loggedTime =
        await this.calculateLoggedTimeInHours(rowData.loggedTimeWithFraction);
      this.listOfDates[rowIndex].loggedTimeWithFraction =
        await this.calculateLoggedTimeInFraction(rowData.loggedTime);
    }
  }

  async onCalculateTimeDiff(rowData, rowIndex) {
    if (rowData.startTime && rowData.endTime) {
      let startTime = await this.parseTime(rowData.startTime);
      let endTime = await this.parseTime(rowData.endTime);
      let loggedTimeInHours = await this.calculateTimeInHoursMinuts(
        startTime,
        endTime
      );
      let loggedTimeInFraction = await this.calculateLoggedTimeInFraction(
        loggedTimeInHours
      );
      this.listOfDates[rowIndex].loggedTime = loggedTimeInHours;
      this.listOfDates[rowIndex].loggedTimeWithFraction = loggedTimeInFraction;
    }
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
  deleteScreenShot(data, index) {
    this.deleteAttachmentRowData = data;
    this.deleteAttachmentRowDataIndex = index;
    this.confirmModel = "block";
    this.hiddenScroll();
  }
  confirm(data, index) {
    this.timesheetService
      .deleteTimesheetById(data.timesheetAttachmentDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.confirmModel = "none";
          this.timesheetsDetails?.attachments.splice(index, 1);
        }
      });
  }

  approverList(projectDetailsId, status) {
    return new Promise<void>((resolve, reject) => {
      this.timesheetService
        .getApproverList(projectDetailsId, status)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.approverEmailList = res.responsePayload;
            resolve();
          } else {
            this.approverEmailList = [];
            resolve();
          }
          // this.approverEmailList.push({
          //   approverEmail: "Provide Approver Email",
          // });
        });
    });
  }
  async onfocus(event, list) {
    let obj = [...list];
    this.selectedApproverEmailList = [];
    let abc = new Promise<void>((res, rej) => {
      if (obj.length > 0) {
        obj.forEach((element) => {
          this.selectedApproverEmailList.push(element);
        });
      }
      this.cdr.detectChanges();
      res();
    });
    await abc;
  }
  onImageViewCloseClick(event) {
    if (event.type == "cancel") {
      this.imageBlob = null;
      this.viewImage = false;
      this.hiddenScroll();
    }
  }
  onInputKeyUp(event, listOfDates) {
    // this.calculateTotalLoggedTimeInHours(listOfDates)
  }
  emailChoosen(event) {
    let email: any;
    this.isCustomEmail = false;
    if (event && event.approverEmail) {
      if (event.approverEmail == "Provide Approver Email") {
        this.isCustomEmail = true;
        this.showCustomEmail();
      } else {
        email = this.selectedApproverEmailList.filter((res) => {
          return res == event.approverEmail;
        });
        if (!email.length) {
          this.selectedApproverEmailList.push(event.approverEmail);
        }
      }
    }
    // event.forEach((element) => {
    //   if (element && element.approverEmail) {
    //     email = this.selectedApproverEmailList.filter((res) => {
    //       return res == element.approverEmail;
    //     });
    //     console.log(email);
    //     if (!email[0]) {
    //       if (
    //         email[0] != element.approverEmail &&
    //         element.approverEmail != "Provide Approver Email"
    //       ) {
    //         this.selectedApproverEmailList.push(element.approverEmail);
    //       } else if (element.approverEmail != "Provide Approver Email") {
    //         var emialIndex = this.selectedApproverEmailList.indexOf(
    //           element.approverEmail
    //         );
    //         this.selectedApproverEmailList.splice(emialIndex, 1);
    //       } else if (element.approverEmail == "Provide Approver Email") {
    //         this.isCustomEmail = true;
    //         this.showCustomEmail();
    //       }
    //     }
    //   }
    // });
  }
  showCustomEmail() {
    this.customEmailModel = "block";
    this.hiddenScroll();
  }
  saveCustomEmail(form?: NgForm) {
    let email;
    email = this.selectedApproverEmailList.filter((res) => {
      return res == this.customEmail;
    });
    if (!email.length) {
      this.selectedApproverEmailList.push(this.customEmail);
      this.customEmailModel = "none";
      this.customEmail = "";
      if (form) {
        form.reset();
      }
      this.displayScroll();
    } else {
      this.sharedService.add({
        severity: "error",
        summary: "Error",
        detail: "This email already inserted",
      });
    }
  }
  removeChosenEmailId(index) {
    this.selectedApproverEmailList.splice(index, 1);
  }
}
