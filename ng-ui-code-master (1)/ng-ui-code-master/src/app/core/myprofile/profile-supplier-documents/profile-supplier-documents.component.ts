import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from "@angular/core";
import { SharedService } from "@app/shared/shared.service";
import { HttpResponse } from "@angular/common/http";
import { FileUploadModel } from "@app/shared/models/fileUpload.model";
import { DocumentService } from "@app/core/custommodules/documents/document.services";
import { AuthService } from "@app/core/service/auth.service";
import { CompanyService } from "@app/core/custommodules/company/company.service";

@Component({
  selector: "app-profile-supplier-documents",
  templateUrl: "./profile-supplier-documents.component.html",
  styleUrls: ["./profile-supplier-documents.component.css"],
})
export class ProfileSupplierDocumentsComponent implements OnInit {
  clientErrorMsg: any;
  @Input() userId: any = -1;
  @Input() isEmp: boolean;
  @Input() isLink: boolean;

  documentCategoryList: any = [];
  mainDocumentCategoryList: any = [];
  documentCategoryDetails: any = [];
  selectedDocumentCategoryDetails: any;
  selectedDocumentCategoryDetailsIndex: any = 0;
  loading: boolean = false;
  cols: any[];
  colstag: any[];
  fileUpload: FileUploadModel;
  noOfAlertsList: any;
  errorLabel: string = "";
  uploadFileInfo: string = "none";
  taggedModelInfo: string = "none";
  taggedProjectModelInfo: string = "none";
  @ViewChild("fileInput")
  myInputVariable: ElementRef;
  viewImage: boolean = false;
  isFileEdit: boolean = false;
  supplierOfProjectList: any = [];
  selectedSupplierOfProjectList: any[] = [];
  employeesOfProjectList: any = [];
  selectedEmployeesOfProjectList: any[];
  documentTaggedCategoryDetails: any = [];
  switchView: boolean;
  selectedCompanyDocumentDetailsId: any;
  selectedTaggedSuppliers: any;
  imageBlob: HttpResponse<Blob>;
  constructor(
    private documentService: DocumentService,
    private companyService: CompanyService,
    public sharedService: SharedService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fileUpload = new FileUploadModel();
    if (this.userId == -1) {
      this.userId = this.authService.currentUser.employeeDetailsId;
    }
    this.switchView = this.sharedService.getUserViewType();
    this.documentCategoryList = [];
    this.noOfAlertsList = [
      { label: "Select Days", value: null },
      { label: "3 Days", value: 3 },
      { label: "7 Days", value: 7 },
      { label: "10 Days", value: 10 },
      { label: "30 Days", value: 30 },
      { label: "90 Days", value: 90 },
      { label: "180 Days", value: 180 },
    ];
    this.cols = [
      { field: "documentTitle", header: "Document Title" },
      { field: "documentExpiryDate", header: "Expiry Date" },
      { field: "alertRequired", header: "Alert Required" },
      { field: "taggedDocument", header: "Tagged Document ?" },
      { field: "sharedWithOthers", header: "Is shared ?" },
    ];
    this.colstag = [
      { field: "documentTitle", header: "Document Title" },
      { field: "documentExpiryDate", header: "Expiry Date" },
      { field: "alertRequired", header: "Alert Required" },
      { field: "alertBeforeNoOfDays", header: "No Of Days" },
    ];
    this.getAllProjects(this.userId, 0, 1);
  }
  getAllProjects(employeeDetailsId, index, status) {
    // this.loading = true;
    this.documentService.getAllCompanies(status, employeeDetailsId).subscribe(
      (res) => {
        // this.loading = false;
        if (res.statusCode == 200) {
          this.documentCategoryList = res.responsePayload;
          this.mainDocumentCategoryList = res.responsePayload;
          this.getSupplier(employeeDetailsId, this.documentCategoryList[index]);
          // this.getTaggedSuppliers(
          //   employeeDetailsId,
          //   this.documentCategoryList[index]
          // );
        } else {
          this.documentCategoryList = [];
          this.mainDocumentCategoryList = [];
        }
      },
      (error) => {
        // this.loading = false;
      }
    );
  }
  getSupplier(employeeDetailsId, rowData) {
    // this.loading = true;
    this.selectedRowData = rowData;
    this.documentService
      .getSupplierAndTaggedProject(employeeDetailsId, rowData.companyDetailsId)
      .subscribe(
        (res) => {
          // this.loading = false;
          if (res.statusCode == 200) {
            this.documentCategoryDetails = res.responsePayload;
          } else {
            this.documentCategoryDetails = [];
          }
        },
        (error) => {
          // this.loading = false;
        }
      );
  }
  getTaggedSuppliers(employeeDetailsId, rowData) {
    // this.loading = true;
    this.documentService
      .getTaggedSupplier(employeeDetailsId, rowData.companyDetailsId)
      .subscribe(
        (res) => {
          // this.loading = false;
          if (res.statusCode == 200) {
            this.documentTaggedCategoryDetails = res.responsePayload;
          } else {
            this.documentTaggedCategoryDetails = [];
          }
        },
        (error) => {
          // this.loading = false;
        }
      );
  }
  selectedRowData: any;
  handleDocChange(event) {
    let index = event;
    this.selectedRowData = this.documentCategoryList[index];
    this.selectedDocumentCategoryDetailsIndex = index;

    this.getSupplier(this.userId, this.documentCategoryList[index]);
    // this.getTaggedSuppliers(
    //   this.userId,
    //   this.documentCategoryList[event.index]
    // );
  }
  uploadDocCatg(rowData) {
    this.isFileEdit = false;
    this.selectedDocumentCategoryDetails = rowData;
    this.getEmployeesOfSupplier(
      this.selectedDocumentCategoryDetails.companyDetailsId
    );
    this.getProjectOfSupplier(
      this.selectedDocumentCategoryDetails.companyDetailsId
    );
    this.uploadFileInfo = "block";
    this.hiddenScroll();
  }
  taggedDocumentModel(rowData) {
    this.taggedModelInfo = "block";
    this.selectedCompanyDocumentDetailsId = rowData.companyDocumentDetailsId;
    this.hiddenScroll();
  }
  taggedProjectModel(rowData) {
    this.taggedProjectModelInfo = "block";
    this.selectedTaggedSuppliers = rowData;
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
  closeAddmodal() {
    this.uploadFileInfo = "none";
    this.taggedModelInfo = "none";
    this.taggedProjectModelInfo = "none";
    this.errorLabel = "";
    this.myInputVariable.nativeElement.value = "";
    this.fileUpload = new FileUploadModel();
    this.getSupplier(
      this.userId,
      this.documentCategoryList[this.selectedDocumentCategoryDetailsIndex]
    );
    this.displayScroll();
  }
  saveUploadFile(rowData) {
    const formModel = this.prepareSave(rowData);

    if (rowData.companyDocumentDetailsId) {
      this.documentService.updateSupplierDocument(formModel).subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.closeAddmodal();
            // this.getSupplier(
            //   this.userId,
            //   this.documentCategoryList[
            //     this.selectedDocumentCategoryDetailsIndex
            //   ]
            // );
            // this.getTaggedSuppliers(
            //   this.userId,
            //   this.documentCategoryList[
            //     this.selectedDocumentCategoryDetailsIndex
            //   ]
            // );
            this.selectedEmployeesOfProjectList = undefined;
            this.selectedSupplierOfProjectList = undefined;
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
        this.documentService.uploadSupplierDocument(formModel).subscribe(
          (res) => {
            if (res.statusCode == 200) {
              this.closeAddmodal();
              this.getSupplier(
                this.userId,
                this.documentCategoryList[
                  this.selectedDocumentCategoryDetailsIndex
                ]
              );
              // this.getTaggedSuppliers(
              //   this.userId,
              //   this.documentCategoryList[
              //     this.selectedDocumentCategoryDetailsIndex
              //   ]
              // );
              this.selectedEmployeesOfProjectList = undefined;
              this.selectedSupplierOfProjectList = undefined;
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
    let supplierList: string[] = [];
    let employeeList: string[] = [];
    if (
      this.selectedEmployeesOfProjectList &&
      this.selectedEmployeesOfProjectList.length
    ) {
      this.selectedEmployeesOfProjectList.forEach((element) => {
        employeeList.push(element.employeeCode);
      });
      input.append("taggedEmployees", JSON.stringify(employeeList));
    }
    if (
      this.selectedSupplierOfProjectList &&
      this.selectedSupplierOfProjectList.length
    ) {
      this.selectedSupplierOfProjectList.forEach((element) => {
        supplierList.push(element.companyCode);
      });
      input.append("taggedSuppliers", JSON.stringify(supplierList));
    }

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

    input.append("employeeDetailsId", this.userId);
    input.append("companyDetailsId", rowData.companyDetailsId);

    if (rowData.companyDocumentDetailsId) {
      input.append(
        "companyDocumentDetailsId",
        rowData.companyDocumentDetailsId
      );
    }
    return input;
  }
  async fileToEdit(rowData) {
    this.isFileEdit = true;
    this.selectedDocumentCategoryDetails = rowData;
    this.uploadFileInfo = "block";
    this.fileUpload = rowData;
    if (this.fileUpload.alertRequired == "1") {
      this.fileUpload.checked = true;
    } else {
      this.fileUpload.checked = false;
    }
    await this.getEmployeesOfSupplier(
      this.selectedDocumentCategoryDetails.companyDetailsId
    );
    await this.getProjectOfSupplier(
      this.selectedDocumentCategoryDetails.companyDetailsId
    );
    this.selectedSupplierOfProjectList = [];
    this.selectedEmployeesOfProjectList = [];
    if (this.selectedDocumentCategoryDetails.taggedEmployees) {
      this.selectedDocumentCategoryDetails.taggedEmployees.forEach(
        (element) => {
          this.employeesOfProjectList.filter((getElement) => {
            if (getElement.employeeCode == element) {
              this.selectedEmployeesOfProjectList.push(getElement);
            }
          });
        }
      );
    }
    if (this.selectedDocumentCategoryDetails.taggedProjects) {
      this.selectedDocumentCategoryDetails.taggedProjects.forEach((element) => {
        this.supplierOfProjectList.filter((getElement) => {
          if (getElement.companyCode == element) {
            this.selectedSupplierOfProjectList.push(getElement);
          }
        });
      });
    }
    this.cdr.detectChanges();
    this.hiddenScroll();
  }
  fileToDownload(rowData) {
    this.sharedService.add({
      severity: "info",
      summary: "Info!",
      detail: "File is preparing to download please wait",
    });
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
  onImageViewOpenClick(rowData) {
    this.documentService
      .downloadCompanyDocument(rowData.companyDocumentDetailsId)
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
  hadleTaggedProjects(event) {
    const projectCode = [];
    this.selectedSupplierOfProjectList.forEach((element) => {
      projectCode.push(element.projectCode);
    });
    this.getEmployeesOfSupplier(projectCode.join(","));
  }
  getEmployeesOfSupplier(companyDetailsId) {
    return new Promise<void>((resolve, reject) => {
      this.companyService
        .getEmployeesOfSupplierBySupplier(companyDetailsId)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.employeesOfProjectList = res.responsePayload;
            console.log(res.responsePayload);
          } else {
            this.employeesOfProjectList = [];
          }
          resolve();
        });
    });
  }
  getProjectOfSupplier(companyDetailsId) {
    return new Promise<void>((resolve, reject) => {
      this.companyService
        .getProjectOfSupplier(companyDetailsId)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.supplierOfProjectList = res.responsePayload;
            console.log(res.responsePayload);
          } else {
            this.supplierOfProjectList = [];
          }
          resolve();
        });
    });
  }
  searchValue: string = "";
  filter(searchValue, objData) {
    this.documentCategoryList = objData.filter((val, i) => {
      console.log(val);
      if (val.companyName.toLowerCase().includes(searchValue.toLowerCase())) {
        return val;
      }
    });
  }
}
