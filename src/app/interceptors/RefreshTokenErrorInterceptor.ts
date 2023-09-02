import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Route } from "@angular/compiler/src/core";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, EMPTY, finalize, Observable, retry, switchMap, tap, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { IRefreshResult } from "../interface/IRefreshResult";
import { AuthenticationService } from "../service/AuthenticationService/AuthenticationService";

@Injectable()

export class RefreshTokenInterceptor implements HttpInterceptor {


  tries!: {
    tryAttempt: number;
    tryTime: number;
  };

  constructor(
    private authStateService: AuthenticationService,
    private http: HttpClient
  ) {
    this.tries = { tryAttempt: 0, tryTime: Date.now() };
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let timeInterval: number = 0;
    const timeOut: number = 1 * 1000;                                                     // 1 Second of Timeout to prevent Recursion

    if (this.tries.tryAttempt != 0) {
      timeInterval = Date.now() - this.tries.tryTime;
      this.tries.tryTime = Date.now();
    }
    if (this.tries.tryAttempt > 0 && timeInterval < timeOut) { return next.handle(req); } // Early Return to Prevent Recursion
    this.tries.tryAttempt++;

    // RefreshToken Logic
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status != 401) { return next.handle(req) }    // Early Return
        if (this.authStateService.$authState.getValue() === false) { throwError(error); }
        const url = environment.baseUrl + 'api/authentication/refreshtoken';
        return this.http.post<IRefreshResult>(url, {}).pipe(
          switchMap((results: IRefreshResult) => {
            const token = results.accessToken;
            localStorage.setItem('token', token);
            req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
            this.authStateService.refreshTokenInnerLogic(results);
            console.log(4);
            return next.handle(req);
          }),
          catchError((refreshError: any) => {
            this.authStateService.logout();
            return throwError(refreshError);
          })
        )
      })
    )
  }
}

