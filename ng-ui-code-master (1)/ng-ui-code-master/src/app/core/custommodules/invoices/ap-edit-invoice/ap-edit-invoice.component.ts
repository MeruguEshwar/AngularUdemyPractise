import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@app/core/service/auth.service";
import {
  invoiceEntries,
  InvoicesDetails,
} from "@app/shared/models/invoicePaymentDetailsmodel.";
import { SharedService } from "@app/shared/shared.service";
import { InvoicesService } from "../invoices.service";
import * as country_details from "@assets/country_details.json";
import { InvoiceFileUploadModel } from "@app/shared/models/invoiceFileUpload.model";
import { FormControl, NgForm } from "@angular/forms";
import { ElementRef } from "@angular/core";
import { CanDeactivateComponent } from "@app/core/guards/unsaved-changes.guard";
import { UserActionServices } from "@app/shared/userAction.services";
import { Observable } from "rxjs";

@Component({
  selector: "app-ap-edit-invoice",
  templateUrl: "./ap-edit-invoice.component.html",
  styleUrls: ["./ap-edit-invoice.component.css"],
})
export class ApEditInvoiceComponent implements OnInit, CanDeactivateComponent {
  @ViewChild(NgForm) f: NgForm;
  approverInfo: string = "none";
  unSavedModel: string = "none";
  confirmUnsaved: boolean = false;
  selectedApproverEmailList: string[] = [];
  state: any;
  invoiceDetailsId: number;
  organizationDetailsId: number;
  grandTotal: number = 0;
  totalTax: number = 0;
  totalDiscount: number = 0;
  invoicePaymentDetailsBasedType: string = "project";
  currencyIcon: string = "$";
  deductionType = [
    { label: this.currencyIcon, value: "1" },
    { label: "%", value: "2" },
  ];
  customerOptions: any;
  selectedCustomerOptions: any;
  remitCompany: any;
  selectedRemitCompanyOptions: any;
  minimumDate = new Date();
  creditDaysOptions = [
    { label: "Select Credit Days", value: null },
    { label: "Immediate", value: "0" },
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
  selectedCreditDaysOptions: any;
  shipFromOption: any;
  selectedshipFromOption: any;
  invoicesDetails: InvoicesDetails;
  invoicesEntries: invoiceEntries[];

  projectOption: any;
  consultantOption: any;
  approverEmailList: any;
  countryDetails = country_details.rows;
  invoiceEntityRowData: any;
  invoiceEntityRowDataIndex: any;
  flag: boolean = true;
  fileToUpload: any;
  uploadedFileTitle: string;
  uploadFileInfo: string = "none";
  @ViewChild("fileInput") myInputVariable: ElementRef;
  errorLabel: any;
  clientErrorMsg: any;
  invoicesAttachmentDetails: InvoiceFileUploadModel[] = [];
  cols = [
    { field: "documentTitle", header: "Name" },
    { field: "createdAt", header: "Created Date" },
  ];
  deleteAttachmentRowData: any;
  confirmType: string;
  formSaved: boolean = false;
  isCustomEmail: boolean = false;
  customEmail: string;
  customEmailModel: string = "none";
  saveDraft: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    public sharedService: SharedService,
    private invoiceService: InvoicesService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private userAction: UserActionServices
  ) {
    this.organizationDetailsId =
      this.authService.currentUser.organizationDetailsId;
  }
  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    if (this.f.dirty) {
      this.unSavedModel = "block";
      return this.userAction.nevigateRouter;
    } else {
      return true;
    }
  }
  async ngOnInit(): Promise<void> {
    this.state = window.history.state;
    if (this.state && this.state.invoiceDetailsId) {
      this.invoiceDetailsId = this.state.invoiceDetailsId;
    }
    this.invoicesDetails = new InvoicesDetails();
    this.getOrganizationDetails();
    this.getCompanyList(this.organizationDetailsId);
    if (this.invoiceDetailsId) {
      this.invoicesEntries = [];
      this.invoicesDetails.invoiceDetailsId = this.invoiceDetailsId;
      this.invoicesDetails.organizationDetailsId = this.organizationDetailsId;
      await this.getInvoices(this.invoiceDetailsId);
      this.getInvoiceAttacment(this.invoiceDetailsId);
      this.approverList(this.invoicesDetails.companyDetailsId, "1");
      console.log(this.invoicesDetails);
    } else {
      this.invoicesEntries = [];
      this.invoicesDetails.organizationDetailsId = this.organizationDetailsId;
      let date = new Date();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let year = date.getFullYear();
      this.invoicesDetails.invoiceDate = month + "-" + day + "-" + year;
      this.onAddPaymentDetails();
      // this.generateInvoiceNumber();
    }
    this.sharedService.openToggleMenu("roleMenuToggleExternalContent");
    this.cdr.detectChanges();
  }
  getOrganizationDetails() {
    this.invoiceService.getOrganizationDetails().subscribe(async (res) => {
      if (res.statusCode == 200) {
        let data = res.responsePayload;
        this.invoicesDetails.einNumber = data.einNumber;
        this.invoicesDetails.organizationName = data.organizationName;
        this.remitCompany = await this.getRemittance(data);
        this.shipFromOption = await this.getAddress(data);
        this.cdr.detectChanges();
      }
    });
  }
  generateInvoiceNumber() {
    this.invoiceService.generateInvoiceNumber().subscribe((res) => {
      if (res.statusCode == 200) {
        this.invoicesDetails.invoiceNumber = res.responsePayload;
      } else {
        this.invoicesDetails.invoiceNumber = "";
      }
    });
  }
  getAddress(data) {
    return new Promise((result, reject) => {
      let options = [
        {
          label: "Select",
          value: null,
        },
      ];
      data.addresses.forEach((element) => {
        let address =
          (element.addressLine1 ? element.addressLine1 + "," : "") +
          (element.addressLine2 ? element.addressLine2 + "," : "") +
          (element.city ? element.city + "," : "") +
          (element.state ? element.state + "," : "") +
          (element.country ? element.country + "," : "") +
          element.pinCode;
        options.push({ label: address, value: element });
      });
      result(options);
    });
  }
  getRemittance(data) {
    return new Promise((result, reject) => {
      let options = [
        {
          label: "Select",
          value: null,
        },
      ];
      data.remittances.forEach((element) => {
        let remittances = element.friendlyName;
        options.push({ label: remittances, value: element });
      });
      result(options);
    });
  }

  getCompanyList(organizationDetailsId) {
    this.invoiceService
      .getCompanyList(organizationDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.customerOptions = res.responsePayload;
          this.customerOptions.splice(0, 0, {
            companyName: "Select",
            value: null,
          });
        }
      });
  }

  getProjectEmployeeList(companyDetailsId) {
    return new Promise<void>((resolve, reject) => {
      this.invoiceService
        .getProjectEmployeeList(companyDetailsId)
        .subscribe(async (res) => {
          if (res.statusCode == 200) {
            this.projectOption = await this.getProjects(
              res.responsePayload.projects
            );
            this.consultantOption = await this.getEmployees(
              res.responsePayload.employees
            );
            this.cdr.detectChanges();
            resolve();
          } else {
            this.projectOption = [
              {
                label: "Select",
                value: null,
              },
            ];
            this.consultantOption = [
              {
                label: "Select",
                value: null,
              },
            ];
          }
          this.cdr.detectChanges();
          resolve();
        });
    });
  }
  getEmployees(data) {
    return new Promise((result, reject) => {
      let options = [
        {
          label: "Select",
          value: null,
        },
      ];
      if (data && data.length) {
        data.forEach((element) => {
          options.push({
            label: element.fullName,
            value: element,
          });
        });
      }

      result(options);
    });
  }
  getProjects(data) {
    return new Promise((result, reject) => {
      let options = [
        {
          label: "Select",
          value: null,
        },
      ];
      if (data && data.length) {
        data.forEach((element) => {
          options.push({
            label: element.projectName,
            value: element.projectDetailsId,
          });
        });
      }
      result(options);
    });
  }
  onAddPaymentDetails() {
    let paymentDetails = Object.assign({}, new invoiceEntries());
    this.invoicesEntries.push(paymentDetails);
  }
  onRemitSelect(event) {
    let seletectedCountry;
    if (event.value) {
      this.invoicesDetails.organizationRemittanceDetailsId =
        event.value.organizationRemittanceDetailsId;
      seletectedCountry = this.countryDetails.filter((res) => {
        return res.country_details_id == event.value.country;
      });
      if (seletectedCountry.length) {
        if (seletectedCountry[0].currency_icon) {
          this.currencyIcon = seletectedCountry[0].currency_icon;
        }
      }
      this.deductionType = [
        { label: this.currencyIcon, value: "1" },
        { label: "%", value: "2" },
      ];
    } else {
      this.invoicesDetails.organizationRemittanceDetailsId = event.value;
    }
    this.cdr.detectChanges();
  }
  getCountryName(id) {
    let seletectedCountry = this.countryDetails.filter((res) => {
      return res.country_details_id == id;
    });
    return seletectedCountry[0].name;
  }
  onCompanyList(event) {
    this.invoicesDetails.companyDetailsId = event.companyDetailsId;
    this.invoicesDetails.companyName = event.companyName;
    this.invoicesDetails.companyEinNumber = event.einNumber;
    this.invoicesDetails.companyAddress = event.companyAddress;
    if (event.companyName != "Select") {
      this.getProjectEmployeeList(event.companyDetailsId);
      this.approverList(this.invoicesDetails.companyDetailsId, "1");
    } else {
      this.projectOption = [];
      this.consultantOption = [];
    }
  }
  onShipFrom(event) {
    if (event.value) {
      this.invoicesDetails.organizationAddressDetailsId =
        event.value.organizationAddressDetailsId;
    } else {
      this.invoicesDetails.organizationAddressDetailsId = event.value;
    }
  }
  oncreditDays(event) {
    this.invoicesDetails.creditDays = event.value;
    let date = new Date(this.invoicesDetails.invoiceDate);
    const daysToAdd = +event.value;
    date.setDate(date.getDate() + daysToAdd);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();
    this.invoicesDetails.invoiceDueDate = month + "-" + day + "-" + year;
  }
  onRemovePaymentDetails(invoice, index) {
    this.invoiceEntityRowData = invoice;
    this.invoiceEntityRowDataIndex = index;
    this.confirmType = "entity";
  }
  onConsultant(event, index) {
    this.invoicesEntries[index].disableQuantity = false;
    this.invoicesEntries[index].employeeDetailsId =
      event.value.employeeDetailsId;
    this.consultantOption.filter((res) => {
      if (res.value != null) {
        if (res.value.employeeDetailsId == event.value.employeeDetailsId) {
          this.invoicesEntries[index].ratestypes = res.value.rates;
        }
      }
    });
    this.cdr.detectChanges();
  }
  onRatestypeSelect(value, index) {
    this.invoicesEntries[index].rate = value;
    this.onInputKeyUp(null, this.invoicesEntries[index], index);
  }
  onProject(event, index) {
    this.invoicesEntries[index].projectDetailsId = event.value;
    this.invoicesEntries[index].disableQuantity = false;
  }
  onProduct(invoice, index) {
    this.invoicesEntries[index].disableQuantity = false;
  }
  save() {
    this.sharedService.displayLoader(true);
    this.saveDraft = false;
    this.invoicesDetails.invoiceEntries = this.invoicesEntries;
    if (this.invoicePaymentDetailsBasedType == "project") {
      this.invoicesDetails.entryType = "1";
    }
    if (this.invoicePaymentDetailsBasedType == "consultant") {
      this.invoicesDetails.entryType = "2";
    }
    this.invoicesDetails.action = "1";
    this.saveInvoice(this.invoicesDetails, this.saveDraft);
  }
  saveSend() {
    this.sharedService.displayLoader(true);
    this.saveDraft = false;
    this.invoicesDetails.approverEmailIds = this.selectedApproverEmailList;
    this.invoicesDetails.invoiceEntries = this.invoicesEntries;
    if (this.invoicePaymentDetailsBasedType == "project") {
      this.invoicesDetails.entryType = "1";
    }
    if (this.invoicePaymentDetailsBasedType == "consultant") {
      this.invoicesDetails.entryType = "2";
    }
    this.invoicesDetails.action = "2";
    this.saveInvoice(this.invoicesDetails, this.saveDraft);
  }
  uploadAttachemnts() {
    this.uploadFileInfo = "block";
    this.hiddenScroll();
  }
  async saveInvoice(invoicesDetails, saveDraft) {
    await this.submitInvoices(invoicesDetails, saveDraft).then((res) => {
      this.sharedService.add({
        severity: "success",
        summary: "Success",
        detail: "Invoice Saved",
      });
      this.f.resetForm();
      this.router.navigate(["/admin/ap_invoices"], { relativeTo: this.route });
    });
  }
  submitInvoices(invoicesDetails, saveDraft) {
    return new Promise<void>((resolve, reject) => {
      this.invoiceService
        .saveAPInvoice(invoicesDetails, saveDraft)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.sharedService.displayLoader(false);
            this.invoiceDetailsId = res.responsePayload.invoiceDetailsId;
            this.invoicesEntries = res.responsePayload.invoiceEntries;
            if (this.invoicesEntries) {
              this.invoicesEntries.forEach((element1, index) => {
                if (element1.employeeDetailsId) {
                  const emp = this.consultantOption.filter((element2) => {
                    if (element2.value != null) {
                      return (
                        element2.value.employeeDetailsId ==
                        element1.employeeDetailsId
                      );
                    }
                  });
                  this.invoicesEntries[index].employeeDetails = emp[0];
                }
                if (element1.projectDetailsId) {
                  const proj = this.projectOption.filter((element2) => {
                    return element2.value == element1.projectDetailsId;
                  });
                  this.invoicePaymentDetailsBasedType = "project";
                  this.invoicesEntries[index].projectDetails = proj[0];
                }
              });
            }
            this.invoicesDetails.invoiceDetailsId = this.invoiceDetailsId;
            resolve();
          } else {
            this.sharedService.add({
              severity: "error",
              summary: "Error",
              detail: res.message,
            });
          }
        });
    });
  }
  getAmount(invoice, index) {
    let amount = 0;
    let tempamount = 0;
    let taxAmount = 0;
    let discountAmount = 0;
    const rate = +invoice.rate;
    const quantity = +invoice.quantity;
    const discount = +invoice.discount;
    const tax = +invoice.tax;
    const taxType = +invoice.taxType;
    const discountType = +invoice.discountType;
    if (rate && quantity) {
      amount = rate * quantity;
      tempamount = rate * quantity;
    }
    if (tempamount) {
      if (discountType == 2) {
        discountAmount = (tempamount * discount) / 100;
        amount = amount - discountAmount;
      } else if (discountType == 1) {
        discountAmount = discount;
        amount = amount - discount;
      }
      if (taxType == 2) {
        taxAmount = (tempamount * tax) / 100;
        amount = amount + taxAmount;
      } else if (taxType == 1) {
        taxAmount = tax;
        amount = amount + tax;
      }
    }
    if (amount >= 0) {
      this.invoicesEntries[index].amount = amount;
      this.invoicesEntries[index].discountAmount = discountAmount;
      this.invoicesEntries[index].taxAmount = taxAmount;
    } else {
      this.invoicesEntries[index].amount = 0;
      this.invoicesEntries[index].discountAmount = 0;
      this.invoicesEntries[index].taxAmount = 0;
    }

    this.getGrandTotal(this.invoicesEntries);
  }
  getGrandTotal(invoicesEntries) {
    let total = 0;
    let tax = 0;
    let discount = 0;
    let amount = 0;
    invoicesEntries.forEach((element) => {
      amount = element.rate * element.quantity;
      if (element.taxAmount) {
        tax += element.taxAmount;
      } else {
        if (+element.taxType == 2) {
          tax += (amount * element.tax) / 100;
        } else if (+element.taxType == 1) {
          tax += element.tax;
        }
      }
      if (element.discountAmount) {
        discount += element.discountAmount;
      } else {
        if (+element.discountType == 2) {
          discount += (amount * element.discount) / 100;
        } else if (+element.discountType == 1) {
          discount += element.discount;
        }
      }
      total += element.amount;
    });
    total ? (this.grandTotal = total) : (this.grandTotal = 0);
    this.totalDiscount = discount;
    this.totalTax = tax;
  }
  entryType(event, entryType) {
    this.invoicesEntries = [];
    this.onAddPaymentDetails();
    this.cdr.detectChanges();
    this.grandTotal = 0;
    this.totalDiscount = 0;
    this.totalTax = 0;
  }
  async saveUploadFile(form: NgForm) {
    console.log("inside saveUploadFile");
    if (this.invoiceDetailsId) {
      this.saveDraft = false;
      this.fileUpload(form);
    } else {
      this.sharedService.displayLoader(true);
      this.saveDraft = true;
      this.invoicesDetails.approverEmailIds = this.selectedApproverEmailList;
      this.invoicesDetails.invoiceEntries = this.invoicesEntries;
      if (this.invoicePaymentDetailsBasedType == "project") {
        this.invoicesDetails.entryType = "1";
      }
      if (this.invoicePaymentDetailsBasedType == "consultant") {
        this.invoicesDetails.entryType = "2";
      }
      this.invoicesDetails.action = "1";
      await this.submitInvoices(this.invoicesDetails, this.saveDraft).then(
        async (res) => {
          console.log(res);
          this.fileUpload(form);
        }
      );
    }
  }
  fileUpload(form: NgForm) {
    console.log("inside file upload");
    return new Promise<void>((resolve, reject) => {
      let imageType = this.fileToUpload.value.type.split("/")[1].toLowerCase();
      let fd = new FormData();
      console.log(this.invoiceDetailsId);
      fd.append("invoiceDetailsId", this.invoiceDetailsId.toString());
      fd.append("fileToUpload", this.fileToUpload.value);
      fd.append("documentTitle", this.uploadedFileTitle);
      if (
        imageType == "jpeg" ||
        imageType == "jpg" ||
        imageType == "gif" ||
        imageType == "png"
      ) {
        console.log("inside if");
        this.invoiceService.uploadInvoiceAttachment(fd).subscribe(
          (res) => {
            if (res.statusCode == 200) {
              this.getInvoiceAttacment(this.invoiceDetailsId);
              this.closeUploadmodal();
              form.reset();
              this.myInputVariable.nativeElement.value = "";
              this.uploadedFileTitle = null;
              this.sharedService.add({
                severity: "success",
                summary: "Success",
                detail: res.message,
              });
              resolve();
            } else {
              this.sharedService.add({
                severity: "error",
                summary: "Error!",
                detail: res.message,
              });
            }
          },
          (error) => {
            this.errorLabel = error;
          }
        );
      } else {
        this.sharedService.add({
          severity: "error",
          summary: "Error!",
          detail: `Please upload file in 'PNG', 'JPEG', 'JPG', 'GIF',"PDF" format`,
        });
        this.myInputVariable.nativeElement.value = "";
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
  clearFile() {
    this.myInputVariable.nativeElement.value = "";
    this.fileToUpload = undefined;
  }
  getInvoiceAttacment(invoiceDetailsId) {
    this.invoiceService
      .getInvoiceAttachment(invoiceDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.invoicesAttachmentDetails = res.responsePayload;
        } else {
          this.invoicesAttachmentDetails = [];
        }
      });
  }
  getInvoices(invoiceDetailsId) {
    return new Promise<void>((resolve, reject) => {
      this.invoiceService
        .getInvoiceDetails(invoiceDetailsId)
        .subscribe(async (res) => {
          if (res.statusCode == 200) {
            const data = res.responsePayload;
            this.invoicesDetails.notes = data.notes;
            if (data.organizationAddressDetails) {
              this.invoicesDetails.organizationAddressDetailsId =
                data.organizationAddressDetails.organizationAddressDetailsId;
            }
            if (data.organizationRemittanceDetails) {
              this.invoicesDetails.organizationRemittanceDetailsId =
                data.organizationRemittanceDetails.organizationRemittanceDetailsId;
            }
            this.invoicesDetails.companyDetailsId = data.companyDetailsId;
            this.invoicesDetails.invoiceDueDate = data.invoiceDueDate;
            this.invoicesDetails.invoiceNumber = data.invoiceNumber;
            this.invoicesDetails.invoiceDate = data.invoiceDate;
            this.invoicesDetails.approverEmailIds =
              data.approverEmailIds.split(",");
            this.invoicesDetails.approverEmailIds.splice(
              this.invoicesDetails.approverEmailIds.length - 1,
              1
            );
            const remitCompany = this.remitCompany.filter((element) => {
              if (element.value) {
                if (data.organizationRemittanceDetails) {
                  return (
                    element.value.organizationRemittanceDetailsId ==
                    data.organizationRemittanceDetails
                      .organizationRemittanceDetailsId
                  );
                }
              }
            });
            this.selectedRemitCompanyOptions = remitCompany[0];
            const creditDays = this.creditDaysOptions.filter((element) => {
              if (element.value) {
                return element.value == data.creditDays;
              }
            });
            this.selectedCreditDaysOptions = creditDays[0];
            const shipFrom = this.shipFromOption.filter((element) => {
              if (element.value) {
                if (data.organizationAddressDetails) {
                  return (
                    element.value.organizationAddressDetailsId ==
                    data.organizationAddressDetails.organizationAddressDetailsId
                  );
                }
              }
            });
            this.selectedshipFromOption = shipFrom[0];
            const customer = this.customerOptions.filter((element) => {
              return element.companyDetailsId == data.companyDetailsId;
            });
            this.selectedCustomerOptions = customer[0];
            this.invoicesEntries = data.invoiceEntries;
            await this.getProjectEmployeeList(
              this.selectedCustomerOptions.companyDetailsId
            );
            this.invoicesEntries.forEach((element1, index) => {
              if (+element1.discount) {
                this.invoicesEntries[index].isDiscount = true;
              } else {
                this.invoicesEntries[index].isDiscount = false;
              }
              if (+element1.tax) {
                this.invoicesEntries[index].isTax = true;
              } else {
                this.invoicesEntries[index].isTax = false;
              }
              if (element1.employeeDetailsId) {
                const emp = this.consultantOption.filter((element2) => {
                  if (element2.value != null) {
                    return (
                      element2.value.employeeDetailsId ==
                      element1.employeeDetailsId
                    );
                  }
                });
                this.invoicePaymentDetailsBasedType = "consultant";
                this.invoicesEntries[index].employeeDetails = emp[0];
              }
              if (element1.projectDetailsId) {
                const proj = this.projectOption.filter((element2) => {
                  return element2.value == element1.projectDetailsId;
                });
                this.invoicePaymentDetailsBasedType = "project";
                this.invoicesEntries[index].projectDetails = proj[0];
              }
            });
            this.getGrandTotal(this.invoicesEntries);
            this.onfocus(Event, this.invoicesDetails.approverEmailIds);
            this.cdr.detectChanges();
          }
          resolve();
        });
    });
  }
  approverList(companyDetailsId, status) {
    return new Promise<void>((resolve, reject) => {
      this.invoiceService
        .getInvoiceApproverList(companyDetailsId, status)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.approverEmailList = res.responsePayload;
            resolve();
          } else {
            this.approverEmailList = [];
            resolve();
          }
          // this.approverEmailList.push({
          //   approverEmail: "Provide Approver Email",
          // });
        });
    });
  }
  closeUploadmodal() {
    this.onfocus(Event, this.selectedApproverEmailList);
    this.approverInfo = "none";
    this.uploadFileInfo = "none";
    this.customEmailModel = "none";
    this.myInputVariable.nativeElement.value = "";
    this.uploadedFileTitle = null;
    this.displayScroll();
  }
  async onfocus(event, list) {
    if (list != null || list != undefined) {
      let obj = [...list];
      if (obj.length) {
        let abc = new Promise<void>((res, rej) => {
          this.selectedApproverEmailList = [];
          obj.forEach((element) => {
            this.selectedApproverEmailList.push(element);
          });
          res();
        });
        abc;
      }
    }
  }
  validateInvoicenumber(invoiceNumber) {
    let params;
    if (this.invoiceDetailsId) {
      params = {
        invoiceNumber: invoiceNumber,
        invoiceDetailsId: this.invoiceDetailsId,
      };
    } else {
      params = {
        invoiceNumber: invoiceNumber,
      };
    }
    this.invoiceService.invoiceNumberExist(params).subscribe((res) => {
      if (res.statusCode != 200) {
        this.sharedService.add({
          severity: "error",
          summary: "Error",
          detail: res.message,
        });
      }
    });
  }
  confirm(type) {
    console.log(type);
    switch (type) {
      case "entity":
        this.onDeleteEntity(
          this.invoiceEntityRowData,
          this.invoiceEntityRowDataIndex
        );
        break;
      case "attachment":
        this.confirmOnDeleteAttachment(this.deleteAttachmentRowData);
        break;
    }
  }
  onDeleteEntity(invoice, index) {
    if (this.invoicesEntries.length > 1) {
      if (invoice.invoiceEntryDetailsId) {
        this.invoiceService
          .deleteInvoiceEntry(invoice.invoiceEntryDetailsId)
          .subscribe((res) => {
            if (res.statusCode == 200) {
              this.invoicesEntries.splice(index, 1);
              this.getGrandTotal(this.invoicesEntries);
            }
          });
      } else {
        this.invoicesEntries.splice(index, 1);
        this.getGrandTotal(this.invoicesEntries);
      }
    }
    this.cdr.detectChanges();
  }

  onTaxChange(event, index) {
    if (!event.checked) {
      this.invoicesEntries[index].tax = 0;
      this.getAmount(this.invoicesEntries[index], index);
    }
  }
  onDiscountChange(event, index) {
    if (!event.checked) {
      this.invoicesEntries[index].discount = 0;
      this.getAmount(this.invoicesEntries[index], index);
    }
  }
  onDeleteAttachment(rowData) {
    this.deleteAttachmentRowData = rowData;
    this.confirmType = "attachment";
  }
  confirmOnDeleteAttachment(rowData) {
    this.invoiceService
      .deleteInvoiceAttachment(rowData.invoiceAttachmentDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getInvoiceAttacment(rowData.invoiceDetailsId);
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
  unSavedConfirm(type: boolean) {
    this.userAction.nevigateRouter.next(type);
    if (!type) {
      this.unSavedModel = "none";
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
  onInputKeyUp(event, invoice, i) {
    this.getAmount(invoice, i);
  }
  emailChoosen(event) {
    let email: any;
    this.isCustomEmail = false;
    if (event && event.approverEmail) {
      if (event.approverEmail == "Provide Approver Email") {
        this.isCustomEmail = true;
        this.showCustomEmail();
      } else {
        email = this.selectedApproverEmailList.filter((res) => {
          return res == event.approverEmail;
        });
        if (!email.length) {
          this.selectedApproverEmailList.push(event.approverEmail);
        }
      }
    }
  }
  showCustomEmail() {
    this.customEmailModel = "block";
    this.hiddenScroll();
  }
  saveCustomEmail(form?: NgForm) {
    let email;
    email = this.selectedApproverEmailList.filter((res) => {
      return res == this.customEmail;
    });
    if (!email.length) {
      this.selectedApproverEmailList.push(this.customEmail);
      this.customEmailModel = "none";
      this.customEmail = "";
      if (form) {
        form.reset();
      }
      this.displayScroll();
    } else {
      this.sharedService.add({
        severity: "error",
        summary: "Error",
        detail: "This email already inserted",
      });
    }
  }
  removeChosenEmailId(index) {
    this.selectedApproverEmailList.splice(index, 1);
  }
}
