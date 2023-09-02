import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../service/AuthenticationService/AuthenticationService';

@Injectable({
  providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean |
    UrlTree {    // If User is Authenticated, Returns True to the CanActivate Method    if (this.authService.$authState.value) { return true; }
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }    });
    return false;


    
  }
}
