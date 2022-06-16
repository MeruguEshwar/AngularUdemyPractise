import { Component, OnInit } from '@angular/core';
import { UserserviceService } from '../userservice.service';

@Component({
  selector: 'app-active-user',
  templateUrl: './active-user.component.html',
  styleUrls: ['./active-user.component.css']
})
export class ActiveUserComponent implements OnInit {
  user: string[] = [];
  constructor(private acuser:UserserviceService) {

   }

  ngOnInit() {
    this.user = this.acuser.activeUser;
  }

  onSetToInactive(id: number){
      this.acuser.setToinactive(id);
  }

}
