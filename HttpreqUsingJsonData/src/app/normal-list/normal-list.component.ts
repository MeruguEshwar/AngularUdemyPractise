import { Component, OnInit } from '@angular/core';
import { MyService } from '../my.service';

@Component({
  selector: 'app-normal-list',
  templateUrl: './normal-list.component.html',
  styleUrls: ['./normal-list.component.css']
})
export class NormalListComponent implements OnInit {

  public res:any;
  constructor(public n:MyService) { }

  ngOnInit(){
      this.n.getProducts().subscribe((data =>{
      this.res=data
      }));
  }
}
