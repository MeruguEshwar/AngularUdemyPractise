import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private route:Router) { }

  ngOnInit() {
  }
  OnloadServer(id: number){
    this.route.navigate(['/Servers',id,'edit'],{queryParams:{allowedit:'1'}, fragment:'loading'});
    //is used to give the server raw data
  }
}
