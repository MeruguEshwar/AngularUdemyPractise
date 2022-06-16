import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdduserComponent } from './adduser/adduser.component';
import { UsersComponent } from './users.component';
import { EdituserComponent } from './edituser/edituser.component';



@NgModule({
  declarations: [AdduserComponent, UsersComponent,EdituserComponent],
  imports: [
    CommonModule,
  ]
})
export class UserModule { }
