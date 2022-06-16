import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { AuthService } from "@app/core/service/auth.service";
import { Project } from "@app/shared/models/project.model";
import { Location } from "@angular/common";
import { ProjectService } from "../project.service";
import { CompanyService } from "../../company/company.service";
import { HttpResponse } from "@angular/common/http";
import { SharedService } from "@app/shared/shared.service";

@Component({
  selector: "app-view-project",
  templateUrl: "./view-project.component.html",
  styleUrls: ["./view-project.component.css"],
})
export class ViewProjectComponent implements OnInit {
  loading: boolean = false;
  state: any;
  projectDetailsId: any;
  project: Project;
  companyType: string;
  clientErrorMsg: any;
  currentOrganization: string = this.authService.currentUser.orgnizationName;
  projectCompanyMappings: any[];
  companyList: any[];
  approverList: any[] = [];
  documentList: any[] = [];
  documentTaggedList: any[] = [];
  resourcesList: any[] = [];
  commentsList: any[] = [];
  selectedTaggedSuppliers: any;
  viewImage: boolean = false;
  imageBlob: HttpResponse<Blob>;
  public taggedModelInfo: string = "none";
  public taggedProjectModelInfo: string = "none";
  selectedProjectDocumentDetailsId: any;
  commonNetDueString = "Net";
  constructor(
    private authService: AuthService,
    private location: Location,
    private projectService: ProjectService,
    private companyService: CompanyService,
    private sharedService: SharedService
  ) {}
  projectDocCols = [
    { field: "documentTitle", header: "Document Title" },
    { field: "documentNumber", header: "Document Number" },
    { field: "documentExpiryDate", header: "Expiry Date" },
    { field: "alertRequired", header: "Alert Status" },
    { field: "taggedDocument", header: "Tagged Document ?" },
    { field: "sharedWithOthers", header: "Is shared ?" },
  ];
  projectTagDocCols = [
    { field: "documentTitle", header: "Document Title" },
    { field: "documentNumber", header: "Document Number" },
    { field: "documentExpiryDate", header: "Expiry Date" },
    { field: "alertRequired", header: "Alert Status" },
    { field: "alertBeforeNoOfDays", header: "No Of Days" },
  ];
  projectResrCols = [
    { field: "employeeFullName", header: "Employee Name" },
    { field: "startDate", header: "Start Date" },
    { field: "endDate", header: "End Date" },
    { field: "invoiceFrequency", header: "Invoice Frequency" },
    { field: "showInInvoice", header: "Show In Invoice" },
    { field: "rate", header: "Rate" },
    { field: "overtimeRate", header: "Overtime Rate" },
    { field: "doubleOvertimeRate", header: "Double Overtime Rate" },
  ];
  commentCols = [
    { field: "employeeName", header: "Employee Name" },
    { field: "commentDateTime", header: "Comment Date" },
    { field: "comment", header: "Comment" },
  ];

