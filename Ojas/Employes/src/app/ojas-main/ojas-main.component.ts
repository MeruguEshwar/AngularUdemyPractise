import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ojas-main',
  templateUrl: './ojas-main.component.html',
  styleUrls: ['./ojas-main.component.css']
})
export class OjasMainComponent implements OnInit {

  

  ngOnInit(): void {
  }


  ImagePath1: string;

  ImagePath2: string;

  ImagePath3: string;

  ImagePath4: string;

  ImagePath5: string;



  constructor(private router:Router){

    this.ImagePath1 = '/assets/Img/01.jpg';

    this.ImagePath2 = '/assets/Img/02.jpg';

    this.ImagePath3 = '/assets/Img/03.jpg';

    this.ImagePath4 = '/assets/Img/04.jpg';

    this.ImagePath5 = '/assets/Img/05.jpg';

  }

  navigateToLogin(nani:String):void{
      this.router.navigate([`${nani}`])
  }

}
