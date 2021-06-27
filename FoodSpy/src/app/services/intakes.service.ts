import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
// rxjs:
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
// Interfaces:
import { IIntake, IMeal, IMealFood } from 'foodspy-shared';
// Models:
import { FoodDetail } from '../models/Food';
import { SearchByEmail } from '../models/searchOptions/SearchByEmail';
import { SearchByEmailAndDate } from '../models/searchOptions/SearchByEmailAndDate';
// Services:
import { MealFoodsService } from './mealFoods.service';
// Shared:
import { Constants } from '../shared/Constants';
import { STATUS_CODES } from 'foodspy-shared';
import { log } from '../shared/Logger';

@Injectable({
   providedIn: 'root'
})
export class IntakesService {

   readonly BASE_URL: string = Constants.APIEndpoints.INTAKES_BASE_URL;
   readonly SEARCH_URL: string = Constants.APIEndpoints.INTAKES_SEARCH_URL;
   readonly SEARCH_BY_EMAIL_AND_DATE: string = Constants.APIEndpoints.INTAKES_SEARCH_BY_EMAIL_AND_DATE;

   constructor(
      private http: HttpClient,
      private mealFoodsService: MealFoodsService,
   ) { }

   // ADD
   addIntake(intake: IIntake): Observable<IIntake> {

      const request = this.http
         .post<IIntake>(
            this.BASE_URL,
            intake
         )
         .pipe(
            tap(
               () => {
                  log('intake.service.ts', this.addIntake.name, `Intake for e-mail '${intake.email}' was created!`);
               }
            )
         );

      return request;
   }

   // EDIT (PUT)
   editIntake(intake: IIntake): Observable<IIntake> {
      const url = `${this.BASE_URL}/${intake.id}`;
      log('intake.service.ts', this.editIntake.name, 'url:', url);

      const request = this.http.put<IIntake>(url, intake)
         .pipe(
            tap(
               () => {
                  log('intake.service.ts', this.editIntake.name, `Intake '${intake.id}' was edited!`);
               }
            )
         );

      return request;
   }

   // Get intake by ID
   getIntakeById(id: string): Observable<IIntake> {
      const url = `${this.BASE_URL}/${id}`;
      log('intakes.service.ts', this.getIntakeById.name, 'URL:', url);

      const request = this.http.get<IIntake>(url)
         .pipe(
            tap(
               (response) => {
                  log('intakes.service.ts', this.getIntakeById.name, 'Intake fetched:', response);
               }
            )
         );
      return request;
   }

   // Get intakes by e-mail
   getIntakesByEmail(
      email: string
   ): Observable<IIntake> {
      const request = this.http
         .post<IIntake>(
            this.SEARCH_URL,
            new SearchByEmail(
               {
                  email: email
               }
            )
         )
         .pipe(
            tap(
               () => { }
            )
         );

      return request;
   }

   // Get intake by e-mail and createdAt
   getIntakeByEmailAndCreatedAt(
      email: string,
      today: Date
   ): Observable<IIntake> {
      const request = this.http
         .post<IIntake>(
            this.SEARCH_BY_EMAIL_AND_DATE,
            new SearchByEmailAndDate(
               {
                  email: email,
                  createdAt: today
               }
            )
         )
         .pipe(
            tap(
               () => { },
               (error: HttpErrorResponse) => {
                  log('intakes.service.ts', this.getIntakeByEmailAndCreatedAt.name, 'Error:', error);
                  if (error.status === STATUS_CODES.NOT_FOUND) { }
               }
            )
         );


      log('intakes.service.ts', this.getIntakeByEmailAndCreatedAt.name, 'request:', request);

      return request;
   }

   // DELETE
   deleteIntake(intake: IIntake): Observable<string> {
      const url = `${this.BASE_URL}/${intake.id}`;
      log('intakes.service.ts', this.deleteIntake.name, 'URL:', url);

      const request = this.http.delete(url, { responseType: 'text' })
         .pipe(
            tap(
               () => {
                  log('intake.service.ts', this.deleteIntake.name, `Intake '${intake.id}' was deleted!`);
               },
               (error: HttpErrorResponse) => {
                  log('intakes.service.ts', this.deleteIntake.name, 'Error:', error);
               }
            )
         );

      return request;
   }


   populateIntakeDetails(intake: IIntake): FoodDetail {
      const meals: IMeal[] = intake.meals;
      let f: FoodDetail = new FoodDetail(
         {
            energy: 0,
            fats: 0,
            saturates: 0,
            carbohydrates: 0,
            sugars: 0,
            proteins: 0,
            salt: 0,
         });
      if (meals) {
         meals.forEach(
            (meal: IMeal) => {
               const mealFoods: IMealFood[] = meal.mealFoods;
               if (mealFoods) {
                  mealFoods.forEach(
                     (mealFood: IMealFood) => {
                        const food = this.mealFoodsService.calculateMealFoodDetails(mealFood);
                        if (food) {
                           f.energy += food.energy;
                           f.fats += food.fats;
                           f.saturates += food.saturates;
                           f.carbohydrates += food.carbohydrates;
                           f.sugars += food.sugars;
                           f.proteins += food.proteins;
                           f.salt += food.salt;
                        } else {
                           log('intakes.service.ts', this.populateIntakeDetails.name, 'if (food) returned null');
                        }
                     }
                  );
               }
            }
         );
      }
      return f;
   }
}