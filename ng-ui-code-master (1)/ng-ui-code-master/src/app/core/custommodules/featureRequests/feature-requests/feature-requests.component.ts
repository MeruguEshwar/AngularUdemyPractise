import { Component, Input, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "@app/core/service/auth.service";
import { EmployeeRequestStatus } from "@app/shared/enums/employeeRequestStatus.enum";
import { EmployeeRequest } from "@app/shared/models/employeeRequest.model";
import { FeatureRequest } from "@app/shared/models/featureRequest.model";
import { SharedService } from "@app/shared/shared.service";
import { FeatureRequestService } from "../featureRequest.service";

@Component({
  selector: "app-feature-requests",
  templateUrl: "./feature-requests.component.html",
  styleUrls: ["./feature-requests.component.css"],
})
export class FeatureRequestsComponent implements OnInit {
  @Input() userId: number = -1;
  switchedView: boolean = false;
  user: any;
  empRequestList: EmployeeRequest[];
  selectedEmpRequestList: FeatureRequest;
  empRequestDetails: FeatureRequest;
  empRequestType: string;
  public confirmModel: string = "none";
  clientErrorMsg: any;
  cols: any = [];
  confirmType: string;
  statusUpdateType: string;
  rowData: any;
  statusComments: string;
  constructor(
    public sharedService: SharedService,
    private featureRequestService: FeatureRequestService,
    public authService: AuthService
  ) {}
  get EmployeeRequestStatus() {
    return EmployeeRequestStatus;
  }

  ngOnInit(): void {
    this.switchedView = this.sharedService.getUserViewType();
    this.user = this.authService.currentUser;
    this.empRequestDetails = new FeatureRequest();
    if (this.userId == -1) {
      this.userId = this.authService.currentUser.employeeDetailsId;
    }
    if (this.user.role) {
    } else {
    }
    this.getFeatureRequest(this.userId);
    if (this.user.role == "supremeadmin") {
      this.cols = [
        { field: "employeeName", header: "Employee Name" },
        { field: "organizationName", header: "Organization Name" },
        { field: "summary", header: "Summary" },
        { field: "description", header: "Description" },
        { field: "requestedDateTime", header: "Requested Date Time" },
        { field: "status", header: "Status" },
      ];
    } else {
      this.cols = [
        { field: "summary", header: "Summary" },
        { field: "description", header: "Description" },
        { field: "requestedDateTime", header: "Requested Date Time" },
        { field: "status", header: "Status" },
      ];
    }
  }
  getFeatureRequest(employeeDetailsId) {
    if (this.user.role == "supremeadmin") {
      this.featureRequestService.getAllFeatureRequest().subscribe((res) => {
        if (res.statusCode == 200) {
          this.empRequestList = res.responsePayload;
        }
      });
    } else {
      this.featureRequestService
        .getFeatureRequest(employeeDetailsId)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.empRequestList = res.responsePayload;
          }
        });
    }
  }
  onDeleteRequest(rowData) {
    this.confirmModel = "block";
    this.selectedEmpRequestList = rowData;
    this.hiddenScroll();
  }
  confirmDelete() {
    this.featureRequestService
      .deleteEmployeeRequest(
        this.selectedEmpRequestList.featureRequestDetailsId
      )
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.closeModal();
        }
      });
  }
  showDialogToAdd() {
    this.empRequestType = "Add";
  }
  closeModal() {
    this.confirmModel = "none";
    this.getFeatureRequest(this.userId);
    this.displayScroll();
  }
  onEditAddCloseClick(event) {
    if (event.type == "add" || event.type == "edit") {
      this.getFeatureRequest(this.userId);
    }
    this.empRequestType = "";
  }
  statusUpdate(rowData, status, type) {
    this.statusUpdateType = status;
    this.rowData = rowData;
    this.confirmType = type;
  }
  confirm(f: NgForm) {
    if (this.statusComments) {
      this.featureRequestService
        .featureReqStatusUpdate(
          this.rowData.featureRequestDetailsId,
          this.statusUpdateType,
          this.statusComments
        )
        .subscribe((res) => {
          if (res.statusCode == 200) {
            f.reset();
            this.getFeatureRequest(this.userId);
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
}
