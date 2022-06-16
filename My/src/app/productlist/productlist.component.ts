import { Component, OnInit } from '@angular/core';
import { MyService } from '../my.service';
@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css']
})
export class ProductlistComponent implements OnInit {

  
 
  constructor(public m:MyService) { 
    
  }

  ngOnInit(): void {
    console.log(this.m);
  }

}
