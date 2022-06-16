import { Component, OnInit } from "@angular/core";
import { MyProfileService } from "../myprofile.service";
import { W4FormStatus } from "@app/shared/enums/w4.enum";

@Component({
  selector: "app-profile-w4",
  templateUrl: "./profile-w4.component.html",
  styleUrls: ["./profile-w4.component.css"],
})
export class ProfileW4Component implements OnInit {
  cols = [
    { field: "employeeName", header: "Employee Name" },
    { field: "w4Status", header: "Status" },
    { field: "w4StatusSubmittedAt", header: "W4 Status Submitted At" },
  ];
  w4List:any
  get W4Status(){
    return W4FormStatus
  }
  constructor(private MyProfileService:MyProfileService){}
  ngOnInit(){
this.getW4ApproverList()
  }
  getW4ApproverList(){
    this.MyProfileService.getW4ApproverList().subscribe(res=>{
      if(res.statusCode==200){
this.w4List=res.responsePayload
      }else{
        this.w4List=[]
      }
    })
  }
}
