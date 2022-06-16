import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from "@angular/core";
import { AuthService } from "@app/core/service/auth.service";
import { Project } from "@app/shared/models/project.model";
import { ProjectService } from "../project.service";
import { projectCompanyMappings } from "@app/shared/models/projectCompanyMappings.model";
import { SharedService } from "@app/shared/shared.service";
import { Location } from "@angular/common";

@Component({
  selector: "app-add-project",
  templateUrl: "./add-project.component.html",
  styleUrls: ["./add-project.component.css"],
})
export class AddProjectComponent implements OnInit {
  @Input() companyList: any[];
  @Input() projectType: string;
  @Output() onClose = new EventEmitter<any>();
  displayDialog: boolean;
  project: Project;
  clientErrorMsg: any;
  public addemployeeDisplay: string = "none";
  public deleteModelInfo: string = "none";
  errLabel: any;
  addErrLabel: any;
  mappingIndex: number = 0;
  mappingIndexs: any[] = [];
  projectCompanyMappings: any[] = [];
  currentCompanyList: any[] = [];
  predessor: string;
  showAddButton: boolean = true;
  selectedAstnType: any = "Company";
  customerMapping: projectCompanyMappings;
  deleteRowData: projectCompanyMappings;
  currentOrganization: string = this.authService.currentUser.orgnizationName;
  inHouseChecked: boolean = false;
  creditDaysOptions = [
    { label: "Immediate", value: 0 },
    { label: "Net 7", value: 7 },
    { label: "Net 10", value: 10 },
    { label: "Net 15", value: 15 },
    { label: "Net 30", value: 30 },
    { label: "Net 45", value: 45 },
    { label: "Net 60", value: 60 },
    { label: "Net 75", value: 75 },
    { label: "Net 90", value: 90 },
    { label: "Net 105", value: 105 },
    { label: "Net 120", value: 120 },
  ];
  @ViewChild("minimumDate") minimumDate: ElementRef<HTMLInputElement>;
  sourceCustomerMapping: projectCompanyMappings[] = [];

