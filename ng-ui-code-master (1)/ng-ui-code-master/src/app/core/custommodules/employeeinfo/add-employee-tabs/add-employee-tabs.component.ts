import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  NgForm,
} from "@angular/forms";
import { AuthService } from "@app/core/service/auth.service";
import { Role } from "@app/shared/enums/role.enum";
import { Employee } from "@app/shared/models/employee.model";
import { SharedService } from "@app/shared/shared.service";
import { EmployeeService } from "../employeeinfo.service";
import { SelectItem } from "@app/components/public_api";
import { MyProfileService } from "@app/core/myprofile/myprofile.service";
import {
  EmploymentDetails,
  PersonalDetails,
} from "@app/shared/models/profile.model";
import { projectAssignment } from "@app/shared/models/project-assignment.model";
import { ProjectService } from "../../project/project.service";

@Component({
  selector: "app-add-employee-tabs",
  templateUrl: "./add-employee-tabs.component.html",
  styleUrls: ["./add-employee-tabs.component.css"],
})
export class AddEmployeeTabsComponent implements OnInit {
  birthMaxDate = new Date();
  @Input() employeeType: string;
  @Output() onClose = new EventEmitter<any>();
  displayDialog: boolean;
  @Input() employee: Employee;
  clientErrorMsg: any;
  employmentDetails: EmploymentDetails;
  addEmployeeForm: FormGroup;
  selectedRole: string = "1";
  public addemployeeDisplay: string = "none";
  errLabel: string = "";
  tabActiveIndex: number = 0;
  reportingToUserNames: SelectItem[];
  departments: any[] = [];
  designations: any[] = [];
  selectedProjectAssignMent: projectAssignment;
  selectedEmployee: any;
  lstProjects: any[];
  isOvertimeExemption: boolean = true;
  showInInvoice: boolean = true;
  invoiceFrequencyList: any = [
    { label: "Weekly", value: "1" },
    { label: "Semi Weekly", value: "2" },
    { label: "Monthly", value: "3" },
  ];
  employeeDetailsId: number;
  profileDetailsId: number;
  personalDetails: PersonalDetails;
  projectCustomerList: any[];
  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private fb: FormBuilder,
    public sharedService: SharedService,
    public profileService: MyProfileService,
    public projectService: ProjectService
  ) {
    this.employee = new Employee();
    this.addEmployeeForm = this.fb.group({
      email: new FormControl({ value: "", disabled: false }, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(150),
      ]),
      firstName: new FormControl({ value: "", disabled: false }, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      lastName: new FormControl({ value: "", disabled: false }, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      userRole: new FormControl({ value: "", disabled: false }, [
        Validators.required,
      ]),
      phoneNumber: new FormControl({ value: "", disabled: false }, [
        Validators.maxLength(10),
      ]),
    });
  }
  roles = [
    // { label: 'Super Admin', value: Role.SuperAdmin },
    { label: "Admin", value: Role.Admin },
    { label: "Accounts", value: Role.Accounts },
    { label: "HR", value: Role.HR },
    { label: "Employee", value: Role.Employee },
  ];
  approvals = [
    { label: "Yes", value: 1 },
    { label: "No", value: 0 },
  ];
  organizationCurrency: string;
  ngOnInit(): void {
    this.showDialogToAdd();
  }
  showDialogToAdd() {
    //this.employee = new Employee;
    this.addemployeeDisplay = "block";

    this.hiddenScroll();
  }
  openNext() {
    switch (this.tabActiveIndex) {
      case 0:
        this.saveEmployeeDetails(false);
        this.personalDetails = new PersonalDetails();
        this.birthMaxDate.setDate(this.birthMaxDate.getDate() - 1);
        this.personalDetails.firstName = this.employee.firstName;
        this.personalDetails.lastName = this.employee.lastName;
        break;
      case 1:
        this.savePersonalDetails(false);
        this.employmentDetails = new EmploymentDetails();
        this.getAllDepartment();
        this.getAllDesignation();
        this.getReportToUsers();
        break;
      case 2:
        this.saveEmploymentDetails(false);
        if (this.authService.orgnizationCurrency) {
          this.organizationCurrency = this.authService.orgnizationCurrency;
        }
        this.selectedProjectAssignMent = new projectAssignment();
        this.getAllProject();
        break;
      default:
        break;
    }
  }
  openPrev() {
    this.tabActiveIndex =
      this.tabActiveIndex === 0 ? 3 : this.tabActiveIndex - 1;
  }

  saveEmployeeDetails(close: boolean = false) {
    this.employeeService.isEmployeeExists(this.employee.email).subscribe(
      (res) => {
        if (res.statusCode != 200) {
          // this.openPrev();
          this.employee.email = undefined;
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        } else {
          this.employee.organizationDetailsId =
            this.authService.currentUser.employeeDetailsId;
          this.employeeService.addEmployee(this.employee).subscribe(
            (res) => {
              if (res.statusCode == 200) {
                if (close) {
                  this.closeAddmodal(this.employeeType);
                } else {
                  this.tabActiveIndex =
                    this.tabActiveIndex === 3 ? 0 : this.tabActiveIndex + 1;
                }
                this.employeeDetailsId = res.responsePayload.employeeDetailsId;
                this.sharedService.add({
                  severity: "success",
                  summary: "Success",
                  detail: res.message,
                });
              } else {
                this.sharedService.add({
                  severity: "error",
                  summary: "Error",
                  detail: res.message,
                });
                //this.openPrev();
              }
            },
            (error) => {
              this.sharedService.add({
                severity: "error",
                summary: "Error",
                detail: error,
              });
              //this.openPrev();
            }
          );
        }
      },
      (error) => {
        this.sharedService.add({
          severity: "error",
          summary: "Error",
          detail: error,
        });
        //this.openPrev();
      }
    );
  }
  savePersonalDetails(close: boolean = false) {
    this.personalDetails.employeeDetailsId = this.employeeDetailsId;
    this.profileService.savePersonalDetails(this.personalDetails).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.profileDetailsId = res.responsePayload.profileDetailsId;
          if (close) {
            this.closeAddmodal(this.employeeType);
          } else {
            this.tabActiveIndex =
              this.tabActiveIndex === 3 ? 0 : this.tabActiveIndex + 1;
          }
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        } else {
          this.sharedService.add({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
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
  saveEmploymentDetails(close: boolean = false) {
    this.employmentDetails.employeeDetailsId = this.employeeDetailsId;
    this.employmentDetails.profileDetailsId = this.profileDetailsId;
    this.profileService.saveEmploymentDetails(this.employmentDetails).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          if (close) {
            this.closeAddmodal(this.employeeType);
          } else {
            this.tabActiveIndex =
              this.tabActiveIndex === 3 ? 0 : this.tabActiveIndex + 1;
          }
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        } else {
          this.errLabel = res.message;
          //this.openPrev();
        }
      },
      (error) => {
        this.errLabel = error;
        // this.openPrev();
      }
    );
  }
  assignProject(close: boolean = false) {
    this.isOvertimeExemption
      ? (this.selectedProjectAssignMent.overtimeExemption = "1")
      : (this.selectedProjectAssignMent.overtimeExemption = "0");
    this.showInInvoice
      ? (this.selectedProjectAssignMent.showInInvoice = "1")
      : (this.selectedProjectAssignMent.showInInvoice = "0");
    if (this.selectedProjectAssignMent.projectAssignmentDetailsId) {
      console.log(this.selectedProjectAssignMent);
      this.projectService
        .updateProjectAssignMent(this.selectedProjectAssignMent)
        .subscribe(
          (res) => {
            if (res.statusCode == 200) {
              if (close) {
                this.closeAddmodal(this.employeeType);
              } else {
                this.tabActiveIndex =
                  this.tabActiveIndex === 3 ? 0 : this.tabActiveIndex + 1;
              }
              this.sharedService.add({
                severity: "success",
                summary: "Success",
                detail: res.message,
              });
            } else {
              this.sharedService.add({
                severity: "error",
                summary: "Error",
                detail: res.message,
              });
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
    } else {
      this.selectedProjectAssignMent.employeeDetailsId = this.employeeDetailsId;
      this.projectService
        .saveProjectAssignMent(this.selectedProjectAssignMent)
        .subscribe(
          (res) => {
            if (res.statusCode == 200) {
              if (close) {
                this.closeAddmodal(this.employeeType);
              } else {
                this.tabActiveIndex =
                  this.tabActiveIndex === 3 ? 0 : this.tabActiveIndex + 1;
              }
              this.sharedService.add({
                severity: "success",
                summary: "Success",
                detail: res.message,
              });
            } else {
              this.sharedService.add({
                severity: "error",
                summary: "Error",
                detail: res.message,
              });
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
      }
    });
  }
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
      }
    });
  }
  getAllDepartment() {
    this.departments = [];
    this.profileService.getAllDepartments().subscribe((res) => {
      if (res.responsePayload) {
        res.responsePayload.forEach((value) => {
          this.departments.push({
            label: value.department,
            value: value.departmentDetailsId,
          });
        });
      }
    });
  }
  getAllProject(status: number = 1) {
    this.lstProjects = [];
    this.projectService.getAllProject(status).subscribe((res) => {
      if (res.responsePayload) {
        res.responsePayload.forEach((value) => {
          this.lstProjects.push({
            label: value.projectName,
            value: value.projectDetailsId,
          });
        });
      }
    });
  }
  getProjectCustomers(projectDetailsId) {
    this.projectService.getProjectCustomers(projectDetailsId).subscribe(
      (res) => {
        this.projectCustomerList = [];
        if (res.statusCode == 200) {
          for (let index = 0; index < res.responsePayload.length; index++) {
            const element: any = res.responsePayload[index];
            this.projectCustomerList.push({
              label: element.companyName,
              value: element.companyDetailsId,
            });
          }
        }
      },
      (error) => {}
    );
  }
  handleIsOvertimeExemption(
    event,
    selectedProjectAssignMent: projectAssignment
  ) {
    if (selectedProjectAssignMent.rate) {
      this.selectedProjectAssignMent.doubleOvertimeRate =
        selectedProjectAssignMent.rate * 2;
      this.selectedProjectAssignMent.overtimeRate =
        selectedProjectAssignMent.rate * 1.5;
    } else {
      this.selectedProjectAssignMent.doubleOvertimeRate = 0;
      this.selectedProjectAssignMent.overtimeRate = 0;
    }
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
  closeAddmodal(type?) {
    this.addemployeeDisplay = "none";
    this.displayScroll();
    this.onClose.emit({ type: type });
  }
}
