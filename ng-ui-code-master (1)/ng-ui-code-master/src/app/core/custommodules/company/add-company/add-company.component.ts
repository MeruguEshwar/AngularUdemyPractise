import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { CompanyService } from "../company.service";
import {
  Company,
  CompanyContacts,
} from "@app/shared/models/company-module.model";
import { SharedService } from "@app/shared/shared.service";
import { AuthService } from "@app/core/service/auth.service";

@Component({
  selector: "app-add-company",
  templateUrl: "./add-company.component.html",
  styleUrls: ["./add-company.component.css"],
})
export class AddCompanyComponent implements OnInit {
  @Input() companyType: string;
  @Output() onClose = new EventEmitter<any>();
  displayDialog: boolean;
  @Input() company: Company;
  displayCompany2: boolean;
  displayCompany3: boolean;
  displayCompany4: boolean;
  displayCompany5: boolean;
  clientErrorMsg: any;
  creditDaysOptions = [
    { label: "Immediate", value: 0 },
    { label: "Net 7", value: 7 },
    { label: "Net 10", value: 10 },
    { label: "Net 15", value: 15 },
    { label: "Net 30", value: 30 },
    { label: "Net 45", value: 45 },
    { label: "Net 60", value: 60 },
    { label: "Net 75", value: 75 },
    { label: "Net 90", value: 90 },
    { label: "Net 105", value: 105 },
    { label: "Net 120", value: 120 },
  ];
  public addemployeeDisplay: string = "none";
  errLabel: any;

  constructor(
    private companyService: CompanyService,
    public sharedService: SharedService,
    private authService: AuthService
  ) {
    //this.company = new Company();
    //this.company.organizationDetailsId = this.authService.currentUser.organizationDetailsId;
  }

  ngOnInit(): void {
    if (this.companyType == "Add") {
      this.company = new Company();
      this.company.invoiceNotificationConfig = "2";
      this.company.companyContacts = [];
      let companyContact = Object.assign({}, new CompanyContacts());
      this.company.companyContacts.push(companyContact);
    }
    this.showDialogToAdd();
    this.company.organizationDetailsId =
      this.authService.currentUser.organizationDetailsId;
  }
  showDialogToAdd() {
    this.addemployeeDisplay = "block";
    this.hiddenScroll();
  }
  onAddMoreContact(index) {
    if (index < 4) {
      let companyContacts = Object.assign({}, new CompanyContacts());
      this.company.companyContacts.push(companyContacts);
    } else {
      this.sharedService.add({
        severity: "error",
        summary: "Error",
        detail: "You can not add more than 5 contact details",
      });
    }
  }
  onRemoveContactDetail(companyContacts) {
    if (this.company.companyContacts.length > 1) {
      let index = this.company.companyContacts.indexOf(companyContacts);
      this.company.companyContacts.splice(index, 1);
    }
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

  checkCompanyAlreadyExist() {
    this.companyService.isCompanyExists(this.company.companyName).subscribe(
      (res) => {
        if (res.statusCode != 200) {
          this.errLabel = res.message;
          this.company.companyName = "";
        }
      },
      (error) => {
        this.errLabel = error;
      }
    );
  }

  save() {
    if (this.companyType == "Add") {
      this.companyService.addCompany(this.company).subscribe(
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
    } else {
      this.companyService.updateCompany(this.company).subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.addemployeeDisplay = "none";
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            this.displayScroll();
            this.onClose.emit({ type: "edit", company: this.company });
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
  closeAddmodal() {
    this.addemployeeDisplay = "none";
    this.displayScroll();
    this.onClose.emit({ type: "cancel" });
  }
}
