import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IMeal } from 'foodspy-shared';
import { ISearchOptions } from '../interfaces/searchOptions/ISearchOptions';
import { Meal } from '../models/Meal';
import { SearchByEmail } from '../models/searchOptions/SearchByEmail';
import { log } from '../shared/Logger';
import { Constants } from '../shared/Constants';

@Injectable({
   providedIn: 'root'
})
export class MealsService {

   readonly BASE_URL: string = Constants.APIEndpoints.MEALS_BASE_URL;
   readonly SEARCH_URL: string = Constants.APIEndpoints.MEALS_SEARCH_URL;

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
      log('meals.service.ts', 'addMeal(meal: IMeal)', '');

      const request = this.http
         .post<IMeal>(
            this.BASE_URL,
            meal
         )
         .pipe(
            tap(
               () => {
                  log('meals.service.ts', 'addMeal(meal: IMeal)', `Item '${meal.type}' was created!`);
               }
            )
         );

      return request;
   }

   // Get meal by ID
   getMealById(id: string): Observable<IMeal> {
      const url = `${this.BASE_URL}/${id}`;
      log('meals.service.ts', 'getDataById(id: string)', 'URL:', url);

      const request = this.http.get<IMeal>(url)
         .pipe(
            tap(
               (response) => {
                  log('meals.service.ts', 'getDataById(id: string)', 'Meal fetched:', response);
               }
            )
         );
      return request;
   }

}