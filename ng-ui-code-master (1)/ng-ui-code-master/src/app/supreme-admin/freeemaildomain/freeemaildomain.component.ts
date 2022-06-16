import { Component, OnInit } from "@angular/core";

import { ConfirmationService } from "src/app/components/api/confirmationservice";
import { FreeEmailDomainServices } from "./freeemaildomain.service";
import { FreeEmailDomain } from "@app/shared/models/freeemaildomain.model";
import { SharedService } from "@app/shared/shared.service";

@Component({
  selector: "app-freeemaildomain",
  templateUrl: "./freeemaildomain.component.html",
  styleUrls: ["./freeemaildomain.component.css"],
})
export class FreeemaildomainComponent implements OnInit {
  cols: any[];
  displayDialog: boolean;
  clientErrorMsg: any;
  public fEDDisplay: string = "none";
  fEDomainType: string;
  fEDomain: FreeEmailDomain;
  lstDomain: FreeEmailDomain[];
  loading: boolean = false;
  status: number = 1;
  constructor(
    private confirmationService: ConfirmationService,
    private sharedService: SharedService,
    private FreeEmailDomainServices: FreeEmailDomainServices
  ) {}

  ngOnInit(): void {
    this.cols = [
      // { field: 'departmentDetailsId', header: 'ID' },
      // { field: "freeEmailProviderDomainsDetailsId", header: "ID" },
      { field: "domainName", header: "Domain Name" },
      { field: "status", header: "Status" },
    ];
    this.getDomain(this.status);
  }
  handleChange(event) {
    if (event.index == 0) {
      this.status = 1;
      this.getDomain(1);
    } else if (event.index == 1) {
      this.status = 0;
      this.getDomain(0);
    }
  }
  getDomain(status: number) {
    this.loading = true;
    this.lstDomain = [];
    this.FreeEmailDomainServices.getAllFreeEmailDomain(status).subscribe(
      (res) => {
        this.loading = false;
        this.lstDomain = [];
        if (res.message == "freeEmailProviderDomains")
          this.lstDomain = res.responsePayload as FreeEmailDomain[];
      },
      (error) => {
        this.loading = false;
      }
    );
  }
  showDialogToAdd() {
    this.fEDomainType = "Add";
    this.displayDialog = true;
    this.hiddenScroll();
    this.fEDomain = {
      domainName: null,
      freeEmailProviderDomainsDetailsId: null,
      status: null,
    };
  }
  onFEDomainCloseClick(event) {
    if (event.type == "add") {
      this.getDomain(this.status);
    }
    this.fEDomainType = "";
    this.displayDialog = undefined;
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
  delete(rowData: FreeEmailDomain) {
    if (this.status == 1) {
      this.FreeEmailDomainServices.deactivateFEDomain(
        rowData.freeEmailProviderDomainsDetailsId
      ).subscribe((res) => {
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.getDomain(this.status);
        }
      });
    } else {
      this.FreeEmailDomainServices.activateFEDomain(
        rowData.freeEmailProviderDomainsDetailsId
      ).subscribe((res) => {
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.getDomain(this.status);
        }
      });
    }
  }
  onDelete(rowData) {
    this.fEDomain = rowData;
  }
  onRowSelect(data: FreeEmailDomain) {
    this.fEDomain = data;
    this.fEDomainType = "Edit";
    this.displayDialog = true;
    this.hiddenScroll();
  }
  modalClose() {
    this.fEDDisplay = "none";
    this.displayScroll();
  }

  closeAddmodal() {
    this.fEDDisplay = "none";
    this.displayScroll();
  }
}
