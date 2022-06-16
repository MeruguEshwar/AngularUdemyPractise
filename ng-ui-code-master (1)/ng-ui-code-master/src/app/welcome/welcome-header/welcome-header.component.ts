import { Component, HostListener, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-welcome-header",
  templateUrl: "./welcome-header.component.html",
  styleUrls: ["./welcome-header.component.css"],
})
export class WelcomeHeaderComponent implements OnInit {
  getLoginDisplay: string = "none";
  actionType: string;
  @Input() fixedTop: boolean = false;
  constructor() {}

  ngOnInit(): void {}
  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (
      document.body.scrollTop > 50 ||
      document.documentElement.scrollTop > 50
    ) {
      document.getElementById("welcom-header").classList.add("header-bg-gray");
      document
        .getElementById("welcom-header")
        .classList.remove("header-bg-blue");
      document.getElementById("welcom-header").classList.remove("starting");
    } else {
      document.getElementById("welcom-header").classList.add("header-bg-blue");
      document
        .getElementById("welcom-header")
        .classList.remove("header-bg-gray");
      document.getElementById("welcom-header").classList.remove("starting");
    }
  }
  onLoginClick(type) {
    // this.router.navigate(["login"]);
    this.actionType = type;
    this.getLoginDisplay = "block";
    this.hiddenScroll();
  }
  onClose(event) {
    this.closeAddmodal();
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
}
