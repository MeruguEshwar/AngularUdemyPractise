import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MyProfileService } from '../../myprofile.service';
import { W4 } from '@app/shared/models/w4-module.model';
import { W4FormType, Residency, FillingStatus, Taxability, YesNo, W4FormStatus } from '@app/shared/enums/w4.enum';
import { HttpResponse } from '@angular/common/http';
import { SharedService } from '@app/shared/shared.service';

@Component({
  selector: 'app-profile-view-w4',
  templateUrl: './profile-view-w4.component.html',
  styleUrls: ['./profile-view-w4.component.css']
})
export class ProfileViewW4Component implements OnInit {
  state: any;
  userId = null;
  w4DetailsId=null
  w4Details:W4
  confirmType:string
  get W4FormType() {
    return W4FormType;
  }
  get Residency(){
    return Residency
  }
  get FillingStatus(){
    return FillingStatus
  }
  get Taxability(){
    return Taxability
  }
  get YesNo(){
    return YesNo
  }
  get Status(){
    return W4FormStatus
  }
  constructor(private activatedRoute: ActivatedRoute,private location:Location,private myProfileService:MyProfileService, private sharedService:SharedService) { }

  ngOnInit(): void {
    this.w4Details = new W4()
    this.activatedRoute.params.subscribe((params) => {
      this.state = window.history.state;
      if (this.state && this.state.userDetailsId) {
        this.userId = this.state.userDetailsId;
        this.w4DetailsId = +params['id'];
        this.getW4Details(this.w4DetailsId);
      } else {
        this.location.back()
      }
    });
  }
  getW4Details(w4DetailsId){
   this.myProfileService.getW4Details(w4DetailsId).subscribe(res=>{
     if(res.statusCode==200){
     this.w4Details = res.responsePayload
     }
   })

  }
  downloadW4Form(employeeDocumentUploadDetailsId) {
    this.myProfileService.downloadW4Doc(employeeDocumentUploadDetailsId)
      .subscribe((resp: HttpResponse<Blob>) => {
        const blob = new Blob([resp.body], { type: resp.body.type });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let imageType = resp.body.type.substring(
          resp.body.type.lastIndexOf("/") + 1
        );
        link.download = `w4Document_${employeeDocumentUploadDetailsId}.${imageType}`;
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
        this.updateW4Status('2',this.w4DetailsId)       
        break;
        case 'Reject':
        this.updateW4Status('0',this.w4DetailsId)       
        break;  
    }
  }
  updateW4Status(status,id){
    let obj = {
      "updateStatus" : status, 
      "w4DetailsId" : id
    }
    this.myProfileService.updateW4Status(obj).subscribe(res=>{
      if(res.statusCode=200){
        this.getW4Details(this.w4DetailsId);
        this.sharedService.add({
          severity: "success",
          summary: "Success",
          detail: res.message,
        });
      }
    })
  }
}
