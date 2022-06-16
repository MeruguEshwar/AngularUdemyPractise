import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }
  name="Eshwar@Harsha";
  name1: any = "Nani@mammu";
  Price=20000;
  Price1=50000;


  update1(y: any){
    this.Price1=y;
  }

  update(x : any ){
    this.Price=x;
  }
  ngOnInit(): void {
  }

}
