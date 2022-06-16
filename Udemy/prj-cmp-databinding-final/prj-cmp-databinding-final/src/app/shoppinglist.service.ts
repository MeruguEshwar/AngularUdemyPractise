import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from './shared/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppinglistService {
 

  constructor() { }
  ingredientChanged = new EventEmitter<Ingredient[]>();
  ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10),
  ];

  getIngrdients(){
    return this.ingredients.slice();
  }

  addIngredient(ingredients:Ingredient){
    this.ingredients.push(ingredients);
    this.ingredientChanged.emit(this.ingredients.slice())
  }

  addIngrediets(ingredients:Ingredient[]){
      // for(let ingredient of ingredients){
      //   this.addIngredient(ingredient);
      // }
      this.ingredients.push(...ingredients);
      this.ingredientChanged.emit(this.ingredients);
  }
}
