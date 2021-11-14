import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// rxjs:
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
// Interfaces:
import { IMeal } from 'foodspy-shared';
import { Meal } from '../models/Meal';
// Shared:
import { Constants } from '../shared/Constants';
import { log } from '../shared/Logger';

@Injectable({
   providedIn: 'root'
})
export class MealsService {

   readonly BASE_URL: string = Constants.APIEndpoints.MEALS_BASE_URL;
   readonly SEARCH_URL: string = this.BASE_URL + Constants.APIEndpoints.MEALS_SEARCH_URL;

   meals: IMeal[] = [];

   constructor(private http: HttpClient) {
      this.meals = [
         new Meal({ type: 'Breakfast' }),
         new Meal({ type: 'Lunch' }),
         new Meal({ type: 'Dinner' }),
         new Meal({ type: 'Snack' })
      ];
   }

   getMealTypes(): IMeal[] {
      return this.meals;
   }

   // ADD (POST)
   addMeal(meal: IMeal): Observable<IMeal> {

      const request = this.http
         .post<IMeal>(
            this.BASE_URL,
            meal
         )
         .pipe(
            tap(
               () => {
                  log('meals.service.ts', 'addMeal(meal: IMeal)', `Meal of type '${meal.type}' was created!`);
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

   // EDIT (PUT)
   editMeal(meal: IMeal): Observable<IMeal> {
      const url = `${this.BASE_URL}/${meal.id}`;
      log('meal.service.ts', this.editMeal.name, 'url:', url);

      const request = this.http.put<IMeal>(url, meal)
         .pipe(
            tap(
               () => {
                  log('meal.service.ts', this.editMeal.name, `Meal '${meal.id}' was edited!`);
               }
            )
         );

      return request;
   }
}