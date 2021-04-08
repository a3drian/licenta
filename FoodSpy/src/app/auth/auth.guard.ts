import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { log } from '../shared/Logger';
import { AuthService } from './auth.service';
import { Constants } from '../shared/Constants';

@Injectable({ 'providedIn': 'root' })
export class AuthGuardService implements CanActivate {

   constructor(
      private authService: AuthService,
      private router: Router
   ) { }

   canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
   ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

      return this.authService.user
         .pipe(
            take(1),
            map(
               (user) => {
                  const isAuth = !!user;
                  if (isAuth) {
                     log('auth.guard.ts', 'canActivate()', 'User is authenticated');
                     return true;
                  }

                  log('auth.guard.ts', 'canActivate()', 'User is not authenticated and tried to access route:', route.url);
                  return this.router.createUrlTree([Constants.APIEndpoints.LOGOUT_REDIRECT_URL]);
               }
            )
         );
   }

}