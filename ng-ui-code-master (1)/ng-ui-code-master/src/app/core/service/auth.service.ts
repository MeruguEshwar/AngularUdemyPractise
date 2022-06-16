import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {
  LoggedInEmployeeAccounts,
  User,
  UserHasMultipleAccounts,
} from "@app/shared/models/user.model";
import { HttpClient } from "@angular/common/http";
import { ApiResponse } from "@app/shared/models/api-response.model";
import { SharedService } from "@app/shared/shared.service";
import * as country_details from "@assets/country_details.json";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService
  ) {}
  isLoggedIn = false;
  currentUser: User;
  userHasMultipleAccounts: UserHasMultipleAccounts;
  // store the URL so we can redirect after logging in
  redirectUrl: string;
  countryDetails = country_details.rows;
  orgnizationCurrency: string;

  login(user: User) {
    console.log(this.userHasMultipleAccounts);
    sessionStorage.setItem("currentUser", JSON.stringify(user));
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("switchedView", "false");
    sessionStorage.setItem(
      "initalLoggedInEmpId",
      user.employeeDetailsId.toString()
    );
    sessionStorage.setItem(
      "userHasMultipleAccounts",
      JSON.stringify({
        hasMultipleAccounts: user.hasMultipleAccounts,
        employeeAccounts: user.employeeAccounts,
      })
    );
    this.isLoggedIn = true;
    this.getOrganizationCurrency(user);
  }
  switchLogin(user: User) {
    sessionStorage.setItem("currentUser", JSON.stringify(user));
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("switchedView", "false");
    this.getOrganizationCurrency(user);
  }
  getOrganizationCurrency(user: User) {
    let orgnizationCurrencyDetails: any;
    if (user && user.organizationCountryDetailsId) {
      let country: any = this.countryDetails.filter((element) => {
        return (
          //element.currency == res.responsePayload.currency
          element.country_details_id == user.organizationCountryDetailsId
        );
      });
      orgnizationCurrencyDetails = country[0];
      if (
        orgnizationCurrencyDetails &&
        orgnizationCurrencyDetails.currency_icon
      ) {
        sessionStorage.setItem(
          "orgnizationCurrency",
          orgnizationCurrencyDetails.currency_icon
        );
        this.orgnizationCurrency = orgnizationCurrencyDetails.currency_icon;
      } else {
        sessionStorage.setItem(
          "orgnizationCurrency",
          orgnizationCurrencyDetails.currency
        );
        this.orgnizationCurrency = orgnizationCurrencyDetails.currency;
      }
    } else {
      sessionStorage.setItem("orgnizationCurrency", "$");
      this.orgnizationCurrency = "$";
    }
  }
  isUserLoggedIn() {
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser")) as User;
    let orgnizationCurrency = sessionStorage.getItem("orgnizationCurrency");
    let userHasMultipleAccounts = JSON.parse(
      sessionStorage.getItem("userHasMultipleAccounts")
    ) as UserHasMultipleAccounts;
    if (currentUser != null && currentUser != new User()) {
      this.currentUser = currentUser;
      this.isLoggedIn = true;
      this.orgnizationCurrency = orgnizationCurrency;
      this.userHasMultipleAccounts = userHasMultipleAccounts;
      return true;
    }
    return false;
  }

  logout(): void {
    this.http
      .post<ApiResponse<User>>("api/employee/logout", {
        authCode: this.currentUser.authCode,
        employeeDetailsId: sessionStorage.getItem("initalLoggedInEmpId"),
      })
      .subscribe((res) => {
        if (res.message == "Logout Successful") {
          this.clearSessionStorage();
          sessionStorage.removeItem("userHasMultipleAccounts");
          sessionStorage.removeItem("initalLoggedInEmpId");
          //this.sharedService.setUserViewType(false);
          //this.sharedService.setAdminMenuType(0);
          this.isLoggedIn = false;
          this.currentUser = null;
          this.userHasMultipleAccounts = null;
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: "You have been logged out of the system.",
          });
          this.router.navigate(["/welcome"]);
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }
  clearSessionStorage() {
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("switchedView");
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("orgnizationCurrency");
    sessionStorage.removeItem("AdminMenuType");
  }
}
