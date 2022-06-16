import { Component, OnInit } from "@angular/core";

import { ConfirmationService } from "src/app/components/api/confirmationservice";
import { CompanyService } from "./company.service";
import { Department } from "@app/shared/models/department.model";
import { SharedService } from "@app/shared/shared.service";
import { Company } from "@app/shared/models/company-module.model";
@Component({
  selector: "app-company",
  templateUrl: "./company.component.html",
  styleUrls: ["./company.component.css"],
})
export class CompanyComponent implements OnInit {
  cols: any[];
  displayDialog: boolean;
  clientErrorMsg: any;
  public editCompanyDisplay: string = "none";
  public addCompanyDisplay: string = "none";
  companyType: string;
  company: Company;
  lstCompanies: Company[];
  loading: boolean = false;
  status: number = 1;
  isAddCustomerEnabled: boolean = true;
  constructor(
    private confirmationService: ConfirmationService,
    private sharedService: SharedService,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: "companyName", header: "Customer Name" },
      { field: "einNumber", header: "EIN Number" },
      { field: "companyWebsite", header: "Website" },
      { field: "companyAddress", header: "Address" },
    ];

    this.getComapnies(this.status);
    this.sharedService.openToggleMenu("roleMenuToggleExternalContent");
  }
  handleChange(event) {
    if (event.index == 0) {
      this.isAddCustomerEnabled = true;
      this.status = 1;
      this.getComapnies(1);
    } else if (event.index == 1) {
      this.isAddCustomerEnabled = false;
      this.status = 0;
      this.getComapnies(0);
    }
  }
  getComapnies(status: number) {
    this.loading = true;
    this.lstCompanies = [];
    this.companyService.getAllCompanies(status).subscribe(
      (res) => {
        this.loading = false;
        this.lstCompanies = [];
        if (res.statusCode == 200)
          this.lstCompanies = res.responsePayload as Company[];
      },
      (error) => {
        this.loading = false;
      }
    );
  }
  showDialogToAdd() {
    this.companyType = "Add";
    //this.hiddenScroll();
  }
  onDeptAddCloseClick(event) {
    this.getComapnies(this.status);
    this.companyType = "";
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

  deactivate(rowData) {
    this.companyService
      .deactivateCompany(rowData.companyDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.displayDialog = false;
          this.getComapnies(this.status);
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }
  activate(rowData) {
    this.companyService
      .activateCompany(rowData.companyDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.displayDialog = false;
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.getComapnies(this.status);
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }
  onAction(rowData) {
    this.company = rowData;
  }
  // This method is call to open edit model
  onRowSelect(data: Company) {
    this.company = data;
    this.companyType = "Edit";
    this.hiddenScroll();
  }
  onAssignApprover(data: Company) {
    this.company = data;
    this.companyType = "assignApprover";
    this.hiddenScroll();
  }
  modalClose() {
    this.editCompanyDisplay = "none";
    this.displayScroll();
  }

  closeAddmodal() {
    this.addCompanyDisplay = "none";
    this.displayScroll();
  }
}
