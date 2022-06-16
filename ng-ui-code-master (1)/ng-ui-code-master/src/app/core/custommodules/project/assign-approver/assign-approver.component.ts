import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef,
} from "@angular/core";
import { ProjectService } from "../project.service";
import { authCode } from "@app/shared/models/approver.model";
import { SharedService } from "@app/shared/shared.service";

@Component({
  selector: "app-assign-approver",
  templateUrl: "./assign-approver.component.html",
  styleUrls: ["./assign-approver.component.css"],
})
export class AssignApproverComponent implements OnInit {
  public assignApprover: string = "none";
  public abc: string = "none";
  @Input() projectDetailsId;
  @Output() onClose = new EventEmitter<any>();
  clientErrorMsg: any;
  errLabel: string;
  constructor(
    private projectService: ProjectService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}
  availableApprovers: authCode[];
  mainAvailableApprovers: any[];

  selectedApprovers: any[];
  approver: any;
  searchValue: string = "";

  draggedApprovers: any;

  ngOnInit() {
    this.selectedApprovers = [];
    if (this.projectDetailsId) {
      this.projectService
        .getProjectTimesheetApprover("1", this.projectDetailsId)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.selectedApprovers = res.responsePayload;
          }
        });
    }
    this.projectService.getAllApprovers("1", "1").subscribe((res) => {
      if (res.statusCode == 200) {
        this.mainAvailableApprovers = res.responsePayload;
        this.availableApprovers = res.responsePayload;
      } else {
        this.availableApprovers = [];
      }
    });
  }

  dragStart(approver: any) {
    this.draggedApprovers = approver;
  }

  drop() {
    if (this.draggedApprovers) {
      //let draggedApproversIndex = this.findIndex(this.draggedApprovers);//finding index
      const filteredItems = this.selectedApprovers.filter(
        (item) =>
          item.approverDetailsId == this.draggedApprovers.approverDetailsId
      );
      if (!filteredItems.length) {
        this.selectedApprovers = [
          ...this.selectedApprovers,
          this.draggedApprovers,
        ];
      }
      // this.availableApprovers = this.availableApprovers.filter(
      //   (val, i) => i != draggedApproversIndex
      // );// To remove list from list
      // this.draggedApprovers = null;
    }
  }

  dragEnd() {
    this.draggedApprovers = null;
  }

  findIndex(approver: authCode) {
    let index = -1;
    for (let i = 0; i < this.availableApprovers.length; i++) {
      if (
        approver.approverDetailsId ===
        this.availableApprovers[i].approverDetailsId
      ) {
        index = i;
        break;
      }
    }
    return index;
  }
  save() {
    let timesheetApproverDetailsIds = [];
    this.selectedApprovers.forEach((element) => {
      timesheetApproverDetailsIds.push(element.approverDetailsId);
    });
    let objData = {
      projectDetailsId: this.projectDetailsId,
      approverDetailsIds: timesheetApproverDetailsIds,
    };
    this.projectService.assignProjectTimesheetApprovers(objData).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.assignApprover = "none";
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
  removeApproverIndex: any;
  onRemove(approver, index) {
    this.abc = "block";
    this.approver = approver;
    this.removeApproverIndex = index;
    console.log(index);
  }
  confirmOnRemove(approver, allApprovers) {
    let approvers = [...allApprovers];
    if (approver.projectTimesheetApproverDetailsId) {
      this.projectService
        .unasignProjectTimesheetApprovers(
          approver.projectTimesheetApproverDetailsId
        )
        .subscribe((res) => {
          if (res.statusCode == 200) {
            approvers.splice(this.removeApproverIndex, 1);
            this.selectedApprovers = [...approvers];
          } else {
            this.sharedService.add({
              severity: "error",
              summary: "Error",
              detail: res.message,
            });
          }
        });
    } else {
      approvers.splice(this.removeApproverIndex, 1);
      this.selectedApprovers = [...approvers];
    }
    this.closeUploadmodal();
  }
  closeAddmodal() {
    this.assignApprover = "none";
    this.displayScroll();
    this.onClose.emit({ type: "cancel" });
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
  closeUploadmodal() {
    this.abc = "none";
    this.removeApproverIndex = undefined;
  }
  filter(searchValue, objData) {
    this.availableApprovers = objData.filter((val, i) => {
      if (val.approverEmail.toLowerCase().includes(searchValue.toLowerCase())) {
        return val;
      }
    });
  }
}
