import { EventEmitter } from "@angular/core";
import { Output } from "@angular/core";
import { Input } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { authCode } from "@app/shared/models/approver.model";
import { Company } from "@app/shared/models/company-module.model";
import { SharedService } from "@app/shared/shared.service";
import { CompanyService } from "../company.service";

@Component({
  selector: "app-assign-company-approver",
  templateUrl: "./assign-company-approver.component.html",
  styleUrls: ["./assign-company-approver.component.css"],
})
export class AssignCompanyApproverComponent implements OnInit {
  public assignApprover: string = "none";
  public abc: string = "none";
  @Input() companyDetailsId: any;
  @Output() onClose = new EventEmitter<any>();
  clientErrorMsg: any;
  errLabel: string;
  constructor(
    private companyService: CompanyService,
    private sharedService: SharedService
  ) {}

  availableApprovers: authCode[];
  mainAvailableApprovers: any[];

  selectedApprovers: any[];
  approver: any;
  searchValue: string = "";

  draggedApprovers: any;

  ngOnInit() {
    this.selectedApprovers = [];
    if (this.companyDetailsId) {
      this.companyService
        .getcompanyInvoicesApprover("1", this.companyDetailsId)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.selectedApprovers = res.responsePayload;
          }
        });
    }
    this.companyService.getAllApprovers("1", "1").subscribe((res) => {
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
    let invoiceApproverDetailsIds = [];
    this.selectedApprovers.forEach((element) => {
      invoiceApproverDetailsIds.push(element.approverDetailsId);
    });
    let objData = {
      companyDetailsId: this.companyDetailsId,
      approverDetailsIds: invoiceApproverDetailsIds,
    };

    this.companyService.assignCompanyInvoiceApprovers(objData).subscribe(
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
  onRemove(approver) {
    this.abc = "block";
    this.approver = approver;
  }
  confirmOnRemove(approver, allApprovers) {
    let approvers = [...allApprovers];

    approvers.forEach((element, i) => {
      if (
        element.companyInvoiceApproverDetailsId ==
        approver.companyInvoiceApproverDetailsId
      ) {
        if (element.companyInvoiceApproverDetailsId) {
          this.companyService
            .unasignCompanyInvoiceApprovers(
              element.companyInvoiceApproverDetailsId
            )
            .subscribe((res) => {
              if (res.statusCode == 200) {
                approvers.splice(i, 1);
              } else {
                this.sharedService.add({
                  severity: "error",
                  summary: "Error",
                  detail: res.message,
                });
              }
            });
        } else {
          approvers.splice(i, 1);
        }
      }
    });
    this.selectedApprovers = approvers;
    this.closeUploadmodal();
  }
  showDialogToAdd() {
    this.assignApprover = "block";
    this.hiddenScroll();
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
  }
  filter(searchValue, objData) {
    this.availableApprovers = objData.filter((val, i) => {
      if (val.approverEmail.toLowerCase().includes(searchValue.toLowerCase())) {
        return val;
      }
    });
  }
}
