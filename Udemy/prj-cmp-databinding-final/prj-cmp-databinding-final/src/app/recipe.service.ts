import { EventEmitter, Injectable } from '@angular/core';
import { Recipe } from './recipes/recipe.model';
import { Ingredient } from './shared/ingredient.model';
import { ShoppinglistService } from './shoppinglist.service';
@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  recipeSelected = new EventEmitter<Recipe>();
  constructor(private shoppinglistService:ShoppinglistService) { }

  private recipes: Recipe[] = [
    new Recipe(
      'A Test Recipe', 
      'This is simply a test', 
      'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
      [
        new Ingredient('Meat',1),
        new Ingredient('French fried',20)
      ]),
    new Recipe(
      'Another Test Recipe', 
      'This is simply a test', 
      'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
      [
        new Ingredient('Buns',2),
        new Ingredient('Meat',1)
      ])
  ];

  getRecipes(){
    return this.recipes.slice();
  }

  getRecipe(index: number){
      return this.recipes.slice()[index];
  }

  addIngredientsToshoppinglist(ingredients: Ingredient[]){
      this.shoppinglistService.addIngrediets(ingredients);
  }
}