  constructor(
    private projectService: ProjectService,
    public sharedService: SharedService,
    private authService: AuthService,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.projectType == "Add") {
      this.project = new Project();
      this.customerMapping = new projectCompanyMappings();
      this.project.timesheetNotificationConfig = "2";
      this.projectCompanyMappings = [];
      this.projectCompanyMappings.push(new projectCompanyMappings());
      this.project.organizationDetailsId =
        this.authService.currentUser.organizationDetailsId;
      this.predessor = this.authService.currentUser.orgnizationName;
      if (this.companyList.length) {
        // this.currentCompanyList = [...this.companyList]
        this.companyList.forEach((element) => {
          this.currentCompanyList.push({
            label: element.companyName,
            value: element.companyDetailsId,
          });
        });
      } else {
        this.sharedService.add({
          severity: "error",
          summary: "Error",
          detail: "Need to add Supplier to add Project",
        });
        this.location.back();
      }
    }
    this.showNextButton();
    this.showDialogToAdd();
    this.getCurrentOrgAsCompanyDetails();
  }
  showDialogToAdd() {
    this.addemployeeDisplay = "block";
    this.hiddenScroll();
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

  checkProjectAlreadyExist() {
    this.projectService.isProjectExists(this.project.projectName).subscribe(
      (res) => {
        if (res.statusCode != 200) {
          this.errLabel = res.message;
          this.project.projectName = "";
        } else {
          this.errLabel = undefined;
        }
      },
      (error) => {
        this.errLabel = error;
      }
    );
  }

  save() {
    console.log(this.project);
    if (this.inHouseChecked) {
      this.project.inHouse = "1";
    } else {
      this.sourceCustomerMapping.forEach((element, index) => {
        this.sourceCustomerMapping[index].mappingIndex = index;
      });
      this.project.projectCompanyMappings = this.sourceCustomerMapping;
      this.project.inHouse = "0";
    }
    if (this.inHouseChecked) {
      this.saveProject();
    } else if (this.project.projectCompanyMappings.length) {
      this.saveProject();
    } else {
      this.sharedService.add({
        severity: "error",
        summary: "Error",
        detail: "Add Customer Mapping",
      });
    }
  }
  saveProject() {
    this.projectService.addProject(this.project).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          this.addemployeeDisplay = "none";
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.displayScroll();
          this.onClose.emit({ type: "add" });
        } else {
          this.errLabel = res.message;
        }
      },
      (error) => {
        this.errLabel = error;
      }
    );
  }
  addCustomerMapping() {
    this.addErrLabel = "";
    if (
      this.customerMapping.associationType != undefined &&
      this.customerMapping.companyDetailsId != undefined
    ) {
      if (this.companyList.length > this.mappingIndexs.length) {
        this.currentCompanyList = this.hideCompanyFromList(
          this.currentCompanyList,
          "value",
          this.customerMapping.companyDetailsId
        ); // remove the selected company from list
        this.mappingIndex += 1;
        this.sourceCustomerMapping = [
          ...this.sourceCustomerMapping,
          this.customerMapping,
        ];
        this.customerMapping = new projectCompanyMappings();
        this.showNextButton();
      } else {
        this.addErrLabel = "You can not add more";
      }
    } else {
      this.addErrLabel = "(*) fields are mandatory";
    }
    this.showNextButton();
  }
  addAssociation() {
    this.addErrLabel = "";
    if (
      this.projectCompanyMappings[this.mappingIndex].associationType !=
        undefined &&
      this.projectCompanyMappings[this.mappingIndex].companyDetailsId !=
        undefined &&
      this.projectCompanyMappings[this.mappingIndex].mappingIndex != undefined
    ) {
      this.predessor = this.getPredessor(
        this.projectCompanyMappings[this.mappingIndex].companyDetailsId
      );
      if (this.companyList.length > this.mappingIndexs.length) {
        this.currentCompanyList = this.hideCompanyFromList(
          this.currentCompanyList,
          "value",
          this.projectCompanyMappings[this.mappingIndex].companyDetailsId
        ); // remove the selected company from list
        this.mappingIndex += 1;
        this.projectCompanyMappings.push(new projectCompanyMappings());
        this.selectedAstnType = "Company";
        this.showNextButton();
      } else {
        this.addErrLabel = "You can not add more";
      }
    } else {
      this.addErrLabel = "(*) fields are mandatory";
    }
    this.showNextButton();
  }
  hideCompanyFromList(arr: any, attr: any, value: any) {
    var i = arr.length;
    while (i--) {
      if (
        arr[i] &&
        arr[i].hasOwnProperty(attr) &&
        arguments.length > 2 &&
        arr[i][attr] === value
      ) {
        arr.splice(i, 1);
      }
    }
    return arr;
  }
  closeAddmodal() {
    this.addemployeeDisplay = "none";
    this.displayScroll();
    this.onClose.emit({ type: "cancel" });
    this.currentCompanyList = [...this.companyList];
  }

  showNextButton() {
    if (this.currentCompanyList.length >= 1) {
      this.showAddButton = true;
    } else {
      this.showAddButton = false;
    }
  }
  pushMappingIndex(index: number) {
    this.projectCompanyMappings[index].mappingIndex = this.mappingIndex + 1;
    this.selectedAstnType = this.projectCompanyMappings[index];
  }
  getPredessor(companyDetailsId: number) {
    var result = this.companyList.filter((company) => {
      return company.value == companyDetailsId;
    });
    if (result[0] != undefined || result.length) {
      return result[0].label;
    }
  }
  getPredessorType(companyDetailsId: number) {
    var result = this.companyList.filter((company) => {
      return company.companyDetailsId == companyDetailsId;
    });
    if (result[0] != undefined || result.length) {
      return result[0].companyName;
    }
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
        return "SELF";
    }
  }
  deleteCustomerMapping(rowData) {
    this.deleteRowData = rowData;
    this.deleteModelInfo = "block";
  }
  confirm() {
    var data = this.hideCompanyFromList(
      this.sourceCustomerMapping,
      "companyDetailsId",
      this.deleteRowData.companyDetailsId
    ); // remove the selected company from list
    this.sourceCustomerMapping = [...data];
    var deletedCompanyDetails = this.companyList.filter((element) => {
      return element.companyDetailsId == this.deleteRowData.companyDetailsId;
    });
    this.currentCompanyList.unshift({
      label: deletedCompanyDetails[0].companyName,
      value: deletedCompanyDetails[0].companyDetailsId,
    });
    this.cancel();
  }
  cancel() {
    this.deleteRowData = undefined;
    this.deleteModelInfo = "none";
  }
  getCurrentOrgAsCompanyDetails() {
    this.projectService.getCurrentOrgAsCompanyDetails().subscribe((res) => {
      if (res.statusCode == 200) {
        this.companyList.push(res.responsePayload);
        this.customerMapping.companyDetailsId =
          res.responsePayload.companyDetailsId;
        this.customerMapping.associationType = "4";
        this.addCustomerMapping();
        // this.sourceCustomerMapping = [
        //   ...this.sourceCustomerMapping,
        //   sourceCustomerMapping,
        // ];
      }
    });
  }
}
