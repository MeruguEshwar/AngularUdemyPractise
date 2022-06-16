import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Gender } from "@app/shared/enums/gender.enum";
import { MaritalStatus } from "@app/shared/enums/maritalstatus.enum";
import { Profile } from "@app/shared/models/profile.model";
import { SharedService } from "@app/shared/shared.service";
import { MyProfileService } from "../myprofile.service";
import { environment } from "@env/environment";
import { SocialNetwork } from "@app/shared/enums/socialNetwork.enum";
import { DomSanitizer } from "@angular/platform-browser";
import { EmployeementType } from "@app/shared/enums/employeementType";

@Component({
  selector: "app-profile-profile-details",
  templateUrl: "./profile-profile-details.component.html",
  styleUrls: ["./profile-profile-details.component.css"],
})
export class ProfileProfileDetailsComponent implements OnInit {
  @Input() profile: Profile;
  clientErrorMsg: any;
  errorLabel: string = "";
  public profileinfo: string = "none";
  pictureUrl: string = environment.pictureUrl;
  @Output() profileUpdated: EventEmitter<any> = new EventEmitter();
  get Gender() {
    return Gender;
  }
  get MaritalStatus() {
    return MaritalStatus;
  }
  get EmployeeType() {
    return EmployeementType;
  }
  activeTabIndex: number = 0;
  constructor(
    private sharedService: SharedService,
    private profileService: MyProfileService,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    console.log(this.profile);
  }
  editprofile(type?) {
    this.profileinfo = "block";
    this.activeTabIndex = 0;
    this.hiddenScroll();
  }
  editSocialNetwork() {
    this.profileinfo = "block";
    this.activeTabIndex = 6;
    this.hiddenScroll();
  }

  updateProfile() {
    // this.getProfile(this.profile.employeeDetailsId)
    this.profileUpdated.emit();
  }
  getProfile(employeeDetailsId) {
    this.profileService.getProfile(employeeDetailsId).subscribe((res) => {
      if (res.statusCode == 200) {
        this.profile = res.responsePayload;
        return;
      }
    });
  }
  errorMessage(error) {
    this.sharedService.add({
      severity: "error",
      summary: "Error",
      detail: error,
    });
  }
  hiddenScroll() {
    try {
      let bodyElement = document.getElementById("modalbody") as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.add("modal-open");
      }
    } catch (ex) {
      this.clientErrorMsg(ex, "hiddenScroll");
    }
  }
  displayScroll() {
    try {
      let bodyElement = document.getElementById("modalbody") as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.remove("modal-open");
      }
    } catch (ex) {
      this.clientErrorMsg(ex, "displayScroll");
    }
  }
  closeAddmodal() {
    this.errorLabel = "";
    this.profileinfo = "none";
    this.displayScroll();
  }
  getSocialNetworkIcon(module) {
    switch (module.toUpperCase()) {
      case SocialNetwork.FACEBOOK.toUpperCase():
        return "fa fa-facebook-square";
      case SocialNetwork.INSTAGRAM.toUpperCase():
        return "fa fa-instagram";
      case SocialNetwork.LINKEDIN.toUpperCase():
        return "fa fa-linkedin-square";
      case SocialNetwork.TWITTER.toUpperCase():
        return "fa fa-twitter-square";
    }
  }
  getEmploymentType(type) {
    switch (+type) {
      case 1:
        return "Fulltime";
        break;
      case 2:
        return "Parttime";
        break;
      default:
        break;
    }
  }
}
