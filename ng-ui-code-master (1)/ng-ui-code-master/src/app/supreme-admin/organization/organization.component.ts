import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";

import { ConfirmationService } from "src/app/components/api/confirmationservice";
import { OrganizationService } from "./organization.service";
import { Department } from "@app/shared/models/department.model";
import { Organization } from "@app/shared/models/organization.model";
import { SendMessage } from "@app/shared/models/sendmessage.model";
import { SharedService } from "@app/shared/shared.service";
@Component({
  selector: "app-organization",
  templateUrl: "./organization.component.html",
  styleUrls: ["./organization.component.css"],
})
export class OrganizationComponent implements OnInit {
  cols: any[];
  displayDialog: boolean;
  clientErrorMsg: any;
  public editemployeeDisplay: string = "none";
  public addemployeeDisplay: string = "none";
  departmentType: string;
  organization: Organization;
  lstOrganizations: Organization[];
  loading: boolean = false;
  status: number;
  @Input() sendMessage: SendMessage = {};
  @ViewChild("closeBtn") closeBtn: ElementRef;

  constructor(
    private confirmationService: ConfirmationService,
    private sharedService: SharedService,
    private organizationService: OrganizationService
  ) {}

  ngOnInit(): void {
    this.cols = [
      // { field: 'departmentDetailsId', header: 'ID' },
      { field: "organizationName", header: "Name" },
      { field: "phoneNumber", header: "Phone Number" },
      { field: "registerredEmployeeEmail", header: "Registerred Email" },
      { field: "noOfEmployees", header: "No of Employees" },
      {
        field: "noOfEmployeesRegisterred",
        header: "No of Employees Registered",
      },
    ];
    this.getOrganizations();
    this.status = 1;
  }
  handleChange(event) {
    if (event.index == 0) {
      this.status = 1;
      this.getOrganizations(1);
    } else if (event.index == 1) {
      this.status = 0;
      this.getOrganizations(0);
    }
  }
  getOrganizations(status: number = 1) {
    this.loading = true;
    this.lstOrganizations = [];
    this.organizationService.getAllOrganizations(status).subscribe(
      (res) => {
        this.loading = false;
        this.lstOrganizations = [];
        if (res.message == "Organizations")
          this.lstOrganizations = res.responsePayload as Organization[];
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
  delete(rowData: Organization) {
    if (this.status == 1) {
      this.organizationService
        .deactivateOrganization(rowData.organizationDetailsId)
        .subscribe((res) => {
          if (res.message == "Organization deactivate successful") {
            this.displayDialog = false;
            this.getOrganizations(this.status);
          }
        });
    } else {
      this.organizationService
        .activateOrganization(rowData.organizationDetailsId)
        .subscribe((res) => {
          if (res.message == "Organization activate successful") {
            this.displayDialog = false;
            this.getOrganizations(this.status);
          }
        });
    }
  }

  sendMessageToOrganization(rowData: Organization) {
    if (!this.sendMessage.subject || this.sendMessage.subject.trim() == "") {
      return;
    }
    this.sendMessage.organizationDetailsId = rowData.organizationDetailsId;
    this.organizationService.sendMessage(this.sendMessage).subscribe((res) => {
      if (res.message == "Send Communication successful") {
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: res.message,
        });
      } else {
        this.sharedService.add({
          severity: "error",
          summary: "Error",
          detail: res.message,
        });
      }
    });
    this.closeBtn.nativeElement.click();
  }

  onDelete(rowData) {
    this.organization = rowData;
  }

  onSendMessage(rowData) {
    this.organization = rowData;
  }

  onRowSelect(data: Organization) {
    this.organization = data;
    this.departmentType = "Edit";
    this.hiddenScroll();
  }
  modalClose() {
    this.editemployeeDisplay = "none";
    this.displayScroll();
  }
}
