import { Component, OnInit } from "@angular/core";

import { ConfirmationService } from "src/app/components/api/confirmationservice";
import { ProjectService } from "./project.service";
import { Department } from "@app/shared/models/department.model";
import { SharedService } from "@app/shared/shared.service";
import { Company } from "@app/shared/models/company-module.model";
import { Project } from "@app/shared/models/project.model";
import { CompanyService } from "../company/company.service";
import { EmployeeService } from "../employeeinfo/employeeinfo.service";
import { Employee } from "@app/shared/models/employee.model";
import { projectAssignment } from "@app/shared/models/project-assignment.model";
@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.css"],
})
export class ProjectComponent implements OnInit {
  cols: any[];
  displayDialog: boolean;
  clientErrorMsg: any;
  public editProjectDisplay: string = "none";
  public addProjectDisplay: string = "none";
  public viewProjectDisplay: string = "none";
  projectType: string;
  project: Project;
  lstProjects: Project[];
  lstEmployes: any[];
  loading: boolean = false;
  status: number = 1;
  // companyList: any[] = [
  //   { label: "one", value: 1 },
  //   { label: "two", value: 2 },
  //   { label: "three", value: 3 },
  // ];
  companyList: any[];
  selectedEmployee: number;
  selectedProjectAssignMent: projectAssignment;
  isAddProjectEnabled: boolean = true;
  constructor(
    private emplService: EmployeeService,
    private companyService: CompanyService,
    private confirmationService: ConfirmationService,
    private sharedService: SharedService,
    private projectService: ProjectService
  ) {
    this.selectedProjectAssignMent = new projectAssignment();
  }

  ngOnInit(): void {
    this.cols = [
      // { field: 'departmentDetailsId', header: 'ID' },
      { field: "projectName", header: "Project Name" },
      { field: "description", header: "Description" },
      { field: "startDate", header: "Start Date" },
      { field: "endDate", header: "End Date" },
      { field: "inHouse", header: "In House" },
      { field: "statusVal", header: "Status" },
    ];
    this.getProjects();
    this.getCompanylist();
    this.sharedService.openToggleMenu("roleMenuToggleExternalContent");
  }

  getProjects(status: number = 1) {
    this.loading = true;
    this.lstProjects = [];
    this.projectService.getAllProject(status).subscribe(
      (res) => {
        this.loading = false;
        this.lstProjects = [];
        if (res.statusCode == 200)
          this.lstProjects = res.responsePayload as Project[];
      },
      (error) => {
        this.loading = false;
      }
    );
  }
  getCompanylist() {
    this.companyService.getAllCompanies(1).subscribe((res) => {
      if (res.statusCode == 200) {
        this.companyList = res.responsePayload;
      } else {
        this.companyList = [];
      }
    });
  }

  handleChange(event) {
    if (event.index == 0) {
      this.isAddProjectEnabled = true;
      this.status = 1;
      this.getProjects(this.status);
    } else if (event.index == 1) {
      this.isAddProjectEnabled = false;
      this.status = 0;
      this.getProjects(this.status);
    }
  }
  showDialogToAdd() {
    this.projectType = "Add";
  }
  onDeptAddCloseClick(event) {
    if (event.type == "add" || event.type == "edit") {
      this.getProjects();
    }
    this.projectType = "";
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

  save() {
    this.displayScroll();
  }

  deactivate(rowData: Project) {
    this.projectService
      .deactivateProject(rowData.projectDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.displayDialog = false;
          this.getProjects(this.status);
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }
  activate(rowData) {
    this.projectService
      .activateProject(rowData.projectDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.displayDialog = false;
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.getProjects(this.status);
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }
  onAction(rowData) {
    this.project = rowData;
  }
  getProjectDetails(data: Project) {
    this.loading = true;
    this.projectService.getProject(data.projectDetailsId).subscribe(
      (res) => {
        this.loading = false;
        if (res.statusCode == 200)
          this.project = res.responsePayload as Project;
      },
      (error) => {
        this.loading = false;
      }
    );
  }
}
