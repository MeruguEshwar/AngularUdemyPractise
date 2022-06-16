import { Component, OnInit } from "@angular/core";
import { AuthService } from "@app/core/service/auth.service";
import { Location } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.css"],
})
export class WelcomeComponent implements OnInit {
  getLoginDisplay: string = "none";
  previousUrl: string;
  constructor(
    private authService: AuthService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      //this.location.back();
      this.router.navigate(["/employee"]);
    }
  }
  actionType: string;
  onLoginClick(type) {
    // this.router.navigate(["login"]);
    this.actionType = type;
    this.getLoginDisplay = "block";
    this.hiddenScroll();
  }
  closeAddmodal() {
    this.getLoginDisplay = "none";
    this.displayScroll();
  }
  hiddenScroll() {
    try {
      let bodyElement = document.getElementById("modalbody") as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.add("modal-open");
      }
    } catch (ex) {}
  }
  displayScroll() {
    try {
      let bodyElement = document.getElementById("modalbody") as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.remove("modal-open");
      }
    } catch (ex) {}
  }

  onClose(event) {
    this.closeAddmodal();
  }
}
