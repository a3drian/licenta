import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
// rxjs:
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
// Interfaces:
import { IFood, IMealFood } from 'foodspy-shared';
// Models:
import { Food } from '../models/Food';
// Services:
import { AuthService } from '../auth/auth.service';
import { HelperService } from './helper.service';
// Shared:
import { Constants } from '../shared/Constants';
import { log } from '../shared/Logger';

@Injectable({
   providedIn: 'root'
})
export class FoodsService {
   readonly BASE_URL: string = Constants.APIEndpoints.FOODS_BASE_URL;
   readonly SEARCH_BY_NAME_URL: string = this.BASE_URL + Constants.APIEndpoints.FOODS_SERACH_URL;

   constructor(
      private http: HttpClient,
      private authService: AuthService,
      private helperService: HelperService
   ) { }

   // GET
   getFoods(
      foodName = ''
   ): Observable<IFood[] | null> {

      const params = new HttpParams()
         .set('name', foodName.toString());

      return this.http
         .get<IFood[]>(this.BASE_URL,
            {
               params: params,
               observe: 'response'
            }
         )
         .pipe(
            tap(
               (response) => {
                  log('foods.service.ts', this.getFoods.name, 'Foods fetched:', response.body);
               }
            ),
            map(
               (response) => {
                  return response.body;
               }
            )
         );
   }

   // Get food by ID
   getFoodById(id: string): Observable<IFood> {
      const url = `${this.BASE_URL}/${id}`;
      log('foods.service.ts', this.getFoodById.name, 'URL:', url);

      const request = this.http.get<IFood>(url)
         .pipe(
            tap(
               (response) => {
                  log('foods.service.ts', this.getFoodById.name, 'Food fetched:', response);
               }
            )
         );
      return request;
   }

   // FILTER
   search(term: string): Observable<IFood[]> {

      log('foods.service.ts', this.search.name, '');

      return this.http
         .get<IFood[]>(`${this.SEARCH_BY_NAME_URL}${term}`)
         .pipe(
            tap(
               (searchResults) => {
                  searchResults.length ?
                     log('foods.service.ts', this.search.name, `Found ${searchResults.length} items matching: `, term) :
                     log('foods.service.ts', this.search.name, 'No items matching: ', term);
               }
            )
         );
   }

   updateFoodInfo(food: IFood, quantity: number): IFood {
      const f: IFood = new Food(
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
   }

   populateFoodInfoFromMealFood(mealFood: IMealFood): IFood {
      const f = new Food({
         displayName: mealFood.food.displayName,
         energy: mealFood.food.energy,
         fats: mealFood.food.fats,
         saturates: mealFood.food.saturates,
         carbohydrates: mealFood.food.carbohydrates,
         sugars: mealFood.food.sugars,
         proteins: mealFood.food.proteins,
         salt: mealFood.food.salt,
      });
      return f;
   }

}
