import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NgForm } from "@angular/forms";
import { EmployeeRequest } from "@app/shared/models/employeeRequest.model";
import { FeatureRequest } from "@app/shared/models/featureRequest.model";
import { SharedService } from "@app/shared/shared.service";
import { FeatureRequestService } from "../featureRequest.service";

@Component({
  selector: "app-edit-feature-request",
  templateUrl: "./edit-feature-request.component.html",
  styleUrls: ["./edit-feature-request.component.css"],
})
export class EditFeatureRequestComponent implements OnInit {
  @Input() selectedEmpRequestList: any;
  @Input() empRequestType: string;
  @Input() userId: number;
  @Output() onClose = new EventEmitter<any>();
  public employeeRequestModel: string = "none";
  clientErrorMsg: any;
  requestTypes: any[] = [
    { name: "Advance Request", key: "1" },
    { name: "Ask a Question to Employer", key: "2" },
    { name: "Request for Correction", key: "3" },
  ];
  empRequestDetails: FeatureRequest;
  constructor(
    public sharedService: SharedService,
    private featureRequestService: FeatureRequestService
  ) {}

  ngOnInit(): void {
    if (this.empRequestType == "Add") {
      this.empRequestDetails = new FeatureRequest();
      this.empRequestDetails.employeeDetailsId = this.userId;
    } else {
      this.empRequestDetails = this.selectedEmpRequestList;
    }
    this.showDialogToAdd();
  }
  save(form: NgForm) {
    this.featureRequestService
      .saveEmployeeRequest(this.empRequestDetails)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          form.reset();
          this.onClose.emit({ type: "add" });
          this.employeeRequestModel = "none";
          this.displayScroll();
        }
      });
  }
  showDialogToAdd() {
    this.employeeRequestModel = "block";
    this.hiddenScroll();
  }
  closeAddmodal() {
    this.employeeRequestModel = "none";
    this.onClose.emit({ type: "cancel" });
    this.displayScroll();
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
