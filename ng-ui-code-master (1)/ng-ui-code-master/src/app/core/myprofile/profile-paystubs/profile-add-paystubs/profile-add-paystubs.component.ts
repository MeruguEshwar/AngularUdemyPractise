import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { Paystubs } from "@app/shared/models/paystubs.model";
import { PaystubsServices } from "@app/core/custommodules/paystubs/paystubs.services";
import { SharedService } from "@app/shared/shared.service";

@Component({
  selector: "app-profile-add-paystubs",
  templateUrl: "./profile-add-paystubs.component.html",
  styleUrls: ["./profile-add-paystubs.component.css"],
})
export class ProfileAddPaystubsComponent implements OnInit {
  public addPaystubDisplay: string = "none";
  @Output() onClose = new EventEmitter<any>();
  @Input() paystubType: string;
  @Input() paystubs: Paystubs;
  @Input() userId: any;
  fileToUpload: any;
  clientErrorMsg: any;
  constructor(
    private paystubService: PaystubsServices,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    if (this.paystubType == "Add") {
      this.paystubs = new Paystubs();
    }
    if (this.paystubType == "Edit") {
      if (this.paystubs.checkDate) {
        let date: string[] = this.paystubs.checkDate.split("-");
        this.paystubs.checkDateFormat = new Date(
          parseInt(date[2]),
          parseInt(date[0]) - 1,
          parseInt(date[1])
        );
      }
    }
    this.showDialogToAdd();
    this.paystubs.employeeDetailsId = this.userId;
  }
  showDialogToAdd() {
    this.addPaystubDisplay = "block";
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
  closeAddmodal() {
    this.addPaystubDisplay = "none";
    this.displayScroll();
    this.onClose.emit({ type: "cancel" });
  }
  save() {
    if (this.paystubs.checkDateFormat) {
      let day = this.paystubs.checkDateFormat.getDate();
      let month = this.paystubs.checkDateFormat.getMonth() + 1; // add 1 because months are indexed from 0
      let year = this.paystubs.checkDateFormat.getFullYear();
      this.paystubs.checkDate = month + "-" + day + "-" + year;
    }
    this.paystubService.addPaystub(this.paystubs).subscribe((res) => {
      if (res && res.statusCode == 200) {
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: res.message,
        });
        if (this.fileToUpload != undefined || this.fileToUpload != null) {
          this.uploadFile(
            this.fileToUpload.value,
            res.responsePayload.paystubDetailsId
          );
        } else {
          this.closeAddmodal();
        }
      } else {
        this.sharedService.add({
          severity: "error",
          summary: "Error!",
          detail: res.message,
        });
      }
    });
  }
  onFileChange(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      this.fileToUpload = new FormControl(file);
    } else {
      this.fileToUpload = undefined;
    }
  }
  @ViewChild("fileInput")
  myInputVariable: ElementRef;
  clearFile() {
    this.myInputVariable.nativeElement.value = "";
    this.fileToUpload = undefined;
  }
  uploadFile(file, id) {
    var fd = new FormData();
    fd.append("paystubToUpload", file);
    fd.append("paystubDetailsId", id);
    this.paystubService.uploadPaystubs(fd).subscribe((res) => {
      if (res && res.statusCode == 200) {
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: res.message,
        });
        this.closeAddmodal();
      } else {
        this.sharedService.add({
          severity: "error",
          summary: "Error!",
          detail: res.message,
        });
      }
    });
  }
}
