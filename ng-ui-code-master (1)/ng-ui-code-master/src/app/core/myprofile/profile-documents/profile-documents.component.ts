import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  AfterViewInit,
} from "@angular/core";
import { FormControl, NgForm } from "@angular/forms";
import { MyProfileService } from "../myprofile.service";
import { SharedService } from "@app/shared/shared.service";
import { HttpResponse } from "@angular/common/http";
import { FileUploadModel } from "@app/shared/models/fileUpload.model";
import { DocumentService } from "@app/core/custommodules/documents/document.services";
import { AuthService } from "@app/core/service/auth.service";

@Component({
  selector: "app-profile-documents",
  templateUrl: "./profile-documents.component.html",
  styleUrls: ["./profile-documents.component.css"],
})
export class ProfileDocumentsComponent implements OnInit, AfterViewInit {
  @ViewChild("myIdentifier")
  myIdentifier: ElementRef;
  clientErrorMsg: any;
  @Input() userId: any = -1;
  @Input() isEmp: any;
  @Input() isLink: boolean;
  documentCategoryList: any = [];
  mainDocumentCategoryList: any = [];
  documentCategoryDetailsList: any = [];
  selectedDocumentCategoryDetails: any;
  selectedDocumentCategoryDetailsIndex: any = 0;
  loading: boolean = false;
  cols: any[] = [
    { field: "documentTitle", header: "Name" },
    { field: "documentNumber", header: "Number" },
    { field: "documentExpiryDate", header: "Expiry Date" },
    { field: "alertRequired", header: "Alert Status" },
  ];
  errorLabel: string = "";
  uploadFileInfo: string = "none";
  @ViewChild("fileInput")
  myInputVariable: ElementRef;
  fileUpload: FileUploadModel;
  noOfAlertsList: any;
  viewImage: boolean = false;
  imageBlob: HttpResponse<Blob>;
  isFileEdit: boolean = false;
  selectedDocs: any = [];

  @Output() linkedDocuments = new EventEmitter();
  linkedDocsList: any = [];
  selectedDocs1: any = [];
  switchedView: boolean;

  constructor(
    private profileService: MyProfileService,
    public sharedService: SharedService,
    private authUser: AuthService
  ) {}

