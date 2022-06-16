import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  ServerName="test";
  constructor() { }

  ngOnInit(): void {
  }

  onupdateServerName(event: Event){
    this.ServerName = (<HTMLInputElement>event.target).value;
}

}
