import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-inner-sub-banner",
  templateUrl: "./inner-sub-banner.component.html",
  styleUrls: ["./inner-sub-banner.component.css"],
})
export class InnerSubBannerComponent implements OnInit {
  @Input() bannerDetails: any;
  constructor() {}

  ngOnInit(): void {}
}
