import { Injectable, NgZone } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { MessageService, Message } from "@app/components/public_api";
import { User } from "./models/user.model";
import { ApiResponse } from "./models/api-response.model";
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class SharedService {
  constructor(
    private messageService: MessageService,
    private ngZone: NgZone,
    private http: HttpClient
  ) {}
  userRole: string;
  public loaderCounter: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  add(message: Message) {
    this.messageService.add(message);
  }
  clear() {
    this.messageService.clear();
  }

  displayLoader(value: boolean) {
    this.loaderCounter.next(value);
  }
  openToggleMenu(menuId) {
    try {
      let bodyElement = document.getElementById(menuId);
      bodyElement.classList.add("show");
    } catch (error) {}
  }
  keyPressCustomValidator(event, regx) {
    const pattern = new RegExp(regx);
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  keyPressEIN(event) {
    const pattern = new RegExp("[0-9-]");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  keyPressEmail(event) {
    const pattern = new RegExp("[a-z0-9._!@#$%&*-]");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  keyPressWebsite(event) {
    const pattern = new RegExp("[a-zA-Z0-9=.%_:/#?-]");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  keyPressAddress(event) {
    const pattern = new RegExp("[a-zA-Z0-9 ,./-]");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  keyPressProject_SupplierName(event) {
    const pattern = new RegExp("[a-zA-Z0-9 _,./()-]");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  keyPressPassword(event) {
    const pattern = new RegExp("[a-zA-Z0-9._!@#$%&*-]");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  keyPressAlphabet(event) {
    const pattern = new RegExp("[A-Za-z ]");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  keyPressNumber(event) {
    const pattern = new RegExp("[0-9]");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  keyPressAlphaNumaric(event) {
    const pattern = new RegExp("[A-Za-z0-9 ]");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  keyPressAlphaNumericWithSpecialChar(event) {
    const pattern = new RegExp("[A-Za-z0-9 ,.]");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  getUserViewType() {
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser")) as User;
    let userView = sessionStorage.getItem("switchedView");
    if (currentUser != null && currentUser != new User()) {
      let isTrueSet = userView === "true";
      return isTrueSet;
    }
    return false;
  }
  getAdminMenuType() {
    let currentUser = JSON.parse(
      sessionStorage.getItem("switchedView")
    ) as User;
    let menuType = sessionStorage.getItem("AdminMenuType");
    if (currentUser != null && currentUser != new User()) {
      return +menuType;
    }
    return 0;
  }
  setUserViewType(viewType) {
    sessionStorage.setItem("switchedView", JSON.stringify(viewType));
  }
  setAdminMenuType(menuType) {
    sessionStorage.setItem("AdminMenuType", JSON.stringify(menuType));
  }
  getUnreadRequestsCount(isAdminView: boolean) {
    return this.http.get<ApiResponse<any>>(
      `/api/employee/request/unread/count?isAdminView=${isAdminView}`
    );
  }
}
