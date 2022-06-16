import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {
  allowNewserver = false;
  ServerCreatedStatus = 'No Server was Created';
  ServerName= 'TestServer';
  UserName='';
  Servercreated= false;
  Servers=['testserver','testserver1'];

  constructor() { 
    setTimeout(() => {
          this.allowNewserver = true;
      }, 2000);
  }


  ngOnInit() {
  }

  onservercreated(){
    this.Servercreated = true;
    this.Servers.push(this.ServerName);
    this.ServerCreatedStatus= 'server was created and server name is '+this.ServerName;
  }

  onupdateServerName(event: Event){
      this.ServerName = (<HTMLInputElement>event.target).value;
  }
}


