import { Component, OnInit } from "@angular/core";

import { ConfirmationService } from "@app/components/api/confirmationservice";
import { ChecklistService } from "./checklist.service";
import { Checklist } from "@app/shared/models/checklist.model";
import { SharedService } from "@app/shared/shared.service";
@Component({
  selector: "app-checklist",
  templateUrl: "./checklist.component.html",
  styleUrls: ["./checklist.component.css"],
})
export class ChecklistComponent implements OnInit {
  cols: any[];
  displayDialog: boolean;
  clientErrorMsg: any;
  public editemployeeDisplay: string = "none";
  public addemployeeDisplay: string = "none";
  departmentType: string;
  department: Checklist;
  lstChecklist: Checklist[];
  loading: boolean = false;
  status: number = 1;
  isCheckListEnable: boolean = true;

  constructor(
    private confirmationService: ConfirmationService,
    private sharedService: SharedService,
    private cheklistService: ChecklistService
  ) { }

  ngOnInit(): void {
    this.cols = [
      { field: "checklistName", header: "Checklist Name" },
      { field: "description", header: "Description" },
    ];
    this.getChecklists();
    this.sharedService.openToggleMenu('roleMenuToggleExternalContent')
  }
  handleChange(event) {
    if (event.index == 0) {
      this.isCheckListEnable = true;
      this.status = 1;
      this.getChecklists(1);
    } else if (event.index == 1) {
      this.isCheckListEnable = false;
      this.status = 0;
      this.getChecklists(0);
    }
  }
  getChecklists(status: number = 1) {
    this.loading = true;
    this.lstChecklist = [];
    this.cheklistService.getAllChecklists(status).subscribe(
      (res) => {
        this.loading = false;
        this.lstChecklist = [];
        if (res.message == "checklists")
          this.lstChecklist = res.responsePayload as Checklist[];
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
      this.getChecklists();
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
  delete(rowData: Checklist) {
    if (this.status == 1) {
      this.cheklistService
        .deactivateDepartment(rowData.checklistDetailsId)
        .subscribe((res) => {
          if (res.message == "Deactivate checklist successful") {
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            this.displayDialog = false;
            this.getChecklists();
          }
        });
    } else {
      this.cheklistService
        .activateDepartment(rowData.checklistDetailsId)
        .subscribe((res) => {
          if (res.message == "Activate checklist successful") {
            this.displayDialog = false;
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            this.getChecklists(this.status);
          }
        });
    }
  }
  onDelete(rowData) {
    this.department = rowData;
  }
  onRowSelect(data: Checklist) {
    this.cheklistService
      .getDepartment(data.checklistDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.department = res.responsePayload;
          this.departmentType = "Edit";
          // this.editemployeeDisplay = "block";
          // this.newCar = false;
          // this.car = this.cloneCar(data);
          // this.displayDialog = true;
          this.hiddenScroll();
        }
      });

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
