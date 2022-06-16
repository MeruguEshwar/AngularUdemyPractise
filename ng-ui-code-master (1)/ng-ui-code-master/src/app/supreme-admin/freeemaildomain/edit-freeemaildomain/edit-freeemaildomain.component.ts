import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FreeEmailDomain } from "@app/shared/models/freeemaildomain.model";
import { FreeEmailDomainServices } from "../freeemaildomain.service";
import { SharedService } from "@app/shared/shared.service";

@Component({
  selector: "app-edit-freeemaildomain",
  templateUrl: "./edit-freeemaildomain.component.html",
  styleUrls: ["./edit-freeemaildomain.component.css"],
})
export class EditFreeemaildomainComponent implements OnInit {
  @Input() fEDomainType: string;
  @Output() onClose = new EventEmitter<any>();
  displayDialog: boolean = true;
  @Input() fEDomain: FreeEmailDomain;
  errLabel: any;
  clientErrorMsg: any;
  public freeEmailDisplayDomain: string = "none";

  constructor(
    private fEdomainService: FreeEmailDomainServices,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.showDialogToAdd();
  }
  showDialogToAdd() {
    this.freeEmailDisplayDomain = "block";
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
    this.fEdomainService.isFEDomainExists(this.fEDomain.domainName).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          if (this.fEDomainType == "Add") {
            this.addFEDomain(this.fEDomain);
          } else if (this.fEDomainType == "Edit") {
            this.updateFEDomain(this.fEDomain);
          }
        } else {
          this.errLabel = res.message;
          this.fEDomain = {
            domainName: "",
            freeEmailProviderDomainsDetailsId: null,
            status: null,
          };
        }
      },
      (error) => {
        this.errLabel = error;
      }
    );
  }
  addFEDomain(fEDomain: FreeEmailDomain) {
    this.fEdomainService.addFEDomain(fEDomain).subscribe((res) => {
      if (res.statusCode == 200) {
        this.freeEmailDisplayDomain = "none";
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: res.message,
        });
      }
      this.displayScroll();
      this.onClose.emit({ type: "add" });
    });
  }
  updateFEDomain(fEDomain: FreeEmailDomain) {
    this.fEdomainService.updateFEDomain(fEDomain).subscribe((res) => {
      if ((res.statusCode = 200)) {
        this.freeEmailDisplayDomain = "none";
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: res.message,
        });
      }
      this.displayScroll();
      this.onClose.emit({ type: "add" });
    });
  }
  modalClose() {
    this.freeEmailDisplayDomain = "none";
    this.displayScroll();
    this.onClose.emit({ type: "Add" });
  }
}
