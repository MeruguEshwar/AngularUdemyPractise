import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ApproversService } from "./approvers.service";
import { authCode } from "@app/shared/models/approver.model";
import { SharedService } from "@app/shared/shared.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-approvers",
  templateUrl: "./approvers.component.html",
  styleUrls: ["./approvers.component.css"],
})
export class ApproversComponent implements OnInit {
  approverType: number;
  approverDetails: authCode;
  loading: boolean = false;
  allapproverDetails: authCode[];
  selectedGroup: boolean = false;
  selectedTimesheet: boolean = false;
  selectedInvoice: boolean = false;
  selectedSendRegisrationLink: boolean = false;
  selectedAuthorization: boolean = false;
  canDeactivateApprover: boolean = true;
  selectedRowData: any;
  selectedrowIndex: any;
  @ViewChild("f") form: any;
  addApproverModel: string = "none";
  cols = [
    { field: "approverEmail", header: "Approver Email Id" },
    { field: "authorizationCode", header: "Auth Code" },
    { field: "group", header: "Group" },
    // { field: "authorization", header: "Authorization" },
    { field: "invoiceApprover", header: "Invoice Approver" },
    { field: "timesheetApprover", header: "Timesheet Approver" },
  ];
  @Input() isApproverShow: boolean = false;
  constructor(
    private approverService: ApproversService,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.approverDetails = new authCode();
    this.approverType = 1;
    this.refreshAuthCode();
    this.getApprovers(this.approverType.toString());
    this.sharedService.openToggleMenu("roleMenuToggleExternalContent");
  }
  handleChange(event) {
    if (event.index == 0) {
      this.approverType = 1;
      this.approverDetails = new authCode();
      this.refreshAuthCode();
      this.getApprovers(this.approverType.toString());
    }
    if (event.index == 1) {
      this.approverType = 0;
      this.getApprovers(this.approverType.toString());
    }
  }
  refreshAuthCode() {
    this.approverService.getAuthCode().subscribe((res) => {
      if (res.statusCode == 200) {
        this.approverDetails.authorizationCode = res.responsePayload;
      } else {
        this.approverDetails.authorizationCode = null;
      }
    });
  }
  getApprovers(status) {
    let obj = {
      status: status,
    };
    this.approverService.getAllApprovers(obj).subscribe((res) => {
      if (res.statusCode == 200) {
        this.allapproverDetails = res.responsePayload;
        this.allapproverDetails.forEach((element, index) => {
          this.allapproverDetails[index].statusChecked = +element.status
            ? true
            : false;
          this.allapproverDetails[index].groupChecked = +element.group
            ? true
            : false;
          this.allapproverDetails[index].authorizationCkecked =
            +element.authorization ? true : false;
        });
      } else {
        this.allapproverDetails = [];
      }
    });
  }
  save() {
    this.approverDetails.group = this.returnSelectedType(this.selectedGroup);
    this.approverDetails.authorization = this.returnSelectedType(
      this.selectedAuthorization
    );
    this.approverDetails.timesheetApprover = this.returnSelectedType(
      this.selectedTimesheet
    );
    this.approverDetails.invoiceApprover = this.returnSelectedType(
      this.selectedInvoice
    );
    this.approverDetails.sendRegistrationLink = this.returnSelectedType(
      this.selectedSendRegisrationLink
    );
    this.approverService.saveApprover(this.approverDetails).subscribe((res) => {
      if (res.statusCode == 200) {
        this.approverDetails = new authCode();
        this.refreshAuthCode();
        this.resetSelections();
        this.getApprovers(this.approverType.toString());
        this.form.resetForm();
        this.cancel(this.form);
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
    });
  }
  editRecord(rowData, index) {
    this.approverDetails = new authCode();
    this.approverDetails = rowData;
    this.setSelection(rowData);
    this.showDialogToAdd();
  }
  reset(form: NgForm) {
    this.resetSelections();
    this.approverDetails = new authCode();
    this.refreshAuthCode();
    form.reset();
  }
  returnSelectedType(type) {
    return type ? "1" : "0";
  }
  resetSelections() {
    this.selectedGroup = false;
    this.selectedTimesheet = false;
    this.selectedInvoice = false;
    this.selectedSendRegisrationLink = false;
    this.selectedAuthorization = false;
    this.canDeactivateApprover = true;
    this.foundAssignedApprovers = undefined;
  }
  setSelection(obj) {
    this.selectedGroup = +obj?.group ? true : false;
    this.selectedAuthorization = +obj?.authorization ? true : false;
    this.selectedTimesheet = +obj?.timesheetApprover ? true : false;
    this.selectedInvoice = +obj?.invoiceApprover ? true : false;
    this.selectedSendRegisrationLink = +obj?.sendRegistrationLink
      ? true
      : false;
  }

  updateApproverAuthorization(event, rowData) {
    let authorization: string;
    if (event.checked) {
      authorization = "1";
    } else {
      authorization = "0";
    }
    this.approverService
      .updateApproverAuthorization(rowData.approverDetailsId, authorization)
      .subscribe((res) => {
        this.getApprovers(this.approverType.toString());
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }
  updateApproverGroup(event, rowData) {
    let group: string;
    if (event.checked) {
      group = "1";
    } else {
      group = "0";
    }
    this.approverService
      .updateApproverGroup(rowData.approverDetailsId, group)
      .subscribe((res) => {
        this.getApprovers(this.approverType.toString());
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }
  onActionApprover(rowData, rowIndex) {
    console.log(rowData);
    console.log(rowIndex);
    this.verifyApproverAssignments("Both", rowData.approverDetailsId);
    this.selectedRowData = rowData;
    this.selectedrowIndex = rowIndex;
  }
  actionApprover(event, rowData, rowIndex) {
    if (event) {
      this.activateApprover(rowData.approverDetailsId);
    } else {
      this.deactivateApprover(rowData.approverDetailsId);
    }
  }
  activateApprover(approverDetailsId) {
    this.approverService
      .activateApprover(approverDetailsId)
      .subscribe((res) => {
        this.getApprovers(this.approverType.toString());
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }
  deactivateApprover(approverDetailsId) {
    this.approverService
      .deactivateApprover(approverDetailsId)
      .subscribe((res) => {
        this.getApprovers(this.approverType.toString());
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }

  groupChange(event) {
    if (event.checked) {
      this.selectedAuthorization = true;
      this.approverDetails.authorizationCode = "NA";
    } else {
      this.refreshAuthCode();
      this.selectedAuthorization = false;
    }
  }
  showDialogToAdd() {
    this.addApproverModel = "block";
    //this.addemployeeDisplay = "block";
    this.hiddenScroll();
  }
  hiddenScroll() {
    try {
      let bodyElement = document.getElementById("modalbody") as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.add("modal-open");
      }
    } catch (ex) {
      //this.clientErrorMsg(ex, "hiddenScroll");
    }
  }

  displayScroll() {
    try {
      let bodyElement = document.getElementById("modalbody") as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.remove("modal-open");
      }
    } catch (ex) {
      // this.clientErrorMsg(ex, "displayScroll");
    }
  }
  cancel(form: NgForm) {
    this.addApproverModel = "none";
    this.approverDetails = new authCode();
    this.refreshAuthCode();
    this.resetSelections();
    this.displayScroll();
    if (form) {
      form.reset();
    }
  }
  checkDeactivationApprover(event, type) {
    console.log(event);
    let firstCheck: boolean = false;
    if (type == "Timesheet") {
      firstCheck = +this.approverDetails.timesheetApprover ? true : false;
    } else if (type == "Invoice") {
      firstCheck = +this.approverDetails.invoiceApprover ? true : false;
    }
    if (
      !event.checked &&
      firstCheck &&
      this.approverDetails.approverDetailsId
    ) {
      this.verifyApproverAssignments(
        type,
        this.approverDetails.approverDetailsId
      );
    }
  }
  foundAssignedApprovers: any;
  verifyApproverAssignments(type, approverDetailsId) {
    this.approverService
      .verifyApproverAssignments(type, approverDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          if (
            res.responsePayload.assignedProjects ||
            res.responsePayload.assignedCustomers
          ) {
            this.foundAssignedApprovers = res.responsePayload;
            this.canDeactivateApprover = false;
            if (type == "Timesheet") {
              this.selectedTimesheet = true;
            } else if (type == "Invoice") {
              this.selectedInvoice = true;
            }
          }
          // this.sharedService.add({
          //   severity: "success",
          //   summary: "Success",
          //   detail: res.message,
          // });
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }
}
