import { Component, OnInit, Input } from "@angular/core";
import { MyProfileService } from "../myprofile.service";
import { SharedService } from "@app/shared/shared.service";
import { AuthService } from "@app/core/service/auth.service";

@Component({
  selector: "app-profile-projects",
  templateUrl: "./profile-projects.component.html",
  styleUrls: ["./profile-projects.component.css"],
})
export class ProfileProjectsComponent implements OnInit {
  allProjectAssignments: any = [];
  currentOrganization: string;
  @Input() userId: any = -1;
  @Input() isEmp: boolean;
  constructor(
    private profileService: MyProfileService,
    private sharedService: SharedService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log(this.isEmp);
    this.allProjectAssignments = [];
    if (this.userId == -1) {
      this.userId = this.authService.currentUser.employeeDetailsId;
    }
    this.currentOrganization = this.authService.currentUser.orgnizationName;
    this.getAllAssignprojects(this.userId);
    // this.getAllprojects(this.userId);
  }
  getAllprojects(employeeId) {
    this.profileService.getAllProjectAssignment(employeeId).subscribe((res) => {
      if (res.statusCode == 200) {
        res.responsePayload.forEach((element, index) => {
          this.getProjectAssignment(element.projectDetailsId, index);
        });
      } else {
        this.allProjectAssignments = [];
      }
    });
  }
  getAllAssignprojects(employeeId) {
    this.profileService.getassignedProjects(employeeId).subscribe((res) => {
      if (res.statusCode == 200) {
        this.allProjectAssignments = res.responsePayload;
      } else {
        this.allProjectAssignments = [];
      }
    });
    console.log(this.allProjectAssignments);
  }

  getProjectAssignment(projectDetailsId, index) {
    this.profileService
      .getProjectAssignment(projectDetailsId)
      .subscribe((res) => {
        let currentProject = res.responsePayload;
        if (res.statusCode == 200) {
          this.allProjectAssignments[index] = {
            projectName: currentProject.projectName,
            projectDescription: currentProject.description,
            projectCompanyMappings:
              currentProject.webProjectCompanyMappings.sort((a, b) => {
                return a.mappingIndex - b.mappingIndex;
              }),
            startDate: currentProject.startDate,
            endDate: currentProject.endDate,
          };
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "error",
            detail: res.message,
          });
        }
      });
  }
  getAstnType(type: string) {
    switch (type) {
      case "1":
        return "Client";
      case "2":
        return "Vendor";
      case "3":
        return "Implementation Partner";
      default:
        return "Company";
    }
  }
}
