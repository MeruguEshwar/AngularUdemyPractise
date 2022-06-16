import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-two-way-data',
  templateUrl: './two-way-data.component.html',
  styleUrls: ['./two-way-data.component.css']
})
export class TwoWayDataComponent implements OnInit {
  name="Testserver";
  allowNewserver='false';
  ServerCreatedStatus="Server was not created";
  ServerName='TestServer';
  UserName='';

  constructor() { }

  ngOnInit(): void {
  }

  onservercreated(){
    this.ServerCreatedStatus= 'server was created and server name is '+this.ServerName;
  }

  element: any="ServerName";
  getSubdomainLink(element: any) {
    return String(element.subDomain).startsWith('http') ? 
    element.subDomain : 'http://' + element.subDomain;
  } 

}
