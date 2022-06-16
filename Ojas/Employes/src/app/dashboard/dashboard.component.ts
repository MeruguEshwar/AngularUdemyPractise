import { Component, OnInit } from '@angular/core';
import { NaniService } from '../nani.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  users: any;
  constructor(private nani:NaniService,private router:Router) { }

  ngOnInit(): void {
    this.nani.getUser().subscribe(data =>{
      console.log(data);
      this.users = data;
    })
  }
  
  navigateToTrainers(eshu:String):void{
    this.router.navigate([`${eshu}`])
}

}
