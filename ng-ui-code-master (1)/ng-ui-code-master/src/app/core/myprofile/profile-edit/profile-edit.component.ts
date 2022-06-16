import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { SelectItem } from "@app/components/public_api";
import { AuthService } from "@app/core/service/auth.service";
import { EmployeementType } from "@app/shared/enums/employeementType";
import { Gender } from "@app/shared/enums/gender.enum";
import {
  Profile,
  PersonalDetails,
  CommunicationDetails,
  AuthorizationDetails,
  EmploymentDetails,
  EmergContactDetails,
  EmpDependentDetails,
  SocialNetwork,
} from "@app/shared/models/profile.model";
import { SharedService } from "@app/shared/shared.service";
import { element } from "protractor";
import { MyProfileService } from "../myprofile.service";

@Component({
  selector: "app-profile-edit",
  templateUrl: "./profile-edit.component.html",
  styleUrls: ["./profile-edit.component.css"],
})
export class ProfileEditComponent implements OnInit {
  birthMaxDate = new Date();
  @Input() activeTabIndex: number;
  @Input() profile: Profile;
  loading: boolean = false;
  saveProfile: Profile;
  reportingToUserNames: SelectItem[];
  departments: any[] = [];
  filterDepartments: any[] = [];
  filterDesignation: any[] = [];
  designations: any[] = [];
  user: any;
  reportingToEmployeeDetailsId: any;
  emergContactDetails: EmergContactDetails;
  empDependentDetails: EmpDependentDetails;
  confirmModel: string = "none";
  emergContactCols = [
    { field: "name", header: "Name" },
    { field: "relationship", header: "Relationship" },
    { field: "phoneNumber", header: "Phone Number" },
    { field: "email", header: "Email" },
  ];
  empDependtCols = [
    { field: "name", header: "Name" },
    { field: "relationship", header: "Relationship" },
    { field: "dateOfBirth", header: "Date Of Birth" },
    { field: "gender", header: "Gender" },
  ];
  @Output() errorMessage: EventEmitter<any> = new EventEmitter();
  @Output() updateProfile: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  get EmployeementType() {
    return EmployeementType;
  }
  get Gender() {
    return Gender;
  }
  constructor(
    private profileService: MyProfileService,
    public sharedService: SharedService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.user = authService.currentUser;
  }
  ngOnInit(): void {
    this.birthMaxDate.setDate(this.birthMaxDate.getDate() - 1);
    this.emergContactDetails = new EmergContactDetails();
    this.empDependentDetails = new EmpDependentDetails();
    this.saveProfile = Object.assign({}, this.profile);
    if (!+this.saveProfile.employeeType) {
      this.saveProfile.employeeType = null;
    }
    if (this.authService.currentUser.roleId != 6) {
      this.getAllDepartment();
      this.getAllDesignation();
      this.getReportToUsers();
    }
  }
  getProfile(userId) {
    this.profileService.getProfile(userId).subscribe((res) => {
      if (res.statusCode == 200) {
        this.profile = res.responsePayload;
      }
    });
  }
  getReportToUsers() {
    this.reportingToUserNames = [];
    this.profileService.getReportingToUsers().subscribe((res) => {
      if (res.responsePayload) {
        res.responsePayload.forEach((value) => {
          this.reportingToUserNames.push({
            label: value.fullName,
            value: value.employeeDetailsId,
          });
        });
        this.reportingToEmployeeDetailsId =
          this.saveProfile.reportingToEmployeeDetailsId;
      }
    });
  }
  designationDetailsId: any;
  getAllDesignation() {
    this.designations = [];
    this.profileService.getAllDesignations().subscribe((res) => {
      if (res.responsePayload) {
        res.responsePayload.forEach((value) => {
          this.designations.push({
            label: value.designation,
            value: value.designationDetailsId,
          });
        });
        this.designationDetailsId = this.saveProfile.designationDetailsId;
      }
    });
  }
  departmentDetailsId: any;
  getAllDepartment() {
    this.departments = [];
    this.profileService.getAllDepartments().subscribe((res) => {
      if (res.responsePayload) {
        res.responsePayload.forEach((value) => {
          // this.cdr.detectChanges();
          this.departments.push({
            label: value.department,
            value: value.departmentDetailsId,
          });
        });
        this.departmentDetailsId = this.saveProfile.departmentDetailsId;
      }
    });
  }
  setDesignation(designation: any, saveProfile) {
    let designationObj = [...designation];
    let selectedDesignation = designationObj.filter((element) => {
      if (element.value == saveProfile.designationDetailsId) {
        return element;
      }
    });
    return selectedDesignation[0];
  }
  setDepartment(department: any, saveProfile) {
    let departmentObj = [...department];
    let selectedDepartment = departmentObj.filter((element) => {
      if (element.value == saveProfile.departmentDetailsId) {
        return element;
      }
    });
    return selectedDepartment[0];
  }
  setRepoter(reportingToUserNames: any, saveProfile) {
    let reportingToUserNamesObj = [...reportingToUserNames];
    let selectedReportingToUserNames = reportingToUserNamesObj.filter(
      (element) => {
        if (element.value == saveProfile.reportingToEmployeeDetailsId) {
          return element;
        }
      }
    );
    return selectedReportingToUserNames[0];
  }
  handleChange(e) {
    this.activeTabIndex = e.index;
    // if (this.activeTabIndex == 3 && this.authService.currentUser.roleId != 6) {
    //   this.getAllDepartment();
    //   this.getAllDesignation();
    //   this.getReportToUsers();
    // }
  }
  departmentsList($event) {
    let query = $event.query;
    // let filtered : any[] = [];
    this.filterDepartments = [];
    for (let i = 0; i < this.departments.length; i++) {
      let country = this.departments[i];
      if (country.label.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        this.filterDepartments.push(country);
      }
    }
  }

