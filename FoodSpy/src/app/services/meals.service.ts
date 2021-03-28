import { Injectable } from '@angular/core';
import { IMeal } from '../interfaces/IMeal';
import { Meal } from '../models/Meal';

@Injectable({
   providedIn: 'root'
})
export class MealsService {

   meals: IMeal[] =
      [
         new Meal({ name: 'Breakfast' }),
         new Meal({ name: 'Lunch' }),
         new Meal({ name: 'Dinner' }),
         new Meal({ name: 'Snack' })
      ];

   constructor() { }

   getMeals(): IMeal[] {
      return this.meals;
   }

}