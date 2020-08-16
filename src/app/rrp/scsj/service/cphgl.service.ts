import { Injectable } from '@angular/core';
import {Response, Robot} from '../../../core/entity/entity';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UrlService} from '../../../core/service/url.service';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class CphglService {
  response: Response;
  private productRatioListUrl = this.url.hostname + '/productRatio/getProductRatio';
  private productRatioListByIdUrl = this.url.hostname + '/productRatio/getProductRatioById';
  constructor(private http: HttpClient , private url: UrlService) { }


  /** GET productRatios from the server */
  // tslint:disable-next-line:variable-name
  getProductRatios(date_begin: string, date_end: string, robot_id: any): Observable<Response> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Response>(this.productRatioListUrl + '?date_begin=' + date_begin + '&date_end=' + date_end + '&robot_id=' + robot_id)
      .pipe(
        catchError(this.handleError<Response>('getProductRatios'))
      );
  }
  /** GET productRatios from the server */
  // tslint:disable-next-line:variable-name
  getProductRatio(time: string): Observable<Response> {
    return this.http.get<Response>(this.productRatioListByIdUrl + '?time=' + time)
      .pipe(
        catchError(this.handleError<Response>('getProductRatio'))
      );
  }

  /**
   * Handle Http operation that failed.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