  organizationCurrency: string;
  ngOnInit(): void {
    if (this.authService.orgnizationCurrency) {
      this.organizationCurrency = this.authService.orgnizationCurrency;
    }

    this.project = new Project();
    this.state = window.history.state;
    if (this.state && this.state.projectDetailsId) {
      this.projectDetailsId = this.state.projectDetailsId;
    }
    if (this.projectDetailsId) {
      this.getProjectDetails(this.projectDetailsId);
      this.getCompanies();
      this.getApprovers(this.projectDetailsId);
      this.getResources(this.projectDetailsId);
      this.getProjectComments(this.projectDetailsId);
      this.getDocuments(
        this.authService.currentUser.employeeDetailsId,
        this.projectDetailsId
      );
      //this.getTaggedDocuments(this.projectDetailsId);
    } else {
      this.location.back();
    }
  }
  getProjectDetails(projectDetailsId) {
    this.loading = true;
    this.projectService.getProject(projectDetailsId).subscribe(
      (res) => {
        this.loading = false;
        if (res.statusCode == 200) console.log(res.responsePayload);
        this.project = res.responsePayload as Project;
        if (this.project.webProjectCompanyMappings) {
          this.projectCompanyMappings =
            this.project.webProjectCompanyMappings.slice(0);
          this.projectCompanyMappings.sort((a, b) => {
            return a.mappingIndex - b.mappingIndex;
          });
        }
      },
      (error) => {
        this.loading = false;
      }
    );
  }
  getCompanies(status: number = 1) {
    this.companyService.getAllCompanies(status).subscribe(
      (res) => {
        this.loading = false;
        this.companyList = [];
        if (res.statusCode == 200) {
          for (let index = 0; index < res.responsePayload.length; index++) {
            const element = res.responsePayload[index];
            this.companyList.push({
              label: element.companyName,
              value: element.companyDetailsId,
            });
          }
          this.projectService
            .getCurrentOrgAsCompanyDetails()
            .subscribe((res) => {
              if (res.statusCode == 200) {
                this.companyList.push({
                  label: res.responsePayload.companyName,
                  value: res.responsePayload.companyDetailsId,
                });
              }
            });
        }
      },
      (error) => {
        this.loading = false;
      }
    );
  }
  getApprovers(projectDetailsId) {
    this.projectService
      .getProjectTimesheetApprover("1", projectDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.approverList = res.responsePayload;
        }
      });
  }
  getProjectComments(projectDetailsId) {
    this.projectService
      .getProjectComments(projectDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.commentsList = res.responsePayload;
        }
      });
  }
  getDocuments(employeeDetailsId, projectDetailsId) {
    this.projectService
      .getProjectAndTaggedDocuments(employeeDetailsId, projectDetailsId)
      .subscribe((res) => {
        if (res.statusCode) {
          this.documentList = res.responsePayload;
        }
      });
  }
  getTaggedDocuments(projectDetailsId) {
    this.projectService
      .getTaggedDocuments(projectDetailsId)
      .subscribe((res) => {
        if (res.statusCode) {
          this.documentTaggedList = res.responsePayload;
        }
      });
  }
  getResources(projectDetailsId) {
    this.projectService
      .getProjectResources(projectDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.resourcesList = res.responsePayload;
        }
      });
  }
  async onImageViewOpenClick(rowData) {
    if (rowData.projectDocumentDetailsId) {
      this.projectService
        .downloadProjectDocument(rowData.projectDocumentDetailsId)
        .subscribe((resp: HttpResponse<Blob>) => {
          this.imageBlob = resp;
          this.viewImage = true;
        });
    } else if (rowData.companyDocumentDetailsId) {
      this.projectService
        .downloadCompanyDocument(rowData.companyDocumentDetailsId)
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
      this.projectService
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
    } else if (rowData.taggedDocument) {
      this.projectService
        .downloadCompanyDocument(rowData.companyDocumentDetailsId)
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
  taggedDocumentModel(rowData) {
    this.taggedModelInfo = "block";
    this.selectedProjectDocumentDetailsId = rowData.projectDocumentDetailsId;
    this.hiddenScroll();
  }
  taggedProjectModel(rowData) {
    this.taggedProjectModelInfo = "block";
    this.selectedTaggedSuppliers = rowData;
    this.hiddenScroll();
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
    this.taggedModelInfo = "none";
    this.taggedProjectModelInfo = "none";
    this.displayScroll();
  }
  getPredessor(companyDetailsId: number) {
    var result = this.companyList.filter((company) => {
      return company.value === companyDetailsId;
    });
    if (result[0]) {
      return result[0].label;
    }
  }
  getAstnType(type: string) {
    switch (type) {
      case "1":
        return "Client";
      case "2":
        return "Vendor";
      case "3":
        return "Implementation Partner";
      default:
        return "SELF";
    }
  }
  getRowData(rowNode) {
    if (rowNode.node.children) {
      return "has-children-node";
    }
  }
}
