import { Component, Input, OnInit } from "@angular/core";
import { SignatureDetailsModel } from "@app/shared/models/signature-module.model";
import { W4 } from "@app/shared/models/w4-module.model";
import { SharedService } from "@app/shared/shared.service";

@Component({
  selector: "app-w4-view",
  templateUrl: "./w4-view.component.html",
  styleUrls: ["./w4-view.component.css"],
})
export class W4ViewComponent implements OnInit {
  @Input() webW4Details: W4;
  @Input() signatureDetails: SignatureDetailsModel;
  @Input() digitalSignature: any;

  constructor(public sharedService: SharedService) {}

  ngOnInit(): void {}
}
