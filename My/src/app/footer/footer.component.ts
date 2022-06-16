import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  a: any;
  price = [5888,8999,6499,3231,9999,7677,2999,1999,4232]
  LTH(){
    this.a=0;
  }
  HTL(){
    this.a=1;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
