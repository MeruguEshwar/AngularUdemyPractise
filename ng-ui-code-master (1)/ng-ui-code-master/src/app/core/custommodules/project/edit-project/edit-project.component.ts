import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { SharedService } from "@app/shared/shared.service";
import { AuthService } from "@app/core/service/auth.service";
import { Project } from "@app/shared/models/project.model";
import { ProjectService } from "../project.service";
import { projectCompanyMappings } from "@app/shared/models/projectCompanyMappings.model";
import { Location } from "@angular/common";
import { CompanyService } from "../../company/company.service";
import { HttpResponse } from "@angular/common/http";
import { FileUploadModel } from "@app/shared/models/fileUpload.model";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-edit-project",
  templateUrl: "./edit-project.component.html",
  styleUrls: ["./edit-project.component.css"],
})
export class EditProjectComponent implements OnInit {
  @ViewChild("minimumDate") minimumDate: ElementRef<HTMLInputElement>;
  displayDialog: boolean;
  project: Project;
  clientErrorMsg: any;
  public addemployeeDisplay: string = "none";
  public taggedModelInfo: string = "none";
  errLabel: any;
  addErrLabel: any;
  mappingIndex: number = 0;
  projectCompanyMappings: any[] = [];
  currentCompanyList: any[] = [];
  documentList: any[] = [];
  companyList: any[] = [];

  supplierOfProjectList: any = [];
  selectedSupplierOfProjectList: any = [];
  employeesOfProjectList: any = [];
  selectedEmployeesOfProjectList: any = [];

  addPointerEvent: string = "auto";
  predessor: string;
  currentOrganization: string = this.authService.currentUser.orgnizationName;
  currentRecord: any;
  recordType: string = "newRecord";
  viewImage: boolean = false;
  imageBlob: HttpResponse<Blob>;
  fileUpload: FileUploadModel;
  fileUploadEdit: boolean = false;
  uploadFileInfo: string = "none";
  errorLabel: string = "";
  @ViewChild("fileInput")
  myInputVariable: ElementRef;
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
  noOfAlertsList: any = [
    { label: "Select Days", value: null },
    { label: "3 Days", value: 3 },
    { label: "7 Days", value: 7 },
    { label: "10 Days", value: 10 },
    { label: "30 Days", value: 30 },
    { label: "90 Days", value: 90 },
    { label: "180 Days", value: 180 },
  ];
  loading: boolean = false;
  state: any;
  projectDetailsId: any;
  selectedProjectDocumentDetailsId: any;
  tabIndex: any;
  commentDetails: ProjectComment;
  commentList: ProjectComment[];
  projectDocCols = [
    { field: "documentTitle", header: "Document Title" },
    { field: "documentNumber", header: "Document Number" },
    { field: "documentExpiryDate", header: "Expiry Date" },
    { field: "alertRequired", header: "Alert Required" },
    { field: "sharedWithOthers", header: "Is shared ?" },
  ];
  selectedDocumentCategoryDetails: any;
  messageType = [
    { label: "Private", value: "1" },
    { label: "Customer", value: "2" },
  ];
  deleteRowData: any;
  confirmType: string;
  initialProjectName: string;
  sourceCustomerMapping: projectCompanyMappings[] = [];
  customerMapping: projectCompanyMappings;
  showAddButton: boolean = true;
  deleteModelInfo: string = "none";
  constructor(
    private projectService: ProjectService,
    public sharedService: SharedService,
    private authService: AuthService,
    private location: Location,
    private companyService: CompanyService,
    private cdr: ChangeDetectorRef
  ) {}

