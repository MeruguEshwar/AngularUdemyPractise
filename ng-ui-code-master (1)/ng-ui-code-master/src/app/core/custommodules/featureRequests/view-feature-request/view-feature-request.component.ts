import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Location } from "@angular/common";
import {
  EmployeeRequest,
  EmployeeRequestMessages,
} from "@app/shared/models/employeeRequest.model";
import { EmployeeRequestType } from "@app/shared/enums/employeeRequestType.enum";
import { AuthService } from "@app/core/service/auth.service";
import { SharedService } from "@app/shared/shared.service";
import { FormControl, NgForm } from "@angular/forms";
import { HttpResponse } from "@angular/common/http";
import { FeatureRequestService } from "../featureRequest.service";

@Component({
  selector: "app-view-feature-request",
  templateUrl: "./view-feature-request.component.html",
  styleUrls: ["./view-feature-request.component.css"],
})
export class ViewFeatureRequestComponent implements OnInit {
  @Input() userId: number = -1;
  state: any;
  imageBlob: HttpResponse<Blob>;
  employeeRequestDetailsId: number;
  empRequestDetails: any;
  selectedEmpRequestDetails: any;
  empRequestType: string;
  get EmpRequestType() {
    return EmployeeRequestType;
  }
  messageDetails: EmployeeRequestMessages;
  selectedMessageDetails: EmployeeRequestMessages;
  deleteRowData: any;
  uploadFileInfo: string = "none";
  fileToUpload: any;
  errorLabel: any;
  clientErrorMsg: any;
  uploadedFileTitle: string;
  @ViewChild("fileInput") myInputVariable: ElementRef;
  constructor(
    private location: Location,
    public cdr: ChangeDetectorRef,
    private featureRequestService: FeatureRequestService,
    public authService: AuthService,
    public sharedService: SharedService
  ) {}

  async ngOnInit(): Promise<void> {
    this.state = window.history.state;
    this.empRequestDetails = new EmployeeRequest();
    this.messageDetails = new EmployeeRequestMessages();
    if (this.userId == -1) {
      this.userId = this.authService.currentUser.employeeDetailsId;
    }
    if (this.state && this.state.requestDetails?.featureRequestDetailsId) {
      this.employeeRequestDetailsId =
        this.state.requestDetails.featureRequestDetailsId;
      this.empRequestDetails = await this.getFeatureRequestDetails(
        this.employeeRequestDetailsId
      );
    }
    if (!this.employeeRequestDetailsId) {
      this.location.back();
    }
    this.cdr.detectChanges();
  }
  showDialogToAdd() {
    this.empRequestType = "Edit";
    this.selectedEmpRequestDetails = { ...this.empRequestDetails };
  }
  back() {
    this.location.back();
  }
  async onEditAddCloseClick(event) {
    if (event.type == "add" || event.type == "edit") {
      this.empRequestDetails = await this.getFeatureRequestDetails(
        this.employeeRequestDetailsId
      );
    }
    this.empRequestType = "";
    this.cdr.detectChanges();
  }
  getFeatureRequestDetails(employeeRequestDetailsId) {
    return new Promise((resolve, reject) => {
      this.featureRequestService
        .getFeatureRequestDetailsById(employeeRequestDetailsId)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            resolve(res.responsePayload);
          }
        });
    });
  }
  EnterSubmit(event, data) {
    if (event.which === 13 || event.keyCode === 13 || event.key === "Enter") {
      this.sendMessage(data);
    }
  }
  getMessages(employeeRequestDetailsId) {
    this.featureRequestService
      .getMessages(employeeRequestDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.empRequestDetails.featureRequestMessages = res.responsePayload;
        }
      });
  }
  sendMessage(details) {
    if (details.message) {
      if (!details.featureRequestDetailsId) {
        details.featureRequestDetailsId =
          this.empRequestDetails.featureRequestDetailsId;
      }
      this.featureRequestService
        .sendMessage(this.messageDetails)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.getMessages(details.featureRequestDetailsId);
            this.messageDetails = new EmployeeRequestMessages();
          }
        });
    }
  }
  editMessage(message) {}
  deleteMessage(message) {
    this.selectedMessageDetails = message;
  }
  confirm(selectedMessageDetails) {
    console.log(selectedMessageDetails);
    this.featureRequestService
      .deleteEmpReqMsg(selectedMessageDetails.employeeRequestMessageDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getMessages(this.empRequestDetails.employeeRequestDetailsId);
          this.messageDetails = new EmployeeRequestMessages();
        }
      });
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
  uploadAttachemnts() {
    this.uploadFileInfo = "block";
    this.hiddenScroll();
  }
  saveUploadFile(form: NgForm) {
    let fd = new FormData();
    fd.append(
      "employeeRequestDetailsId",
      this.empRequestDetails.employeeRequestDetailsId.toString()
    );
    fd.append("fileToUpload", this.fileToUpload);
    fd.append("documentTitle", this.uploadedFileTitle);
    this.featureRequestService.uploadEmpReqMsgFile(fd).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.getMessages(this.empRequestDetails.employeeRequestDetailsId);
          this.closeModal(form);
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
  downloadFile(data) {
    this.featureRequestService
      .downloadEmpReqMsgFile(data.employeeRequestMessageDetailsId)
      .subscribe((resp: HttpResponse<Blob>) => {
        this.imageBlob = resp;
        const blob = new Blob([resp.body], { type: resp.body.type });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let imageType = resp.body.type.substring(
          resp.body.type.lastIndexOf("/") + 1
        );
        link.download = `Request Message File${data.employeeRequestMessageDetailsId}.${imageType}`;
        link.click();
        link.remove();
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: "File downloaded",
        });
      });
  }
  closeModal(form?: NgForm) {
    this.uploadFileInfo = "none";
    if (form) {
      form.reset();
    }
    this.uploadedFileTitle = null;
    this.myInputVariable.nativeElement.value = "";
    this.displayScroll();
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
