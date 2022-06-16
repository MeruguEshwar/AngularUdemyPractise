import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserserviceService {

  activeUser=['nani','chintu'];
  inactiveUser=['harsha','mammu'];

  constructor() { }

  setToactive(id:number){
      this.activeUser.push(this.inactiveUser[id]);
      console.log(this.activeUser);
      this.inactiveUser.splice(id,1);
  }

  setToinactive(id: number){
      this.inactiveUser.push(this.activeUser[id]);
      console.log(this.inactiveUser);
      this.activeUser.splice(id,1);
  }
}
