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
export class DhbmjService {
  response: Response;
  private boardAreaListUrl = this.url.hostname + '/boardArea/getBoardArea';
  private newestLeaseByIdUrl = this.url.hostname + '/boardArea/findNewestByRobot';
  private boardAreaListByIdUrl = this.url.hostname + '/boardArea/getBoardAreaById';
  constructor(private http: HttpClient , private url: UrlService) { }


  /** GET boardAreas from the server */
  // tslint:disable-next-line:variable-name
  getBoardAreas(date_begin: string, date_end: string, robot_id: string): Observable<Response> {
    return this.http.get<Response>(this.boardAreaListUrl + '?date_begin=' + date_begin + '&date_end=' + date_end + '&robot_id=' + robot_id)
      .pipe(
        catchError(this.handleError<Response>('getBoardAreas'))
      );
  }
  /** GET boardAreas from the server */
  // tslint:disable-next-line:variable-name
  getBoardArea(time: string): Observable<Response> {
    return this.http.get<Response>(this.boardAreaListByIdUrl + '?time=' + time)
      .pipe(
        catchError(this.handleError<Response>('getBoardArea'))
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
  getAreaByRobotId(id: number): Observable<Response> {
    const url = this.newestLeaseByIdUrl + '?id=' + id;
    return this.http.get<Response>(url).pipe(
      catchError(this.handleError<Response>(`getArea id=${id}`))
    );
  }
}
