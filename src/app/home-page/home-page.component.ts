import { HttpClient } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { IComments } from '../interface/IComments';
import { IPageParams } from '../interface/IPageParams';
import { BaseRepository } from '../repository/BaseRepository';
import { MatCarousel, MatCarouselComponent, Orientation } from '@ngbmodule/material-carousel'
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  providers: [BaseRepository]
})
export class HomePageComponent implements OnInit {



  constructor() { }

  ngOnInit(): void {
  }






}