  designationList($event) {
    let query = $event.query;
    // let filtered : any[] = [];
    this.filterDesignation = [];
    for (let i = 0; i < this.designations.length; i++) {
      let designation = this.designations[i];
      if (designation.label.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        this.filterDesignation.push(designation);
      }
    }
  }
  onProfileSubmit(form?: NgForm) {
    switch (this.activeTabIndex) {
      case 0:
        this.savePersonalDetails(this.saveProfile);
        break;
      case 1:
        this.saveCommunicationDetails(this.saveProfile);
        break;
      case 2:
        this.saveAuthorizationDetails(this.saveProfile);
        break;
      case 3:
        this.saveEmploymentDetails(this.saveProfile);
        break;
      case 4:
        this.saveEmployeeDependentDetails(this.saveProfile, form);
        break;
      case 5:
        this.saveContactDetails(this.saveProfile, form);
        break;
      case 6:
        this.saveSocialNetworkDetails(this.saveProfile);
        break;
    }
  }
  saveSocialNetworkDetails(saveProfile: Profile) {
    console.log(saveProfile);
    let socialNetworking = [];
    saveProfile.socialNetworks.forEach((element) => {
      let saveSocialNetworking = new SocialNetwork();
      console.log(element);
      if (element.socialNetworkLink) {
        saveSocialNetworking.employeeDetailsId = saveProfile.employeeDetailsId;
        saveSocialNetworking.socialNetworkLink = element.socialNetworkLink;
        saveSocialNetworking.socialNetworkDetailsId =
          element.socialNetworkDetailsId;
        saveSocialNetworking.socialNetwork = element.socialNetwork;
        saveSocialNetworking.status = "1";
        socialNetworking.push(saveSocialNetworking);
      }
    });
    this.profileService.saveSocialNetworking(socialNetworking).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.updateProfile.emit();
        } else {
          this.errorMessage.emit(res.message);
        }
      },
      (error) => {
        this.errorMessage.emit(error);
      }
    );
  }
  savePersonalDetails(saveProfile) {
    let personalDetails = new PersonalDetails();
    personalDetails.employeeDetailsId = saveProfile.employeeDetailsId;
    personalDetails.profileDetailsId = saveProfile.profileDetailsId;
    personalDetails.firstName = saveProfile.firstName;
    personalDetails.lastName = saveProfile.lastName;
    personalDetails.middleName = saveProfile.middleName;
    personalDetails.gender = saveProfile.gender;
    personalDetails.dateOfBirth = saveProfile.dateOfBirth;
    personalDetails.maritalStatus = saveProfile.maritalStatus;
    personalDetails.nationality = saveProfile.nationality;
    if (saveProfile.maritalStatus == 2) {
      personalDetails.dateOfMarriage = saveProfile.dateOfMarriage;
    }
    this.profileService.savePersonalDetails(personalDetails).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.saveProfile.profileDetailsId =
            res.responsePayload.profileDetailsId;
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.updateProfile.emit();
        } else {
          this.errorMessage.emit(res.message);
        }
      },
      (error) => {
        this.errorMessage.emit(error);
      }
    );
  }
  saveCommunicationDetails(saveProfile) {
    let communicationDetails = new CommunicationDetails();
    communicationDetails.profileDetailsId = saveProfile.profileDetailsId;
    communicationDetails.employeeDetailsId = saveProfile.employeeDetailsId;
    communicationDetails.address = saveProfile.address;
    communicationDetails.city = saveProfile.city;
    communicationDetails.state = saveProfile.state;
    communicationDetails.country = saveProfile.country;
    communicationDetails.pinCode = saveProfile.pinCode;
    communicationDetails.phoneNumber = saveProfile.phoneNumber;
    if (saveProfile.profileDetailsId) {
      this.profileService
        .saveCommunicationDetails(communicationDetails)
        .subscribe(
          (res) => {
            if (res.statusCode == 200) {
              this.sharedService.add({
                severity: "success",
                summary: "Success",
                detail: res.message,
              });
              this.updateProfile.emit();
            } else {
              this.errorMessage.emit(res.message);
            }
          },
          (error) => {
            this.errorMessage.emit(error);
          }
        );
    } else {
      this.sharedService.add({
        severity: "error",
        summary: "Error",
        detail: "Please save profile details first",
      });
      this.activeTabIndex = 0;
    }
  }
  saveAuthorizationDetails(saveProfile) {
    let authorizationDetails = new AuthorizationDetails();
    authorizationDetails.profileDetailsId = saveProfile.profileDetailsId;
    authorizationDetails.employeeDetailsId = saveProfile.employeeDetailsId;
    authorizationDetails.passportNo = saveProfile.passportNo;
    authorizationDetails.passportExpDate = saveProfile.passportExpDate;
    authorizationDetails.panNo = saveProfile.panNo;
    authorizationDetails.aadharNo = saveProfile.aadharNo;
    authorizationDetails.ssn = saveProfile.ssn;
    if (saveProfile.profileDetailsId) {
      if (
        (saveProfile.passportNo == null ||
          saveProfile.passportNo == undefined) &&
        (saveProfile.passportExpDate == null ||
          saveProfile.passportExpDate == undefined) &&
        (saveProfile.ssn == null || saveProfile.ssn == undefined)
      ) {
        this.sharedService.add({
          severity: "error",
          summary: "Error",
          detail: "Unable to process your request",
        });
      } else {
        this.profileService
          .saveAuthorizationDetails(authorizationDetails)
          .subscribe(
            (res) => {
              if (res.statusCode == 200) {
                this.sharedService.add({
                  severity: "success",
                  summary: "Success",
                  detail: res.message,
                });
                this.updateProfile.emit();
              } else {
                this.errorMessage.emit(res.message);
              }
            },
            (error) => {
              this.errorMessage.emit(error);
            }
          );
      }
    } else {
      this.sharedService.add({
        severity: "error",
        summary: "Error",
        detail: "Please save profile details first",
      });
      this.activeTabIndex = 0;
    }
  }
  saveContactDetails(saveProfile, form: NgForm) {
    this.emergContactDetails.employeeDetailsId = saveProfile.employeeDetailsId;
    if (saveProfile.profileDetailsId) {
      this.profileService
        .saveContactDetails(this.emergContactDetails)
        .subscribe(
          (res) => {
            if (res.statusCode == 200) {
              this.emergContactDetails = new EmergContactDetails();
              form.reset();
              this.saveProfile.emergencyContacts = res.responsePayload;
              this.sharedService.add({
                severity: "success",
                summary: "Success",
                detail: res.message,
              });
              this.updateProfile.emit();
            } else {
              this.errorMessage.emit(res.message);
            }
          },
          (error) => {
            this.errorMessage.emit(error);
          }
        );
    } else {
      this.sharedService.add({
        severity: "error",
        summary: "Error",
        detail: "Please save profile details first",
      });
      this.activeTabIndex = 0;
    }
  }
  saveEmployeeDependentDetails(saveProfile, form: NgForm) {
    this.empDependentDetails.employeeDetailsId = saveProfile.employeeDetailsId;
    if (saveProfile.profileDetailsId) {
      this.profileService
        .saveEmployeeDependentDetails(this.empDependentDetails)
        .subscribe(
          (res) => {
            if (res.statusCode == 200) {
              this.empDependentDetails = new EmpDependentDetails();
              form.reset();
              this.saveProfile.dependents = res.responsePayload;
              this.sharedService.add({
                severity: "success",
                summary: "Success",
                detail: res.message,
              });
              this.updateProfile.emit();
            } else {
              this.errorMessage.emit(res.message);
            }
          },
          (error) => {
            this.errorMessage.emit(error);
          }
        );
    } else {
      this.sharedService.add({
        severity: "error",
        summary: "Error",
        detail: "Please save profile details first",
      });
      this.activeTabIndex = 0;
    }
  }
  editEmergContact(rowData) {
    this.emergContactDetails = { ...rowData };
  }
  editEmpDependentDetails(rowData) {
    this.empDependentDetails = { ...rowData };
  }
  cancelForm(form: NgForm) {
    this.emergContactDetails = new EmergContactDetails();
    this.empDependentDetails = new EmpDependentDetails();
    form.reset();
  }
  saveEmploymentDetails(saveProfile) {
    let employmentDetails = new EmploymentDetails();
    employmentDetails.profileDetailsId = saveProfile.profileDetailsId;
    employmentDetails.employeeDetailsId = saveProfile.employeeDetailsId;
    employmentDetails.employeeId = saveProfile.employeeId;
    employmentDetails.dateOfJoining = saveProfile.dateOfJoining;
    employmentDetails.employeeType = saveProfile.employeeType;
    employmentDetails.reportingToEmployeeDetailsId =
      this.reportingToEmployeeDetailsId;
    employmentDetails.employmentDetailsId = saveProfile.employmentDetailsId;
    employmentDetails.employmentType = saveProfile.employmentType;
    employmentDetails.departmentDetailsId = this.departmentDetailsId;
    employmentDetails.designationDetailsId = this.designationDetailsId;
    if (saveProfile.profileDetailsId) {
      console.log(employmentDetails);
      this.profileService.saveEmploymentDetails(employmentDetails).subscribe(
        (res) => {
          if (res.statusCode == 200) {
            this.sharedService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            this.updateProfile.emit();
          } else {
            this.errorMessage.emit(res.message);
          }
        },
        (error) => {
          this.errorMessage.emit(error);
        }
      );
    } else {
      this.sharedService.add({
        severity: "error",
        summary: "Error",
        detail: "Please save profile details first",
      });
      this.activeTabIndex = 0;
    }
  }
  saveProfilePicture(event, profilePicture) {
    let formData = new FormData();
    formData.append(
      "employeeDetailsId",
      this.saveProfile.employeeDetailsId.toString()
    );
    formData.append("fileToUpload", event.files[0]);
    this.profileService.saveProfilePicture(formData).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.updateProfile.emit();
        } else {
          this.errorMessage.emit(res.message);
        }
        profilePicture.clear();
      },
      (error) => {
        this.errorMessage.emit(error);
      }
    );
  }
  confirmSSNValidation() {
    if (this.saveProfile.ssn && this.saveProfile.confirmssn) {
      if (this.saveProfile.ssn != this.saveProfile.confirmssn) {
        this.sharedService.add({
          severity: "error",
          summary: "Error",
          detail: "SSN and confirm SSN not matched",
        });
      }
    }
  }
  onCancel() {
    this.onClose.emit();
  }
  deletingRowdataIndex: any;
  deleteEmpDependentDetails(deletingRowdata, index) {
    this.deletingRowdata = deletingRowdata;
    this.modelType = "Dependent Details";
    this.confirmModel = "block";
    this.deletingRowdataIndex = index;
  }
  confirmDeleteEmpDependentDetails(deletingRowdata) {
    this.profileService
      .deleteEmpDependentDetails(deletingRowdata.employeeDependentDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.cancel();
          this.saveProfile.dependents.splice(this.deletingRowdataIndex, 1),
            (this.saveProfile.dependents = [...this.saveProfile.dependents]);
          this.updateProfile.emit();
        }
      });
  }
  confirmDeleteEmpEmergContact(deletingRowdata) {
    this.profileService
      .deleteEmergContact(deletingRowdata.emergencyContactDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.cancel();
          this.saveProfile.emergencyContacts.splice(
            this.deletingRowdataIndex,
            1
          );
          this.saveProfile.emergencyContacts = [
            ...this.saveProfile.emergencyContacts,
          ];
          this.updateProfile.emit();
        }
      });
  }
  deleteEmergContact(deletingRowdata, index) {
    this.deletingRowdata = deletingRowdata;
    this.modelType = "Emergency Contact Details";
    this.confirmModel = "block";
    this.deletingRowdataIndex = index;
  }
  modelType: string;
  deletingRowdata: any;
  confirmDeleteAction(deletingRowdata, modelType) {
    switch (modelType) {
      case "Dependent Details":
        this.confirmDeleteEmpDependentDetails(deletingRowdata);
        break;
      case "Emergency Contact Details":
        this.confirmDeleteEmpEmergContact(deletingRowdata);
        break;
      default:
        break;
    }
  }
  cancel() {
    this.confirmModel = "none";
    this.deletingRowdata = undefined;
    this.modelType = undefined;
    this.deletingRowdataIndex = undefined;
  }
}
