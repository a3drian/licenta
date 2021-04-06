import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { exhaustMap, take } from "rxjs/operators";
import { AuthService } from "./auth.service";


@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    // attaching the token to outgoing requests

    constructor(
        private authService: AuthService
    ) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        let httpHeaders = new HttpHeaders();

        // we use "take(1)" so we don't have to manually "unsubscribe()"
        // "exhaustMap" waits for the "user" observable, then continues with the "http" observable
        return this.authService.user
            .pipe(
                take(1),
                exhaustMap(
                    (user) => {

                        console.log('Do I have user?', !user);

                        // do not modify the log in / register requests
                        if (!user) {
                            return next.handle(req);
                        }

                        if (user.token) {
                            httpHeaders.set('Authorization', user.token);
                        }

                        const modifiedRequest = req
                            .clone(
                                {
                                    headers: httpHeaders
                                }
                            );
                        console.log('modifiedRequest', modifiedRequest);
                        return next.handle(modifiedRequest);
                    }
                )
            );

    }
}