import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountService } from '../accounts.service';
import { loginService } from '../loginService';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  providers: [loginService]
})
export class AccountComponent {
  @Input() account: {name: string, status: string};
  @Input() id: number;
  @Output() statusChanged = new EventEmitter<{id: number, newStatus: string}>();

  constructor(private login:loginService,
              private acc:AccountService){
  }

  onSetTo(status: string) {
    this.acc.updateStatus(this.id , status);
    this.login.logStatusChanges(status);
  }

  
}
