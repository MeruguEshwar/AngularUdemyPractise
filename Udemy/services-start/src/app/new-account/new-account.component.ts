import { Component, EventEmitter, Output } from '@angular/core';
import { AccountService } from '../accounts.service';
import { loginService } from '../loginService';
@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css'],
  providers: [loginService]
})
export class NewAccountComponent {
  @Output() accountAdded = new EventEmitter<{name: string, status: string}>();

  constructor(private login:loginService,
              private accountservice:AccountService){}
             

   onCreateAccount( accountName: string , accountStatus: string) {
      this.accountservice.addAccount(accountName,accountStatus);
      this.login.logStatusChanges(accountStatus);
  }
            
  
}
