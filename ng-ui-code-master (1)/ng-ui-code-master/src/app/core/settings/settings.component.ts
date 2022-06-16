import { Component, OnInit } from "@angular/core";
import { SharedService } from "@app/shared/shared.service";
import { SettingsService } from "./settings.service";
import * as country_details from "@assets/country_details.json";
import { AuthService } from "../service/auth.service";
import { FormGroup, NgForm } from "@angular/forms";
import { EmailDetails } from "@app/shared/models/SettingsEmailDetails.model";
import { NotificationConfig } from "@app/shared/models/notificationConfig.model";
import { NONE_TYPE } from "@angular/compiler";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"],
})
export class SettingsComponent implements OnInit {
  globalCurrencyDetails: GlobalCurrency;
  countryDetails = country_details.rows;
  selectedCountryDetails: any;
  selectedGlobalCurrencyDetails: any;
  clientErrorMsg: any;
  settingsEmailDetails = new EmailDetails();
  emailDetails: any;
  empIdConfiguration: any;
  //natificationConfigs: NotificationConfig[];
  employeeConfigs: any[];
  employeeConfigDetailsUpdate = new EmployeeConfigUpdate();
  invoiceConfigs: any[];
  invoiceCols = [
    { field: "companyName", header: "Customer Name" },
    {
      field: "invoiceNotificationConfigValue",
      header: "Invoice Configuration",
    },
  ];
  timesheetConfigs: any[];
  timesheetCols = [
    { field: "projectName", header: "Project Name" },
    {
      field: "timesheetNotificationConfigValue",
      header: "Timesheet Configuration",
    },
  ];
  employeeCols = [
    { field: "employeeName", header: "Employee Name" },
    { field: "timesheetNotification", header: "Timesheet Notification" },
    { field: "w4ConfigValue", header: "W4 Configuration" },
    { field: "i9ConfigValue", header: "I9 Configuration" },
  ];
  w4ConfigOptionList = [
    { label: "Download-->Sign-->Upload", value: "1" },
    { label: "Digital Signture", value: "2" },
    { label: "Digital Signature with SSN Verify", value: "3" },
    { label: "Digital Signataure with SSN & Date of Birth Verify", value: "4" },
  ];
  i9ConfigOptionList = [
    { label: "Download-->Sign-->Upload", value: "1" },
    { label: "Digital Signture", value: "2" },
    { label: "Digital Signature with SSN Verify", value: "3" },
    { label: "Digital Signataure with SSN & Date of Birth Verify", value: "4" },
  ];
  loading: boolean = false;
  w4Configs: any[];
  i9Configs: any[];

  constructor(
    private settingsService: SettingsService,
    public sharedService: SharedService,
    public authService: AuthService
  ) {
    this.globalCurrencyDetails = new GlobalCurrency();
  }

