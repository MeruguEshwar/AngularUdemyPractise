import { Component, OnInit } from '@angular/core';
import { ingriends } from '../Shared/ingriends.model';

@Component({
  selector: 'app-shopinglist',
  templateUrl: './shopinglist.component.html',
  styleUrls: ['./shopinglist.component.css']
})
export class ShopinglistComponent implements OnInit {
  ingrident: ingriends[]=[
    new ingriends("apples",10),
    new ingriends("banan",20)
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
