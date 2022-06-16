import { Component, OnInit } from "@angular/core";

import { ConfirmationService } from "src/app/components/api/confirmationservice";
import { DepartmentService } from "./departments.service";
import { Department } from "@app/shared/models/department.model";
import { SharedService } from "@app/shared/shared.service";
@Component({
  selector: "app-departments",
  templateUrl: "./departments.component.html",
  styleUrls: ["./departments.component.css"],
})
export class DepartmentsComponent implements OnInit {
  cols: any[];
  displayDialog: boolean;
  clientErrorMsg: any;
  public editemployeeDisplay: string = "none";
  public addemployeeDisplay: string = "none";
  departmentType: string;
  department: Department;
  lstDepartments: Department[];
  loading: boolean = false;
  status: number = 1;
  isAddDepartmentsEnabled: boolean = true;
  constructor(
    private confirmationService: ConfirmationService,
    private sharedService: SharedService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.cols = [
      // { field: 'departmentDetailsId', header: 'ID' },
      { field: "department", header: "Name" },
      { field: "description", header: "Description" },
    ];
    this.getDepartments();
    this.sharedService.openToggleMenu("roleMenuToggleExternalContent");
  }
  handleChange(event) {
    if (event.index == 0) {
      this.isAddDepartmentsEnabled = true;
      this.status = 1;
      this.getDepartments(1);
    } else if (event.index == 1) {
      this.isAddDepartmentsEnabled = false;
      this.status = 0;
      this.getDepartments(0);
    }
  }
  getDepartments(status: number = 1) {
    if (this.departmentType == undefined || this.departmentType == null) {
      this.loading = true;
    }
    this.lstDepartments = [];
    this.departmentService.getAllDepartments(status).subscribe(
      (res) => {
        this.loading = false;
        this.lstDepartments = [];
        if (res.message == "departments")
          this.lstDepartments = res.responsePayload as Department[];
      },
      (error) => {
        this.loading = false;
      }
    );
  }
  showDialogToAdd() {
    this.departmentType = "Add";
    //this.hiddenScroll();
  }
  onDeptAddCloseClick(event) {
    if (event.type) {
      this.getDepartments();
    }
    this.departmentType = "";
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
  confirm(rowData) {
    this.confirmationService.confirm({
      message: "Are you sure that you want to Inactivate this data?",
      accept: () => {
        this.delete(rowData);
        //Actual logic to perform a confirmation
      },
    });
  }
  delete(rowData: Department) {
    if (this.status == 1) {
      this.departmentService
        .deactivateDepartment(rowData.departmentDetailsId)
        .subscribe((res) => {
          if (res.message == "Deactivate department successful") {
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            this.displayDialog = false;
            this.getDepartments();
          }
        });
    } else {
      this.departmentService
        .activateDepartment(rowData.departmentDetailsId)
        .subscribe((res) => {
          if (res.message == "Activate department successful") {
            this.displayDialog = false;
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            this.getDepartments(this.status);
          }
        });
    }
  }
  onDelete(rowData) {
    this.department = rowData;
  }
  onRowSelect(data: Department) {
    this.department = data;
    this.departmentType = "Edit";
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
}
