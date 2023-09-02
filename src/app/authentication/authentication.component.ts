import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Params } from '@angular/router';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { ILoginRequest } from '../interface/ILoginRequest';



@Component({
  selector: 'authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  public loginCheck!: boolean;

  ngOnInit(): void {
    var loginOrSignUp = this.activatedRoute.toString();
    var containsLogin = loginOrSignUp.includes("login")
    this.loginCheck = (containsLogin) ? true : false;
  };
}
