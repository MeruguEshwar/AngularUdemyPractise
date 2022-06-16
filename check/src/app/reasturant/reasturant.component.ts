import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl, Validators } from '@angular/forms'

@Component({
  selector: 'app-reasturant',
  templateUrl: './reasturant.component.html',
  styleUrls: ['./reasturant.component.css']
})
export class ReasturantComponent implements OnInit {

  reasturant: any;
  constructor() { }

  ngOnInit(){
    this.reasturant = new FormGroup({
      DishName    : new FormControl('',[Validators.required,Validators.minLength(2)]),
      DishPrice   : new FormControl('',[Validators.required,Validators.minLength(1000)]),
      Ingridients : new FormControl(''),
    }) 
  }

  abc(){
    console.log(this.reasturant.controls['DishName'])
  }

}
