import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ChecklistService } from "../checklist.service";
import { Checklist } from "@app/shared/models/checklist.model";
import { SharedService } from "@app/shared/shared.service";
import { AuthService } from "@app/core/service/auth.service";

@Component({
  selector: "app-add-checklist",
  templateUrl: "./add-checklist.component.html",
  styleUrls: ["./add-checklist.component.css"],
})
export class AddChecklistComponent implements OnInit {
  @Input() departmentType: string;
  @Output() onClose = new EventEmitter<any>();
  displayDialog: boolean;
  department: Checklist;
  clientErrorMsg: any;
  public addemployeeDisplay: string = "none";
  errLabel: any;
  entries: any = [];
  entryObj = JSON.stringify({
    checklistEntryDetailsId: null,
    entryName: "",
    description: "",
  });
  entryName: any;
  description1: any;
  rowIndex: any;

  constructor(
    private checklistService: ChecklistService,
    public sharedService: SharedService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.departmentType == "Add") {
      this.department = new Checklist();
      this.showDialogToAdd();
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

  save() {
    this.department.checklistEntries = this.entries;
    this.department.organizationDetailsId =
      this.authService.currentUser.organizationDetailsId;
    this.checklistService.addDepartment(this.department).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.addemployeeDisplay = "none";
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.displayScroll();
          this.onClose.emit({ type: "add" });
        } else {
          this.errLabel = res.message;
        }
      },
      (error) => {
        this.errLabel = error;
      }
    );
  }
  closeAddmodal() {
    this.addemployeeDisplay = "none";
    this.displayScroll();
    this.onClose.emit({ type: "cancel" });
  }
  addEntry() {
    let obj = JSON.parse(this.entryObj);
    if (this.entryName) {
      obj.entryName = this.entryName;
      obj.description = this.description1;
      if (this.rowIndex > -1) {
        let isExist = this.entries.findIndex(
          (el) => el.entryName == obj.entryName
        );
        if (isExist == -1) {
          this.entries[this.rowIndex] = obj;
          this.rowIndex = -1;
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: "Entry Name Already exists",
          });
        }
      } else {
        let isExist = this.entries.findIndex(
          (el) => el.entryName == obj.entryName
        );
        if (isExist == -1) {
          this.entries.push(obj);
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
    }
  }
  deleteEntry(index) {
    this.entries.splice(index, 1);
  }
  editEntry(obj, sno) {
    this.rowIndex = sno;
    this.entryName = obj.entryName;
    this.description1 = obj.description;
  }
}
