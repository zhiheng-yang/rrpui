import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UrlService} from '../../../core/service/url.service';
import {Company, Robot} from '../../../core/entity/entity';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class BljqrglService {
  response: Response;
  private robotListUrl = this.url.hostname + '/robot/findAllRobot';
  private robotListByIdUrl = this.url.hostname + '/robot/findById';
  private robotListByCompanyIdUrl = this.url.hostname + '/robot/findAllByCompany';
  private robotDeleteUrl = this.url.hostname + '/robot/deleteRobot';
  private robotUpdateUrl = this.url.hostname + '/robot/updateRobot';
  private robotAddteUrl = this.url.hostname + '/robot/addRobot';

  // private robotAddteUrl = 'http://localhost:8080/robot/addrobot';
  constructor(private http: HttpClient,
              private url: UrlService) { }
  /** DELETE: detail the robot from the server */
  deleteRobot(robot: Robot | number): Observable<Response> {
    const id = typeof robot === 'number' ? robot : robot.id;
    return this.http.delete<Response>(this.robotDeleteUrl + '?id=' + id, httpOptions).pipe(
      catchError(this.handleError<Response>('deleteRobot'))
    );
  }

  /** GET robots from the server */
  getRobots(): Observable<Response> {
    return this.http.get<Response>(this.robotListUrl)
      .pipe(
        catchError(this.handleError<Response>('getRobots'))
      );
  }

  /** GET robot by id. Will 404 if id not found */
  getRobot(id: number): Observable<Response> {
    const url = this.robotListByIdUrl + '?id=' + id;
    return this.http.get<Response>(url).pipe(
      catchError(this.handleError<Response>(`getRobot id=${id}`))
    );
  }
  /** POST: add a new robot to the server */
  addRobot(robot: {
    id: string
    , name: string, way: string, belongingCompany: Company, use_situation: string, shengchanxian: string }): Observable<Response> {
    return this.http.post<Response>(this.robotAddteUrl, robot, httpOptions).pipe(
      catchError(this.handleError<any>('addRobot'))
    );
  }
  /** PUT: update the hero on the server */
  updateRobot(robot: Robot): Observable<Response> {
    return this.http.put<Response>(this.robotUpdateUrl, robot, httpOptions).pipe(
      catchError(this.handleError<Response>('updateRobot'))
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
  query(data) {
    const url = this.url.hostname + '/robot/QueryRobot';
    return new Promise(((resolve, reject) =>
      this.http.post(url, data)
        .toPromise().then(res => {
        resolve(res);
      }, error => {
        reject(error);
      })));
  }
}
