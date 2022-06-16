import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { TimesheetsServices } from "@app/core/custommodules/timesheets/timesheets.services";
import { SharedService } from "@app/shared/shared.service";
import { FormControl } from "@angular/forms";
import { HttpResponse } from "@angular/common/http";

@Component({
  selector: "app-profile-timecard",
  templateUrl: "./profile-timecard.component.html",
  styleUrls: ["./profile-timecard.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileTimecardComponent implements OnInit {
  public timecardDisplay: string = "none";
  @Output() onClose = new EventEmitter<any>();
  @Input() userId: any;
  @Input() timesheetType: string;
  @Input() recordData: any;
  clientErrorMsg: any;
  approverEmailId: string;
  timesheetsDates: any;
  listOfDates: any;
  filterEmails: any;
  selectedPeriod: string;
  entryType: any;
  cols: any;
  loading: boolean = false;
  errLabel: any;
  timesheetsDetails: any;
  fileToUpload: any;
  @ViewChild("fileInput")
  myInputVariable: ElementRef;
  uploadFileInfo: string = "none";
  errorLabel: string = "";
  assignProjects: any;
  selectedProjectId: any;
  status: any;
  projectDetails: any;
  totalLoggedTime: any = 0;

  allEmails: any = ["one@gmail.com", "two@gmail.com", "three@gmail.com"];
  constructor(
    private timesheetService: TimesheetsServices,
    private sharedService: SharedService,
    private changeRef: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.cols = [
      { field: "entryDate", header: "Date" },
      { field: "entryType", header: "Entry Type" },
      { field: "loggedTime", header: "Logged Time" },
      { field: "description", header: "Description" },
    ];
    this.entryType = [
      {
        label: "Regular ",
        value: 1,
      },
      {
        label: "Overtime  ",
        value: 2,
      },
      {
        label: "Sick  ",
        value: 3,
      },
      {
        label: "PTO ",
        value: 4,
      },
      {
        label: "Break ",
        value: 5,
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
    this.totalLoggedTime = await this.getTotalLoggedTime(this.listOfDates);
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
    this.totalLoggedTime = await this.getTotalLoggedTime(this.listOfDates);
  }
  getTimesheetDetails(userId, period) {
    //return new Promise<void>((resolve, reject) => {
    const dates = period.split(" - ");
    const fromDate = dates[0];
    const toDate = dates[1];
    this.timesheetService
      .getTimesheetDetails(userId, period)
      .subscribe(async (res) => {
        const days = this.getDays(fromDate, toDate);
        this.listOfDates = [];
        if (res.statusCode == 200) {
          this.timesheetsDetails = res.responsePayload;
          const resObj = res.responsePayload.timesheetEntries;
          this.approverEmailId = res.responsePayload.approverEmailId;
          this.status = this.getStatus(res.responsePayload.status);

          this.selectedProjectId = res.responsePayload.projectDetailsId;
          days.forEach((dayElemnt, dayindex) => {
            this.listOfDates.push({
              entryDate: dayElemnt,
              entryType: 1,
              loggedTime: "00:00",
              description: " ",
              status: "1",
            });
            resObj.forEach((resObjElement, resObjIndex) => {
              if (resObjElement.entryDate == dayElemnt) {
                this.listOfDates[dayindex] = resObjElement;
              }
            });
          });
          // resolve();
        } else {
          this.approverEmailId = "";
          this.selectedProjectId = null;
          this.status = "New";
          this.timesheetsDetails = res.responsePayload;
          days.forEach((element) => {
            this.listOfDates.push({
              entryDate: element,
              entryType: 1,
              loggedTime: "00:00",
              description: " ",
              status: "1",
            });
          });
          // resolve();
        }
      });
    //});
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
    newObj.push({
      entryDate: rowdata.entryDate,
      entryType: 1,
      loggedTime: "00:00",
      description: " ",
      status: "1",
    });
    this.listOfDates = newObj;
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
    if (rowdata?.timesheetDetailsId) {
      newObj[index].status = "0";
    } else {
      newObj.splice(index, 1);
    }
    this.listOfDates = newObj;
  }
  save() {
    let reqObj = {
      timesheetPeriod: this.selectedPeriod,
      approverEmailId: this.approverEmailId,
      employeeDetailsId: this.userId,
      timesheetEntries: this.listOfDates,
      timesheetDetailsId: null,
      projectDetailsId: this.selectedProjectId,
    };
    if (this.timesheetsDetails != null) {
      reqObj.timesheetDetailsId = this.timesheetsDetails.timesheetDetailsId;
      this.timesheetService.updateTimesheet(reqObj).subscribe(
        (res) => {
          if (res.statusCode == 200) {
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
      approverEmailId: this.approverEmailId,
      employeeDetailsId: this.userId,
      timesheetEntries: this.listOfDates,
      timesheetDetailsId: null,
      projectDetailsId: this.selectedProjectId,
    };
    if (this.timesheetsDetails?.timesheetDetailsId) {
      reqObj.timesheetDetailsId = this.timesheetsDetails.timesheetDetailsId;
    }
    this.timesheetService.submitTimesheet(reqObj).subscribe(
      (res) => {
        if (res.statusCode == 200) {
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
    if (this.timesheetsDetails?.timesheetDetailsId) {
      this.uploadFileInfo = "block";
    } else {
      let reqObj = {
        timesheetPeriod: this.selectedPeriod,
        approverEmailId: this.approverEmailId,
        employeeDetailsId: this.userId,
        timesheetEntries: this.listOfDates,
        timesheetDetailsId: null,
        projectDetailsId: this.selectedProjectId,
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
              detail: "Enable to upload",
            });
          }
        },
        (error) => {
          this.errLabel = error;
        }
      );
    }
  }
  closeUploadmodal() {
    this.uploadFileInfo = "none";
  }
  saveUploadFile() {
    let fd = new FormData();
    fd.append("timesheetDetailsId", this.timesheetsDetails.timesheetDetailsId);
    fd.append("fileToUpload", this.fileToUpload.value);
    this.timesheetService.uploadTimesheet(fd).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.closeUploadmodal();
          this.myInputVariable.nativeElement.value = "";
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
    if (this.timesheetsDetails) {
      this.approverEmailId = this.timesheetsDetails.approverEmailId;
    } else {
      this.projectDetails.forEach((element) => {
        if (element.projectDetailsId == event.value) {
          this.approverEmailId = element.approverEmail;
          return;
        }
      });
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
  closeAddmodal() {
    this.timecardDisplay = "none";
    this.displayScroll();
    this.onClose.emit({ type: "cancel" });
  }

  emailList($event) {
    let query = $event.query;

    this.filterEmails = [];
    for (let i = 0; i < this.allEmails.length; i++) {
      let email = this.allEmails[i];
      if (email.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        this.filterEmails.push(email);
      }
    }
  }
  async changeLoggedTimeCalculation(listOfDates) {
    this.totalLoggedTime = await this.getTotalLoggedTime(listOfDates);
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
  downloadScreenShot(data) {
    this.timesheetService
      .downloadTimesheet(data.timesheetDetailsId)
      .subscribe((resp: HttpResponse<Blob>) => {
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
}
