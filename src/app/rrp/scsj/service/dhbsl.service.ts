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
export class DhbslService {
  response: Response;
  private boardCountListUrl = this.url.hostname + '/boardCount/getBoardCount';
  private newestLeaseByIdUrl = this.url.hostname + '/boardCount/findNewestByRobot';
  private newestLeaseByIdUrl1 = this.url.hostname + '/concreteCount/findNewestByRobot';
  private newestLeaseByIdUrl2 = this.url.hostname + '/sczt/findScztByRobot';
  private boardCountListByIdUrl = this.url.hostname + '/boardCount/getBoardCountById';
  constructor(private http: HttpClient , private url: UrlService) { }


  /** GET boardCounts from the server */
  // tslint:disable-next-line:variable-name
  getBoardCounts(date_begin: string, date_end: string, robot_id: string): Observable<Response> {
    return this.http.get<Response>(this.boardCountListUrl + '?date_begin=' + date_begin + '&date_end=' + date_end + '&robot_id=' + robot_id)
      .pipe(
        catchError(this.handleError<Response>('getBoardCounts'))
      );
  }
  /** GET boardCounts from the server */
  // tslint:disable-next-line:variable-name
  getBoardCount(time: string): Observable<Response> {
    return this.http.get<Response>(this.boardCountListByIdUrl + '?time=' + time)
      .pipe(
        catchError(this.handleError<Response>('getBoardCount'))
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
      catchError(this.handleError<Response>(`getArea id=${id}`))
    );
  }

  // 根据RobotID查找最新的混凝土方量
  getConcreteCountByRobotId(id: number): Observable<Response> {
    const url = this.newestLeaseByIdUrl1 + '?id=' + id;
    return this.http.get<Response>(url).pipe(
      catchError(this.handleError<Response>(`getArea id=${id}`))
    );
  }

  // 根据RobotID查找最新的生产状态
  getScztByRobotId(id: number): Observable<Response> {
    const url = this.newestLeaseByIdUrl2 + '?id=' + id;
    return this.http.get<Response>(url).pipe(
      catchError(this.handleError<Response>(`getArea id=${id}`))
    );
  }
}
