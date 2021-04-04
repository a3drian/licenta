import { Injectable } from '@angular/core';
import { IMeal } from '../interfaces/IMeal';
import { Meal } from '../models/Meal';

@Injectable({
   providedIn: 'root'
})
export class MealsService {

   meals: IMeal[] =
      [
         new Meal({ type: 'Breakfast' }),
         new Meal({ type: 'Lunch' }),
         new Meal({ type: 'Dinner' }),
         new Meal({ type: 'Snack' })
      ];

   constructor() { }

   getMeals(): IMeal[] {
      return this.meals;
   }

}