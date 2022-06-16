import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { EmployeeService } from "../employeeinfo.service";
import { Employee } from "@app/shared/models/employee.model";
import { SharedService } from "@app/shared/shared.service";

@Component({
  selector: "app-edit-employee",
  templateUrl: "./edit-employee.component.html",
  styleUrls: ["./edit-employee.component.css"],
})
export class EditEmployeeComponent implements OnInit {
  @Input() employeeType: string;
  @Output() onClose = new EventEmitter<any>();
  displayDialog: boolean;
  @Input() employee: Employee;
  clientErrorMsg: any;
  public editemployeeDisplay: string = "none";
  errLabel: string = "";
  constructor(private employeeService: EmployeeService,public sharedService:SharedService) {}

  ngOnInit(): void {
    this.showDialogToAdd();
  }
  showDialogToAdd() {
    //this.employee = new Employee;
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
    this.employeeService.updateEmployee(this.employee).subscribe(
      (res) => {
        if (res.message == "Update employee successful")
          this.closeAddmodal(this.employeeType);
      },
      (error) => {
        this.errLabel = error;
      }
    );
  }
  closeAddmodal(type?) {
    this.editemployeeDisplay = "none";
    this.displayScroll();
    this.onClose.emit({ type: type });
  }
}
