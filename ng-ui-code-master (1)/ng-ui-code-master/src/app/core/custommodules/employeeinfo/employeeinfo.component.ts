import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ConfirmationService } from "src/app/components/api/confirmationservice";
import { EmployeeService } from "./employeeinfo.service";
import { Employee } from "@app/shared/models/employee.model";
import { Role } from "@app/shared/enums/role.enum";
import { SharedService } from "@app/shared/shared.service";
import { AccessModule } from "@app/shared/models/access-module.model";
import { DocumentCategory } from "@app/shared/models/document-category.model";
import { environment } from "@env/environment";
import { Checklist } from "@app/shared/models/checklist.model";
import { HttpResponse } from "@angular/common/http";
import { FormControl, NgForm } from "@angular/forms";
declare var $: any;
export class FileUploadModel {
  fileToUpload: File = null;
}
@Component({
  selector: "app-employeeinfo",
  templateUrl: "./employeeinfo.component.html",
  styleUrls: ["./employeeinfo.component.css"],
})
export class EmployeeinfoComponent implements OnInit {
  pictureUrl: string = environment.pictureUrl;
  lstEmployees: Employee[];
  lstAccessModules: AccessModule[];
  lstDocumentCategory: DocumentCategory[];
  accessibleModulesDetailsId: string;
  cols: any[];
  terminateCols: any[];
  designation: any[];
  displayDialog: boolean;
  selectedEmpName: string;
  selectedUserName: string;
  selectedDesignation: string;
  clientErrorMsg: any;
  public listviewcol: boolean = true;
  public gridviewcol: boolean = false;
  public editemployeeDisplay: string = "none";
  public addemployeeDisplay: string = "none";
  uploadFileInfo: string = "none";
  @ViewChild("fileInput") myInputVariable: ElementRef;
  errorLabel: any;
  employeeType: string = "";
  employee: Employee;
  loading: boolean = false;
  terminationOrRehireDate: string = "";
  commentsOrRemarks: string = "";
  employeeDetailsId: string = "";
  statusCode = 1;
  isAddEmpEnable: boolean = true;
  checkList: any = [];
  checkListInfo: any = [];
  selectedChecklist: string;
  selectedChecklist1: string;
  public fileUpload: File = null;
  empDocs: any = [];
  fileToUpload: any;
  uploadedFileTitle: string;

  statusOptions = [
    { label: "Select", value: null },
    { label: "Pending", value: "0" },
    { label: "Complete", value: "1" },
    { label: "NA", value: "2" },
  ];
  checklistDetailsId: any;
  checklistMappings: any = [];

  constructor(
    private confirmationService: ConfirmationService,
    public sharedService: SharedService,
    private employeeService: EmployeeService
  ) {
    this.designation = [
      { label: "Select Designation", value: null },
      {
        label: "Web Developer",
        value: { id: "Web Developer", name: "Web Developer" },
      },
      {
        label: "UI Developer",
        value: { id: "UI Developer", name: "UI Developer" },
      },
      {
        label: "Android Developer",
        value: { id: "Android Developer", name: "Android Developer" },
      },
      {
        label: "Ios Developer",
        value: { id: "Ios Developer", name: "Ios Developer" },
      },
    ];
  }

  ngOnInit(): void {
    this.cols = [
      { field: "fullName", header: "Employee Name" },
      { field: "email", header: "Email" },
      { field: "employeeType", header: "Employee Type" },
      { field: "role", header: "Role" },
    ];
    this.terminateCols = [
      { field: "fullName", header: "Employee Name" },
      { field: "dateOfJoin", header: "Date Of Join" },
      { field: "terminationDate", header: "Termination Date" },
      { field: "employeeType", header: "Employee Type" },
      { field: "role", header: "Role" },
    ];
    this.sharedService.openToggleMenu("roleMenuToggleExternalContent");

    this.getEmployees();
    this.employeeService.getAllChecklists().subscribe((res) => {
      if (res.statusCode == 200) {
        let data = [
          {
            value: null,
            label: "Select",
          },
        ];
        res.responsePayload.forEach((element) => {
          data.push({
            value: element.checklistDetailsId,
            label: element.checklistName,
          });
        });
        this.checkList = data;
      }
    });
  }
  onEmployeeAddCloseClick(event) {
    if (event.type == "Add" || event.type == "Edit") {
      this.getEmployees();
    }

    this.employeeType = null;
  }
  handleChange(event) {
    this.empDocs = [];
    if (event.index == 0) {
      this.isAddEmpEnable = true;
      this.statusCode = 1;
      this.getEmployees(1);
    } else if (event.index == 1) {
      this.isAddEmpEnable = false;
      this.statusCode = 0;
      this.getEmployees(0);
    }
  }
  getEmployees(status = 1) {
    this.lstEmployees = [];
    this.loading = true;
    this.employeeService.getAllEmployees(status).subscribe((res) => {
      this.loading = false;
      this.lstEmployees = [];
      if (res.message == "Employees") {
        let lstEmp = res.responsePayload as Employee[];
        lstEmp.forEach((element) => {
          element.role = Role[element.roleId];
        });
        this.lstEmployees = lstEmp;
      }

      // lstEmp.forEach((value, index) => {
      //   this.orginalCars.push(value);
      // })
    }),
      (error) => {
        this.loading = false;
      };
  }

