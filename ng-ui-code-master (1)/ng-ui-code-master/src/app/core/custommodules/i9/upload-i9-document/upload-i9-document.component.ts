import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { I9Service } from "../i9.services";
import { AuthService } from "@app/core/service/auth.service";
import { SharedService } from "@app/shared/shared.service";
import { FileUploadModel } from "@app/shared/models/fileUpload.model";

@Component({
  selector: "app-upload-i9-document",
  templateUrl: "./upload-i9-document.component.html",
  styleUrls: ["./upload-i9-document.component.css"],
})
export class UploadI9DocumentComponent implements OnInit {
  uploadDisplay: string = "none";
  clientErrorMsg: any;
  errLabel: string;
  @Output() onClose = new EventEmitter<any>();
  @Input() userId: any;
  fileUpload: FileUploadModel;
  noOfAlertsList: any;
  constructor(
    private i9Services: I9Service,
    private authService: AuthService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.noOfAlertsList = [
      { label: "Select Days", value: null },
      { label: "3 Days", value: 3 },
      { label: "7 Days", value: 7 },
      { label: "10 Days", value: 10 },
      { label: "30 Days", value: 30 },
      { label: "90 Days", value: 90 },
      { label: "180 Days", value: 180 },
    ];
    this.showDialogToAdd();
    this.fileUpload = new FileUploadModel();
  }
  showDialogToAdd() {
    this.uploadDisplay = "block";
    this.hiddenScroll();
  }
  closeAddmodal() {
    this.uploadDisplay = "none";
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
  onFileChange(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      this.fileUpload.fileToUpload = file;
    } else {
      this.fileUpload.fileToUpload = undefined;
    }
  }
  @ViewChild("fileInput") myInputVariable: ElementRef;
  clearFile() {
    this.myInputVariable.nativeElement.value = "";
    this.fileUpload.fileToUpload = undefined;
  }
  save() {
    const formModel = this.prepareSave();
    if (this.fileUpload.fileToUpload) {
      this.i9Services.uploadI9Doc(formModel).subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.closeAddmodal();
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            this.displayScroll();
            this.onClose.emit({
              employeeDocumentUploadDetailsId: res.responsePayload,
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
          this.errLabel = error;
        }
      );
    } else {
      this.errLabel = "Please Select a File";
      this.sharedService.add({
        severity: "error",
        summary: "Error!",
        detail: this.errLabel,
      });
    }
  }
  private prepareSave(): any {
    let input = new FormData();
    if (this.fileUpload.checked) {
      this.fileUpload.alertRequired = "1";
    } else {
      this.fileUpload.alertRequired = "0";
    }
    console.log(this.fileUpload);
    input.append("documentTitle", this.fileUpload.documentTitle);
    input.append("documentNumber", this.fileUpload.documentNumber);
    input.append("fileToUpload", this.fileUpload.fileToUpload);
    input.append("documentExpiryDate", this.fileUpload.documentExpiryDate);
    input.append("alertRequired", this.fileUpload.alertRequired);
    input.append("alertBeforeNoOfDays", this.fileUpload.alertBeforeNoOfDays);
    input.append("employeeDetailsId", this.userId);
    return input;
  }
}
