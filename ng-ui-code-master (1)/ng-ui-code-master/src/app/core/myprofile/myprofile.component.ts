import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from "@angular/core";
import { SharedService } from "@app/shared/shared.service";
import { MyProfileService } from "./myprofile.service";
import { User } from "@app/shared/models/user.model";
import { AuthService } from "../service/auth.service";
import {
  Profile,
  Experience,
  Education,
} from "@app/shared/models/profile.model";
import { ActivatedRoute, Router } from "@angular/router";
import { Department } from "@app/shared/models/department.model";
import { Designation } from "@app/shared/models/designation.model";
import { Gender } from "@app/shared/enums/gender.enum";
import { MaritalStatus } from "@app/shared/enums/maritalstatus.enum";
import { projectAssignment } from "@app/shared/models/project-assignment.model";
import { FormControl } from "@angular/forms";
import { HttpResponse } from "@angular/common/http";
@Component({
  selector: "app-myprofile",
  templateUrl: "./myprofile.component.html",
  styleUrls: ["./myprofile.component.css"],
})
export class MyprofileComponent implements OnInit {
  toggleType: string;
  userId = null;
  user: User;
  profile: Profile;
  state: any;
  accessType: boolean = false;
  constructor(
    private sharedService: SharedService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private profileService: MyProfileService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.user = this.authService.currentUser;
    this.profile = new Profile();
  }

  ngOnInit(): void {
    this.sharedService.userRole = "admin";
    this.toggleType = "profile";
    this.activatedRoute.queryParams.subscribe((params) => {
      this.state = window.history.state;
      if (this.state && this.state.userDetailsId) {
        this.userId = this.state.userDetailsId;
        this.accessType = true;
      } else {
        this.userId = this.user.employeeDetailsId;
        this.router.navigate([
          `/${this.authService.currentUser.role}/myprofile`,
        ]);
      }
      this.getProfile(this.userId);
    });
  }

  getProfile(employeeDetailsId) {
    this.profileService.getProfile(employeeDetailsId).subscribe((res) => {
      if (res.statusCode == 200) {
        this.profile = res.responsePayload;
        return;
      }
    });
  }
  profileUpdated() {
    this.getProfile(this.userId);
    this.cdr.detectChanges();
  }

  onProfileToggle() {
    this.toggleType = "profile";
  }
  onProjectToggle() {
    this.toggleType = "projects";
  }
  onDocumentToggle() {
    this.toggleType = "documents";
  }
  onProjectDocumentToggle() {
    this.toggleType = "project_document";
  }
  onSupplierDocumentToggle() {
    this.toggleType = "supplier_document";
  }
  onI9Toggle() {
    this.toggleType = "i9";
  }
  onW4Toggle() {
    this.toggleType = "w4";
  }
  onPaystubToggle() {
    this.toggleType = "paystub";
  }
  onTimesheetToggle() {
    this.toggleType = "timesheets";
  }
  onNotesToggle() {
    this.toggleType = "notes";
  }
  onBankAccountToggle() {
    this.toggleType = "bank_statutory";
  }
  onDigitalSignatureToggle() {
    this.toggleType = "digital_signature";
  }
}
