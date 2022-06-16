import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  MyOrganizationDetails,
  MyOrganizationDetailsAddress,
  MyOrganizationDetailsDocuments,
  MyOrganizationDetailsRemittances,
} from "@app/shared/models/myOrganizationDetails.model";
import { SharedService } from "@app/shared/shared.service";
import { MyOrganizationDetailsService } from "./my-organization-details.service";
import * as country_details from "@assets/country_details.json";
import { NgForm } from "@angular/forms";
import { environment } from "@env/environment";
import { User } from "@app/shared/models/user.model";
import { UserActionServices } from "@app/shared/userAction.services";
import { HttpResponse } from "@angular/common/http";
import { AuthService } from "../service/auth.service";
import { Project } from "@app/shared/models/project.model";
import { ProjectService } from "../custommodules/project/project.service";

@Component({
  selector: "app-my-organization-details",
  templateUrl: "./my-organization-details.component.html",
  styleUrls: ["./my-organization-details.component.css"],
})
export class MyOrganizationDetailsComponent implements OnInit {
  organizationDetails: MyOrganizationDetails;
  organizationAddressDetails: MyOrganizationDetailsAddress;
  organizationRemittanceDetails: MyOrganizationDetailsRemittances;
  selectedNoOfEmployess: string;
  addressInfo: string = "none";
  remittanceInfo: string = "none";
  organizationInfo: string = "none";
  fileUploadInfo: string = "none";
  public addPoject: string = "none";
  clientErrorMsg: any;
  project: Project;
  projectsDetailsList: Project[];
  errLabel: any;
  @ViewChild("fileInput") myInputVariable: ElementRef;
  addressCols = [
    { field: "addressLine1", header: "Address Line 1" },
    { field: "addressLine2", header: "Address Line 2" },
    { field: "city", header: "City" },
    { field: "state", header: "State" },
    { field: "country", header: "Country" },
    { field: "pinCode", header: "Pincode" },
  ];
  remittanceCols = [
    { field: "bankName", header: "Bank Name" },
    { field: "friendlyName", header: "Friendly Name" },
    { field: "accountName", header: "Account Name" },
    { field: "accountNumber", header: "Account Number" },
    { field: "ifscCode", header: "IFSC Code" },
    { field: "routingNumber", header: "Routing Number" },
    { field: "otherDetails", header: "Other Details" },
  ];
  documentCols = [
    { field: "organizationName", header: "Organization Name" },
    { field: "documentTitle", header: "Document Title" },
    { field: "documentNumber", header: "Document Number" },
    { field: "documentExpiryDate", header: "Document Expiry Date" },
    { field: "alertRequired", header: "Alert Status" },
    { field: "alertBeforeNoOfDays", header: "Prior Intimation" },
  ];
  noOfEmployees = [
    { label: "Select No Of Employees", value: null },
    { label: "1-5", value: "1-5" },
    { label: "6-10", value: "6-10" },
    { label: "11-25", value: "11-25" },
    { label: "26-150", value: "26-150" },
    { label: "150+", value: "150+" },
  ];
  projectCols = [
    { field: "projectName", header: "Project Name" },
    { field: "description", header: "Description" },
    { field: "startDate", header: "Start Date" },
    { field: "endDate", header: "End Date" },
    { field: "inHouse", header: "In House" },
  ];
  countryDetails = country_details.rows;
  selectedCountryDetails: any;
  selectedGlobalCurrencyDetails: any;
  addressSelectedCountryDetails: any;
  fileToUpload: any;
  pictureUrl: string = environment.pictureUrl;
  organizationDocumentDetails: MyOrganizationDetailsDocuments;
  documentInfo: string;
  organizationDocsDetails: any;
  imageBlob: HttpResponse<Blob>;
  viewImage: boolean;

  constructor(
    private organizationDetailsService: MyOrganizationDetailsService,
    public sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    public authService: AuthService,
    private userAction: UserActionServices,
    private projectService: ProjectService
  ) {
    this.organizationDetails = new MyOrganizationDetails();
    this.organizationAddressDetails = new MyOrganizationDetailsAddress();
    this.organizationRemittanceDetails = new MyOrganizationDetailsRemittances();
    this.organizationDocumentDetails = new MyOrganizationDetailsDocuments();
    this.project = new Project();
  }

