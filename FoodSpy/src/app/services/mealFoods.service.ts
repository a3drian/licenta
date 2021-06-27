import { Injectable } from '@angular/core';
// Interfaces:
import { IFood, IMealFood } from 'foodspy-shared';
// Models:
import { Food, FoodDetail } from '../models/Food';
// Services:
import { HelperService } from './helper.service';
// Shared:
import { log } from '../shared/Logger';
import { Constants } from '../shared/Constants';

@Injectable({
   providedIn: 'root'
})
export class MealFoodsService {

   isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

   constructor(
      private helperService: HelperService
   ) { }

   calculateMealFoodDetails(mealFood: IMealFood): FoodDetail {
      const food: IFood = mealFood.food;
      const quantity: number = mealFood.quantity;
      if (food) {
         const f: FoodDetail = new FoodDetail(
            {
               energy: this.helperService.getFoodValuePerQuantity(food.energy, quantity),
               fats: this.helperService.getFoodValuePerQuantity(food.fats, quantity),
               saturates: this.helperService.getFoodValuePerQuantity(food.saturates, quantity),
               carbohydrates: this.helperService.getFoodValuePerQuantity(food.carbohydrates, quantity),
               sugars: this.helperService.getFoodValuePerQuantity(food.sugars, quantity),
               proteins: this.helperService.getFoodValuePerQuantity(food.proteins, quantity),
               salt: this.helperService.getFoodValuePerQuantity(food.salt, quantity),
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

}
