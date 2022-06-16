import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { FileUploadModel } from "@app/shared/models/fileUpload.model";
import { ImmigrationDetails } from "@app/shared/models/profile.model";
import { SharedService } from "@app/shared/shared.service";
import * as country_details from "@assets/country_details.json";
import { MyProfileService } from "../myprofile.service";

@Component({
  selector: "app-profile-immigrations",
  templateUrl: "./profile-immigrations.component.html",
  styleUrls: ["./profile-immigrations.component.css"],
})
export class ProfileImmigrationsComponent implements OnInit {
  visaStatusList: any = [
    { label: "Select Visa Status", value: "0" },
    { label: "Citizen", value: "Citizen" },
    { label: "CPT", value: "CPT" },
    { label: "EAX", value: "EAX" },
    { label: "E3", value: "E3" },
    { label: "F1", value: "F1" },
    { label: "Green Card", value: "Green Card" },
    { label: "H1B", value: "H1B" },
    { label: "H4", value: "H4" },
    { label: "H4 EAD", value: "H4 EAD" },
    { label: "L1", value: "L1" },
    { label: "L2", value: "L2" },
    { label: "OPT", value: "OPT" },
    { label: "Other", value: "Other" },
  ];
  loading: boolean = false;
  immigrationDetails: ImmigrationDetails;
  countryDetails = country_details.rows;
  selectedCountry: any;
  @Input() userId: any;
  @Output() errorMessage: EventEmitter<any> = new EventEmitter();
  @Output() updateProfile: EventEmitter<any> = new EventEmitter();
  errorLabel: string = "";
  clientErrorMsg: any;
  filterCountry: any[] = [];
  cols = [
    { field: "documentTitle", header: "Document Title" },
    { field: "documentNumber", header: "Document Number" },
    { field: "documentExpiryDate", header: "Document Expiry Date" },
    { field: "alertRequired", header: "Alert Status" },
    { field: "alertBeforeNoOfDays", header: "No Of Days" },
  ];
  noOfAlertsList = [
    { label: "Select Days", value: null },
    { label: "3 Days", value: 3 },
    { label: "7 Days", value: 7 },
    { label: "10 Days", value: 10 },
    { label: "30 Days", value: 30 },
    { label: "90 Days", value: 90 },
    { label: "180 Days", value: 180 },
  ];
  immigrationDocList: any = [];
  viewImage: boolean = false;
  uploadFileInfo: string = "none";
  @ViewChild("fileInput")
  myInputVariable: ElementRef;
  fileUpload: FileUploadModel;
  fileSelected: boolean = false;
  uploadFileInfo1: string = "none";