  ngOnInit(): void {
    this.getOrganizationDetails();
    this.getProjectDetails();
  }
  getOrganizationDetails() {
    this.organizationDetailsService
      .getOrganizationDetails()
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.organizationDetails = res.responsePayload;
          this.selectedNoOfEmployess = this.organizationDetails.noOfEmployees;
          this.getOrganizationDocsDetails(
            this.organizationDetails.organizationDetailsId
          );
        }
      });
  }
  getOrganizationDocsDetails(orgId) {
    this.organizationDetailsService
      .getOrganizationDocsDetails(orgId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.organizationDocsDetails = res.responsePayload;
          this.selectedNoOfEmployess = this.organizationDetails.noOfEmployees;
        }
      });
  }
  addressUpdate(organizationAddressDetails) {
    this.addressInfo = "block";
    this.hiddenScroll();
    this.organizationAddressDetails = organizationAddressDetails;
    this.organizationAddressDetails.organizationDetailsId =
      this.organizationDetails.organizationDetailsId;
    console.log(this.organizationAddressDetails);
    let country = this.countryDetails.filter((element) => {
      return element.name == this.organizationAddressDetails.country;
    });
    this.addressSelectedCountryDetails = country[0];
    this.cdr.detectChanges();
  }
  remittanceUpdate(organizationRemittanceDetails) {
    this.remittanceInfo = "block";
    this.hiddenScroll();
    this.organizationRemittanceDetails = organizationRemittanceDetails;
    this.organizationRemittanceDetails.organizationDetailsId =
      this.organizationDetails.organizationDetailsId;
    this.organizationRemittanceDetails.confirmAccountNumber =
      this.organizationRemittanceDetails.accountNumber;
    let country = this.countryDetails.filter((element) => {
      return (
        element.country_details_id == this.organizationRemittanceDetails.country
      );
    });
    this.selectedCountryDetails = country[0];
    this.cdr.detectChanges();
  }
  organizationUpdate() {
    this.organizationInfo = "block";
    this.hiddenScroll();
  }
  saveAddress(form: NgForm) {
    this.organizationDetailsService
      .saveOrganizationAddress(this.organizationAddressDetails)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.closeAddmodal();
          this.getOrganizationDetails();
          this.organizationAddressDetails = new MyOrganizationDetailsAddress();
          form.reset();
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }
  saveRemittance(form: NgForm) {
    if (
      this.organizationRemittanceDetails.accountNumber ==
      this.organizationRemittanceDetails.confirmAccountNumber
    ) {
      console.log(form);
      this.remittance(form);
    } else {
      this.sharedService.add({
        severity: "error",
        summary: "Error",
        detail: "Account Number and Confirm Account Number Not Match",
      });
    }
  }
  remittance(form: NgForm) {
    this.organizationDetailsService
      .saveOrganizationRemittance(this.organizationRemittanceDetails)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.closeAddmodal();
          this.getOrganizationDetails();
          this.organizationRemittanceDetails =
            new MyOrganizationDetailsRemittances();
          form.reset();
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }
  saveOrganization(form: NgForm) {
    let organizationDetails = {
      organizationDetailsId: this.organizationDetails.organizationDetailsId,
      website: this.organizationDetails.website,
      phoneNumber: this.organizationDetails.phoneNumber,
      noOfEmployees: this.selectedNoOfEmployess,
      einNumber: this.organizationDetails.einNumber,
    };
    this.organizationDetailsService
      .updateOrganizationDetails(organizationDetails)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.closeOrgAddmodal();
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }
  selectCountry(event) {
    this.organizationRemittanceDetails.country = event.country_details_id;
    this.cdr.detectChanges();
    if (event.country_details_id == 101) {
      this.organizationRemittanceDetails.routingNumber = "";
    } else if (event.country_details_id == 233) {
      this.organizationRemittanceDetails.ifscCode = "";
    } else {
      this.organizationRemittanceDetails.ifscCode = "";
      this.organizationRemittanceDetails.routingNumber = "";
    }
  }

  selectAddressCountry(event) {
    this.organizationAddressDetails.country = event.name;
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
  closeAddmodal(form?: NgForm) {
    this.addressInfo = "none";
    this.remittanceInfo = "none";
    this.organizationInfo = "none";
    this.fileUploadInfo = "none";
    this.addPoject = "none";
    this.organizationAddressDetails = new MyOrganizationDetailsAddress();
    this.organizationRemittanceDetails = new MyOrganizationDetailsRemittances();
    this.project = new Project();
    this.selectedCountryDetails = 0;
    this.displayScroll();
    if (form) {
      form.reset();
    }
  }
  closeAddmodalDocs(form?: NgForm) {
    this.documentInfo = "none";
    this.displayScroll();
    if (form) {
      form.reset();
    }
  }
  closeOrgAddmodal() {
    this.myInputVariable.nativeElement.value = "";
    this.getOrganizationDetails();
    this.closeAddmodal();
  }
  closeDocAddmodal() {
    this.getOrganizationDocsDetails(
      this.organizationDetails.organizationDetailsId
    );
    this.closeAddmodal();
  }
  confirmAccountNumberValidation() {
    if (
      this.organizationRemittanceDetails.accountNumber &&
      this.organizationRemittanceDetails.confirmAccountNumber
    ) {
      if (
        this.organizationRemittanceDetails.accountNumber !=
        this.organizationRemittanceDetails.confirmAccountNumber
      ) {
        this.sharedService.add({
          severity: "error",
          summary: "Error",
          detail: "Account Number and confirm Account Number not matched",
        });
      }
    }
  }
  saveFileUpload(form: NgForm) {
    let input = new FormData();
    input.append("fileToUpload", this.fileToUpload);
    this.organizationDetailsService.UploadOrgFile(input).subscribe((res) => {
      if ((res.statusCode = 200)) {
        let currentUser = JSON.parse(
          sessionStorage.getItem("currentUser")
        ) as User;
        currentUser.logoPath = res.responsePayload;
        sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
        this.myInputVariable.nativeElement.value = "";
        this.fileToUpload = undefined;
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: res.message,
        });
        this.closeOrgAddmodal();
        this.userAction.logochanges.next(res.responsePayload);
      } else {
        this.sharedService.add({
          severity: "error",
          summary: "Error",
          detail: res.message,
        });
        form.reset();
        this.myInputVariable.nativeElement.value = "";
        this.fileToUpload = undefined;
      }
    });
  }
  uploadFile() {
    this.fileUploadInfo = "block";
    this.hiddenScroll();
  }
  onFileChange(event, form: NgForm) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      if (
        file.type == "image/jpeg" ||
        file.type == "image/png" ||
        file.type == "image/jpg"
      ) {
        this.fileToUpload = file;
      } else {
        this.myInputVariable.nativeElement.value = "";
        this.fileToUpload = undefined;
        form.resetForm();
        form.reset();
        this.sharedService.add({
          severity: "error",
          summary: "Error",
          detail: "Please upload JPG or PNG file",
        });
      }
    }
  }
  documentsUpdate(organizationDocumentDetails) {
    this.documentInfo = "block";
    this.hiddenScroll();
    this.organizationDocumentDetails = organizationDocumentDetails;
    this.organizationDocumentDetails.organizationDetailsId =
      this.organizationDetails.organizationDetailsId;
    this.cdr.detectChanges();
  }
  saveDocument(form: NgForm) {
    let input = new FormData();
    input.append("fileToUpload", this.fileToUpload);
    input.append("authCode", this.authService.currentUser.authCode);
    input.append(
      "organizationDetailsId",
      this.organizationDetails.organizationDetailsId.toString()
    );
    input.append(
      "employeeDetailsId",
      this.authService.currentUser.employeeDetailsId.toString()
    );
    input.append(
      "organizationDocumentDetailsId",
      this.organizationDocumentDetails.organizationDocumentDetailsId
    );
    input.append(
      "documentTitle",
      this.organizationDocumentDetails.documentTitle
    );
    input.append(
      "documentNumber",
      this.organizationDocumentDetails.documentNumber
    );
    input.append(
      "alertRequired",
      this.organizationDocumentDetails.alertRequired ? "1" : "0"
    );
    input.append(
      "alertBeforeNoOfDays",
      this.organizationDocumentDetails.alertBeforeNoOfDays
    );
    input.append(
      "documentExpiryDate",
      this.organizationDocumentDetails.documentExpiryDate
    );

    this.organizationDetailsService
      .saveOrganizationDocument(input)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.closeDocAddmodal();
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }
  fileToDownload(rowData) {
    this.organizationDetailsService
      .downloadOrgDocument(rowData.organizationDocumentDetailsId)
      .subscribe((resp: HttpResponse<Blob>) => {
        const blob = new Blob([resp.body], { type: resp.body.type });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let imageType = resp.body.type.substring(
          resp.body.type.lastIndexOf("/") + 1
        );
        link.download = `${rowData.organizationDetailsId}_${rowData.organizationDocumentUploadDetailsId}.${imageType}`;
        link.click();
        link.remove();
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: "File downloaded",
        });
      });
  }
  saveProject() {
    this.project.organizationDetailsId =
      this.authService.currentUser.organizationDetailsId;
    this.project.inHouse = "1";
    this.project.timesheetNotificationConfig = "2";
    if (this.project.projectDetailsId) {
      this.projectService.updateProject(this.project).subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.getProjectDetails();
            this.addPoject = "none";
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            this.displayScroll();
          } else {
            this.errLabel = res.message;
          }
        },
        (error) => {
          this.errLabel = error;
        }
      );
    } else {
      this.projectService.addProject(this.project).subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.getProjectDetails();
            this.addPoject = "none";
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            this.displayScroll();
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
  getProjectDetails(status: string = "1") {
    this.organizationDetailsService
      .getInHouseProjects(status)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.projectsDetailsList = res.responsePayload;
        }
      });
  }
  projectUpdate(project) {
    this.addPoject = "block";
    this.hiddenScroll();
    this.project = project;
  }
  checkProjectAlreadyExist() {
    this.projectService.isProjectExists(this.project.projectName).subscribe(
      (res) => {
        if (res.statusCode != 200) {
          this.errLabel = res.message;
          this.project.projectName = "";
        } else {
          this.errLabel = undefined;
        }
      },
      (error) => {
        this.errLabel = error;
      }
    );
  }
}