  organizationCurrency: string;
  async ngOnInit(): Promise<void> {
    if (this.authService.orgnizationCurrency) {
      this.organizationCurrency = this.authService.orgnizationCurrency;
    }
    this.project = new Project();
    this.currentRecord = new projectCompanyMappings();
    this.customerMapping = new projectCompanyMappings();
    this.fileUpload = new FileUploadModel();
    this.commentDetails = new ProjectComment();
    this.state = window.history.state;
    if (this.state && this.state.projectDetailsId) {
      this.projectDetailsId = this.state.projectDetailsId;
      this.tabIndex = this.state.tabIndex;
    }
    if (this.projectDetailsId) {
      await this.getProjectDetails(this.projectDetailsId).then(
        (res: Project) => {
          this.project = res;
          this.initialProjectName = this.project.projectName;
        }
      );
      await this.getCompanies();
      this.getProjectComments(this.projectDetailsId);
      this.getDocuments(
        this.authService.currentUser.employeeDetailsId,
        this.projectDetailsId
      );
      this.currentCompanyList = [...this.companyList];
      if (this.project.webProjectCompanyMappings) {
        this.projectCompanyMappings =
          this.project.webProjectCompanyMappings.slice(0);
        this.projectCompanyMappings.sort((a, b) => {
          return a.mappingIndex - b.mappingIndex;
        });
        this.sourceCustomerMapping = [...this.projectCompanyMappings];
        this.mappingIndex = this.project.webProjectCompanyMappings.length;
        for (
          let index = 0;
          index < this.projectCompanyMappings.length;
          index++
        ) {
          this.currentCompanyList = this.hideCompanyFromList(
            this.currentCompanyList,
            "value",
            this.projectCompanyMappings[index].companyDetailsId
          ); // remove the selected company from list
        }
        this.predessor = this.getPredessor(
          this.projectCompanyMappings[this.mappingIndex - 1].companyDetailsId
        );
      }
    } else {
      this.location.back();
    }
    this.cdr.detectChanges();
  }
  getCompanies(status: number = 1) {
    return new Promise<void>((resolve, reject) => {
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
            resolve();
          }
        },
        (error) => {
          this.loading = false;
        }
      );
    });
  }
  getDocuments(employeeDetailsId, projectDetailsId) {
    this.projectService
      .getProjectDocuments(employeeDetailsId, projectDetailsId)
      .subscribe((res) => {
        if (res.statusCode) {
          this.documentList = res.responsePayload;
        }
      });
  }
  uploadDocCatg() {
    this.uploadFileInfo = "block";
    this.fileUploadEdit = false;
    // this.getEmployeesOfProject(this.projectDetailsId, null);
    this.getSupplierOfProject(this.projectDetailsId);
    this.hiddenScroll();
  }
  taggedDocumentModel(rowData) {
    this.taggedModelInfo = "block";
    this.selectedProjectDocumentDetailsId = rowData.projectDocumentDetailsId;
    this.hiddenScroll();
  }
  async editUploadDoc(rowData) {
    console.log(rowData);
    this.fileUpload = { ...rowData };
    this.fileUploadEdit = true;
    this.uploadFileInfo = "block";
    if (this.fileUpload.alertRequired == "1") {
      this.fileUpload.checked = true;
    } else {
      this.fileUpload.checked = false;
    }
    await this.getEmployeesOfProject(this.projectDetailsId, null);
    await this.getSupplierOfProject(this.projectDetailsId);
    if (rowData.taggedEmployees) {
      this.selectedEmployeesOfProjectList = await this.getSelectedList(
        rowData.taggedEmployees,
        this.employeesOfProjectList,
        "employeeCode"
      );
    }
    if (rowData.taggedSuppliers) {
      this.selectedSupplierOfProjectList = await this.getSelectedList(
        rowData.taggedSuppliers,
        this.supplierOfProjectList,
        "companyCode"
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
  getProjectDetails(projectDetailsId) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.projectService.getProject(projectDetailsId).subscribe(
        (res) => {
          this.loading = false;
          if (res.statusCode == 200)
            var project = res.responsePayload as Project;
          resolve(project);
        },
        (error) => {
          this.loading = false;
        }
      );
    });
  }
  getProjectComments(invoiceDetailsId) {
    this.projectService
      .getProjectComments(invoiceDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.commentList = res.responsePayload;
        } else {
          this.commentList = [];
        }
      });
  }
  async onImageViewOpenClick(rowData) {
    this.projectService
      .downloadProjectDocument(rowData.projectDocumentDetailsId)
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
  fileToDownload(rowData) {
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
  }
  editComment(rowData) {
    this.commentDetails = rowData;
  }
  deleteComment(rowData) {
    this.deleteRowData = rowData;
    this.confirmType = "deleteComment";
    this.hiddenScroll();
  }
  handleChange(e) {
    this.tabIndex = e.index;
  }
  showDialogToAdd() {
    //this.department = new Department;
    this.addemployeeDisplay = "block";
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

  checkProjectAlreadyExist(f: NgForm) {
    if (f.form.controls.projectName.dirty) {
      this.projectService.isProjectExists(this.project.projectName).subscribe(
        (res) => {
          if (res.statusCode != 200) {
            this.errLabel = res.message;
            this.project.projectName = this.initialProjectName;
          } else {
            this.errLabel = undefined;
          }
        },
        (error) => {
          this.errLabel = error;
        }
      );
    }
  }

  save() {
    if (this.project.inHouse == "0" || this.project.inHouse == 0) {
      this.sourceCustomerMapping.forEach((element, index) => {
        this.sourceCustomerMapping[index].mappingIndex = index;
      });
      this.project.projectCompanyMappings = this.sourceCustomerMapping;
    }
    this.projectService.updateProject(this.project).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.addemployeeDisplay = "none";
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.displayScroll();
        } else {
          this.errLabel = res.message;
        }
      },
      (error) => {
        this.errLabel = error;
      }
    );
  }
  saveComment(comment) {
    if (comment.comment) {
      this.commentDetails.projectDetailsId = this.projectDetailsId;
      this.projectService.saveProjectcomment(comment).subscribe((res) => {
        if (res.statusCode == 200) {
          this.getProjectComments(comment.projectDetailsId);
          this.commentDetails = new ProjectComment();
        }
      });
    }
  }
  confirm(type) {
    switch (type) {
      case "deleteComment":
        this.confirmDeleteComment(this.deleteRowData);
        break;
      case "projectMapping":
        this.confirCompanyMapping();
        break;
      case "document":
        this.confirmDeleteDocument(this.deleteRowData);
        break;
    }
  }
  confirmDeleteComment(rowData) {
    this.projectService
      .deleteProjectComment(rowData.projectCommentDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getProjectComments(rowData.projectDetailsId);
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
  addAssociation() {
    this.addErrLabel = "";
    if (
      this.currentRecord.associationType != undefined &&
      this.currentRecord.companyDetailsId != undefined &&
      this.currentRecord.mappingIndex != undefined
    ) {
      if (this.recordType === "updateRecord") {
        this.projectCompanyMappings.filter((record, index) => {
          if (record.mappingIndex === this.currentRecord.mappingIndex) {
            this.projectCompanyMappings[index] = this.currentRecord;
          }
        });
      } else {
        this.projectCompanyMappings.push(this.currentRecord);
      }
    } else {
      this.addErrLabel = "(*) fields are mandatory";
    }
    this.currentCompanyList = this.hideCompanyFromList(
      this.currentCompanyList,
      "value",
      this.currentRecord.companyDetailsId
    ); // remove the selected company from list
    this.predessor = this.getPredessor(
      this.projectCompanyMappings[this.mappingIndex - 1].companyDetailsId
    );
    this.recordType = "newRecord";
    this.currentRecord = new projectCompanyMappings();
  }
  hideCompanyFromList(arr: any, attr: any, value: any) {
    var i = arr.length;
    while (i--) {
      if (
        arr[i] &&
        arr[i].hasOwnProperty(attr) &&
        arguments.length > 2 &&
        arr[i][attr] === value
      ) {
        arr.splice(i, 1);
      }
    }
    return arr;
  }
  closeAddmodal(form?: NgForm) {
    this.addemployeeDisplay = "none";
    this.taggedModelInfo = "none";
    this.displayScroll();
    this.currentCompanyList = [...this.companyList];
    this.uploadFileInfo = "none";
    this.errorLabel = "";
    this.myInputVariable.nativeElement.value = "";
    this.fileUpload = new FileUploadModel();
    if (form) {
      form.reset();
    }
  }

  showNextButton() {
    if (this.currentCompanyList.length >= 1) {
      this.showAddButton = true;
    } else {
      this.showAddButton = false;
    }
  }
  showNextButton1(index: number) {
    if (index <= this.currentCompanyList.length + 1) {
      return true;
    } else {
      return false;
    }
  }
  pushMappingIndex() {
    if (this.recordType === "newRecord") {
      this.mappingIndex += 1;
      this.currentRecord.mappingIndex = this.mappingIndex;
    }
  }
  getPredessor(companyDetailsId: number) {
    var result = this.companyList.filter((company) => {
      return company.value === companyDetailsId;
    });
    if (result[0] != undefined) {
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
  editRecord(record: any) {
    this.recordType = "updateRecord";
    this.currentCompanyList.push({
      label: record.companyName,
      value: record.companyDetailsId,
    });
    this.currentRecord = record;
    if (this.currentRecord.mappingIndex != 1) {
      this.predessor = this.getPredessor(
        this.projectCompanyMappings[this.currentRecord.mappingIndex - 2]
          .companyDetailsId
      );
    } else {
      this.predessor = this.currentOrganization;
    }
  }
  cancelRecord() {
    this.currentCompanyList = this.hideCompanyFromList(
      this.currentCompanyList,
      "value",
      this.currentRecord.companyDetailsId
    );
    this.predessor = this.getPredessor(
      this.projectCompanyMappings[this.mappingIndex - 1].companyDetailsId
    );
    this.currentRecord = new projectCompanyMappings();
    this.recordType = "newRecord";
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
    }
    if (
      this.selectedEmployeesOfProjectList &&
      this.selectedEmployeesOfProjectList.length &&
      this.selectedSupplierOfProjectList &&
      this.selectedSupplierOfProjectList.length
    ) {
      this.selectedSupplierOfProjectList.forEach((element) => {
        supplierList.push(element.companyCode);
      });
    }

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
    input.append("projectDetailsId", this.projectDetailsId);
    input.append("taggedSuppliers", JSON.stringify(supplierList));
    input.append("taggedEmployees", JSON.stringify(employeeList));
    if (rowData.projectDocumentDetailsId) {
      input.append(
        "projectDocumentDetailsId",
        rowData.projectDocumentDetailsId
      );
      this.projectService.updateProjectDocument(input).subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.closeAddmodal();
            this.getDocuments(
              this.authService.currentUser.employeeDetailsId,
              this.projectDetailsId
            );
            this.fileUpload = new FileUploadModel();
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
        this.projectService.uploadProjectDocument(input).subscribe(
          (res) => {
            if (res.statusCode == 200) {
              this.closeAddmodal();
              this.getDocuments(
                this.authService.currentUser.employeeDetailsId,
                this.projectDetailsId
              );
              this.fileUpload = new FileUploadModel();
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
  EnterSubmit(event, data) {
    if (event.which === 13 || event.keyCode === 13 || event.key === "Enter") {
      this.saveComment(data);
    }
  }
  getEmployeesOfProject(projectid, projectCodes) {
    return new Promise<void>((resolve, reject) => {
      this.projectService
        .getEmployeesOfSupplierBySupplier(projectid, projectCodes)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.employeesOfProjectList = res.responsePayload;
          } else {
            this.employeesOfProjectList = [];
            this.selectedEmployeesOfProjectList = [];
          }
          resolve();
        });
    });
  }
  getSupplierOfProject(projectDetailsId) {
    return new Promise<void>((resolve, reject) => {
      this.projectService
        .getSupplierOfProject(projectDetailsId)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.supplierOfProjectList = res.responsePayload;
          } else {
            this.supplierOfProjectList = [];
          }
          resolve();
        });
    });
  }
  hadleTaggedSupplier(event) {
    console.log(event);
    const companyCode = [];
    this.selectedSupplierOfProjectList.forEach((element) => {
      companyCode.push(element.companyCode);
    });
    this.getEmployeesOfProject(this.projectDetailsId, companyCode.join(","));
  }
  addCustomerMapping() {
    this.addErrLabel = "";
    if (
      this.customerMapping.associationType != undefined &&
      this.customerMapping.companyDetailsId != undefined
    ) {
      if (this.companyList.length > this.mappingIndex) {
        this.currentCompanyList = this.hideCompanyFromList(
          this.currentCompanyList,
          "value",
          this.customerMapping.companyDetailsId
        ); // remove the selected company from list
        this.mappingIndex += 1;
        this.sourceCustomerMapping = [
          ...this.sourceCustomerMapping,
          this.customerMapping,
        ];
        this.customerMapping = new projectCompanyMappings();
        this.showNextButton();
      } else {
        this.addErrLabel = "You can not add more";
      }
    } else {
      this.addErrLabel = "(*) fields are mandatory";
    }
    this.showNextButton();
  }
  deleteCustomerMapping(rowData, type) {
    this.deleteRowData = rowData;
    this.deleteModelInfo = "block";
    this.confirmType = type;
  }
  confirCompanyMapping() {
    if (this.deleteRowData.projectCompanyMappingDetailsId) {
      this.projectService
        .projectMappingRemove(this.deleteRowData.projectCompanyMappingDetailsId)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.projectMappingRemove();
          }
        });
    } else {
      this.projectMappingRemove();
    }
  }
  projectMappingRemove() {
    var data = this.hideCompanyFromList(
      this.sourceCustomerMapping,
      "companyDetailsId",
      this.deleteRowData.companyDetailsId
    ); // remove the selected company from list
    this.sourceCustomerMapping = [...data];
    var deletedCompanyDetails = this.companyList.filter((element) => {
      return element.value == this.deleteRowData.companyDetailsId;
    });
    if (deletedCompanyDetails.length) {
      this.currentCompanyList.unshift(deletedCompanyDetails[0]);
    }
    this.cancelConfirm();
  }
  cancelConfirm() {
    this.deleteRowData = undefined;
    this.deleteModelInfo = "none";
  }
  fileToDelete(rowData, type) {
    this.deleteRowData = rowData;
    this.deleteModelInfo = "block";
    this.confirmType = type;
  }
  confirmDeleteDocument(rowData) {
    this.projectService
      .deleteProjectDocument(rowData.projectDocumentDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getDocuments(
            this.authService.currentUser.employeeDetailsId,
            this.projectDetailsId
          );
          this.cancelConfirm();
        }
      });
  }
}
export class ProjectComment {
  "projectCommentDetailsId": number;
  "comment": string;
  "commentType": string = "1";
  "employeeDetailsId": number;
  "employeeName": string;
  "projectDetailsId": number;
  "status": string;
  "commentDateTime": string;
}
