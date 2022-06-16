import { Component, Input, OnInit } from "@angular/core";
import { I9 } from "@app/shared/models/i9-module.model";
import { SignatureDetailsModel } from "@app/shared/models/signature-module.model";

@Component({
  selector: "app-view-i9",
  templateUrl: "./view-i9.component.html",
  styleUrls: ["./view-i9.component.css"],
})
export class ViewI9Component implements OnInit {
  @Input() webI9Details: I9;
  @Input() signatureDetails: SignatureDetailsModel;
  @Input() digitalSignature: any;
  constructor() {}

  ngOnInit(): void {}
}
