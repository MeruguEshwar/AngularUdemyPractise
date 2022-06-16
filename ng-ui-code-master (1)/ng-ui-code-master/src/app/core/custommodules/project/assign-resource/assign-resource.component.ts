import { ChangeDetectorRef, ElementRef, Input, ViewChild } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { TreeNode } from "@app/components/api/public_api";
import { AuthService } from "@app/core/service/auth.service";
import { Employee } from "@app/shared/models/employee.model";
import { projectAssignment } from "@app/shared/models/project-assignment.model";
import { SharedService } from "@app/shared/shared.service";
import { EmployeeService } from "../../employeeinfo/employeeinfo.service";
import { ProjectService } from "../project.service";

@Component({
  selector: "app-assign-resource",
  templateUrl: "./assign-resource.component.html",
  styleUrls: ["./assign-resource.component.css"],
})
export class AssignResourceComponent implements OnInit {
  @ViewChild("minimumDate") minimumDate: ElementRef<HTMLInputElement>;
  addResourceModelInfo: string = "none";
  selectedProjectAssignMent: projectAssignment;
  loading: boolean = false;
  selectedEmployee: any;
  lstEmployes: any[];
  projectCustomerList: any[];
  isOvertimeExemption: boolean = true;
  showInInvoice: boolean = true;
  projectResrCols = [
    { field: "employeeFullName", header: "Employee Name" },
    { field: "startDate", header: "Start Date" },
    { field: "endDate", header: "End Date" },
    { field: "invoiceFrequency", header: "Invoice Frequency" },
    { field: "showInInvoice", header: "Show In Invoice" },
    { field: "rate", header: "Rate" },
    { field: "overtimeRate", header: "Overtime Rate" },
    { field: "doubleOvertimeRate", header: "Double Overtime Rate" },
  ];
  invoiceFrequencyList: any = [
    { label: "Weekly", value: "1" },
    { label: "Semi Weekly", value: "2" },
    { label: "Monthly", value: "3" },
  ];
  resourcesList: any[] = [];
  @Input() projectDetailsId;
  cols = [
    { field: "name", header: "Name" },
    { field: "size", header: "Size" },
    { field: "type", header: "Type" },
  ];
  files: TreeNode[] = [
    {
      data: {
        name: "Documents",
        size: "75kb",
        type: "Folder",
      },
      children: [
        {
          data: {
            name: "Work",
            size: "55kb",
            type: "Folder",
          },
          children: [
            {
              data: {
                name: "Expenses.doc",
                size: "30kb",
                type: "Document",
              },
            },
            {
              data: {
                name: "Resume.doc",
                size: "25kb",
                type: "Resume",
              },
            },
          ],
        },
        {
          data: {
            name: "Home",
            size: "20kb",
            type: "Folder",
          },
          children: [
            {
              data: {
                name: "Invoices",
                size: "20kb",
                type: "Text",
              },
            },
          ],
        },
      ],
    },
    {
      data: {
        name: "Pictures",
        size: "150kb",
        type: "Folder",
      },
      children: [
        {
          data: {
            name: "barcelona.jpg",
            size: "90kb",
            type: "Picture",
          },
        },
        {
          data: {
            name: "primeui.png",
            size: "30kb",
            type: "Picture",
          },
        },
        {
          data: {
            name: "optimus.jpg",
            size: "30kb",
            type: "Picture",
          },
        },
      ],
    },
  ];
  constructor(
    private projectService: ProjectService,
    private emplService: EmployeeService,
    private sharedService: SharedService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.selectedProjectAssignMent = new projectAssignment();
  }