  ngOnInit(): void {
    this.getOrganizationCurrency();
    this.getEmailDetails();
    this.getEmployeeConfigs();
    this.getInvoiceConfigs();
    this.getTimesheetConfigs();
    this.getEmployeeIdConfig();
    //this.getW4ConfigDetails();
    //this.getI9ConfigDetails();
  }
  selectGlobalCurrency(event) {
    this.globalCurrencyDetails.country = event.name;
    this.globalCurrencyDetails.currency = event.currency;
    this.globalCurrencyDetails.countryDetailsId = event.country_details_id;
    this.settingsService
      .saveOrganizationCurrency(
        event.name,
        event.currency,
        event.country_details_id
      )
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getOrganizationCurrency();
        }
      });
  }
  getOrganizationCurrency() {
    this.settingsService.getOrganizationCurrency().subscribe((res) => {
      if (res.statusCode == 200) {
        let country = this.countryDetails.filter((element) => {
          return (
            //element.currency == res.responsePayload.currency
            element.country_details_id == res.responsePayload.countryDetailsId
          );
        });
        this.selectedGlobalCurrencyDetails = country[0];
        sessionStorage.setItem(
          "orgnizationCurrency",
          this.selectedGlobalCurrencyDetails.currency_icon
        );
        this.authService.orgnizationCurrency =
          this.selectedGlobalCurrencyDetails.currency_icon;
        //this.authService.getOrganizationCurrency(this.authService.currentUser);
      }
    });
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

  getEmailDetails() {
    this.settingsService.getEmailDetails().subscribe((resp) => {
      if (resp.statusCode == 200) {
        this.emailDetails = resp;
        this.settingsEmailDetails = this.emailDetails.responsePayload;
      } else {
        console.log(resp.message + resp.statusCode);
      }
    });
  }

  updateEmailDetails(formdata) {
    let emailDetailsToPost = new EmailDetails();
    emailDetailsToPost.mailBoxHost = formdata.value.mailBoxHost;
    emailDetailsToPost.mailBoxUsername = formdata.value.mailBoxUsername;
    emailDetailsToPost.mailBoxPassword = formdata.value.mailBoxPassword;
    this.settingsService
      .updateEmailDetails(emailDetailsToPost)
      .subscribe((resp) => {
        if (resp.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: resp.message,
          });
          console.log(resp.message);
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: resp.message,
          });
          console.log(resp.message);
        }
      });
  }
  getEmployeeConfigs() {
    this.settingsService.getEmployeeConfigurations().subscribe((resp) => {
      if (resp.statusCode == 200) {
        this.employeeConfigs = resp.responsePayload;
        this.employeeConfigs.forEach((element, index) => {
          this.employeeConfigs[index].notificationChecked =
            +element.timesheetNotification ? true : false;
        });
        console.log(this.employeeConfigs);
      } else {
        console.log(resp.message + resp.statusCode);
      }
    });
  }
  getEmployeeIdConfig() {
    this.settingsService.getEmployeeIdConfig().subscribe((resp) => {
      if (resp.statusCode == 200) {
        this.empIdConfiguration = resp.responsePayload.empIdConfiguration;
      }
    });
  }
  onEmpIdConfigurationChange() {
    this.settingsService
      .saveEmployeeIdConfig(this.empIdConfiguration)
      .subscribe((resp) => {
        if (resp.statusCode != 200) {
          this.getEmployeeIdConfig();
        }
      });
  }

  updateNotificationConfig(event, rowData) {
    let timeSheetNotification: string;
    if (event.checked) {
      timeSheetNotification = "1";
    } else {
      timeSheetNotification = "0";
    }
    this.settingsService
      .UpdateNotificationConfig(
        rowData.employeeConfigsDetailsId,
        timeSheetNotification
      )
      .subscribe((res) => {
        if (res.statusCode == 200) {
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
  }

  editType: string = "";
  editW4Details: string = "none";
  employeeConfigDetails: any;
  editI9Details: string = "none";
  employeeConfigDisplay: string = "none";
  //i9ConfigurationDetails: any;
  applyToAll: boolean = false;
  applyToAllI9: boolean = false;
  applyToAllEmployees: boolean = false;
  applyToAllInvoices: boolean = false;
  invoiceConfigDetails: any;
  editInvoiceConfigs: string = "none";
  applyToAllTimeSheets: boolean = false;
  timesheetConfigDetails: any;
  editTimesheetConfigs: string = "none";
  invoiceApplyToAll: boolean = false;
  invoiceNotificationConfig: string;
  companyDetailsId: number;
  projectsApplyToAll: boolean = false;
  timesheetNotificationConfig: string;
  projectDetailsId: number;
  onChangeApplyToAllW4(event) {
    if (event.checked) {
      this.applyToAll = true;
    } else {
      this.applyToAll = false;
    }
  }
  onChangeApplyToAllEmp(event) {
    if (event.checked) {
      this.applyToAllEmployees = true;
    } else {
      this.applyToAllEmployees = false;
    }
  }

  onChangeApplyToAllI9(event) {
    if (event.checked) {
      this.applyToAllI9 = true;
    } else {
      this.applyToAllI9 = false;
    }
  }

  //Invoice Configurations

  onChangeApplyToAllInvoices(event) {
    if (event.checked) {
      this.applyToAllInvoices = true;
    } else {
      this.applyToAllInvoices = false;
    }
  }

  editInvoice(invoiceConfigDetails) {
    this.invoiceNotificationConfig =
      invoiceConfigDetails.invoiceNotificationConfig;
    this.companyDetailsId = invoiceConfigDetails.companyDetailsId;
    //this.invoiceConfigDetails = invoiceConfigDetails;
    this.editType = "invoiceConfig";
    this.editInvoiceConfigs = "block";
    this.invoiceApplyToAll = true;
  }

  editInvoiceConfigDetails() {
    this.invoiceNotificationConfig = "2";
    this.applyToAllInvoices = true;
    this.editType = "invoiceConfig";
    this.editInvoiceConfigs = "block";
  }

  getInvoiceConfigs() {
    this.settingsService.getInvoiceConfigurations().subscribe((resp) => {
      if (resp.statusCode == 200) {
        this.invoiceConfigs = resp.responsePayload;
        //console.log(this.invoiceConfigs);
      } else {
        console.log(resp.message + resp.statusCode);
      }
    });
  }

  updateInvoiceConfigDetails() {
    this.settingsService
      .updateInvoiceConfigurations(
        this.invoiceNotificationConfig,
        this.applyToAllInvoices,
        this.companyDetailsId
      )
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.editW4Details = "none";
          this.editType = "";
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.applyToAllInvoices = false;
          //this.getW4ConfigDetails();
          this.getInvoiceConfigs();
          this.invoiceApplyToAll = false;
        } else {
          this.applyToAll = false;
          this.editW4Details = "none";
          this.editType = "";
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }

  //Time Sheet Configurations
  onChangeApplyToAllTimesheets(event) {
    if (event.checked) {
      this.applyToAllTimeSheets = true;
    } else {
      this.applyToAllTimeSheets = false;
    }
  }

  getTimesheetConfigs() {
    this.settingsService.getTimesheetConfigurations().subscribe((resp) => {
      if (resp.statusCode == 200) {
        this.timesheetConfigs = resp.responsePayload;
        //console.log(this.timesheetConfigs);
      } else {
        console.log(resp.message + resp.statusCode);
      }
    });
  }

  editTimesheet(timesheetConfigDetails) {
    this.timesheetNotificationConfig =
      timesheetConfigDetails.timesheetNotificationConfig;
    this.projectDetailsId = timesheetConfigDetails.projectDetailsId;
    //this.timesheetConfigDetails = timesheetConfigDetails;
    this.editType = "timesheetConfig";
    this.editTimesheetConfigs = "block";
    this.projectsApplyToAll = true;
  }

  editProjectConfigDetails() {
    this.timesheetNotificationConfig = "2";
    this.editType = "timesheetConfig";
    this.editTimesheetConfigs = "block";
    this.applyToAllTimeSheets = true;
  }

  updateTimesheetConfigDetails() {
    this.settingsService
      .updateTimesheetConfigurations(
        this.timesheetNotificationConfig,
        this.applyToAllTimeSheets,
        this.projectDetailsId
      )
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.editW4Details = "none";
          this.editType = "";
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.applyToAllTimeSheets = false;
          this.projectsApplyToAll = false;
          //this.getW4ConfigDetails();
          this.getTimesheetConfigs();
        } else {
          this.applyToAll = false;
          this.editW4Details = "none";
          this.editType = "";
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }

  onChangeTimesheetNotification(event) {
    if (event.checked) {
      //this.timeSheetNotificationCheck = true;
      this.employeeConfigDetailsUpdate.timesheetNotification = "1";
    } else {
      //this.timeSheetNotificationCheck = false;
      this.employeeConfigDetailsUpdate.timesheetNotification = "0";
    }
  }
  onCheckTimeSheet(event) {
    if (event.target.checked) {
      this.employeeConfigDetailsUpdate.updateTimesheetConfig = true;
    } else {
      this.employeeConfigDetailsUpdate.updateTimesheetConfig = false;
    }
  }
  onCheckW4(event) {
    if (event.target.checked) {
      this.employeeConfigDetailsUpdate.updateW4Config = true;
    } else {
      this.employeeConfigDetailsUpdate.updateW4Config = false;
    }
  }
  onCheckI9(event) {
    if (event.target.checked) {
      this.employeeConfigDetailsUpdate.updateI9Config = true;
    } else {
      this.employeeConfigDetailsUpdate.updateI9Config = false;
    }
  }

  edit(employeeConfigDetails) {
    this.employeeConfigDetails = employeeConfigDetails;
    console.log(this.employeeConfigDetails);
    this.editType = "w4";
    this.editW4Details = "block";
  }
  editI9Config(employeeConfigDetails) {
    this.employeeConfigDetails = employeeConfigDetails;
    console.log(this.employeeConfigDetails);
    this.editType = "i9";
    this.editI9Details = "block";
  }
  timeSheetNotificationCheck: boolean;

  editEmployeeConfigDetails() {
    this.editType = "employeeConfig";
    this.employeeConfigDisplay = "block";
  }
  cancel() {
    this.editW4Details = "none";
    this.editI9Details = "none";
    this.employeeConfigDisplay = "none";
    this.editType = "";
    this.editInvoiceConfigs = "none";
    this.editTimesheetConfigs = "none";
    this.projectsApplyToAll = false;
    this.invoiceApplyToAll = false;
    this.employeeConfigDetailsUpdate.updateTimesheetConfig = false;
    this.employeeConfigDetailsUpdate.updateW4Config = false;
    this.employeeConfigDetailsUpdate.updateI9Config = false;
    this.employeeConfigDetailsUpdate.timesheetNotification = "0";
  }

  updateEmployeeConfigDetails() {
    console.log(this.employeeConfigDetailsUpdate);
    this.settingsService
      .updateEmployeeConfigurations(this.employeeConfigDetailsUpdate)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.employeeConfigDisplay = "none";
          this.editType = "";
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          //this.applyToAllEmployees = false;
          //this.getW4ConfigDetails();
          this.employeeConfigDetailsUpdate.updateTimesheetConfig = false;
          this.employeeConfigDetailsUpdate.updateW4Config = false;
          this.employeeConfigDetailsUpdate.updateI9Config = false;
          this.employeeConfigDetailsUpdate.timesheetNotification = "0";
          this.getEmployeeConfigs();
        } else {
          //this.applyToAllEmployees = false;
          this.employeeConfigDetailsUpdate.updateTimesheetConfig = false;
          this.employeeConfigDetailsUpdate.updateW4Config = false;
          this.employeeConfigDetailsUpdate.updateI9Config = false;
          this.employeeConfigDetailsUpdate.timesheetNotification = "0";
          this.employeeConfigDisplay = "none";
          this.editType = "";
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }

  updateW4ConfigDetails() {
    console.log(this.applyToAll);
    this.settingsService
      .updateW4Configurations(
        this.employeeConfigDetails.w4Config,
        this.applyToAll,
        this.employeeConfigDetails.employeeConfigsDetailsId
      )
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.editW4Details = "none";
          this.editType = "";
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.applyToAll = false;
          //this.getW4ConfigDetails();
          this.getEmployeeConfigs();
        } else {
          this.applyToAll = false;
          this.editW4Details = "none";
          this.editType = "";
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }

  updateI9ConfigDetails() {
    console.log(this.applyToAllI9);
    this.settingsService
      .updateI9Configurations(
        this.employeeConfigDetails.i9Config,
        this.applyToAllI9,
        this.employeeConfigDetails.employeeConfigsDetailsId
      )
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.editI9Details = "none";
          this.editType = "";
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.applyToAllI9 = false;
          //this.getI9ConfigDetails();
          this.getEmployeeConfigs();
        } else {
          this.applyToAllI9 = false;
          this.editI9Details = "none";
          this.editType = "";
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }
}

class GlobalCurrency {
  country: string;
  currency: string;
  countryDetailsId: number;
}

class EmployeeConfigUpdate {
  i9Config: string;
  w4Config: string;
  timesheetNotification: string;
  updateTimesheetConfig: boolean = false;
  updateW4Config: boolean = false;
  updateI9Config: boolean = false;
}
