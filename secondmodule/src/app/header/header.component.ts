import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  MyWebsiteURL: any="abc://facebook";

  x=100;
  b: any;
  abc="https://static.autox.com/uploads/2020/12/Hyundai-i20-N-Line.jpg";
  name: any= "eshwar@harsha";
  todayDate = new Date();
  jsonvalue = {name : 'Eshu', age:'10',address:{a1:'hyderabad',a2:'Newyork'}};
  month: any= ['jan','feb','mar','Apr','may','jun','july','Aug','Sep','Oct','Nov','Dec'];
  number=625;
  constructor() { }
  pqr(e: any){
    console.log("this is pqr",e);
  }
  ngOnInit(): void {
  }

}
