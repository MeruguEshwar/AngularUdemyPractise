import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { I9FormStatus } from "@app/shared/enums/i9.enum";
import { I9 } from "@app/shared/models/i9-module.model";
import { I9VeirifyModel } from "@app/shared/models/i9-verify-module.model";
import { SharedService } from "@app/shared/shared.service";
import { I9Service } from "../i9.services";

@Component({
  selector: "app-verify-i9",
  templateUrl: "./verify-i9.component.html",
  styleUrls: ["./verify-i9.component.css"],
})
export class VerifyI9Component implements OnInit {
  @Input() isEmp: boolean = false;
  @Input() webI9Details: I9;
  @Output() onClose = new EventEmitter<any>();
  showVerify: string = "none";
  listA: String = "";
  listB: String = "";
  listC: String = "";
  clientErrorMsg: any;
  listADisabled: boolean = false;
  listBDisabled: boolean = false;
  listCDisabled: boolean = false;
  nextDisabled: boolean = true;
  verifyDisplay: string = "none";
  messageDisplay: string = "none";
  deleteConfirmModel: string = "none";
  editType: string = "";
  verifyDetails: I9VeirifyModel;
  errLabel: string;
  isMiddleInitial: boolean = false;
  currentDate: Date = new Date();
  fileToUpload: any;
  uploadedFileTitle: string;
  uploadFileInfo: string = "none";
  @ViewChild("fileInput") myInputVariable: ElementRef;
  verificationAttachmentDetails: I9VerificationDocumentDetails[];
  deleteAttachmentRowData: any;
  get Status() {
    return I9FormStatus;
  }

  constructor(
    private i9Services: I9Service,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.showDialogToAdd();
  }
  showDialogToAdd() {
    this.showVerify = "block";
    this.hiddenScroll();
  }
  handleList(event, listType) {
    if (listType == "A") {
      this.listBDisabled = true;
      this.listCDisabled = true;
    }
    if (listType == "B" || listType == "C") {
      this.listADisabled = true;
    }
    if (this.listA || (this.listB && this.listC)) {
      this.nextDisabled = false;
    } else {
      this.nextDisabled = true;
    }
  }
  closeVerify() {
    this.showVerify = "none";
    this.displayScroll();
    this.onClose.emit({ type: "cancel" });
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
  next() {
    this.verifyDisplay = "block";
    this.editType = "verify";
    this.verifyDetails = new I9VeirifyModel();
    this.verifyDetails.verifiedDate =
      this.currentDate.getMonth() +
      1 +
      "-" +
      this.currentDate.getDate() +
      "-" +
      this.currentDate.getFullYear();
    this.hiddenScroll();
    this.getI9ValidationDocument(this.webI9Details.i9DetailsId);
  }
  closeVerifyModel() {
    this.verifyDisplay = "none";
  }
  approve() {
    this.verifyDetails.approveOrReject = "2";
    this.approveOrReject();
    this.hiddenScroll();
  }
  addMessage: string;
  reject() {
    this.verifyDetails.approveOrReject = "0";
    this.verifyDisplay = "block";
    this.messageDisplay = "block";
    this.addMessage = "message";
    this.errLabel = "";
    // this.approveOrReject();
    // this.hiddenScroll();
  }
  approveOrReject() {
    this.verifyDetails.i9DetailsId = this.webI9Details.i9DetailsId;
    if (!this.listADisabled) {
      this.verifyDetails.listATypeDocumentOption = this.listA;
    }
    if (!this.listBDisabled) {
      this.verifyDetails.listBTypeDocumentOption = this.listB;
    }
    if (!this.listCDisabled) {
      this.verifyDetails.listCTypeDocumentOption = this.listC;
    }
    this.i9Services.verifyI9Details(this.verifyDetails).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.cancel();
          this.onClose.emit({ type: "success" });
        } else {
          this.errLabel = res.message;
        }
      },
      (error) => {
        this.errLabel = error;
      }
    );
  }
  addMessageCancel() {
    this.verifyDetails.rejectReason = "";
    this.messageDisplay = "none";
  }
  submit() {
    this.approveOrReject();
    this.addMessage = "";
  }
  cancel() {
    this.verifyDisplay = "none";
    this.messageDisplay = "none";
    this.showVerify = "none";
    this.errLabel = "";
    this.displayScroll();
  }
  checkApplicable(event, type) {
    switch (type) {
      case "isMiddleInitial":
        this.isMiddleInitial
          ? (this.verifyDetails.employeeMiddleName = "NA")
          : (this.verifyDetails.employeeMiddleName = undefined);
        break;
        break;
    }
  }
  onDocExp(value) {
    console.log(typeof value);
    var currentDate = new Date();
    if (value < currentDate) {
      this.sharedService.add({
        severity: "warning",
        summary: "Warning",
        detail: "The expired document is configuring",
      });
    }
  }
  uploadAttachemnts() {
    this.uploadFileInfo = "block";
  }
  onDeleteAttachment(rowData) {
    this.deleteAttachmentRowData = rowData;
    this.deleteConfirmModel = "block";
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      let imageType = file.type.split("/")[1].toLowerCase();
      console.log(imageType);
      if (
        imageType == "jpeg" ||
        imageType == "jpg" ||
        imageType == "gif" ||
        imageType == "png" ||
        imageType == "pdf"
      ) {
        this.fileToUpload = file;
      } else {
        this.sharedService.add({
          severity: "error",
          summary: "Error!",
          detail: `Please upload file in 'PNG', 'JPEG', 'JPG', 'GIF',"PDF" format`,
        });
        this.fileToUpload = undefined;
        this.myInputVariable.nativeElement.value = "";
      }
    } else {
      this.fileToUpload = undefined;
    }
  }
  clearFile() {
    this.myInputVariable.nativeElement.value = "";
    this.fileToUpload = undefined;
  }
  closeUploadmodal(form?: NgForm) {
    this.uploadFileInfo = "none";
    if (form) {
      form.reset();
    }
    this.myInputVariable.nativeElement.value = "";
    this.uploadedFileTitle = undefined;
    this.fileToUpload = undefined;
  }
  async saveUploadFile(form: NgForm) {
    return new Promise<void>((resolve, reject) => {
      let fd = new FormData();
      fd.append("i9DetailsId", this.webI9Details.i9DetailsId.toString());
      fd.append("fileToUpload", this.fileToUpload);
      fd.append("documentTitle", this.uploadedFileTitle);
      this.i9Services.uploadI9ValidationDocument(fd).subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.verificationAttachmentDetails = res.responsePayload;
            this.closeUploadmodal(form);

            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            resolve();
          } else {
            this.sharedService.add({
              severity: "error",
              summary: "Error!",
              detail: res.message,
            });
          }
        },
        (error) => {
          this.errLabel = error;
        }
      );
    });
  }
  getI9ValidationDocument(i9DetailsId) {
    this.i9Services.getI9ValidationDocument(i9DetailsId).subscribe((res) => {
      if (res.statusCode == 200) {
        this.verificationAttachmentDetails = res.responsePayload;
      }
    });
  }
  confirmOnDeleteAttachment(rowData) {
    this.i9Services
      .deleteI9ValidationDocument(rowData.i9VerificationDocumentDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.verificationAttachmentDetails = res.responsePayload;
          this.deleteConfirmModel = "none";
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
  cancelConfirmOnDeleteAttachment() {
    this.deleteConfirmModel = "none";
  }
}

export class I9VerificationDocumentDetails {
  i9DetailsId: number;
  documentTitle: string;
  i9VerificationDocumentDetailsId: string;
  "status": string;
}
