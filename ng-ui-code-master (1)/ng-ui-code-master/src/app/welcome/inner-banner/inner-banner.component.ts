import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-inner-banner",
  templateUrl: "./inner-banner.component.html",
  styleUrls: ["./inner-banner.component.css"],
})
export class InnerBannerComponent implements OnInit {
  @Input() bannerDetails: any;
  getLoginDisplay: string = "none";
  actionType: string;
  constructor() {}

  ngOnInit(): void {}
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
