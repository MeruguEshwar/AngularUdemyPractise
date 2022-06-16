import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { Gender } from "@app/shared/enums/gender.enum";
import { MaritalStatus } from "@app/shared/enums/maritalstatus.enum";
import {
  Profile,
  Experience,
  Education,
  ImmigrationDetails,
} from "@app/shared/models/profile.model";
import { MyProfileService } from "../myprofile.service";
import { SharedService } from "@app/shared/shared.service";
import { environment } from "@env/environment";

@Component({
  selector: "app-profile-profile",
  templateUrl: "./profile-profile.component.html",
  styleUrls: ["./profile-profile.component.css"],
})
export class ProfileProfileComponent implements OnInit {
  @ViewChild("minimumDate") minimumDate: ElementRef<HTMLInputElement>;
  pictureUrl: string = environment.pictureUrl;
  saveProfile: Profile;
  public profileinfo: string = "none";
  educationInfo: string = "none";
  experienceInfo: string = "none";
  immigrationInfo: string = "none";
  errorLabel: string = "";
  clientErrorMsg: any;
  maritalStatuses: any[] = [];
  genders: any[] = [];
  @Input() userId: any;
  @Input() profile: Profile;
  @Input() user: any;
  @Input() state: any;

  activeTabIndex: number = 0;

  get Gender() {
    return Gender;
  }
  get MaritalStatus() {
    return MaritalStatus;
  }
  emergContactCols = [
    { field: "name", header: "Name" },
    { field: "relationship", header: "Relationship" },
    { field: "phoneNumber", header: "Phone Number" },
  ];
  empDependtCols = [
    { field: "name", header: "Name" },
    { field: "relationship", header: "Relationship" },
    { field: "dateOfBirth", header: "Date Of Birth" },
  ];
  @Output() profileUpdated: EventEmitter<any> = new EventEmitter();
  constructor(
    private profileService: MyProfileService,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    if (!this.profile.educations) {
      this.profile.educations = [];
      let education = Object.assign({}, new Education());
      education.employeeDetailsId = this.userId;
      education.status = 1;
      this.profile.educations.push(education);
    }
    if (!this.profile.experiences) {
      this.profile.experiences = [];
      let experience = Object.assign({}, new Experience());
      experience.employeeDetailsId = this.userId;
      experience.status = 1;
      this.profile.experiences.push(experience);
    }
    this.saveProfile = Object.assign({}, { ...this.profile });
  }
  updateProfile() {
    // this.getProfile(this.profile.employeeDetailsId)
    this.profileUpdated.emit();
  }
  immigrationUpdated(event) {
    this.profileUpdated.emit();
    this.immigrationInfo = "none";
    this.displayScroll();
  }
  getProfile(employeeDetailsId) {
    this.profileService.getProfile(employeeDetailsId).subscribe((res) => {
      if (res.statusCode == 200) {
        this.profile = res.responsePayload;
        // this.saveProfile = res.responsePayload;
        if (!this.profile.educations) {
          this.profile.educations = [];
          let education = Object.assign({}, new Education());
          education.employeeDetailsId = this.userId;
          education.status = 1;
          this.profile.educations.push(education);
        }
        if (!this.profile.experiences) {
          this.profile.experiences = [];
          let experience = Object.assign({}, new Experience());
          experience.employeeDetailsId = this.userId;
          experience.status = 1;
          this.profile.experiences.push(experience);
        }
        this.saveProfile = Object.assign({}, { ...this.profile });
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

  editprofile(type?) {
    this.profileinfo = "block";
    if (type == "emergencyContact") {
      this.activeTabIndex = 1;
    } else if (type == "personalInfo") {
      this.activeTabIndex = 2;
    } else if (type == "dependentInfo") {
      this.activeTabIndex = 4;
    } else if (type == "emergencyContactsInfo") {
      this.activeTabIndex = 5;
    }
    this.saveProfile = Object.assign({}, { ...this.profile });
    this.hiddenScroll();
  }
  experienceClick() {
    this.experienceInfo = "block";
    this.hiddenScroll();
  }
  educationInfoClick() {
    this.educationInfo = "block";
    this.saveProfile = Object.assign({}, { ...this.profile });
    this.hiddenScroll();
  }
  immigrationStatusClick() {
    this.immigrationInfo = "block";
    this.hiddenScroll();
  }
  onEducationSubmit() {
    this.errorLabel = "";
    this.profileService.saveEducations(this.profile.educations).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.closeAddmodal();
        } else {
          this.errorLabel = res.message;
        }
      },
      (error) => {
        this.errorLabel = error;
      }
    );
  }
  onExperienceSubmit() {
    this.errorLabel = "";
    this.profileService.saveExperiences(this.profile.experiences).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.closeAddmodal();
        } else {
          this.errorLabel = res.message;
        }
      },
      (error) => {
        this.errorLabel = error;
      }
    );
  }

  onAddMoreEducation() {
    let education = Object.assign({}, new Education());
    education.employeeDetailsId = this.userId;
    education.status = 1;
    this.profile.educations.push(education);
  }
  onAddMoreExperience() {
    let experience = Object.assign({}, new Experience());
    experience.employeeDetailsId = this.userId;
    experience.status = 1;
    this.profile.experiences.push(experience);
  }

  onRemoveExperience(experience: Experience) {
    if (this.profile.experiences.length > 1) {
      let index = this.profile.experiences.indexOf(experience);
      this.profile.experiences.splice(index, 1);
    }
  }
  onRemoveEducation(education: Education) {
    if (this.profile.educations.length > 1) {
      let index = this.profile.educations.indexOf(education);
      this.profile.educations.splice(index, 1);
    }
  }
  saveEducations(educations: Education[]) {
    // this.profileService
    //   .saveEducations(this.profile.educations)
    //   .subscribe((res) => {
    //     if (res.message == "Educations") {
    //       this.profile = res.responsePayload;
    //     } else if (
    //       res.message ==
    //       `Profile Details not found for the employeeDetailsId :${this.user.employeeDetailsId}`
    //     ) {
    //     }
    //   });
  }
  saveExperiences(experiences: Experience[]) {
    // this.profileService
    //   .saveExperiences(this.profile.experiences)
    //   .subscribe((res) => {
    //     if (res.message == "Experiences saved successfully") {
    //       this.profile = res.responsePayload;
    //     } else if (
    //       res.message ==
    //       `Profile Details not found for the employeeDetailsId :${this.user.employeeDetailsId}`
    //     ) {
    //     }
    //   });
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
    this.profileinfo = "none";
    this.educationInfo = "none";
    this.experienceInfo = "none";
    this.immigrationInfo = "none";
    this.errorLabel = "";
    this.displayScroll();
    this.getProfile(this.profile.employeeDetailsId);
  }

  getImmigrationStatus(statusCode) {
    switch (statusCode) {
      case "0":
        return "Not Valid";
      case "1":
        return "Valid";
      default:
        return "Save Immigration Details";
    }
  }
}
