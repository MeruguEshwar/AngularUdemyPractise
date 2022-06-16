import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ApiResponse } from "@app/shared/models/api-response.model";
import { SignatureDetailsModel } from "@app/shared/models/signature-module.model";
import { SharedService } from "@app/shared/shared.service";

@Component({
  selector: "app-i9-w4-signature-model",
  templateUrl: "./i9-w4-signature-model.component.html",
  styleUrls: ["./i9-w4-signature-model.component.css"],
})
export class I9W4SignatureModelComponent implements OnInit {
  clientErrorMsg: any;
  public uploadDisplay: string = "none";
  dateOfBirth: string = "";
  showDOB: boolean = false;
  ssn: string;
  @Input() signatureDetails: SignatureDetailsModel;
  @Input() formType: string;
  @Input() userId: any;
  @Output() onClose = new EventEmitter<any>();
  constructor(public sharedService: SharedService, private http: HttpClient) {}

  ngOnInit(): void {
    this.showDialogToAdd();
    switch (this.formType) {
      case "W4":
        if (this.signatureDetails.w4Config == 4) {
          this.showDOB = true;
        } else {
          this.showDOB = false;
        }
        break;
      case "I9":
        if (this.signatureDetails.i9Config == 4) {
          this.showDOB = true;
        } else {
          this.showDOB = false;
        }
        break;
      default:
        this.showDOB = false;
        break;
    }
  }
  closeAddmodal() {
    this.uploadDisplay = "none";
    this.displayScroll();
    this.onClose.emit({ type: "cancel" });
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
  showDialogToAdd() {
    this.uploadDisplay = "block";
    this.hiddenScroll();
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
  save() {
    this.http
      .get<ApiResponse<any>>(
        `/api/profile/employee/ssn/dob/validate/${this.userId}?ssn=${this.ssn}&dateOfBirth=${this.dateOfBirth}`
      )
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.uploadDisplay = "none";
          this.displayScroll();
          this.onClose.emit({ type: "success" });
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
