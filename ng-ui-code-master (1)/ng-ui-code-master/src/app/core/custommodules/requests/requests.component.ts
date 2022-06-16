import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '@app/core/service/auth.service';
import { EmployeeRequestStatus } from '@app/shared/enums/employeeRequestStatus.enum';
import { EmployeeRequestType } from '@app/shared/enums/employeeRequestType.enum';
import { EmployeeRequest } from '@app/shared/models/employeeRequest.model';
import { SharedService } from '@app/shared/shared.service';
import { EmpRequestService } from './empRequest.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  @Input() userId: number = -1;
  switchedView:boolean= false;
  user:any
  empRequestList:EmployeeRequest[];
  selectedEmpRequestList:EmployeeRequest;
  empRequestDetails:EmployeeRequest;
  statusCode:string='1';
  empRequestType:string
  public confirmModel: string = "none";
  clientErrorMsg:any
  cols:any = [];
  confirmType:string
  statusUpdateType: string;
  rowData: any;
  statusComments:string
  get EmpRequestType(){
    return EmployeeRequestType
  }
  get EmployeeRequestStatus(){
    return EmployeeRequestStatus
  }
  constructor(public sharedService: SharedService,private empRequestService:EmpRequestService,public authService: AuthService) { }

  ngOnInit(): void {
    this.switchedView = this.sharedService.getUserViewType();
    this.user = this.authService.currentUser;
    this.empRequestDetails = new EmployeeRequest();
    if (this.userId == -1) {
      this.userId = this.authService.currentUser.employeeDetailsId;
    }
    this.getEmployeeRequest(this.userId,this.statusCode);
    if(this.switchedView){
     this.cols = [
        { field: "employeeName", header: "Employee Name" },
        { field: "requestType", header: "Request Type" },
        { field: "requestedDateTime", header: "Requested Date Time" },
        { field: "description", header: "Description" },
        { field: "status", header: "Status" },
     ]
    }else{
      this.cols = [
        { field: "requestType", header: "Request Type" },
        { field: "requestedDateTime", header: "Requested Date Time" },
        { field: "description", header: "Description" },
        { field: "status", header: "Status" },
      ];
    }
  }
  getEmployeeRequest(employeeDetailsId,statusCode) {
    if(this.switchedView){
      this.empRequestService.getAllEmployeeRequest().subscribe(res=>{
        if(res.statusCode==200){
          this.empRequestList =res.responsePayload
        }
      })
    }else{
      this.empRequestService.getEmployeeRequest(employeeDetailsId,statusCode).subscribe(res=>{
        if(res.statusCode==200){
          this.empRequestList =res.responsePayload;
        }
      })
    }    
  }
  onDeleteRequest(rowData) {
    this.confirmModel = "block";
    this.selectedEmpRequestList = rowData;
    this.hiddenScroll();
  }
  confirmDelete(){
    this.empRequestService.deleteEmployeeRequest(this.selectedEmpRequestList.employeeRequestDetailsId).subscribe(res=>{
      if(res.statusCode==200){
        this.closeModal();
      }
    })
  }
  showDialogToAdd() {
    this.empRequestType = "Add";
  }
  closeModal() {
    this.confirmModel = "none";
    this.getEmployeeRequest(this.userId,this.statusCode);
    this.displayScroll();
  }
  onEditAddCloseClick(event) {
    if (event.type == "add" || event.type == "edit") {
      this.getEmployeeRequest(this.userId,this.statusCode);
    }
    this.empRequestType = "";
  }
  statusUpdate(rowData, status, type) {
    this.statusUpdateType = status;
    this.rowData = rowData;
    this.confirmType = type;
  }
  confirm(f:NgForm) {
    if(this.statusComments){
      this.empRequestService
      .empReqStatusUpdate(this.rowData.employeeRequestDetailsId,this.statusUpdateType,this.statusComments
      )
      .subscribe((res) => {
        if (res.statusCode == 200) {
          f.reset()
          this.getEmployeeRequest(this.userId,this.statusCode);
          this.statusComments=undefined;
          this.sharedService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        }
      });
    }else{
      this.sharedService.add({
        severity: "error",
        summary: "Error",
        detail: 'Please provide comments',
      });
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
}
