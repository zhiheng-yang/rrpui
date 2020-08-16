import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {RobotData, Response} from '../../../core/entity/entity';
import {catchError} from 'rxjs/operators';
import {UrlService} from '../../../core/service/url.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})

export class CssdService {
  response: Response;
  private robotDataListUrl = this.url.hostname + '/robotData/getRobotData';
  private robotDataListByIdUrl = this.url.hostname + '/robotData/getRobotDataById';
  private robotDataDeleteUrl = this.url.hostname + '/robotData/deleteById';
  private robotDataUpdateUrl = this.url.hostname + '/robotData/updateRobotData';
  private robotDataAddteUrl = this.url.hostname + '/robotData/addRobotData';
  constructor(private http: HttpClient , private url: UrlService) { }

  /** DELETE: detail the robotData from the server */
  deleteRobotData(robotData: RobotData | number): Observable<Response> {
    const id = typeof robotData === 'number' ? robotData : robotData.id;
    return this.http.post<Response>(this.robotDataDeleteUrl, id, httpOptions).pipe(
      catchError(this.handleError<Response>('deleteRobotData'))
    );
  }

  /** GET robotDatas from the server */
  getRobotDatas(): Observable<Response> {
    return this.http.get<Response>(this.robotDataListUrl)
      .pipe(
        catchError(this.handleError<Response>('getRobotDatas'))
      );
  }

  /** GET robotData by id. Will 404 if id not found */
  getRobotData(id: number): Observable<Response> {
    const url = this.robotDataListByIdUrl + '?id=' + id;
    return this.http.get<Response>(url).pipe(
      catchError(this.handleError<Response>(`getRobotData id=${id}`))
    );
  }
  /** POST: add a new robotData to the server */
  addRobotData(robotData: RobotData): Observable<Response> {
    return this.http.post<Response>(this.robotDataAddteUrl, robotData, httpOptions).pipe(
      catchError(this.handleError<any>('addRobotData'))
    );
  }
  /** PUT: update the hero on the server */
  updateRobotData(robotData: RobotData): Observable<Response> {
    return this.http.put<Response>(this.robotDataUpdateUrl, robotData, httpOptions).pipe(
      catchError(this.handleError<Response>('updateRobotData'))
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

  // getDataByRobotId(id) {
  //   const url = this.url.hostname + '/robotData/getRobotDataByRobot?robot_id=';
  //   return new Promise(((resolve, reject) =>
  //     this.http.get(url + id)
  //       .toPromise().then(res => {
  //       resolve(res);
  //     }, error => {
  //       reject(error);
  //     })));
  // }

  query(data) {
    const url = this.url.hostname + '/robotData/QueryRobotData';
    return new Promise(((resolve, reject) =>
      this.http.post(url, data)
        .toPromise().then(res => {
        resolve(res);
      }, error => {
        reject(error);
      })));
  }
}
