import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IApiObject } from '../../interface/IApiObject';
import { IComments } from '../../interface/IComments';
import { IPageParams } from '../../interface/IPageParams';
import { BaseRepository } from '../../repository/BaseRepository';

@Component({
  selector: 'app-comment-module',
  templateUrl: './comment-module.component.html',
  styleUrls: ['./comment-module.component.css'],
  providers: [BaseRepository]
})
export class CommentModuleComponent implements AfterViewInit {

  // #region Constructor
  constructor(
    private repository: BaseRepository<IApiObject<IComments[]>, IApiObject<IComments[]>>,
    private cdr: ChangeDetectorRef
  ) {
    this.commentRepository$ = this.repository.GetAll("url", this.params)
    this.url = "api/comments" // Gotta Refactor
  }
  // #endregion

  // #region Properties
  url!: string
  commentRepository$: Observable<IApiObject<IComments[]>>
  public displayedColumns: string[] = ["CommentsDefinition"];       // Not sure why we need that
  public Comments!: MatTableDataSource<IComments>;                  // Generic Class from AngMat Table
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Setting Default Values
  params: IPageParams =
    {
      pageIndex : 0,
      pageSize: 5,
      filterColumn: "id",
      sortColumn: "id",
      sortOrder: "desc",
      filterQuery: ""
    }
  // #endregion

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    this.url = environment.baseUrl + this.url;
    this.loadData();
  };

  loadData(event?:  PageEvent) {
    //var pageEvent = new PageEvent();
    //pageEvent.pageIndex = this.params.pageIndex;
    //pageEvent.pageSize = this.params.pageSize;

    this.setPaginatorValues();

    var obs = this.repository.GetAll(this.url, this.params);
    obs.subscribe(results => {
      this.paginator.length = results.count;
      this.paginator.pageIndex = this.params.pageIndex;
      this.paginator.pageSize = this.params.pageSize;
      this.Comments = new MatTableDataSource<IComments>(results.objects);
    })
  }

  setPaginatorValues() {
    var sortColumn = (this.sort) ? this.sort.active : this.params.sortColumn;      // Active is the Current string
    var sortOrder = (this.sort) ? this.sort.direction : this.params.sortOrder;    // Direction is Ascending/Descending
    var filterQuery = (this.params.filterQuery) ? this.params.filterQuery : null;
    var filterColumn = (this.params.filterColumn) ? this.params.filterColumn : null;

    this.params.sortOrder = sortOrder;
    this.params.sortColumn = sortColumn;
    this.params.filterQuery = (filterQuery) ? filterQuery : "";
    this.params.sortColumn = filterColumn ? filterColumn : "";
    this.params.pageSize = this.paginator.pageSize;
    this.params.pageIndex = this.paginator.pageIndex;
  }
}
