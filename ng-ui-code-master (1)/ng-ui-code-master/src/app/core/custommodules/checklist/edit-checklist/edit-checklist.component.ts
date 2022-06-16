import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ChecklistService } from "../checklist.service";
import { Checklist } from "@app/shared/models/checklist.model";
import { SharedService } from "@app/shared/shared.service";

@Component({
  selector: "app-edit-checklist",
  templateUrl: "./edit-checklist.component.html",
  styleUrls: ["./edit-checklist.component.css"],
})
export class EditChecklistComponent implements OnInit {
  @Input() departmentType: string;
  @Output() onClose = new EventEmitter<any>();
  displayDialog: boolean;
  @Input() department: Checklist;
  clientErrorMsg: any;
  public editemployeeDisplay: string = "none";
  errLabel: any;

  entryObj = JSON.stringify({
    checklistEntryDetailsId: null,
    entryName: "",
    description: "",
    status: "",
    checklistDetailsId: null,
  });

  statusOptions = [
    { label: "Select", value: null },
    { label: "Pending", value: "0" },
    { label: "Complete", value: "1" },
    { label: "NA", value: "2" },
  ];

  entryName: any;
  description1: any;
  rowIndex: any;
  status: any;
  checklistEntryDetailsId: any;

  constructor(
    private checklistService: ChecklistService,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    if (this.departmentType == "Edit") {
      //this.department = new Department();
      this.showDialogToAdd();
    }
    if (
      this.department.checklistEntries == null ||
      this.department.checklistEntries == undefined
    ) {
      this.department.checklistEntries = [];
    }
  }
  checkDepartmentAlreadyExist() {
    this.errLabel = "";
    this.checklistService
      .isDepartmentExists(this.department.checklistName)
      .subscribe((res) => {
        if (res.statusCode != 200) {
          this.department.checklistName = "";
          this.errLabel = res.message;
        }
      });
  }
  showDialogToAdd() {
    //this.department = new Department;
    this.editemployeeDisplay = "block";
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

  save() {
    this.checklistService.updateDepartment(this.department).subscribe((res) => {
      if (res.statusCode == 200) {
        //"Checklist saved successfully"
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: res.message,
        });
        this.editemployeeDisplay = "none";
        this.displayScroll();
        this.onClose.emit({ type: "add" });
      } else {
        this.sharedService.add({
          severity: "error",
          summary: "Error",
          detail: res.message,
        });
      }
    });
  }
  modalClose() {
    this.editemployeeDisplay = "none";
    this.displayScroll();
    this.onClose.emit({ type: "Add" });
  }
  addEntry() {
    console.log(this.department);
    let obj = JSON.parse(this.entryObj);
    if (this.entryName) {
      obj.entryName = this.entryName;
      obj.description = this.description1;
      obj.status = this.status;
      obj.checklistDetailsId = this.department.checklistDetailsId;
      if (this.checklistEntryDetailsId) {
        obj.checklistEntryDetailsId = this.checklistEntryDetailsId;
      }
      if (this.rowIndex > -1) {
        let isExist = this.department.checklistEntries.findIndex(
          (el) => el.entryName == obj.entryName
        );
        if (isExist == -1) {
          this.department.checklistEntries[this.rowIndex] = obj;
          this.rowIndex = -1;
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: "Entry Name Already exists",
          });
        }
      } else {
        let isExist = this.department.checklistEntries.findIndex(
          (el) => el.entryName == obj.entryName
        );
        if (isExist == -1) {
          this.department.checklistEntries.push(obj);
          this.rowIndex = -1;
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: "Entry Name Already exists",
          });
        }
      }
      this.entryName = "";
      this.description1 = "";
      this.checklistEntryDetailsId = null;
    }
  }
  deleteEntry(obj, index) {
    console.log(obj);
    this.department.checklistEntries.splice(index, 1);
    if (obj.checklistEntryDetailsId) {
      this.checklistService
        .deleteEntry(obj.checklistEntryDetailsId)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
          }
        });
    }
  }
  editEntry(obj, sno) {
    console.log(obj);
    this.rowIndex = sno;
    this.entryName = obj.entryName;
    this.description1 = obj.description;
    this.checklistEntryDetailsId = obj.checklistEntryDetailsId;
  }
}