  constructor(
    private profileService: MyProfileService,
    public sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.immigrationDetails = new ImmigrationDetails();
    this.fileUpload = new FileUploadModel();
    this.getImmigrationDetails(this.userId);
    this.getImmigrationDocuments(this.userId);
  }
  getImmigrationDetails(employeeDetailsId) {
    this.profileService
      .getImmigrationDetails(employeeDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.immigrationDetails = res.responsePayload;
        }
        this.selectedCountry = this.setCountry(
          this.countryDetails,
          this.immigrationDetails
        );
        this.checkVisaStatusType(
          this.visaStatusList,
          this.immigrationDetails.visaStatus
        );
        this.cdr.detectChanges();
      });
  }
  getImmigrationDocuments(employeeDetailsId) {
    this.profileService
      .getImmigrationDocuments(employeeDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.immigrationDocList = res.responsePayload;
        }
      });
  }
  onImmigrationSubmit() {
    this.errorLabel = "";
    this.immigrationDetails.employeeDetailsId = this.userId;
    this.immigrationDetails.visaCountry = this.selectedCountry.name;
    if (
      this.immigrationDetails.visaStatus == "Other" &&
      this.immigrationDetails.customeVisaStatus
    ) {
      this.immigrationDetails.visaStatus =
        this.immigrationDetails.customeVisaStatus;
    }
    this.profileService
      .saveImmigrationDetails(this.immigrationDetails)
      .subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.getImmigrationDetails(this.userId);
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            this.updateProfile.emit();
          } else {
            this.errorMessage.emit(res.message);
          }
        },
        (error) => {
          this.errorMessage.emit(error);
        }
      );
  }
  saveUploadFile(f?: NgForm) {
    let input = new FormData();
    if (this.fileUpload.checked) {
      this.fileUpload.alertRequired = "1";
    } else {
      this.fileUpload.alertRequired = "0";
    }
    input.append("documentTitle", this.fileUpload.documentTitle);
    input.append("documentNumber", this.fileUpload.documentNumber);
    input.append("fileToUpload", this.fileUpload.fileToUpload);
    input.append("documentExpiryDate", this.fileUpload.documentExpiryDate);
    input.append("alertRequired", this.fileUpload.alertRequired);
    input.append("alertBeforeNoOfDays", this.fileUpload.alertBeforeNoOfDays);
    input.append("employeeDetailsId", this.userId);
    this.profileService.uploadImmigrationDocument(input).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.getImmigrationDocuments(this.userId);
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.uploadFileInfo = "none";
          this.fileSelected = false;
          this.myInputVariable.nativeElement.value = "";
          f.resetForm();
          // this.displayScroll()
          // this.updateProfile.emit()
        } else {
          this.errorMessage.emit(res.message);
        }
      },
      (error) => {
        this.errorMessage.emit(error);
      }
    );
  }
  countryList($event) {
    let query = $event.query;
    // let filtered : any[] = [];
    this.filterCountry = [];
    for (let i = 0; i < this.countryDetails.length; i++) {
      let country = this.countryDetails[i];
      if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        this.filterCountry.push(country);
      }
    }
  }
  setCountry(country: any, immgration) {
    let countryObj = [...country];
    let selectedCountry = countryObj.filter((element) => {
      if (element.name == immgration.visaCountry) {
        return element;
      }
    });
    return selectedCountry[0];
  }
  checkVisaStatusType(visaStatusList, name) {
    if (name) {
      let status = visaStatusList.filter((res) => {
        return res.label == name;
      });
      if (!status.length) {
        this.immigrationDetails.customeVisaStatus =
          this.immigrationDetails.visaStatus;
        this.immigrationDetails.visaStatus = "Other";
      }
    }
  }
  resetType() {
    this.immigrationDetails.visaStatus = null;
    this.immigrationDetails.customeVisaStatus = null;
  }
  changeImmigrationStatusType(event) {
    if (event == "Other") {
      this.immigrationDetails.customeVisaStatus = undefined;
      this.cdr.detectChanges();
    }
  }
  onImageViewOpenClick() {
    this.viewImage = true;
  }
  onImageViewCloseClick(event) {
    if (event.type == "cancel") {
      this.viewImage = false;
    }
  }
  uploadDocCatg() {
    this.fileUpload = new FileUploadModel();
    this.uploadFileInfo = "block";
    this.hiddenScroll();
  }
  linkDocuments() {
    this.fileUpload = new FileUploadModel();
    this.uploadFileInfo1 = "block";
    this.hiddenScroll();
  }
  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.fileSelected = true;
      let file = event.target.files[0];
      this.fileUpload.fileToUpload = file;
    } else {
      this.fileUpload.fileToUpload = undefined;
    }
  }
  clearFile() {
    this.myInputVariable.nativeElement.value = "";
    this.fileUpload.fileToUpload = undefined;
  }
  closeAddmodal() {
    this.uploadFileInfo = "none";
    this.errorLabel = "";
    this.myInputVariable.nativeElement.value = "";
    this.fileUpload = new FileUploadModel();
    this.displayScroll();
  }

  closeAddmodalLink() {
    this.uploadFileInfo1 = "none";
    this.errorLabel = "";
    this.myInputVariable.nativeElement.value = "";
    this.fileUpload = new FileUploadModel();
    this.displayScroll();
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
  getAlertType(type) {
    switch (type) {
      case "0":
        return "No";
      case "1":
        return "Yes";
    }
  }

  linkedDocuments(data) {
    this.errorLabel = "";
    if (data) {
      let obj = {
        employeeDetailsId: this.userId,
        linkedIn: "Immigration",
        linkedDocuments: data,
      };
      this.profileService.saveLinkDocuments(obj).subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.getImmigrationDetails(this.userId);
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            //this.updateProfile.emit()
          } else {
            this.errorMessage.emit(res.message);
          }
        },
        (error) => {
          this.errorMessage.emit(error);
        }
      );
      this.closeAddmodalLink();
    } else {
      this.errorLabel = "Please Select atleast one document";
    }
  }
}
