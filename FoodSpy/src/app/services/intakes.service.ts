import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IIntake } from '../interfaces/IIntake';
import { SearchByEmail } from '../models/searchOptions/SearchByEmail';
import { SearchByEmailAndDate } from '../models/searchOptions/SearchByEmailAndDate';
import { log } from '../shared/Logger';

@Injectable({
   providedIn: 'root'
})
export class IntakesService {

   readonly BASE_URL: string = '/api/intakes';
   readonly SEARCH_URL: string = '/api/intakes/search/';

   constructor(private http: HttpClient) { }

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
   ) {
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

   // Get intakes by e-mail and createdAt
   getIntakesByEmailAndCreatedAt(
      email: string,
      createdAt: Date
   ): Observable<IIntake> {
      const request = this.http
         .post<IIntake>(
            this.SEARCH_URL,
            new SearchByEmailAndDate(
               {
                  email: email,
                  createdAt: createdAt
               }
            )
         )
         .pipe(
            tap(
               () => { },
               (error: HttpErrorResponse) => {
                  log('intakes.service.ts', this.getIntakesByEmailAndCreatedAt.name, 'Error:', error);
                  if (error.status === 404) { }
               }
            )
         );


      log('intakes.service.ts', this.getIntakesByEmailAndCreatedAt.name, 'request:', request);

      return request;
   }
}