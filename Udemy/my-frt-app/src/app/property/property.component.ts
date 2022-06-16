import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit {
  ServerCreatedStatus='No Server was Created';
  ServerName='TestServer';
  allowNewserver = false;

  constructor() {
    setTimeout(() => {
      this.allowNewserver = true;
  }, 2000);
   }

  ngOnInit(): void {
  }

  onservercreated(){
    this.ServerCreatedStatus= 'server was created and server name is '+this.ServerName;
  }

}
