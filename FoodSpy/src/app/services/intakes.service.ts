import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IIntake } from '../interfaces/IIntake';
import { ISearchOptions } from '../interfaces/searchOptions/ISearchOptions';
import { Intake } from '../models/Intake';
import { SearchByEmail } from '../models/searchOptions/SearchByEmail';

@Injectable({
   providedIn: 'root'
})
export class IntakesService {

   readonly BASE_URL: string = '/api/intakes';
   readonly SEARCH_URL: string = '/api/intakes/search/';

   constructor(private http: HttpClient) { }

   // ADD
   addIntake(intake: IIntake): Observable<IIntake> {
      console.log('addIntake(intake: IIntake):');

      const request = this.http
         .post<IIntake>(
            this.BASE_URL,
            intake
         )
         .pipe(
            tap(
               () => {
                  console.log('Intake for e-mail:"', intake.email, '"was created!');
               }
            )
         );

      return request;
   }

   // Get intake by ID
   getIntakeById(id: string): Observable<IIntake> {
      console.log('getDataById(id: string):');
      const url = `${this.BASE_URL}/${id}`;
      console.log('url:', url);

      const request = this.http.get<IIntake>(url)
         .pipe(
            tap(
               (response) => {
                  console.log('Intake fetched:', response);
               }
            )
         );
      return request;
   }

   // Get intakes by e-mail
   getIntakesByEmail(email: string) {
      const request = this.http
         .post(
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
}