  ngOnInit(): void {
    this.fileUpload = new FileUploadModel();
    if (this.userId == -1) {
      this.userId = this.authUser.currentUser.employeeDetailsId;
    }
    this.switchedView = this.sharedService.getUserViewType();
    this.noOfAlertsList = [
      { label: "Select Days", value: null },
      { label: "3 Days", value: 3 },
      { label: "7 Days", value: 7 },
      { label: "10 Days", value: 10 },
      { label: "30 Days", value: 30 },
      { label: "90 Days", value: 90 },
      { label: "180 Days", value: 180 },
    ];
    this.documentCategoryList = [];
    // if (this.isEmp) {
    //   this.cols.push({ field: "alertBeforeNoOfDays", header: "No Of Days" });
    // }

    this.getAllDocumentCategory(
      this.userId,
      this.selectedDocumentCategoryDetailsIndex
    );
  }
  ngAfterViewInit() {
    var height = this.myIdentifier.nativeElement.offsetHeight;
    console.log("Height: " + height);
  }
  getAllLinked(index) {
    this.profileService.getAllLinkDocs(this.userId).subscribe(
      (res) => {
        // this.loading = false;
        if (res.statusCode == 200) {
          this.linkedDocsList = res.responsePayload;
          let data = this.documentCategoryList[index];
          if (this.linkedDocsList.length && this.switchedView) {
            this.selectedDocs = this.linkedDocsList.filter(
              (element) =>
                data.documentAccessDetailsId ==
                element.documentCategoryDetailsId
            );
            this.selectedDocs1 = this.linkedDocsList.filter(
              (element) =>
                data.documentAccessDetailsId ==
                element.documentCategoryDetailsId
            );
          }
          this.getDocumentCategory(
            this.userId,
            this.documentCategoryList[index]
          );
        } else {
          this.linkedDocsList = [];
        }
      },
      (error) => {
        // this.loading = false;
      }
    );
  }
  getDocumentCategory(employeeDetailsId, rowData) {
    // this.loading = true;
    this.selectedRowData = rowData;
    console.log(this.selectedRowData);
    this.profileService
      .getDocumentCategory(
        employeeDetailsId,
        rowData.documentCategoryDetails.documentCategoryDetailsId
      )
      .subscribe(
        (res) => {
          // this.loading = false;
          if (res.statusCode == 200) {
            let data = this.selectedDocs;
            res["responsePayload"].forEach((element) => {
              let ind = this.selectedDocs1.findIndex(
                (row) =>
                  row.documentCategoryDetailsId ==
                    element.documentCategoryDetailsId &&
                  element.employeeDocumentUploadDetailsId ==
                    row.employeeDocumentUploadDetailsId
              );
              if (ind > -1) {
                data.push(element);
              }
              ind = this.selectedDocs.findIndex(
                (row) =>
                  row.documentCategoryDetailsId ==
                    element.documentCategoryDetailsId &&
                  element.employeeDocumentUploadDetailsId ==
                    row.employeeDocumentUploadDetailsId
              );
              if (ind > -1) {
                data.push(element);
              }
            });
            if (data && this.switchedView) {
              this.selectedDocs = data;
            } else {
              this.selectedDocs = [];
              this.selectedDocs1 = [];
            }
            this.documentCategoryDetailsList = res.responsePayload;
          } else {
            this.documentCategoryDetailsList = [];
          }
        },
        (error) => {
          // this.loading = false;
        }
      );
  }
  getAllDocumentCategory(employeeDetailsId, index = 0) {
    this.profileService
      .getAllDocumentCategory(employeeDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.documentCategoryList = res.responsePayload;
          this.mainDocumentCategoryList = res.responsePayload;
          this.getDocumentCategory(
            this.userId,
            this.documentCategoryList[index]
          );
          //   this.getAllLinked(0);
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "error",
            detail: res.message,
          });
          this.documentCategoryList = [];
          this.mainDocumentCategoryList = [];
        }
      });
  }
  selectedRowData: any;
  handleDocChange(event) {
    let index = event;
    this.selectedDocumentCategoryDetailsIndex = index;
    this.selectedRowData = this.documentCategoryList[index];
    this.getDocumentCategory(this.userId, this.documentCategoryList[index]);
    let data = this.documentCategoryList[index];
    if (this.linkedDocsList.length) {
      this.selectedDocs1 = this.linkedDocsList.filter(
        (element) =>
          data.documentAccessDetailsId == element.documentCategoryDetailsId
      );
    }
  }
  uploadDocCatg(rowData) {
    this.isFileEdit = false;
    this.selectedDocumentCategoryDetails = rowData;
    this.uploadFileInfo = "block";
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
  closeAddmodal(form?: NgForm) {
    this.uploadFileInfo = "none";
    this.errorLabel = "";
    if (form) {
      form.reset();
    }
    this.myInputVariable.nativeElement.value = "";
    this.fileUpload = new FileUploadModel();
    this.getDocumentCategory(
      this.userId,
      this.documentCategoryList[this.selectedDocumentCategoryDetailsIndex]
    );
    this.displayScroll();
  }
  selectRow(checkValue) {
    if (checkValue) {
      this.selectedDocs = JSON.parse(
        JSON.stringify(this.documentCategoryDetailsList)
      );
    } else {
      this.selectedDocs = [];
    }
  }
  saveUploadFile(rowData, form: NgForm) {
    const formModel = this.prepareSave(rowData);

    if (rowData.documentCategoryDetails) {
      if (this.fileUpload.fileToUpload) {
        this.profileService.uploadDocument(formModel).subscribe(
          (res) => {
            if (res.statusCode == 200) {
              this.closeAddmodal(form);
              this.getDocumentCategory(
                this.userId,
                this.documentCategoryList[
                  this.selectedDocumentCategoryDetailsIndex
                ]
              );
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
        this.errorLabel = "Please Select a File";
        this.sharedService.add({
          severity: "error",
          summary: "Error!",
          detail: this.errorLabel,
        });
      }
    } else {
      this.profileService.updateDocument(formModel).subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.closeAddmodal(form);
            this.getDocumentCategory(
              this.userId,
              this.documentCategoryList[
                this.selectedDocumentCategoryDetailsIndex
              ]
            );
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
        this.fileUpload.fileToUpload = file;
      } else {
        this.sharedService.add({
          severity: "error",
          summary: "Error!",
          detail: `Please upload file in 'PNG', 'JPEG', 'JPG', 'GIF',"PDF" format`,
        });
        this.fileUpload.fileToUpload = undefined;
        this.myInputVariable.nativeElement.value = "";
      }
    } else {
      this.fileUpload.fileToUpload = undefined;
    }
  }
  clearFile() {
    this.myInputVariable.nativeElement.value = "";
    this.fileUpload.fileToUpload = undefined;
  }
  private prepareSave(rowData): any {
    let input = new FormData();
    if (this.fileUpload.checked) {
      this.fileUpload.alertRequired = "1";
      input.append("alertBeforeNoOfDays", this.fileUpload.alertBeforeNoOfDays);
    } else {
      this.fileUpload.alertRequired = "0";
      input.append("alertBeforeNoOfDays", "0");
    }
    input.append("documentTitle", this.fileUpload.documentTitle);
    input.append("documentNumber", this.fileUpload.documentNumber);
    input.append("fileToUpload", this.fileUpload.fileToUpload);
    input.append("documentExpiryDate", this.fileUpload.documentExpiryDate);
    input.append("alertRequired", this.fileUpload.alertRequired);
    input.append("employeeDetailsId", rowData.employeeDetailsId);
    if (rowData.documentCategoryDetails) {
      input.append(
        "documentCategoryDetailsId",
        rowData.documentCategoryDetails.documentCategoryDetailsId
      );
    } else {
      input.append(
        "documentCategoryDetailsId",
        rowData.documentCategoryDetailsId
      );
      input.append(
        "employeeDocumentUploadDetailsId",
        rowData.employeeDocumentUploadDetailsId
      );
    }
    return input;
  }
  fileToEdit(rowData) {
    this.isFileEdit = true;
    this.selectedDocumentCategoryDetails = rowData;
    this.uploadFileInfo = "block";
    this.fileUpload = this.selectedDocumentCategoryDetails;
    if (this.fileUpload.alertRequired == "1") {
      this.fileUpload.checked = true;
    } else {
      this.fileUpload.checked = false;
    }
    this.hiddenScroll();
  }
  fileToDownload(rowData) {
    this.sharedService.add({
      severity: "info",
      summary: "Info!",
      detail: "File is preparing to download please wait",
    });
    this.profileService
      .downloadDocument(
        rowData.employeeDetailsId,
        rowData.employeeDocumentUploadDetailsId
      )
      .subscribe((resp: HttpResponse<Blob>) => {
        this.imageBlob = resp;
        const blob = new Blob([resp.body], { type: resp.body.type });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let imageType = resp.body.type.substring(
          resp.body.type.lastIndexOf("/") + 1
        );
        link.download = `${rowData.documentCategory}_${rowData.employeeDetailsId}.${imageType}`;
        link.click();
        link.remove();
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: "File downloaded",
        });
      });
  }
  onImageViewOpenClick(rowData) {
    this.profileService
      .downloadDocument(
        rowData.employeeDetailsId,
        rowData.employeeDocumentUploadDetailsId
      )
      .subscribe((resp: HttpResponse<Blob>) => {
        this.imageBlob = resp;
        this.viewImage = true;
      });
  }
  onImageViewCloseClick(event) {
    if (event.type == "cancel") {
      this.imageBlob = null;
      this.viewImage = false;
    }
  }
  getAlertType(type) {
    switch (type) {
      case "0":
        return "No";
      case "1":
        return "Yes";
    }
  }
  linkDocuments() {
    let data = this.selectedDocs;
    this.linkedDocuments.emit({ link: data });
  }
  confirmModel: string = "none";
  selectedDeletedFile: any;
  deleteUploadedFile(rowData) {
    console.log(rowData);
    this.confirmModel = "block";
    this.selectedDeletedFile = rowData;
  }
  closeConfirmModel() {
    this.confirmModel = "none";
    this.selectedDeletedFile = undefined;
  }
  confirm() {
    this.profileService
      .deleteEmployeeDocument(
        this.selectedDeletedFile.employeeDetailsId,
        this.selectedDeletedFile.employeeDocumentUploadDetailsId
      )
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.getDocumentCategory(
            this.userId,
            this.documentCategoryList[this.selectedDocumentCategoryDetailsIndex]
          );
          this.closeConfirmModel();
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error!",
            detail: res.message,
          });
        }
      });
  }
  categoryType: any;
  showDialogToAdd() {
    this.categoryType = "Add";
    //this.hiddenScroll();
  }
  onDeptAddCloseClick(event) {
    if (event.type == "add") {
      this.getAllDocumentCategory(
        this.userId,
        this.selectedDocumentCategoryDetailsIndex
      );
    }
    this.categoryType = "";
  }
  searchValue: string = "";
  filter(searchValue, objData) {
    this.documentCategoryList = objData.filter((val, i) => {
      console.log(val);
      if (
        val.documentCategoryDetails.documentCategory
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      ) {
        return val;
      }
    });
  }
}
