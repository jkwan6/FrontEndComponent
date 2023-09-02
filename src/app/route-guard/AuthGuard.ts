import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../service/AuthenticationService/AuthenticationService';

@Injectable({
  providedIn: 'root'
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    UrlTree {
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    return false;


    
  }
}