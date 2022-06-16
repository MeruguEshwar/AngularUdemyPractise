import {  Component, OnInit } from "@angular/core";
import { ImmigrationsServices } from './immigrations.service';

@Component({
  selector: "app-immigrations",
  templateUrl: "./immigrations.component.html",
  styleUrls: ["./immigrations.component.css"],
})
export class ImmigrationsComponent implements OnInit {
  cols: any = [];
  selectedEmployee: any;
  selectedEmployeeAction: any;
  employeeList: any;
  immigrationModel: string = "none";
  errorLabel: string;
  clientErrorMsg: any;
  currentCategoryOptionList: any = [];
  categoryOptionList:any=[]
  events1: any[];    
    events2: any[];
  selectedCategoryOptionList:any
  showDocLinkModel:boolean=false
  linkDocList:any
  loading: boolean = false;
  filteredCategory: any;
  selectedPhase:any='testDemo'
  enableFieldset:string='attorney'
  docStatusList:any = [
    { label: "Select", value: null },
    { label: "Requested", value: "Requested" },
    { label: "Requested Additional Documents", value: "Requested Additional Documents" },
    { label: "Reviewing", value: "Reviewing" },
    { label: "Looks Good", value: "Looks Good" },
    { label: "Sent To Attorney", value: "Sent To Attorney" },
  ];
  attorneyStatusList:any = [
    { label: "Select", value: null },
    { label: "Documents Review Inprocess", value: "Documents Review Inprocess" },
    { label: "Requested Additional Documents", value: "Requested Additional Documents" },
    { label: "Additional Documents Requested", value: "Additional Documents Requested" },
    { label: "XYZ ", value: "XYZ " },
    { label: "Documents Ship To USCIS", value: "Sent To Attorney" },
  ];
  uscisStatusList:any = [
    { label: "Select", value: null },
    { label: "Case Received", value: "Case Received" },
    { label: "Case Approved", value: "Case Approved" },
    { label: "RFP", value: "RFP" },
    { label: "RFP Answered", value: "RFP Answered" },
    { label: "Case Approved", value: "Case Approved" },
  ];


  constructor(private immgrationService:ImmigrationsServices) {}
  ngOnInit(): void {
    this.cols = [
      { field: "employeeName", header: "Employee Name" },
      { field: "rate", header: "Rate" },
      { field: "salary", header: "Salary" },
      { field: "startDate", header: "Start Date" },
      { field: "endDate", header: "End Date" },
      { field: "rateCodeDescp", header: "Rate Code Description" },
    ];
    
    this.categoryOptionList = ['H-1',"Green Card","H4 EAD"    ];
    this.events1 = [
      {type:'documentation',status: 'Documentation', date: '15/10/2020', icon: '', color: '#9C27B0', image: 'game-controller.jpg'},
      {type: 'attorney',status: 'Attorney Review', date: '15/10/2020', icon: '', color: '#673AB7'},
      {type: 'uscis',status: 'USCIS', date: '15/10/2020', icon: '', color: '#FF9800'},
      {type: 'approved',status: 'Approved', date: '16/10/2020', icon: '', color: '#607D8B'},
      {type:'dummy'}
  ];
  this.events2 = [
      "2020", "2021", "2022", "2023"
  ];
    this.getEmployees()
    
  }
  getEmployees() {
    this.immgrationService.getAllEmployees().subscribe((res) => {
      if (res.statusCode == 200) {
        this.employeeList = res.responsePayload;
        this.employeeList.splice(0, 0, {
          fullName: "Select Employee",
          value: null,
        });
      } else {
        this.employeeList = [];
      }
    });
    // this.employeeList=[{
    //         fullName: "Select Employee",
    //         value: null,
    //       },
    //       {
    //         fullName: "syed",
    //         value: 1,
    //       },
    //     ]
  }
  showDocLinkToggle(){
    this.showDocLinkModel= true
  }
  handleDocChange(event) {
    console.log(event)
  }
  getDetails(employee) {
    if (employee && employee.fullName != "Select Employee") {
      this.selectedEmployeeAction = employee;
      this.currentCategoryOptionList = [
        { label: "H-1" },
        { label: "Green Card" },
        { label: "H4 EAD" },
      ];
    } else{
      this.currentCategoryOptionList=[]
    }  
  }
  statusUpdate(rowData, index) {}
  saveCase(form) {}
  showDialogToAdd() {
    this.immigrationModel = "block";
    this.hiddenScroll();
  }
  showDialogToEdit(rowData) {
    this.immigrationModel = "block";
    this.hiddenScroll();
  }
  onDeductionType(event) {
    if (event != "other") {
      // this.payRateDetails.deductionType = event;
    }
  }
  filterCategory(event) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.categoryOptionList.length; i++) {
      let element = this.categoryOptionList[i];
      if (element.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(element);
      }
    }
    this.filteredCategory = filtered;
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
  closeUploadmodal() {
    this.immigrationModel = "none";
    this.selectedCategoryOptionList=null
    this.displayScroll();
  }
  onDeptCloseClick(event) {
    if ( event.type == "save") {
      this.linkDocList= event.details
    }
    this.showDocLinkModel = false;
  }
}
