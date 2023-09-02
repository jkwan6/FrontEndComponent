import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Route } from "@angular/compiler/src/core";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, EMPTY, Observable, throwError } from "rxjs";
import { AuthenticationService } from "../service/AuthenticationService/AuthenticationService";

@Injectable()
export class TokenHeaderInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var token = localStorage.getItem("token");

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(req);
  }
}

