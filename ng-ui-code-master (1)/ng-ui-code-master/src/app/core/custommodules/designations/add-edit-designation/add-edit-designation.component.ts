import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { DesignationService } from "../designations.service";
import { Designation } from "@app/shared/models/designation.model";
import { SharedService } from "@app/shared/shared.service";
@Component({
  selector: "app-add-edit-designation",
  templateUrl: "./add-edit-designation.component.html",
  styleUrls: ["./add-edit-designation.component.css"],
})
export class AddEditDesignationComponent implements OnInit {
  @Input() designationType: string;
  @Output() onClose = new EventEmitter<any>();
  displayDialog: boolean;
  @Input() designation: Designation;
  clientErrorMsg: any;
  public addemployeeDisplay: string = "none";
  errLabel: string = "";
  constructor(
    private designationService: DesignationService,
    public sharedService: SharedService
  ) {
    if (this.designationType == "Add") this.designation = new Designation();
  }

  ngOnInit(): void {
    this.showDialogToAdd();
  }
  showDialogToAdd() {
    //this.designation = new Designation;
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
    if (this.designationType == "Add") {
      this.designationService
        .isDesignationExists(this.designation.designation)
        .subscribe(
          (res) => {
            if (res.message == "Designation available.") {
              this.designationService
                .addDesignation(this.designation)
                .subscribe(
                  (res) => {
                    if (res.message == "Designation added successfully") {
                      this.closeAddmodal(this.designationType);
                      this.sharedService.add({
                        severity: "success",
                        summary: "Success",
                        detail: res.message,
                      });
                    } else {
                      this.errLabel = res.message;
                    }
                  },
                  (error) => {
                    this.errLabel = res.message;
                  }
                );
            }
          },
          (error) => {
            this.errLabel = error;
          }
        );
    } else if (this.designationType == "Edit") {
      this.designationService.updateDesignation(this.designation).subscribe(
        (res) => {
          if (res.message == "Update designation successful") {
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            this.closeAddmodal(this.designationType);
          } else {
            this.errLabel = res.message;
          }
        },
        (error) => {
          this.errLabel = error;
        }
      );
    }
  }
  closeAddmodal(type?: any) {
    this.addemployeeDisplay = "none";
    this.displayScroll();
    this.onClose.emit({ type: type });
  }
}
