import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { SharedService } from "@app/shared/shared.service";
import { DocumentService } from "./document.services";
import { AuthService } from "@app/core/service/auth.service";
import { HttpResponse } from "@angular/common/http";
import { FileUploadModel } from "@app/shared/models/fileUpload.model";

@Component({
  selector: "app-documents",
  templateUrl: "./documents.component.html",
  styleUrls: ["./documents.component.css"],
})
export class DocumentsComponent implements OnInit {
  clientErrorMsg: any;
  documentCategoryIndex: any = 9;
  projectDocumentList: any = [];
  projectDocumentDetails: any = [];
  CompanyDocumentList: any = [];
  CompanyDocumentDetails: any = [];
  toggoleType: number = 1;
  selectedDocumentCategoryDetails: any;
  selectedDocumentCategoryDetailsIndex: any = 0;
  loading: boolean = false;
  uploadFileInfo: string = "none";
  companyCols: any[];
  docCols: any[];
  projectCols: any[];
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
    this.projectDocumentList = [];
    this.toggoleType = 1;
    this.projectCols = [
      { field: "documentTitle", header: "Document Title" },
      { field: "employeeName", header: "Employee Name" },
    ];
    this.userId = this.authService.currentUser.employeeDetailsId;
    this.getAllProjects(this.userId, 0, 1);
    this.sharedService.openToggleMenu("roleMenuToggleExternalContent");
  }
  onProjectDocumentToggle() {
    this.projectDocumentList = [];
    this.toggoleType = 1;
    this.projectCols = [
      { field: "documentTitle", header: "Document Title" },
      { field: "employeeName", header: "Employee Name" },
    ];
    this.getAllProjects(this.userId, 0, 1);
  }

  onCompanyDocumentToggle() {
    this.CompanyDocumentList = [];
    this.toggoleType = 2;
    this.companyCols = [
      { field: "documentTitle", header: "Document Title" },
      { field: "employeeName", header: "Employee Name" },
    ];
    this.getAllCompanys(this.userId, 0, 1);
  }
  handleDocChange(event) {
    this.selectedDocumentCategoryDetailsIndex = event.index;
    switch (this.toggoleType) {
      case 1:
        this.getProject(this.userId, this.projectDocumentList[event.index]);
        break;
      case 2:
        this.getCompany(this.userId, this.CompanyDocumentList[event.index]);
        break;
    }
  }

  getAllProjects(employeeDetailsId, index, status) {
    this.loading = true;
    this.documentService.getAllProject(status, employeeDetailsId).subscribe(
      (res) => {
        this.loading = false;
        if (res.statusCode == 200) {
          this.projectDocumentList = res.responsePayload;
          this.getProject(employeeDetailsId, this.projectDocumentList[index]);
        } else {
          this.projectDocumentList = [];
        }
      },
      (error) => {
        this.loading = false;
      }
    );
  }
  getProject(employeeDetailsId, rowData) {
    this.loading = true;
    this.documentService
      .getProject(employeeDetailsId, rowData.projectDetailsId)
      .subscribe(
        (res) => {
          this.loading = false;
          if (res.statusCode == 200) {
            this.projectDocumentDetails = res.responsePayload;
          } else {
            this.projectDocumentDetails = [];
          }
        },
        (error) => {
          this.loading = false;
        }
      );
  }
  getAllCompanys(employeeDetailsId, index, status) {
    this.loading = true;
    this.documentService.getAllCompanies(status, employeeDetailsId).subscribe(
      (res) => {
        this.loading = false;
        if (res.statusCode == 200) {
          this.CompanyDocumentList = res.responsePayload;
          this.getCompany(employeeDetailsId, this.CompanyDocumentList[index]);
        } else {
          this.CompanyDocumentList = [];
        }
      },
      (error) => {
        this.loading = false;
      }
    );
  }
  getCompany(employeeDetailsId, rowData) {
    this.loading = true;
    this.documentService
      .getCompany(employeeDetailsId, rowData.companyDetailsId)
      .subscribe(
        (res) => {
          this.loading = false;
          if (res.statusCode == 200) {
            this.CompanyDocumentDetails = res.responsePayload;
          } else {
            this.CompanyDocumentDetails = [];
          }
        },
        (error) => {
          this.loading = false;
        }
      );
  }
  UploadProjectCategory(rowData) {
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
    input.append("projectDetailsId", rowData.projectDetailsId);
    if (rowData.projectDocumentDetailsId) {
      input.append(
        "projectDocumentDetailsId",
        rowData.projectDocumentDetailsId
      );
      this.documentService.updateProjectDocument(input).subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.closeAddmodal();
            this.getProject(
              this.userId,
              this.projectDocumentList[
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
      if (this.fileUpload.fileToUpload) {
        this.documentService.uploadProjectDocument(input).subscribe(
          (res) => {
            if (res.statusCode == 200) {
              this.closeAddmodal();
              this.getProject(
                this.userId,
                this.projectDocumentList[
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
    }
  }
  UploadCompanyCategory(rowData) {
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
    input.append("companyDetailsId", rowData.companyDetailsId);
    if (rowData.companyDocumentDetailsId) {
      input.append(
        "companyDocumentDetailsId",
        rowData.companyDocumentDetailsId
      );
      this.documentService.updateCompanyDocument(input).subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.closeAddmodal();
            this.getCompany(
              this.userId,
              this.CompanyDocumentList[
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
      if (this.fileUpload.fileToUpload) {
        this.documentService.uploadCompanyDocument(input).subscribe(
          (res) => {
            if (res.statusCode == 200) {
              this.closeAddmodal();
              this.getCompany(
                this.userId,
                this.CompanyDocumentList[
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
    }
  }
  downloadProjectCategory(rowData) {
    this.documentService
      .downloadProjectDocument(rowData.projectDocumentDetailsId)
      .subscribe((resp: HttpResponse<Blob>) => {
        const blob = new Blob([resp.body], { type: resp.body.type });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let imageType = resp.body.type.substring(
          resp.body.type.lastIndexOf("/") + 1
        );
        link.download = `${rowData.projectName}_${rowData.employeeDetailsId}.${imageType}`;
        link.click();
        link.remove();
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: "File downloaded",
        });
      });
  }
  downloadCompanyCategory(rowData) {
    this.documentService
      .downloadCompanyDocument(rowData.companyDocumentDetailsId)
      .subscribe((resp: HttpResponse<Blob>) => {
        const blob = new Blob([resp.body], { type: resp.body.type });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let imageType = resp.body.type.substring(
          resp.body.type.lastIndexOf("/") + 1
        );
        link.download = `${rowData.companyName}_${rowData.employeeDetailsId}.${imageType}`;
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
    switch (this.toggoleType) {
      case 1:
        this.UploadProjectCategory(rowData);
        break;
      case 2:
        this.UploadCompanyCategory(rowData);
        break;
    }
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
    switch (this.toggoleType) {
      case 1:
        this.downloadProjectCategory(rowData);
        break;
      case 2:
        this.downloadCompanyCategory(rowData);
        break;
    }
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
    switch (this.toggoleType) {
      case 1:
        this.documentService
          .downloadProjectDocument(rowData.projectDocumentDetailsId)
          .subscribe((resp: HttpResponse<Blob>) => {
            this.imageBlob = resp;
            this.viewImage = true;
          });
        break;
      case 2:
        this.documentService
          .downloadCompanyDocument(rowData.companyDocumentDetailsId)
          .subscribe((resp: HttpResponse<Blob>) => {
            this.imageBlob = resp;
            this.viewImage = true;
          });
        break;
    }
  }

  onImageViewCloseClick(event) {
    if (event.type == "cancel") {
      this.imageBlob = null;
      this.viewImage = false;
    }
  }
}
