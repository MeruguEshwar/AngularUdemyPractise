import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Company } from "@app/shared/models/company-module.model";
import { CompanyService } from "../company.service";
import { Location } from "@angular/common";
import { HttpResponse } from "@angular/common/http";
import { SharedService } from "@app/shared/shared.service";
import { AuthService } from "@app/core/service/auth.service";

@Component({
  selector: "app-companyview",
  templateUrl: "./companyview.component.html",
  styleUrls: ["./companyview.component.css"],
})
export class CompanyviewComponent implements OnInit {
  loading: boolean = false;
  public statusViewModel: string = "none";
  public taggedModelInfo: string = "none";
  public taggedProjectModelInfo: string = "none";

  state: any;
  companyDetailsId: any;
  company: Company;
  companyType: string;
  clientErrorMsg: any;
  viewImage: boolean = false;
  imageBlob: HttpResponse<Blob>;
  approverList: any[] = [];
  invoicesList: any[] = [];
  documentList: any[] = [];
  documentTagList: any[] = [];
  paymentList: any[] = [];
  projectsList: any[] = [];
  employeesWorkList: any[] = [];
  supplierContactList: any[] = [];
  commentsList: any[] = [];
  selectedTaggedProjects: any;
  comments: string;
  selectedCompanyDocumentDetailsId: any;
  organizationCurrency: string;
  commonNetDueString = "Net";
  paymentsCols = [
    { field: "companyName", header: "Customer Name" },
    { field: "paymentType", header: "Payment Type" },
    { field: "dateReceived", header: "Received Date" },
    { field: "amount", header: "Received Amount" },
    { field: "invoiceNumber", header: "Invoice ID" },
  ];
  invoicesCols = [
    { field: "companyName", header: "Customer" },
    { field: "invoiceDate", header: "Created Date" },
    { field: "invoiceDueDate", header: "Due Date" },
    { field: "amount", header: "Total Amount" },
    { field: "amountPaid", header: "Amount Received" },
    { field: "balanceAmount", header: "Balance" },
    { field: "invoiceNumber", header: "#Invoice" },
    { field: "paymentStatus", header: "Status" },
  ];
  CompanyDocCols = [
    { field: "documentTitle", header: "Document Title" },
    { field: "documentNumber", header: "Document Number" },
    { field: "documentExpiryDate", header: "Expiry Date" },
    { field: "alertRequired", header: "Alert Status" },
    { field: "taggedDocument", header: "Tagged Document ?" },
    { field: "sharedWithOthers", header: "Is shared ?" },
  ];
  CompanyDocTagCols = [
    { field: "documentTitle", header: "Document Title" },
    { field: "documentNumber", header: "Document Number" },
    { field: "documentExpiryDate", header: "Expiry Date" },
    { field: "alertRequired", header: "Alert Status" },
    { field: "alertBeforeNoOfDays", header: "No Of Days" },
  ];
  employeeWorkCols = [
    { field: "employeeFullName", header: "Employee Name" },
    { field: "projectName", header: "Project Name" },
    { field: "startDate", header: "Start Date" },
    { field: "endDate", header: "End Date" },
  ];
  supplierContactCols = [
    { field: "contactName", header: "Contact Name" },
    { field: "contactTitle", header: "Contact Title" },
    { field: "contactEmail", header: "Email" },
    { field: "contactPhone", header: "Mobile" },
    { field: "contactLandline", header: "Landline" },
    { field: "contactLandlineExtn", header: "Extension" },
  ];
  commentCols = [
    { field: "employeeName", header: "Employee Name" },
    { field: "commentDateTime", header: "Comment Date" },
    { field: "comment", header: "Comment" },
  ];
  projectCols = [
    { field: "projectName", header: "Project Name" },
    { field: "description", header: "Discription" },
    { field: "startDate", header: "Start Date" },
    { field: "endDate", header: "End Date" },
  ];
  constructor(
    private companyService: CompanyService,
    private location: Location,
    private sharedService: SharedService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.authService.orgnizationCurrency) {
      this.organizationCurrency = this.authService.orgnizationCurrency;
    }
    this.state = window.history.state;
    if (this.state && this.state.companyDetailsId) {
      this.companyDetailsId = this.state.companyDetailsId;
    }
    if (this.companyDetailsId) {
      this.getCompanieDetails(this.companyDetailsId);
      this.getApprovers(this.companyDetailsId);
      this.getInvoices(this.companyDetailsId);
      this.getPayments(this.companyDetailsId);
      this.getEmployeesWorked(this.companyDetailsId);
      this.getCompanyComments(this.companyDetailsId);
      this.getCompanyProjects(this.companyDetailsId);
      this.getSupplierContactDetails(this.companyDetailsId);
      this.getDocuments(
        this.authService.currentUser.employeeDetailsId,
        this.companyDetailsId
      );
      // this.getTaggedDocuments(this.companyDetailsId);
      this.cdr.detectChanges();
    } else {
      this.location.back();
    }
  }
  onEditSupplier() {
    this.company = this.company;
    this.companyType = "Edit";
    this.hiddenScroll();
  }
  onDeptAddCloseClick(event) {
    this.getCompanieDetails(this.companyDetailsId);
    this.companyType = "";
  }
  getCompanieDetails(companyDetailsId: number) {
    this.loading = true;
    this.companyService.getCompanieDetails(companyDetailsId).subscribe(
      (res) => {
        this.loading = false;
        if (res.statusCode == 200)
          this.company = res.responsePayload as Company;
        console.log(res.responsePayload);
        console.log(this.company);
      },
      (error) => {
        this.loading = false;
      }
    );
  }
  getApprovers(companyDetailsId) {
    this.companyService
      .getcompanyInvoicesApprover("1", companyDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.approverList = res.responsePayload;
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
  getPayments(companyDetailsId) {
    this.companyService.getPayments(companyDetailsId).subscribe((res) => {
      if (res.statusCode == 200) {
        this.paymentList = res.responsePayload;
      }
    });
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
  getSupplierContactDetails(companyDetailsId) {
    this.companyService
      .getSupplierContactDetails(companyDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.supplierContactList = res.responsePayload;
        }
      });
  }

  getDocuments(employeeDetailsId, companyDetailsId) {
    this.companyService
      .getCompanyAndTaggedDocuments(employeeDetailsId, companyDetailsId)
      .subscribe((res) => {
        if (res.statusCode) {
          this.documentList = res.responsePayload;
          console.log(this.documentList);
        }
      });
  }
  getTaggedDocuments(companyDetailsId) {
    this.companyService
      .getTaggedDocuments(companyDetailsId)
      .subscribe((res) => {
        if (res.statusCode) {
          this.documentTagList = res.responsePayload;
        }
      });
  }
  taggedDocumentModel(rowData) {
    this.taggedModelInfo = "block";
    this.selectedCompanyDocumentDetailsId = rowData.companyDocumentDetailsId;
    this.hiddenScroll();
  }
  taggedProjectModel(rowData) {
    this.taggedProjectModelInfo = "block";
    this.selectedTaggedProjects = rowData;
    this.hiddenScroll();
  }
  getCompanyComments(companyDetailsId) {
    this.companyService
      .getCompanyComments(companyDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.commentsList = res.responsePayload;
        }
      });
  }
  async onImageViewOpenClick(rowData) {
    if (rowData.companyDocumentDetailsId) {
      this.companyService
        .downloadCompanyDocument(rowData.companyDocumentDetailsId)
        .subscribe((resp: HttpResponse<Blob>) => {
          this.imageBlob = resp;
          this.viewImage = true;
        });
    } else if (rowData.projectDocumentDetailsId) {
      this.companyService
        .downloadProjectDocument(rowData.projectDocumentDetailsId)
        .subscribe((resp: HttpResponse<Blob>) => {
          this.imageBlob = resp;
          this.viewImage = true;
        });
    }
  }
  onImageViewCloseClick(event) {
    if (event.type == "cancel") {
      this.imageBlob = null;
      this.viewImage = false;
    }
  }
  fileToDownload(rowData, type) {
    if (!rowData.taggedDocument) {
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
    } else if (rowData.taggedDocument) {
      this.companyService
        .downloadProjectDocument(rowData.projectDocumentDetailsId)
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
  }

  viewStatusComment(comments) {
    this.statusViewModel = "block";
    this.comments = comments;
  }
  closeUploadmodal() {
    this.statusViewModel = "none";
    this.comments = null;
  }
  closeAddmodal() {
    this.taggedModelInfo = "none";
    this.taggedProjectModelInfo = "none";
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

  getCompanyProjects(companyDetailsId) {
    this.companyService
      .getCompanyProjects(companyDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.projectsList = res.responsePayload;
        }
      });
  }
}
