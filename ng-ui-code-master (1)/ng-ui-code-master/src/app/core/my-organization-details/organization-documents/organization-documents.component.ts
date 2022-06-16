import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from "@angular/core";
import { FormControl, NgForm } from "@angular/forms";
import { SharedService } from "@app/shared/shared.service";
import { HttpResponse } from "@angular/common/http";
import { FileUploadModel } from "@app/shared/models/fileUpload.model";
import { DocumentService } from "@app/core/custommodules/documents/document.services";
import { AuthService } from "@app/core/service/auth.service";
import { ProjectService } from "@app/core/custommodules/project/project.service";
import { MyOrganizationDetailsService } from "../my-organization-details.service";

@Component({
  selector: "app-organization-documents",
  templateUrl: "./organization-documents.component.html",
  styleUrls: ["./organization-documents.component.css"],
})
export class OrganizationDocumentsComponent implements OnInit {
  clientErrorMsg: any;
  @Input() userId: any = -1;
  @Input() isEmp: boolean;
  @Input() isLink: boolean;
  orgDocumentCategory: string;
  errLabel: any;

  documentCategoryList: any = [];
  mainDocumentCategoryList: any = [];
  documentCategoryDetails: any = [];
  selectedDocumentCategoryDetails: any;
  selectedDocumentCategoryDetailsIndex: any = 0;
  loading: boolean = false;
  cols: any[];
  fileUpload: FileUploadModel;
  noOfAlertsList: any;
  errorLabel: string = "";
  uploadFileInfo: string = "none";
  orgDocumentCategorytInfo: string = "none";
  @ViewChild("fileInput")
  myInputVariable: ElementRef;
  viewImage: boolean = false;
  isFileEdit: boolean = false;
  documentTaggedCategoryDetails: any = [];
  switchView: boolean;

  constructor(
    private documentService: DocumentService,
    private projectService: ProjectService,
    public sharedService: SharedService,
    private authService: AuthService,
    private organizationDetailsService: MyOrganizationDetailsService,
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
      { field: "documentNumber", header: "Document Number" },
      { field: "documentExpiryDate", header: "Expiry Date" },
      { field: "alertRequired", header: "Alert Status" },
      { field: "alertBeforeNoOfDays", header: "No Of Days" },
    ];
    this.getAllOrgDocCatList(1, 0);
  }
  getAllOrgDocCatList(status, index) {
    // this.loading = true;
    this.organizationDetailsService.getAllOrgDocCatList(status).subscribe(
      (res) => {
        // this.loading = false;
        if (res.statusCode == 200) {
          this.documentCategoryList = res.responsePayload;
          this.mainDocumentCategoryList = res.responsePayload;
          this.getOrgDocDetails(this.documentCategoryList[index]);
        } else {
          this.documentCategoryList = [];
          this.mainDocumentCategoryList = [];
        }
        this.cdr.detectChanges();
      },
      (error) => {
        // this.loading = false;
      }
    );
  }
  getOrgDocDetails(rowData) {
    // this.loading = true;
    this.selectedRowData = rowData;
    this.organizationDetailsService
      .getOrganizationDocsDetails(rowData.organizationDocumentCategoryDetailsId)
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
  selectedRowData: any;
  handleDocChange(event) {
    let index = event;
    this.selectedDocumentCategoryDetailsIndex = index;
    this.selectedRowData = this.documentCategoryList[index];
    this.getOrgDocDetails(this.documentCategoryList[index]);
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

  saveUploadFile(rowData) {
    const formModel = this.prepareSave(rowData);
    if (this.isFileEdit) {
      this.organizationDetailsService
        .updateOrganizationDocument(formModel)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.getOrgDocDetails(
              this.documentCategoryList[
                this.selectedDocumentCategoryDetailsIndex
              ]
            );
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            this.closeAddmodal();
          } else {
            this.sharedService.add({
              severity: "error",
              summary: "Error",
              detail: res.message,
            });
          }
        });
    } else {
      this.organizationDetailsService
        .saveOrganizationDocument(formModel)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.getOrgDocDetails(
              this.documentCategoryList[
                this.selectedDocumentCategoryDetailsIndex
              ]
            );
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            this.closeAddmodal();
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

    input.append("employeeDetailsId", this.userId);
    input.append(
      "organizationDocumentCategoryDetailsId",
      rowData.organizationDocumentCategoryDetailsId
    );
    if (this.isFileEdit) {
      input.append(
        "organizationDocumentDetailsId",
        this.selectedDocumentCategoryDetails.organizationDocumentDetailsId
      );
    }
    return input;
  }
  fileToEdit(rowData) {
    this.isFileEdit = true;
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
    this.organizationDetailsService
      .downloadOrgDocument(rowData.organizationDocumentDetailsId)
      .subscribe((resp: HttpResponse<Blob>) => {
        const blob = new Blob([resp.body], { type: resp.body.type });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let imageType = resp.body.type.substring(
          resp.body.type.lastIndexOf("/") + 1
        );
        link.download = `${rowData.documentTitle}_${rowData.employeeDetailsId}.${imageType}`;
        link.click();
        link.remove();
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: "File downloaded",
        });
      });
  }
  onImageViewOpenClick() {
    this.viewImage = true;
  }
  onImageViewCloseClick(event) {
    if (event.type == "cancel") {
      this.viewImage = false;
    }
  }
  saveOrgDocumentCategoryt(documentCategory) {
    this.organizationDetailsService
      .saveOrgDocumentCategoryt(documentCategory)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.errLabel = undefined;
          // this.getAllOrgDocCatList(1,this.selectedDocumentCategoryDetailsIndex);
          this.documentCategoryList.push(res.responsePayload);
          this.cdr.detectChanges();
          this.closeAddmodal();
          this.orgDocumentCategory = "";
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
          this.errLabel = res.message;
          this.orgDocumentCategory = "";
        }
      });
  }
  orgDocumentCategorytInfoEnable() {
    this.orgDocumentCategorytInfo = "block";
    this.hiddenScroll();
  }
  checkOrgDocCatAlreadyExist(documentCategory) {
    this.organizationDetailsService
      .checkOrgDocCatAlreadyExist(documentCategory)
      .subscribe(
        (res) => {
          if (res.statusCode != 200) {
            this.errLabel = res.message;
            this.orgDocumentCategory = "";
          } else {
            this.errLabel = undefined;
          }
        },
        (error) => {
          this.errLabel = error;
        }
      );
  }
  closeAddmodal(form?: NgForm) {
    this.uploadFileInfo = "none";
    this.orgDocumentCategorytInfo = "none";
    this.errorLabel = "";
    this.orgDocumentCategory = "";
    this.myInputVariable.nativeElement.value = "";
    this.fileUpload = new FileUploadModel();
    this.displayScroll();
    if (form) {
      form.reset();
    }
  }
  searchValue: string = "";
  filter(searchValue, objData) {
    this.documentCategoryList = objData.filter((val, i) => {
      console.log(val);
      if (
        val.documentCategory.toLowerCase().includes(searchValue.toLowerCase())
      ) {
        return val;
      }
    });
  }
}
