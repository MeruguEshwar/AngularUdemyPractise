import { Component, OnInit } from '@angular/core';
import { ShoppinglistService } from '../shoppinglist.service';
import { Ingredient } from '../shared/ingredient.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Ingredient[];

  constructor(private shoppinglistService:ShoppinglistService) { }

  ngOnInit() {
    this.ingredients=this.shoppinglistService.getIngrdients();
    this.shoppinglistService.ingredientChanged.
    subscribe(
     (ingredients:Ingredient[])=>{
       this.ingredients=ingredients;
     } 
    )
  }

 
}
