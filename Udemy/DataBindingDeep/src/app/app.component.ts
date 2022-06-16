import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DataBindingDeep';
  serverData: any;
  bluePrintrData: any;

  serverElements = [{type:'server',name:'test the Merugu Server',content:'just a test'}];


  onServeradded(serverData:{serverName: string, serverContent: string}) {
    this.serverElements.push({
      type: 'server',
      name: serverData.serverName,
      content: serverData.serverContent
    });
  }

  onBlueprintadded(bluePrintrData:{serverName: string, serverContent: string}) {
    this.serverElements.push({
      type: 'blueprint',
      name: bluePrintrData.serverName,
      content: bluePrintrData.serverContent
    });
  }

}
