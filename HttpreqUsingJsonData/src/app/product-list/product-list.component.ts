import { Component, OnInit } from '@angular/core';
import { MyService } from '../my.service';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  public results:any;
  constructor(public m:MyService) { }

  ngOnInit(){
    this.m.getProducts().subscribe((data =>{
    this.results=data}));
  }

}