  showDialogToAdd() {
    this.employeeType = "Add";
    //this.addemployeeDisplay = "block";
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
  gridview() {
    this.gridviewcol = true;
    this.listviewcol = false;
    document.getElementById("grid").classList.add("active");
    document.getElementById("list").classList.remove("active");
  }
  listview() {
    this.listviewcol = true;
    this.gridviewcol = false;
    document.getElementById("list").classList.add("active");
    document.getElementById("grid").classList.remove("active");
  }
  save() {
    this.displayScroll();
  }
  confirm(rowData) {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this data?",
      accept: () => {
        this.delete(rowData);
        //Actual logic to perform a confirmation
      },
    });
  }
  delete(rowData: Employee) {
    this.employeeService
      .deactivateEmployee({
        terminationOrRehireDate: this.terminationOrRehireDate,
        commentsOrRemarks: this.commentsOrRemarks,
        employeeDetailsId: rowData.employeeDetailsId,
      })
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.employeeService
            .saveMappings(this.checklistMappings)
            .subscribe((res) => {
              if (res.statusCode == 200) {
                this.fileUpload = null;
                this.displayDialog = false;
                this.sharedService.add({
                  severity: "success",
                  summary: "Success",
                  detail: res.message,
                });
                this.getEmployees(this.statusCode);
                $("#delete_employee").modal("hide");
              }
            });
        }
      });
  }
  activate(rowData: Employee) {
    this.employeeService
      .activateEmployee({
        terminationOrRehireDate: this.terminationOrRehireDate,
        commentsOrRemarks: this.commentsOrRemarks,
        employeeDetailsId: rowData.employeeDetailsId,
      })
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.employeeService
            .saveMappings(this.checklistMappings)
            .subscribe((res) => {
              if (res.statusCode == 200) {
                this.fileUpload = null;
                this.displayDialog = false;
                this.getEmployees(this.statusCode);
                $("#activate_employee").modal("hide");
              }
            });
        }
      });
  }

  onDelete(rowData) {
    this.terminationOrRehireDate = "";
    this.commentsOrRemarks = "";
    this.employeeDetailsId = "";
    this.selectedChecklist = "";
    this.selectedChecklist1 = "";
    this.employeeDetailsId = rowData.employeeDetailsId;
    this.employee = rowData;
    this.checklistMappings = [];
  }
  loadEntries(checklistDetailsId) {
    this.empDocs = [];
    this.checklistDetailsId = checklistDetailsId;
    console.log(
      this.employee,
      this.employee.employeeDetailsId,
      checklistDetailsId
    );
    this.employeeService
      .getChecklistMappings(this.employee.employeeDetailsId, checklistDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          let data = [];
          if (res.responsePayload["employeeChecklistMappgings"]) {
            res.responsePayload["employeeChecklistMappgings"].forEach(
              (element) => {
                element.employeeDetailsId = this.employee.employeeDetailsId;
                data.push(element);
              }
            );
          }
          this.checklistMappings = data;
          this.empDocs = res.responsePayload.uploadedDocuments;
        }
      });
  }
  onActivate(rowData) {
    this.terminationOrRehireDate = "";
    this.commentsOrRemarks = "";
    this.employeeDetailsId = "";
    this.selectedChecklist = "";
    this.selectedChecklist1 = "";
    this.employee = rowData;
    this.employeeDetailsId = rowData.employeeDetailsId;
    this.checklistMappings = [];
  }
  onManageAccess(rowData) {
    this.employee = rowData;
    this.employeeService
      .getManageAccess(this.employee.employeeDetailsId)
      .subscribe((res) => {
        this.loading = false;
        this.accessibleModulesDetailsId =
          res.responsePayload.accessibleModulesDetailsId;
        let allModules = res.responsePayload.allModules;
        this.lstDocumentCategory = res.responsePayload.documentAccess;
        let existModules = res.responsePayload.accessibleModules;
        this.lstAccessModules = [];
        for (let index = 0; index < allModules.length; index++) {
          let module: AccessModule = {};
          const element = allModules[index];
          module.moduleName = element;
          for (let x = 0; x < existModules.length; x++) {
            const existModule = existModules[x];
            if (existModule == element) {
              module.active = true;
              break;
            }
          }
          this.lstAccessModules.push(module);
        }
        for (let index = 0; index < this.lstDocumentCategory.length; index++) {
          const element: DocumentCategory = this.lstDocumentCategory[index];
          if (element.accessType == 3) {
            element.delete = true;
          } else if (element.accessType == 2) {
            element.write = true;
          } else {
            element.read = true;
          }
        }
        console.log(this.lstDocumentCategory);
      }),
      (error) => {
        this.loading = false;
      };
  }

  documentCategoryChange(document: DocumentCategory, accessType, $event) {
    if (accessType == "read" && $event.checked) {
      document.read = true;
      document.write = false;
      document.delete = false;
    } else if (accessType == "write" && $event.checked) {
      document.read = false;
      document.write = true;
      document.delete = false;
    } else if (accessType == "delete" && $event.checked) {
      document.read = false;
      document.write = false;
      document.delete = true;
    }
  }
  saveAccess(rowData) {
    let activeModules = [];
    for (let index = 0; index < this.lstAccessModules.length; index++) {
      const element = this.lstAccessModules[index];
      if (element.active) {
        activeModules.push(element.moduleName);
      }
    }
    for (let index = 0; index < this.lstDocumentCategory.length; index++) {
      const element = this.lstDocumentCategory[index];
      if (element.delete) {
        element.accessType = 3;
      } else if (element.write) {
        element.accessType = 2;
      } else {
        element.accessType = 1;
      }
    }
    this.employeeService
      .saveManageAccess({
        employeeDetailsId: this.employee.employeeDetailsId,
        accessibleModulesDetailsId: this.accessibleModulesDetailsId,
        accessibleModules: activeModules.toString(),
        documentAccess: this.lstDocumentCategory,
      })
      .subscribe((res) => {
        this.loading = false;
        if (res.statusCode == 200) {
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
      }),
      (error) => {
        this.loading = false;
      };
  }

  resetPassword(rowData) {
    this.employee = rowData;
  }

  sendRegistrationLink(rowData) {
    this.employeeService
      .sendRegistrationLink(rowData.employeeDetailsId)
      .subscribe((res) => {
        if (res.statusCode != 200) {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        } else {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        }
      });
  }

  resetPasswordConfirm(rowData) {
    this.employeeService
      .resetPasswordEmployee(rowData.employeeDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.displayDialog = false;
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
      });
  }
  onRowSelect(data: Employee) {
    this.employeeType = "Edit";
    this.employee = data;
    // this.editemployeeDisplay = "block";
    // this.newCar = false;
    // this.car = this.cloneCar(data);
    // this.displayDialog = true;
    this.hiddenScroll();
  }
  modalClose() {
    this.editemployeeDisplay = "none";
    this.displayScroll();
  }

  closeAddmodal() {
    this.addemployeeDisplay = "none";
    this.displayScroll();
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      console.log(this.fileToUpload);
      this.fileToUpload = new FormControl(file);
    } else {
      this.fileToUpload = undefined;
    }
  }
  clearFile() {
    this.myInputVariable.nativeElement.value = "";
    this.fileToUpload = undefined;
  }
  async saveUploadFile(form: NgForm) {
    let imageType = this.fileToUpload.value.type.split("/")[1].toLowerCase();
    let docData = this.prepareSave();
    if (
      imageType == "jpeg" ||
      imageType == "jpg" ||
      imageType == "gif" ||
      imageType == "png" ||
      imageType == "pdf"
    ) {
      this.employeeService.uploadDocs(docData).subscribe((res) => {
        if (res.statusCode == 200) {
          this.empDocs = res.responsePayload;
          this.closeUploadmodal(form);
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
      });
    } else {
      this.sharedService.add({
        severity: "error",
        summary: "Error!",
        detail: `Please upload file in 'PNG', 'JPEG', 'JPG', 'GIF',"PDF" format`,
      });
      this.myInputVariable.nativeElement.value = "";
    }
  }

  private prepareSave(): any {
    let fd = new FormData();
    fd.append("checklistDetailsId", this.checklistDetailsId);
    fd.append("employeeDetailsId", this.employee.employeeDetailsId.toString());
    fd.append("fileToUpload", this.fileToUpload.value);
    fd.append("documentTitle", this.uploadedFileTitle);
    return fd;
  }

  imageBlob: HttpResponse<Blob>;
  fileToDownload(rowData) {
    this.sharedService.add({
      severity: "info",
      summary: "Info!",
      detail: "File is preparing to download please wait",
    });
    this.employeeService
      .downloadDocument(rowData.employeeChecklistDocumentUploadDetailsId)
      .subscribe((resp: HttpResponse<Blob>) => {
        this.imageBlob = resp;
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
  uploadAttachemnts() {
    this.uploadFileInfo = "block";
    this.hiddenScroll();
  }
  closeUploadmodal(form: NgForm) {
    this.uploadFileInfo = "none";
    this.myInputVariable.nativeElement.value = "";
    this.uploadedFileTitle = null;
    this.fileToUpload = null;
    form.reset();
    //this.displayScroll();
  }
}
