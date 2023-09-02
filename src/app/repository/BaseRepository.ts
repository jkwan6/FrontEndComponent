import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'
import { IPageParams } from '../interface/IPageParams';
import { SharedUtils } from '../shared-utils/SharedUtils';

@Injectable({
  providedIn: 'any'
}) // DI Decorator
export class BaseRepository<TIn, Tout> {

  // DI Injection
  constructor(private httpClient: HttpClient) {
  }

  GetAll(url: string, pageParams: IPageParams): Observable<Tout> {
    var params = new HttpParams()
      .set(SharedUtils.nameof(pageParams, x => x.pageIndex), pageParams.pageIndex)
      .set(SharedUtils.nameof(pageParams, x => x.pageSize), pageParams.pageSize)
      .set(SharedUtils.nameof(pageParams, x => x.sortColumn), pageParams.sortColumn)
      .set(SharedUtils.nameof(pageParams, x => x.sortOrder), pageParams.sortOrder);

    if (pageParams.filterColumn && pageParams.filterQuery) {
      params = params.set(SharedUtils.nameof(pageParams, x => x.filterColumn), pageParams.filterColumn);
      params = params.set(SharedUtils.nameof(pageParams, x => x.filterQuery), pageParams.filterQuery);
    }

    var queryable = this.httpClient.get<Tout>(url, { params });
    return queryable;
  }

  GetById(baseUrl: string, id: number): Observable<Tout> {
    var url = baseUrl + "/" + id;
    var queryable = this.httpClient.get<Tout>(url);
    return queryable;
  }

  PutItem(baseUrl: string, object: TIn, id: number): Observable<Tout> {
    var url = baseUrl + "/" + id;
    var queryable = this.httpClient.put<Tout>(url, object);
    return queryable;
  }

  PostItem(baseUrl: string, object: TIn): Observable<Tout> {
    var url = baseUrl;
    var queryable = this.httpClient.post<Tout>(url, object);
    return queryable;
  };

  DeleteItem(baseUrl: string, id: number): Observable<Tout> {
    var url = baseUrl + "/" + id;
    var queryable = this.httpClient.delete<Tout>(url);
    return queryable;
  }

}
