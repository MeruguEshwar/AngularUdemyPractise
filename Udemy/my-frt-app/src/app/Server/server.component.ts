
import { Component,OnInit } from "@angular/core";

@Component({
    selector:'app-server',
    templateUrl:'./server.component.html',
    styles:[' h1{font-weight:normal}  .class{color:white}']
})
export class Servercomponent
{
   
    serverId=10;
    serverstatus='online';
    online: any;

    getserverStatus(){
        return this.serverstatus;
    }

    getColor(){
        return this.serverstatus === 'online' ? 'green' : 'red' ;
    }

    constructor(){
       this.serverstatus = Math.random() > 0.5 ? 'online' : 'offline';
    }
    ngOnInit(){

    }
}