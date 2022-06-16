import { HttpResponse } from "@angular/common/http";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { AuthService } from "@app/core/service/auth.service";
import { FileUploadModel } from "@app/shared/models/fileUpload.model";
import { SharedService } from "@app/shared/shared.service";
import { DocumentService } from "../documents/document.services";

@Component({
  selector: "app-my-documents",
  templateUrl: "./my-documents.component.html",
  styleUrls: ["./my-documents.component.css"],
})
export class MyDocumentsComponent implements OnInit {
  clientErrorMsg: any;
  documentCategoryList: any = [];
  documentCategoryDetails: any = [];
  documentCategoryIndex: any = 9;
  toggoleType: number = 1;
  selectedDocumentCategoryDetails: any;
  selectedDocumentCategoryDetailsIndex: any = 0;
  loading: boolean = false;
  uploadFileInfo: string = "none";
  docCols: any[];
  userId = null;
  errorLabel: string = "";
  @ViewChild("fileInput")
  myInputVariable: ElementRef;
  fileUpload: FileUploadModel;
  noOfAlertsList: any;
  viewImage: boolean = false;
  imageBlob: HttpResponse<Blob>;
  constructor(
    private documentService: DocumentService,
    private sharedService: SharedService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fileUpload = new FileUploadModel();
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
    this.toggoleType = 1;
    this.docCols = [
      { field: "documentTitle", header: "Name" },
      { field: "documentNumber", header: "Number" },
      { field: "documentExpiryDate", header: "Expiry Date" },
      { field: "alertRequired", header: "Alert Status" },
      { field: "alertBeforeNoOfDays", header: "No Of Days" },
    ];
    this.userId = this.authService.currentUser.employeeDetailsId;
    this.getAllDocumentCategory(this.userId, 0);
  }
  handleDocChange(event) {
    this.selectedDocumentCategoryDetailsIndex = event.index;
    this.getDocumentCategory(
      this.userId,
      this.documentCategoryList[event.index]
    );
  }
  getDocumentCategory(employeeDetailsId, rowData) {
    this.loading = true;
    this.documentService
      .getDocumentCategory(
        employeeDetailsId,
        rowData.documentCategoryDetails.documentCategoryDetailsId
      )
      .subscribe(
        (res) => {
          this.loading = false;
          if (res.statusCode == 200) {
            this.documentCategoryDetails = res.responsePayload;
          } else {
            this.documentCategoryDetails = [];
          }
        },
        (error) => {
          this.loading = false;
        }
      );
  }
  getAllDocumentCategory(employeeDetailsId, index = 0) {
    this.loading = true;
    this.documentService.getAllDocumentCategory(employeeDetailsId).subscribe(
      (res) => {
        this.loading = false;
        if (res.statusCode == 200) {
          this.documentCategoryList = res.responsePayload;
          this.getDocumentCategory(
            employeeDetailsId,
            this.documentCategoryList[index]
          );
        } else {
          this.documentCategoryList = [];
        }
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  UploadDocumentCategory(rowData) {
    let input = new FormData();
    if (this.fileUpload.checked) {
      this.fileUpload.alertRequired = "1";
    } else {
      this.fileUpload.alertRequired = "0";
    }
    input.append("documentTitle", this.fileUpload.documentTitle);
    input.append("documentNumber", this.fileUpload.documentNumber);
    input.append("fileToUpload", this.fileUpload.fileToUpload);
    input.append("documentExpiryDate", this.fileUpload.documentExpiryDate);
    input.append("alertRequired", this.fileUpload.alertRequired);
    input.append("alertBeforeNoOfDays", this.fileUpload.alertBeforeNoOfDays);
    input.append("employeeDetailsId", this.userId);
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
    if (rowData.documentCategoryDetails) {
      if (this.fileUpload.fileToUpload) {
        this.documentService.uploadDocument(input).subscribe(
          (res) => {
            if (res.statusCode == 200) {
              this.closeAddmodal();
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
      this.documentService.updateDocument(input).subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.closeAddmodal();
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
  downloadDocumentCategory(rowData) {
    this.documentService
      .downloadDocument(
        rowData.employeeDetailsId,
        rowData.employeeDocumentUploadDetailsId
      )
      .subscribe((resp: HttpResponse<Blob>) => {
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
  uploadDocCatg(rowData) {
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
  onFileChange(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      this.fileUpload.fileToUpload = file;
    } else {
      this.fileUpload.fileToUpload = undefined;
    }
  }
  clearFile() {
    this.myInputVariable.nativeElement.value = "";
    this.fileUpload.fileToUpload = undefined;
  }
  saveUploadFile(rowData) {
    console.log(rowData);
    this.UploadDocumentCategory(rowData);
  }
  fileToEdit(rowData) {
    this.selectedDocumentCategoryDetails = rowData;
    this.uploadFileInfo = "block";
    this.fileUpload = rowData;
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
    console.log(rowData);
    this.downloadDocumentCategory(rowData);
  }
  closeAddmodal() {
    this.uploadFileInfo = "none";
    this.errorLabel = "";
    this.myInputVariable.nativeElement.value = "";
    this.fileUpload = new FileUploadModel();
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
  getAlertType(type) {
    switch (type) {
      case "0":
        return "No";
      case "1":
        return "Yes";
    }
  }
  async onImageViewOpenClick(rowData) {
    this.documentService
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
}
