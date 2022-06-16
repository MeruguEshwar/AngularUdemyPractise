import { Component, OnInit, Input } from "@angular/core";
import { MyProfileService } from "../myprofile.service";
import { W4FormStatus } from "@app/shared/enums/w4.enum";

@Component({
  selector: "app-profile-i9",
  templateUrl: "./profile-i9.component.html",
  styleUrls: ["./profile-i9.component.css"],
})
export class ProfileI9Component implements OnInit {
  cols = [
    { field: "employeeName", header: "Employee Name" },
    { field: "i9Status", header: "Status" },
    { field: "i9StatusSubmittedAt", header: "W4 Status Submitted At" },
  ];
  i9List:any
  confirmType:string
  get W4Status(){
    return W4FormStatus
  }
  constructor(private MyProfileService:MyProfileService){}
  ngOnInit(){
this.getI9ApproverList()
  }
  getI9ApproverList(){
    this.MyProfileService.getI9ApproverList().subscribe(res=>{
      if(res.statusCode==200){
this.i9List=res.responsePayload
      }else{
        this.i9List=[]
      }
    })
  }
}
