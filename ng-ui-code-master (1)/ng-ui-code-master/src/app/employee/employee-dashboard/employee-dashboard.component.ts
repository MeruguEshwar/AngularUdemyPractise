import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyProfileService } from '@app/core/myprofile/myprofile.service';
import { AuthService } from '@app/core/service/auth.service';
import { Gender } from '@app/shared/enums/gender.enum';
import { MaritalStatus } from '@app/shared/enums/maritalstatus.enum';
import { Profile } from '@app/shared/models/profile.model';
import { User } from '@app/shared/models/user.model';
import { SharedService } from '@app/shared/shared.service';

import { environment } from '@env/environment';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css'],
})
export class EmployeeDashboardComponent implements OnInit {
  profile: Profile;
  user: User;
  clientErrorMsg: any;
  errorLabel: string = '';
  public profileinfo: string = 'none';
  pictureUrl: string = environment.pictureUrl;
  get Gender() {
    return Gender;
  }
  get MaritalStatus() {
    return MaritalStatus;
  }
  activeTabIndex: number = 0;
  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private profileService: MyProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;
    this.getProfile(this.user.employeeDetailsId);
    console.log(this.user.role);
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
      severity: 'error',
      summary: 'Error',
      detail: error,
    });
  }
  hiddenScroll() {
    try {
      let bodyElement = document.getElementById('modalbody') as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.add('modal-open');
      }
    } catch (ex) {
      this.clientErrorMsg(ex, 'hiddenScroll');
    }
  }
  displayScroll() {
    try {
      let bodyElement = document.getElementById('modalbody') as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.remove('modal-open');
      }
    } catch (ex) {
      this.clientErrorMsg(ex, 'displayScroll');
    }
  }
  closeAddmodal() {
    this.errorLabel = '';
    this.profileinfo = 'none';
    this.displayScroll();
  }

  getImmigrationStatus(statusCode) {
    switch (statusCode) {
      case '0':
        return 'Not Valid';
      case '1':
        return 'Valid';
      default:
        return 'Save Immigration Details';
    }
  }

  navigateToMyProfile() {
    this.router.navigate([this.user.role + '/myprofile']);
  }
}
