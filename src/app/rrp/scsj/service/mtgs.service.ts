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
export class MtgsService {
  response: Response;
  private benchCountListUrl = this.url.hostname + '/benchCount/getBenchCount';
  private benchCountListByIdUrl = this.url.hostname + '/benchCount/getBenchCountById';
  private newestLeaseByIdUrl = this.url.hostname + '/benchCount/findNewestByRobot';
  // private queryUrl = this.url.hostname + '/benchCount/query';
  constructor(private http: HttpClient , private url: UrlService) { }


  /** GET benchCounts from the server */
  // tslint:disable-next-line:variable-name
  getBenchCounts(date_begin: string, date_end: string, robot_id: string): Observable<Response> {
    return this.http.get<Response>(this.benchCountListUrl + '?date_begin=' + date_begin + '&date_end=' + date_end + '&robot_id=' + robot_id)
      .pipe(
        catchError(this.handleError<Response>('getBenchCounts'))
      );
  }
  query(data) {
    const url = this.url.hostname + '/benchCount/query';
    return new Promise(((resolve, reject) =>
      this.http.post(url, data)
        .toPromise().then(res => {
        resolve(res);
      }, error => {
        reject(error);
      }))
    );
  }
  /** GET benchCounts from the server */
  // tslint:disable-next-line:variable-name
  getBenchCount(time: string): Observable<Response> {
    return this.http.get<Response>(this.benchCountListByIdUrl + '?time=' + time)
      .pipe(
        catchError(this.handleError<Response>('getBenchCount'))
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
  // 根据RobotID查找最新的模台个数
  getCountByRobotId(id: number): Observable<Response> {
    const url = this.newestLeaseByIdUrl + '?id=' + id;
    return this.http.get<Response>(url).pipe(
      catchError(this.handleError<Response>(`getLease id=${id}`))
    );
  }
}
