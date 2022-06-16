import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app/shared/shared.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  emailId:string
  constructor(public sharedService:SharedService) { }

  ngOnInit(): void {
  }
  onFormSubmit(){
    
  }
}
