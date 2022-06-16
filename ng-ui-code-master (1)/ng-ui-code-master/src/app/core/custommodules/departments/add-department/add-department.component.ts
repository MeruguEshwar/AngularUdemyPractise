import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { DepartmentService } from "../departments.service";
import { Department } from "@app/shared/models/department.model";
import { SharedService } from "@app/shared/shared.service";

@Component({
  selector: "app-add-department",
  templateUrl: "./add-department.component.html",
  styleUrls: ["./add-department.component.css"],
})
export class AddDepartmentComponent implements OnInit {
  @Input() departmentType: string;
  @Output() onClose = new EventEmitter<any>();
  displayDialog: boolean;
  department: Department;
  clientErrorMsg: any;
  public addemployeeDisplay: string = "none";
  errLabel: any;

  constructor(
    private departmentService: DepartmentService,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    if (this.departmentType == "Add") {
      this.department = new Department();
      this.showDialogToAdd();
    }
  }
  checkDepartmentAlreadyExist() {
    this.departmentService
      .isDepartmentExists(this.department.department)
      .subscribe((res) => {
        if (res.statusCode != 200) {
          this.department.department = "";
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
    this.departmentService.addDepartment(this.department).subscribe(
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
}
