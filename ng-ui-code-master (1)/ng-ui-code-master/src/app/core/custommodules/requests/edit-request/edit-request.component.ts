import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmployeeRequest } from '@app/shared/models/employeeRequest.model';
import { SharedService } from '@app/shared/shared.service';
import { EmpRequestService } from '../empRequest.service';

@Component({
  selector: 'app-edit-request',
  templateUrl: './edit-request.component.html',
  styleUrls: ['./edit-request.component.css']
})
export class EditRequestComponent implements OnInit {
  @Input() selectedEmpRequestList: any;
  @Input() empRequestType: string;
  @Input() userId: number;
  @Output() onClose = new EventEmitter<any>();
  public employeeRequestModel: string = "none";
  clientErrorMsg:any
  requestTypes: any[] = [
    {name: 'Advance Request', key: '1'}, 
    {name: 'Ask a Question to Employer', key: '2'}, 
    {name: 'Request for Correction', key: '3'}];
    empRequestDetails:EmployeeRequest;
  constructor(public sharedService: SharedService,private empRequestService:EmpRequestService) { }

  ngOnInit(): void {
    if (this.empRequestType == "Add") {
      this.empRequestDetails = new EmployeeRequest();
      this.empRequestDetails.employeeDetailsId = this.userId
    }else{
      this.empRequestDetails = this.selectedEmpRequestList
    }
    this.showDialogToAdd();
  }
  save(form:NgForm){
    this.empRequestService.saveEmployeeRequest(this.empRequestDetails).subscribe(res=>{
      if(res.statusCode==200){
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: res.message,
        });
        form.reset();
        this.onClose.emit({ type: "add" });
        this.employeeRequestModel = "none";
        this.displayScroll();
      }
    })

  }
  showDialogToAdd() {
    this.employeeRequestModel = "block";
    this.hiddenScroll();
  }
  closeAddmodal() {
    this.employeeRequestModel = "none";
    this.onClose.emit({ type: "cancel" });
    this.displayScroll();
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
}
