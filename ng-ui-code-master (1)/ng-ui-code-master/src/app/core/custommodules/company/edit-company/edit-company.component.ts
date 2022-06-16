import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  Company,
  CompanyContacts,
} from "@app/shared/models/company-module.model";
import { CompanyService } from "../company.service";
import { Location } from "@angular/common";
import { SharedService } from "@app/shared/shared.service";
import { FileUploadModel } from "@app/shared/models/fileUpload.model";
import { HttpResponse } from "@angular/common/http";
import { AuthService } from "@app/core/service/auth.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-edit-company",
  templateUrl: "./edit-company.component.html",
  styleUrls: ["./edit-company.component.css"],
})
export class EditCompanyComponent implements OnInit {
  loading: boolean = false;
  state: any;
  companyDetailsId: any;
  company: Company;
  companyType: string;
  clientErrorMsg: any;
  errLabel: any;
  tabIndex: any;
  documentList: any[] = [];
  fileUpload: FileUploadModel;
  public uploadFileInfo: string = "none";
  public statusViewModel: string = "none";
  public taggedModelInfo: string = "none";
  errorLabel: string = "";
  @ViewChild("fileInput")
  myInputVariable: ElementRef;
  commentDetails: CompanyComment;
  commentList: CompanyComment[];
  supplierContactList: any[] = [];
  invoicesList: any[] = [];
  employeesWorkList: any[] = [];
  projectOfSupplierList: any = [];
  selectedProjectOfSupplierList: any = [];
  employeesOfSupplierList: any = [];
  selectedEmployeesOfSupplierList: any = [];
  deleteRowData: any;
  confirmType: string;
  comments: string;
  companyContacts: CompanyContacts;
  selectedCompanyDocumentDetailsId: any;
  viewImage: boolean = false;
  imageBlob: HttpResponse<Blob>;
  creditDaysOptions = [
    { label: "Immediate", value: 0 },
    { label: "Net 7", value: 7 },
    { label: "Net 10", value: 10 },
    { label: "Net 15", value: 15 },
    { label: "Net 30", value: 30 },
    { label: "Net 45", value: 45 },
    { label: "Net 60", value: 60 },
    { label: "Net 75", value: 75 },
    { label: "Net 90", value: 90 },
    { label: "Net 105", value: 105 },
    { label: "Net 120", value: 120 },
  ];
  messageType = [
    { label: "Private", value: "1" },
    { label: "Customer", value: "2" },
  ];
  noOfAlertsList: any = [
    { label: "Select Days", value: null },
    { label: "3 Days", value: 3 },
    { label: "7 Days", value: 7 },
    { label: "10 Days", value: 10 },
    { label: "30 Days", value: 30 },
    { label: "90 Days", value: 90 },
    { label: "180 Days", value: 180 },
  ];
  projectDocCols = [
    { field: "documentTitle", header: "Document Title" },
    { field: "documentNumber", header: "Document Number" },
    { field: "documentExpiryDate", header: "Expiry Date" },
    { field: "alertRequired", header: "Alert Status" },
    { field: "sharedWithOthers", header: "Is shared ?" },
  ];
  supplierContactCols = [
    { field: "contactName", header: "Contact Name" },
    { field: "contactTitle", header: "Contact Title" },
    { field: "contactEmail", header: "Email" },
    { field: "contactPhone", header: "Mobile" },
    { field: "contactLandline", header: "Office Number" },
    { field: "contactLandlineExtn", header: "Extn" },
  ];
  invoicesCols = [
    { field: "companyName", header: "Customer" },
    { field: "invoiceDate", header: "Created Date" },
    { field: "invoiceDueDate", header: "Due Date" },
    { field: "amount", header: "Total Amount" },
    { field: "amountPaid", header: "Amount Received" },
    { field: "balanceAmount", header: "Balance" },
    { field: "invoiceNumber", header: "#Invoice" },
    { field: "paymentStatus", header: "Payment Status" },
  ];
  employeeWorkCols = [
    { field: "employeeFullName", header: "Employee Name" },
    { field: "projectName", header: "Project Name" },
    { field: "startDate", header: "Start Date" },
    { field: "endDate", header: "End Date" },
  ];
  constructor(
    private companyService: CompanyService,
    private location: Location,
    public sharedService: SharedService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.company = new Company();
    this.companyContacts = new CompanyContacts();
    this.fileUpload = new FileUploadModel();
    this.commentDetails = new CompanyComment();
    this.state = window.history.state;
    if (this.state && this.state.companyDetailsId) {
      this.companyDetailsId = this.state.companyDetailsId;
      this.tabIndex = this.state.tabIndex;
    }
    if (this.companyDetailsId) {
      this.getCompanieDetails(this.companyDetailsId);
      this.getSupplierContactDetails(this.companyDetailsId);
      this.getCompanyComments(this.companyDetailsId);
      this.getInvoices(this.companyDetailsId);
      this.getEmployeesWorked(this.companyDetailsId);
      this.getDocuments(
        this.authService.currentUser.employeeDetailsId,
        this.companyDetailsId
      );

      this.cdr.detectChanges();
    } else {
      this.location.back();
    }
  }
  handleChange(e) {
    this.tabIndex = e.index;
  }
  getCompanieDetails(companyDetailsId: number) {
    this.loading = true;
    this.companyService.getCompanieDetails(companyDetailsId).subscribe(
      (res) => {
        this.loading = false;
        if (res.statusCode == 200)
          this.company = res.responsePayload as Company;
      },
      (error) => {
        this.loading = false;
      }
    );
  }
  saveCompanyDetails() {
    console.log(this.company);
    this.companyService.updateCompany(this.company).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        } else {
          this.errLabel = res.message;
        }
      },
      (error) => {
        this.errLabel = error;
      }
    );
  }
  saveCompanyContactDetails(form: NgForm) {
    this.companyContacts.companyDetailsId = this.companyDetailsId;
    this.companyService
      .saveCompanyContacts(this.companyContacts)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getSupplierContactDetails(this.companyDetailsId);
          this.companyContacts = new CompanyContacts();
          form.reset();
        }
      });
  }
  editCompanyContact(rowData) {
    this.companyContacts = rowData;
  }

  checkCompanyAlreadyExist() {
    this.companyService.isCompanyExists(this.company.companyName).subscribe(
      (res) => {
        if (res.statusCode != 200) {
          this.errLabel = res.message;
          this.company.companyName = "";
        }
      },
      (error) => {
        this.errLabel = error;
      }
    );
  }
  onAddMoreContact(index) {
    if (index < 4) {
      let companyContacts = Object.assign({}, new CompanyContacts());
      this.company.companyContacts.push(companyContacts);
    } else {
      this.sharedService.add({
        severity: "error",
        summary: "Error",
        detail: "You can not add more than 5 contact details",
      });
    }
  }
  onRemoveContactDetail(companyContacts) {
    if (this.company.companyContacts.length > 1) {
      let index = this.company.companyContacts.indexOf(companyContacts);
      this.company.companyContacts.splice(index, 1);
    }
  }
  uploadDocCatg() {
    this.uploadFileInfo = "block";
    this.fileUploadEdit = false;
    //this.getEmployeesOfSupplier(this.companyDetailsId);
    this.getProjectOfSupplier(this.companyDetailsId);
    this.hiddenScroll();
  }
  taggedDocumentModel(rowData) {
    this.taggedModelInfo = "block";
    this.selectedCompanyDocumentDetailsId = rowData.companyDocumentDetailsId;
    this.hiddenScroll();
  }
  fileUploadEdit: boolean = false;
  async editUploadDoc(rowData) {
    this.uploadFileInfo = "block";
    this.fileUploadEdit = true;
    this.fileUpload = rowData;
    if (this.fileUpload.alertRequired == "1") {
      this.fileUpload.checked = true;
    } else {
      this.fileUpload.checked = false;
    }
    await this.getProjectOfSupplier(this.companyDetailsId);
    if (rowData.taggedProjects) {
      await this.getEmployeesOfSupplier(rowData.taggedProjects.join(","));
      this.selectedProjectOfSupplierList = await this.getSelectedList(
        rowData.taggedProjects,
        this.projectOfSupplierList,
        "projectCode"
      );
    }
    if (rowData.taggedEmployees) {
      this.selectedEmployeesOfSupplierList = await this.getSelectedList(
        rowData.taggedEmployees,
        this.employeesOfSupplierList,
        "employeeCode"
      );
    }
    this.hiddenScroll();
  }
  getSelectedList(actualList, fullList, compairId) {
    return new Promise((resolve, reject) => {
      if (actualList) {
        let abc = [];
        actualList.filter((a) => {
          fullList.forEach((element) => {
            if (element[compairId] == a) {
              abc.push(element);
            }
          });
          resolve(abc);
        });
      }
    });
  }
  fileToDownload(rowData) {
    this.companyService
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
  async onImageViewOpenClick(rowData) {
    this.companyService
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
  saveUploadFile(rowData, form: NgForm) {
    let input = new FormData();
    let projectList: string[] = [];
    let employeeList: string[] = [];
    this.selectedEmployeesOfSupplierList.forEach((element) => {
      employeeList.push(element.employeeCode);
    });
    this.selectedProjectOfSupplierList.forEach((element) => {
      projectList.push(element.projectCode);
    });
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
    input.append(
      "employeeDetailsId",
      this.authService.currentUser.employeeDetailsId.toString()
    );
    input.append("companyDetailsId", this.companyDetailsId);
    input.append("taggedProjects", JSON.stringify(projectList));
    input.append("taggedEmployees", JSON.stringify(employeeList));
    if (rowData.companyDocumentDetailsId) {
      input.append(
        "companyDocumentDetailsId",
        rowData.companyDocumentDetailsId
      );
      this.updateCompanytDocument(input, form);
    } else {
      if (this.fileUpload.fileToUpload) {
        this.uploadCompanytDocument(input, form);
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
      this.fileUpload.fileToUpload = file;
    } else {
      this.fileUpload.fileToUpload = undefined;
    }
  }
  clearFile() {
    this.myInputVariable.nativeElement.value = "";
    this.fileUpload.fileToUpload = undefined;
  }
  uploadCompanytDocument(input, form: NgForm) {
    this.companyService.UploadCompanytDocument(input).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.closeAddmodal();
          this.getDocuments(
            this.authService.currentUser.employeeDetailsId,
            this.companyDetailsId
          );
          this.fileUpload = new FileUploadModel();
          this.selectedProjectOfSupplierList = [];
          this.selectedEmployeesOfSupplierList = [];
          form.resetForm();
          form.reset();
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
  updateCompanytDocument(input, form: NgForm) {
    this.companyService.UpdateCompanytDocument(input).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.closeAddmodal();
          this.getDocuments(
            this.authService.currentUser.employeeDetailsId,
            this.companyDetailsId
          );
          this.fileUpload = new FileUploadModel();
          this.selectedProjectOfSupplierList = [];
          this.selectedEmployeesOfSupplierList = [];
          form.reset();
          form.resetForm();
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
  getDocuments(employeeDetailsId, companyDetailsId) {
    this.companyService
      .getCompanyDocuments(employeeDetailsId, companyDetailsId)
      .subscribe((res) => {
        if (res.statusCode) {
          this.documentList = res.responsePayload;
        }
      });
  }
  saveComment(comment) {
    console.log(comment);
    if (comment.comment) {
      this.commentDetails.companyDetailsId = this.companyDetailsId;
      this.companyService.saveCompanyComment(comment).subscribe((res) => {
        if (res.statusCode == 200) {
          this.getCompanyComments(comment.companyDetailsId);
          this.commentDetails = new CompanyComment();
        }
      });
    }
  }
  editComment(rowData) {
    this.commentDetails = rowData;
  }
  getCompanyComments(invoiceDetailsId) {
    this.companyService
      .getCompanyComments(invoiceDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.commentList = res.responsePayload;
        } else {
          this.commentList = [];
        }
      });
  }
  getSupplierContactDetails(companyDetailsId) {
    this.companyService
      .getSupplierContactDetails(companyDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.supplierContactList = res.responsePayload;
        }
      });
  }
  deleteComment(rowData) {
    this.deleteRowData = rowData;
    this.confirmType = "deleteComment";
    this.hiddenScroll();
  }
  confirm(type) {
    switch (type) {
      case "deleteComment":
        this.confirmDeleteComment(this.deleteRowData);
        break;
      case "deleteDocument":
        this.confirmDeleteDocument(this.deleteRowData);
        break;
    }
  }
  confirmDeleteComment(rowData) {
    this.companyService
      .deleteCompanyComment(rowData.companyCommentDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getCompanyComments(rowData.companyDetailsId);
          this.confirmType = "";
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
  getInvoices(companyDetailsId) {
    this.companyService
      .getCompanyInvoices(companyDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.invoicesList = res.responsePayload.invoices;
        }
      });
  }
  viewStatusComment(comments) {
    this.statusViewModel = "block";
    this.comments = comments;
  }
  getEmployeesWorked(companyDetailsId) {
    this.companyService
      .getEmployeesWorked(companyDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.employeesWorkList = res.responsePayload;
        }
      });
  }
  hadleTaggedProjects(event) {
    const projectCode = [];
    this.selectedProjectOfSupplierList.forEach((element) => {
      projectCode.push(element.projectCode);
    });
    this.getEmployeesOfSupplier(projectCode.join(","));
  }
  getEmployeesOfSupplier(projectCodes) {
    return new Promise<void>((resolve, reject) => {
      this.companyService
        .getEmployeesOfSupplierBySupplier(projectCodes)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.employeesOfSupplierList = res.responsePayload;
          } else {
            this.employeesOfSupplierList = [];
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
            this.projectOfSupplierList = res.responsePayload;
            console.log(this.projectOfSupplierList);
          } else {
            this.projectOfSupplierList = [];
          }
          resolve();
        });
    });
  }
  closeAddmodal() {
    this.uploadFileInfo = "none";
    this.taggedModelInfo = "none";
    this.displayScroll();
    this.errorLabel = "";
    this.myInputVariable.nativeElement.value = "";
    this.fileUpload = new FileUploadModel();
    this.statusViewModel = "none";
    this.comments = null;
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
  fileToDeleteDocument(rowData) {
    this.deleteRowData = rowData;
    this.confirmType = "deleteDocument";
    this.hiddenScroll();
  }
  confirmDeleteDocument(rowData) {
    this.companyService
      .deleteCompanyDocument(rowData.companyDocumentDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getDocuments(
            this.authService.currentUser.employeeDetailsId,
            this.companyDetailsId
          );
        }
      });
  }
}
export class CompanyComment {
  "companyCommentDetailsId": number;
  "comment": string;
  "commentType": string = "1";
  "employeeDetailsId": number;
  "employeeName": string;
  "companyDetailsId": number;
  "status": string;
  "commentDateTime": string;
}
