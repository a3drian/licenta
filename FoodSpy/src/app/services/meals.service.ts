import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IMeal } from '../interfaces/IMeal';
import { Meal } from '../models/Meal';

@Injectable({
   providedIn: 'root'
})
export class MealsService {

   readonly BASE_URL: string = '/api/meals';

   meals: IMeal[] =
      [
         new Meal({ type: 'Breakfast' }),
         new Meal({ type: 'Lunch' }),
         new Meal({ type: 'Dinner' }),
         new Meal({ type: 'Snack' })
      ];

   constructor(private http: HttpClient) { }

   getMealTypes(): IMeal[] {
      return this.meals;
   }

   // ADD
   addMeal(meal: IMeal): Observable<IMeal> {
      console.log('addMeal(meal: IMeal):');

      const request = this.http
         .post<IMeal>(
            this.BASE_URL,
            meal
         )
         .pipe(
            tap(
               () => {
                  console.log('Item "', meal.type, '"was created!');
               }
            )
         );

      return request;
   }

}