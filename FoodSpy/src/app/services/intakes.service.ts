import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
// rxjs:
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
// Interfaces:
import { IIntake } from 'foodspy-shared';
import { SearchByEmail } from '../models/searchOptions/SearchByEmail';
import { SearchByEmailAndDate } from '../models/searchOptions/SearchByEmailAndDate';
// Shared:
import { log } from '../shared/Logger';
import { STATUS_CODES } from 'foodspy-shared';

@Injectable({
   providedIn: 'root'
})
export class IntakesService {

   readonly BASE_URL: string = '/api/intakes';
   readonly SEARCH_URL: string = '/api/intakes/search/';
   readonly SEARCH_BY_EMAIL_AND_DATE: string = '/api/intakes/searchByEmailAndCreatedAt';

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
}