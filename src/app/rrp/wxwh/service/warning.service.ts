import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Warning, Response} from '../../../core/entity/entity';
import {catchError} from 'rxjs/operators';
import {UrlService} from '../../../core/service/url.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})

export class WarningService {
  response: Response;
  private warningListUrl = this.url.hostname + '/warning/getWarning';
  private warningListByIdUrl = this.url.hostname + '/warning/getWarningById';
  private warningDeleteUrl = this.url.hostname + '/warning/deleteById';
  private warningUpdateUrl = this.url.hostname + '/warning/updateWarning';
  private warningAddteUrl = this.url.hostname + '/warning/addWarning';
  constructor(private http: HttpClient , private url: UrlService) { }

  /** DELETE: detail the warning from the server */
  deleteWarning(warning: Warning | number): Observable<Response> {
    const id = typeof warning === 'number' ? warning : warning.id;
    return this.http.post<Response>(this.warningDeleteUrl, id, httpOptions).pipe(
      catchError(this.handleError<Response>('deleteWarning'))
    );
  }

  /** GET warnings from the server */
  getWarnings(): Observable<Response> {
    return this.http.get<Response>(this.warningListUrl)
      .pipe(
        catchError(this.handleError<Response>('getWarnings'))
      );
  }

  /** GET warning by id. Will 404 if id not found */
  getWarning(id: number): Observable<Response> {
    const url = this.warningListByIdUrl + '?id=' + id;
    return this.http.get<Response>(url).pipe(
      catchError(this.handleError<Response>(`getWarning id=${id}`))
    );
  }
  /** POST: add a new warning to the server */
  addWarning(warning: Warning): Observable<Response> {
    return this.http.post<Response>(this.warningAddteUrl, warning, httpOptions).pipe(
      catchError(this.handleError<any>('addWarning'))
    );
  }
  /** PUT: update the hero on the server */
  updateWarning(warning: Warning): Observable<Response> {
    return this.http.put<Response>(this.warningUpdateUrl, warning, httpOptions).pipe(
      catchError(this.handleError<Response>('updateWarning'))
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
  //   const url = this.url.hostname + '/warning/getWarningByRobot?robot_id=';
  //   return new Promise(((resolve, reject) =>
  //     this.http.get(url + id)
  //       .toPromise().then(res => {
  //       resolve(res);
  //     }, error => {
  //       reject(error);
  //     })));
  // }
  query(data) {
    const url = this.url.hostname + '/warning/QueryWarning';
    return new Promise(((resolve, reject) =>
      this.http.post(url, data)
        .toPromise().then(res => {
        resolve(res);
      }, error => {
        reject(error);
      })));
  }
}
