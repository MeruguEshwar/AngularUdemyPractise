import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "@app/core/service/auth.service";
import { BankAcountDetails } from "@app/shared/models/profile.model";
import { SharedService } from "@app/shared/shared.service";
import { MyProfileService } from "../myprofile.service";
import * as country_details from "@assets/country_details.json";

@Component({
  selector: "app-profile-bank-statutory",
  templateUrl: "./profile-bank-statutory.component.html",
  styleUrls: ["./profile-bank-statutory.component.css"],
})
export class ProfileBankStatutoryComponent implements OnInit {
  loading: boolean = false;

  @Input() userId: number = -1;
  bankAcountDetails: BankAcountDetails;
  bankAcountDetailsList: BankAcountDetails[];
  countryDetails = country_details.rows;
  selectedCountryDetails: any;
  cols = [
    { field: "bankName", header: "Bank Name" },
    { field: "accountName", header: "Account Name" },
    { field: "accountNumber", header: "Acount Number" },
    { field: "routingNumber", header: "Routing Number" },
    { field: "ifscCode", header: "IFSC Code" },
    { field: "otherDetails", header: "Other Details" },
  ];
  constructor(
    private authService: AuthService,
    public sharedService: SharedService,
    private profileService: MyProfileService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.bankAcountDetails = new BankAcountDetails();
    if (this.userId == -1) {
      this.userId = this.authService.currentUser.employeeDetailsId;
    }
    this.getBankAccountDetails(this.userId);
    this.defaultCountry(233);
  }
  save(form: NgForm) {
    this.bankAcountDetails.employeeDetailsId = this.userId;
    this.profileService
      .saveBankAccountDetails(this.bankAcountDetails)
      .subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.bankAcountDetailsList =
              res.responsePayload as BankAcountDetails[];
            form.reset();
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            this.bankAcountDetails = new BankAcountDetails();
            this.defaultCountry(233);
          } else {
            this.bankAcountDetailsList = [];
          }
        },
        (error) => {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: error,
          });
        }
      );
  }
  getBankAccountDetails(employeeDetailsId) {
    this.profileService.getBankAccountDetails(employeeDetailsId).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.bankAcountDetailsList =
            res.responsePayload as BankAcountDetails[];
        } else {
          this.bankAcountDetailsList = [];
        }
      },
      (error) => {
        this.sharedService.add({
          severity: "error",
          summary: "Error",
          detail: error,
        });
      }
    );
  }
  defaultCountry(country_details_id) {
    this.bankAcountDetails.country = country_details_id;
    let country = this.countryDetails.filter((element) => {
      return element.country_details_id == country_details_id;
    });
    this.selectedCountryDetails = country[0];
    this.cdr.detectChanges();
  }
  editBankAcount(rowData) {
    this.bankAcountDetails = rowData;
    this.bankAcountDetails.confirmAccountNumber =
      this.bankAcountDetails.accountNumber;
    if (rowData.ifscCode) {
      this.bankAcountDetails.country = 101;
      let country = this.countryDetails.filter((element) => {
        return element.country_details_id == 101;
      });
      this.selectedCountryDetails = country[0];
    } else if (rowData.routingNumber) {
      this.bankAcountDetails.country = 233;
      let country = this.countryDetails.filter((element) => {
        return element.country_details_id == 233;
      });
      this.selectedCountryDetails = country[0];
    } else {
      this.selectedCountryDetails = null;
    }
  }
  selectCountry(event) {
    this.bankAcountDetails.country = event.country_details_id;
    console.log(this.bankAcountDetails.country);
    this.cdr.detectChanges();
    if (event.country_details_id == 101) {
      this.bankAcountDetails.routingNumber = "";
    } else if (event.country_details_id == 233) {
      this.bankAcountDetails.ifscCode = "";
    } else {
      this.bankAcountDetails.ifscCode = "";
      this.bankAcountDetails.routingNumber = "";
    }
  }
  confirmAccountNumberValidation() {
    if (
      this.bankAcountDetails.accountNumber &&
      this.bankAcountDetails.confirmAccountNumber
    ) {
      if (
        this.bankAcountDetails.accountNumber !=
        this.bankAcountDetails.confirmAccountNumber
      ) {
        this.sharedService.add({
          severity: "error",
          summary: "Error",
          detail: "Account Number and confirm Account Number not matched",
        });
      }
    }
  }
}
