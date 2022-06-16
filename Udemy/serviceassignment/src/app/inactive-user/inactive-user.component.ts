import { Component, OnInit } from '@angular/core';
import { UserserviceService } from '../userservice.service';

@Component({
  selector: 'app-inactive-user',
  templateUrl: './inactive-user.component.html',
  styleUrls: ['./inactive-user.component.css']
})
export class InactiveUserComponent implements OnInit {

  users: string[] = [];

  constructor(private inuser:UserserviceService) { 

  }

  ngOnInit() {
    this.users = this.inuser.inactiveUser;
  }

  onSetToactive(id: number){
    this.inuser.setToactive(id);
}

}
