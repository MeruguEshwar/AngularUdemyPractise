import { Component, OnInit } from "@angular/core";
import { AuthService } from "@app/core/service/auth.service";
import { SharedService } from "@app/shared/shared.service";
import { MyProfileService } from "../myprofile.service";

@Component({
  selector: "app-digital-signature",
  templateUrl: "./digital-signature.component.html",
  styleUrls: ["./digital-signature.component.css"],
})
export class DigitalSignatureComponent implements OnInit {
  fullName: string = "";
  initials: string = "";
  preview: string;
  isPreview: boolean = false;
  signatureStyle: string = "AAutoSignature";
  selectedStyle: any;
  userId: number;
  changeStylesList: any = [
    { label: "Style 1", value: "AAutoSignature" },
    { label: "Style 2", value: "AlfridaDemoSignature" },
    { label: "Style 3", value: "AllisonScript" },
    { label: "Style 4", value: "ArtySignature" },
    { label: "Style 5", value: "AsemKandisPERSONALUSE" },
    { label: "Style 6", value: "AuroRumpthut" },
    { label: "Style 7", value: "BeautyAndelliademo" },
    { label: "Style 8", value: "Brigham" },
    { label: "Style 9", value: "Cherolina" },
    { label: "Style 10", value: "ConcettaKalvaniSignature" },
    { label: "Style 11", value: "CreattionDemo" },
    { label: "Style 12", value: "DemoBalnes" },
    { label: "Style 13", value: "genitdemo" },
    { label: "Style 14", value: "Historia" },
    { label: "Style 15", value: "Holimount" },
    { label: "Style 16", value: "HoneymoonAvenueScriptDemo" },
    { label: "Style 17", value: "Jasmine" },
    { label: "Style 18", value: "LovtonyScript" },
    { label: "Style 19", value: "RaimondFREE" },
    { label: "Style 20", value: "Rhesmanisa" },
    { label: "Style 21", value: "TheSuavity" },
  ];
  constructor(
    private authService: AuthService,
    private profileService: MyProfileService,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.currentUser.employeeDetailsId;
    this.getSignature(this.userId);
  }

  saveSignature() {
    this.profileService
      .saveDigitalSignature(
        this.fullName,
        this.signatureStyle,
        this.userId,
        this.initials
      )
      .subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            this.getSignature(this.userId);
          } else {
            console.log(res.message);
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
  digitalSignature: any;
  getSignature(employeeDetailsId) {
    this.profileService.getDigitalSignature(employeeDetailsId).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.digitalSignature = res.responsePayload;
          this.fullName = res.responsePayload.signature;
          this.signatureStyle = res.responsePayload.signatureFont;
          this.initials = res.responsePayload.initials;
          this.isPreview = true;
          const font = this.changeStylesList.filter((res) => {
            if (res.value == this.signatureStyle) {
              return res;
            }
          });
          this.selectedStyle = font[0];
        } else {
          this.digitalSignature = "";
          this.fullName = "";
          this.signatureStyle = "";
          this.initials = "";
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
  selectStyle(event) {
    this.signatureStyle = event.value;
  }
  onEdit() {
    this.isPreview = false;
  }
  cancel() {
    this.isPreview = true;
  }
}