  organizationCurrency: string;
  ngOnInit(): void {
    if (this.authService.orgnizationCurrency) {
      this.organizationCurrency = this.authService.orgnizationCurrency;
    }
    this.getResources(this.projectDetailsId);
  }
  getResources(projectDetailsId) {
    this.projectService
      .getProjectResources(projectDetailsId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.resourcesList = res.responsePayload;
        }
      });
  }
  editRecord(rowData) {
    console.log(rowData);
    this.addResourceAssignment();
    this.selectedProjectAssignMent = rowData;
    if (this.selectedProjectAssignMent.overtimeExemption == "1") {
      this.isOvertimeExemption = true;
    } else {
      this.isOvertimeExemption = false;
    }
    if (this.selectedProjectAssignMent.showInInvoice == "1") {
      this.showInInvoice = true;
    } else {
      this.showInInvoice = false;
    }
    //this.selectedEmployee = rowData.employeeDetailsId;
  }
  getProjectAssignMents(event) {
    if (event) {
      this.selectedProjectAssignMent = new projectAssignment();
      this.projectService.getProjectAssignMent(event).subscribe(
        (res) => {
          if (res.statusCode == 200) {
            let projectAssignMents = res.responsePayload as projectAssignment[];
            for (let index = 0; index < projectAssignMents.length; index++) {
              if (
                this.projectDetailsId ==
                projectAssignMents[index].projectDetailsId
              ) {
                this.selectedProjectAssignMent = projectAssignMents[index];
                break;
              }
            }
          }
        },
        (error) => {
          this.loading = false;
        }
      );
    }
  }
  getEmployees(status: number = 1) {
    this.projectService.getOnBoardedEmployees().subscribe(
      (res) => {
        this.loading = false;
        this.lstEmployes = [];
        if (res.statusCode == 200) {
          for (let index = 0; index < res.responsePayload.length; index++) {
            const element: Employee = res.responsePayload[index];
            this.lstEmployes.push({
              label: element.fullName,
              value: element.employeeDetailsId,
            });
          }
        }
      },
      (error) => {
        this.loading = false;
      }
    );
  }
  assignProject(assignResource: NgForm) {
    this.isOvertimeExemption
      ? (this.selectedProjectAssignMent.overtimeExemption = "1")
      : (this.selectedProjectAssignMent.overtimeExemption = "0");
    this.showInInvoice
      ? (this.selectedProjectAssignMent.showInInvoice = "1")
      : (this.selectedProjectAssignMent.showInInvoice = "0");
    // if (!this.selectedEmployee) {
    //   return;
    // }
    this.selectedProjectAssignMent.projectDetailsId = this.projectDetailsId;
    //this.selectedProjectAssignMent.employeeDetailsId = this.selectedEmployee;

    if (this.selectedProjectAssignMent.projectAssignmentDetailsId) {
      console.log(this.selectedProjectAssignMent);
      this.projectService
        .updateProjectAssignMent(this.selectedProjectAssignMent)
        .subscribe(
          (res) => {
            if (res.statusCode == 200) {
              this.sharedService.add({
                severity: "success",
                summary: "Success",
                detail: res.message,
              });
              this.cancel(assignResource);
              this.getResources(this.projectDetailsId);
            } else {
              this.sharedService.add({
                severity: "error",
                summary: "Error",
                detail: res.message,
              });
            }
          },
          (error) => {
            this.loading = false;
          }
        );
    } else {
      this.projectService
        .saveProjectAssignMent(this.selectedProjectAssignMent)
        .subscribe(
          (res) => {
            if (res.statusCode == 200) {
              this.sharedService.add({
                severity: "success",
                summary: "Success",
                detail: res.message,
              });
              this.cancel(assignResource);
              this.getResources(this.projectDetailsId);
            } else {
              this.sharedService.add({
                severity: "error",
                summary: "Error",
                detail: res.message,
              });
            }
          },
          (error) => {
            this.loading = false;
          }
        );
    }
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
  clear(form?: NgForm) {
    this.selectedProjectAssignMent = new projectAssignment();
    //this.selectedEmployee = 0;
    if (form) {
      form.reset();
    }
    this.cdr.detectChanges();
    this.isOvertimeExemption = true;
    this.showInInvoice = true;
  }
  cancel(form?: NgForm) {
    if (form) {
      this.clear(form);
    } else {
      this.clear();
    }
    this.addResourceModelInfo = "none";
    this.displayScroll();
  }
  showInvoiceUpdate(event, rowData) {
    let showInInvoice = event.checked ? "1" : "0";
    this.projectService
      .updateProjectAssignmentShowInInvoiceStatus(
        rowData.projectAssignmentDetailsId,
        showInInvoice
      )
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getResources(this.projectDetailsId);
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        }
      });
  }
  rowData: any;
  onUpdateProjectAssignmentStatus(rowData) {
    this.rowData = rowData;
  }
  updateProjectAssignmentStatus(event) {
    let status = event.checked ? "1" : "0";
    if (event == "deactivate") {
      status = "0";
    } else if (event == "activate") {
      status = "1";
    }

    this.projectService
      .updateProjectAssignmentStatus(
        this.rowData.projectAssignmentDetailsId,
        status
      )
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.getResources(this.projectDetailsId);
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        }
      });
  }
  addResourceAssignment() {
    this.getEmployees();
    this.getProjectCustomers(this.projectDetailsId);
    this.addResourceModelInfo = "block";
    this.isOvertimeExemption = true;
    this.showInInvoice = true;
    this.hiddenScroll();
  }
  hiddenScroll() {
    try {
      let bodyElement = document.getElementById("modalbody") as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.add("modal-open");
      }
    } catch (ex) {}
  }

  displayScroll() {
    try {
      let bodyElement = document.getElementById("modalbody") as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.remove("modal-open");
      }
    } catch (ex) {}
  }

  getProjectCustomers(projectDetailsId) {
    this.projectService.getProjectCustomers(projectDetailsId).subscribe(
      (res) => {
        this.loading = false;
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
      (error) => {
        this.loading = false;
      }
    );
  }
  getRowData(rowNode) {
    if (rowNode.node.children) {
      return "has-children-node";
    }
  }
}
