import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SharedService } from "@app/shared/shared.service";
import { SignatureValidationServices } from "../signature-validation-services.service";

@Component({
  selector: "app-signature-validation",
  templateUrl: "./signature-validation.component.html",
  styleUrls: ["./signature-validation.component.css"],
})
export class SignatureValidationComponent implements OnInit {
  token: any;
  signature: string = "Syed Ifthequer";
  signatureStyle: string = "AAutoSignature";
  cols = [
    { field: "entryDate", header: "Date" },
    { field: "entryType", header: "Entry Type" },
    { field: "loggedTime", header: "Logged Time" },
    { field: "description", header: "Description" },
  ];
  clientErrorMsg: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private signatureValidationService: SignatureValidationServices,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.token = params["token"];
    });
    // this.authAuthCode(this.token);
  }
  submitStatus() {
    this.signatureValidationService
      .validateSignature(this.token)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.router.navigate(["/"]);
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      });
  }
}
