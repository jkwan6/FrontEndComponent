import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Route } from "@angular/compiler/src/core";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, EMPTY, finalize, Observable, retry, switchMap, tap, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { IRefreshResult } from "../interface/IRefreshResult";
import { AuthenticationService } from "../service/AuthenticationService/AuthenticationService";

@Injectable()

export class RefreshTokenTimeOutInterceptor implements HttpInterceptor {

  tryAttempts: number = 0;

  constructor(
    private authStateService: AuthenticationService,
    private http: HttpClient
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    var accessToken = localStorage.getItem('token');
    if (!accessToken) { return next.handle(req); }
    const jwtBase64 = accessToken.split('.')[1];
    const jwtToken = JSON.parse(atob(jwtBase64!));
    const accessTokenExpires = new Date(jwtToken.exp * 1000);
    var accessTokenExpired = Date.now() > accessTokenExpires.getTime();

    if (!accessTokenExpired) { return next.handle(req); }

    if (this.tryAttempts > 0) { return next.handle(req); }  // To prevent recursion
    this.tryAttempts++;
    console.log('refreshing token')
    const url = environment.baseUrl + 'api/authentication/refreshtoken';
    return this.http.post<IRefreshResult>(url, {}).pipe(
      switchMap((results) => {
        const token = results.accessToken;
        localStorage.setItem('token', token);
        req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
        this.authStateService.refreshTokenInnerLogic(results);
        return next.handle(req);
      })
    )
  }
}

