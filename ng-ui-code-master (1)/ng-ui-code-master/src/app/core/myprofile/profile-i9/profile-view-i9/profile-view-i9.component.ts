import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { I9FormStatus } from '@app/shared/enums/i9.enum';
import { I9 } from '@app/shared/models/i9-module.model';
import { SharedService } from '@app/shared/shared.service';
import { from } from 'rxjs';
import { MyProfileService } from '../../myprofile.service';
import {Location} from '@angular/common'
import { HttpResponse } from '@angular/common/http';
import { I9EmployeerVerification } from '@app/shared/models/i9EmployeerVerification-module.model';

@Component({
  selector: 'app-profile-view-i9',
  templateUrl: './profile-view-i9.component.html',
  styleUrls: ['./profile-view-i9.component.css']
})
export class ProfileViewI9Component implements OnInit {
  state: any;
  userId = null;
  i9DetailsId=null
  webI9Details:I9
  i9EmployeerVerification: I9EmployeerVerification
  confirmType:string
  get Status(){
    return I9FormStatus
  }
  verificationType:any=[
    {label:'Select Verification Type',value:null},
    {label:'In Person Verification',value:'In Person Verification'},
    {label:'Virtual Verification',value:'Virtual Verification'},
    {label:'Other',value:'Other'},
  ]
  constructor(private activatedRoute: ActivatedRoute,private location:Location,private myProfileService:MyProfileService, private sharedService:SharedService) { }

  ngOnInit(): void {
    this.webI9Details = new I9()
    this.i9EmployeerVerification = new I9EmployeerVerification()
    this.activatedRoute.params.subscribe((params) => {
      this.state = window.history.state;
      if (this.state && this.state.userDetailsId) {
        this.userId = this.state.userDetailsId;
        this.i9DetailsId = +params['id'];
        this.getI9Details(this.i9DetailsId);
      } else {
        this.location.back()
      }
    });
  }
  getI9Details(i9DetailsId){
   this.myProfileService.getI9Details(i9DetailsId).subscribe(res=>{
     if(res.statusCode==200){
     this.webI9Details = res.responsePayload
     }
   })
  }
  downloadI9Form(employeeDocumentUploadDetailsId) {
    this.myProfileService.downloadI9Doc(employeeDocumentUploadDetailsId)
      .subscribe((resp: HttpResponse<Blob>) => {
        const blob = new Blob([resp.body], { type: resp.body.type });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let imageType = resp.body.type.substring(
          resp.body.type.lastIndexOf("/") + 1
        );
        link.download = `i9Document_${employeeDocumentUploadDetailsId}.${imageType}`;
        link.click();
        link.remove();
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: "File downloaded",
        });
      });
  }
  action(type){
    switch (type) {
      case 'approve':
        this.confirmType = 'Approve'        
        break;
        case 'reject':
        this.confirmType = 'Reject'        
        break;    
      default:
        this.confirmType = null
        break;
    }

  }
  confirm(type){
    switch (type) {
      case 'Approve':
        this.updateI9Status('2',this.i9DetailsId)       
        break;
        case 'Reject':
        this.updateI9Status('0',this.i9DetailsId)       
        break;  
    }
  }
  updateI9Status(status,id){
    this.i9EmployeerVerification.approveOrReject = status
    this.i9EmployeerVerification.i9DetailsId=id
    if(this.i9EmployeerVerification.customVerificationType){
      this.i9EmployeerVerification.verificationType = this.i9EmployeerVerification.customVerificationType
    }
    console.log(this.i9EmployeerVerification)
    // this.myProfileService.updateI9Status(this.i9EmployeerVerification).subscribe(res=>{
    //   if(res.statusCode=200){
    //     this.getI9Details(this.i9DetailsId);
    //     this.sharedService.add({
    //       severity: "success",
    //       summary: "Success",
    //       detail: res.message,
    //     });
    //   }
    // })
  }
  saveI9EmploymentAuthDetails(){
    
  }
  checkType(data) {
    if (data == "1") {
      return "Yes";
    } else {
      return "No";
    }
  }
  showDialogToUpload(){

  }
  chechVerificationType(type){
    let getType = this.verificationType.filter(res=>{
      return res.value = type
    })
    if(getType.length && type){
      this.i9EmployeerVerification.customVerificationType = getType[0].value
      this.i9EmployeerVerification.verificationType = 'Other'
    }
  }
  refresh(){
    this.i9EmployeerVerification.verificationType = null
  }

}
