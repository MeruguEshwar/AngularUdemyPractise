import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
} from "@angular/core";
import { W4Service } from "../w4.service";
import { SharedService } from "@app/shared/shared.service";
import { FormGroup, FormControl } from "@angular/forms";
import { FileUploadModel } from "@app/shared/models/fileUpload.model";

@Component({
  selector: "app-upload-w4-document",
  templateUrl: "./upload-w4-document.component.html",
  styleUrls: ["./upload-w4-document.component.css"],
})
export class UploadW4DocumentComponent implements OnInit {
  errLabel: string;
  public uploadDisplay: string = "none";
  clientErrorMsg: any;
  form: FormGroup;
  @Input() userId: any;
  @Output() onClose = new EventEmitter<any>();
  fileUpload: FileUploadModel;
  noOfAlertsList: any;

  constructor(
    private w4Services: W4Service,
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

  save() {
    const formModel = this.prepareSave();
    if (this.fileUpload.fileToUpload) {
      this.w4Services.uploadW4Doc(formModel).subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            this.uploadDisplay = "none";
            this.displayScroll();
            this.onClose.emit({
              employeeDocumentUploadDetailsId: res.responsePayload,
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
      this.errLabel = "Please Select a File";
      this.sharedService.add({
        severity: "error",
        summary: "Error!",
        detail: this.errLabel,
      });
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
  onFileChange(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      this.fileUpload.fileToUpload = file;
    } else {
      this.fileUpload.fileToUpload = undefined;
    }
  }
  @ViewChild("fileInput") myInputVariable: any;
  clearFile() {
    this.myInputVariable.nativeElement.value = "";
    this.fileUpload.fileToUpload = undefined;
  }
  private prepareSave(): any {
    let input = new FormData();
    if (this.fileUpload.checked) {
      this.fileUpload.alertRequired = "1";
    } else {
      this.fileUpload.alertRequired = "0";
    }
    // input.append("documentTitle", this.fileUpload.documentTitle);
    input.append("documentTitle", "W-4 Scanned Copy");
    // input.append("documentNumber", this.fileUpload.documentNumber);
    input.append("fileToUpload", this.fileUpload.fileToUpload);
    // input.append("documentExpiryDate", this.fileUpload.documentExpiryDate);
    // input.append("alertRequired", this.fileUpload.alertRequired);
    // input.append("alertBeforeNoOfDays", this.fileUpload.alertBeforeNoOfDays);
    input.append("employeeDetailsId", this.userId);
    return input;
  }
}
