import { Injectable } from '@angular/core';
import {Response} from '../../../core/entity/entity';
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
export class HntflService {
  response: Response;
  private concreteCountListUrl = this.url.hostname + '/concreteCount/getConcreteCount';
  private concreteCountListByIdUrl = this.url.hostname + '/concreteCount/getConcreteCountById';
  constructor(private http: HttpClient , private url: UrlService) { }


  /** GET concreteCounts from the server */
  // tslint:disable-next-line:variable-name
  getConcreteCounts(date_begin: string, date_end: string, robot_id: string): Observable<Response> {
    return this.http.get<Response>(this.concreteCountListUrl + '?date_begin=' + date_begin + '&date_end=' + date_end + '&robot_id=' + robot_id)
      .pipe(
        catchError(this.handleError<Response>('getConcreteCounts'))
      );
  }
  /** GET concreteCounts from the server */
  // tslint:disable-next-line:variable-name
  getConcreteCount(time: string): Observable<Response> {
    return this.http.get<Response>(this.concreteCountListByIdUrl + '?time=' + time)
      .pipe(
        catchError(this.handleError<Response>('getConcreteCount'))
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
