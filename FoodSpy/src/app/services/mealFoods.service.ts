import { Injectable } from '@angular/core';
// Interfaces:
import { IFood, IMealFood } from 'foodspy-shared';
// Models:
import { FoodDetail } from '../models/Food';
// Shared:
import { log } from '../shared/Logger';
import { Constants } from '../shared/Constants';

@Injectable({
   providedIn: 'root'
})
export class MealFoodsService {

   isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

   constructor() { }

   calculateMealFoodDetails(mealFood: IMealFood): FoodDetail {
      const food: IFood = mealFood.food;
      const quantity: number = mealFood.quantity;
      if (food) {
         const f: FoodDetail = new FoodDetail(
            {
               energy: this.getFoodValuePerQuantity(food.energy, quantity),
               fats: this.getFoodValuePerQuantity(food.fats, quantity),
               saturates: this.getFoodValuePerQuantity(food.saturates, quantity),
               carbohydrates: this.getFoodValuePerQuantity(food.carbohydrates, quantity),
               sugars: this.getFoodValuePerQuantity(food.sugars, quantity),
               proteins: this.getFoodValuePerQuantity(food.proteins, quantity),
               salt: this.getFoodValuePerQuantity(food.salt, quantity),
            });
         return f;
      } else {
         log('mealFoods.service.ts', this.calculateMealFoodDetails.name, 'mealFood.food returned null');
         const f: FoodDetail = new FoodDetail(
            {
               energy: 0,
               fats: 0,
               saturates: 0,
               carbohydrates: 0,
               sugars: 0,
               proteins: 0,
               salt: 0,
            });
         return f;
      }
   }

   private getFoodValuePerQuantity(foodValue: number, quantity: number): number {
      const value: number = foodValue * quantity / 100;
      return value;
   }

}