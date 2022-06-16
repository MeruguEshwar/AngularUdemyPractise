import { Component, OnInit } from '@angular/core';
import { MyService } from '../my.service';

@Component({
  selector: 'app-productfuldetails',
  templateUrl: './productfuldetails.component.html',
  styleUrls: ['./productfuldetails.component.css']
})
export class ProductfuldetailsComponent implements OnInit {

  constructor(public n:MyService) { }

  ngOnInit(): void {
  }

}
