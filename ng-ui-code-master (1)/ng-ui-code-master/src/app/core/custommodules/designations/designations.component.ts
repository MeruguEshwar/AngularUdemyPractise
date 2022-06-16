import { Component, OnInit } from "@angular/core";

import { ConfirmationService } from "src/app/components/api/confirmationservice";
import { DesignationService } from "./designations.service";
import { Designation } from "@app/shared/models/designation.model";
import { SharedService } from "@app/shared/shared.service";
@Component({
  selector: "app-designations",
  templateUrl: "./designations.component.html",
  styleUrls: ["./designations.component.css"],
})
export class DesignationsComponent implements OnInit {
  loading: boolean = false;
  lstDesignations: Designation[];
  cols: any[];
  displayDialog: boolean;
  designation: Designation;
  clientErrorMsg: any;
  designationType: string;
  public editemployeeDisplay: string = "none";
  public addemployeeDisplay: string = "none";
  statusCode = 1;
  isAddDesignationsEnabled: boolean = true;
  constructor(
    private sharedService: SharedService,
    private confirmationService: ConfirmationService,
    private designationService: DesignationService
  ) {}

  ngOnInit(): void {
    this.cols = [
      // { field: 'designationDetailsId', header: 'ID' },
      { field: "designation", header: "Name" },
      { field: "description", header: "Description" },
    ];
    this.getDesignations();
    this.sharedService.openToggleMenu("roleMenuToggleExternalContent");
  }
  handleChange(event) {
    if (event.index == 0) {
      this.statusCode = 1;
      this.isAddDesignationsEnabled = true;
      this.getDesignations(1);
    } else if (event.index == 1) {
      this.statusCode = 0;
      this.getDesignations(0);
      this.isAddDesignationsEnabled = false;
    }
  }
  getDesignations(status: number = 1) {
    if (this.designationType == undefined || this.designationType == null) {
      this.loading = true;
    }
    this.lstDesignations = [];
    this.designationService.getAllDesignations(status).subscribe(
      (res) => {
        this.loading = false;
        this.lstDesignations = [];
        this.lstDesignations = res.responsePayload as Designation[];
      },
      (error) => {
        this.loading = false;
      }
    );
  }
  showDialogToAdd() {
    // this.newCar = true;
    // this.car = {};
    // this.addemployeeDisplay = "block";
    this.designationType = "Add";
    this.designation = new Designation();
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

  deactivate(rowData: Designation) {
    this.designationService
      .deactivateDesignation(rowData.designationDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.displayDialog = false;
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.getDesignations(this.statusCode);
        }
      });
  }
  activate(rowData: Designation) {
    this.designationService
      .activateDesignation(rowData.designationDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.displayDialog = false;
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.getDesignations(this.statusCode);
        }
      });
  }
  onAction(rowData) {
    this.designation = rowData;
  }
  onRowSelect(data: Designation) {
    console.log(data);
    this.designation = new Designation();
    this.designationType = "Edit";
    this.designation = data;
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

  onDeptCloseClick(event) {
    this.getDesignations();
    this.designation = new Designation();
    this.designationType = null;
  }
}
