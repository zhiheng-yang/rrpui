import { Injectable } from '@angular/core';
import {Response, Bench, Robot} from '../../../core/entity/entity';
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
export class MtglService {
  response: Response;
  private benchListUrl = this.url.hostname + '/bench/getBench';
  private benchListByIdUrl = this.url.hostname + '/bench/getBenchById';
  private benchDeleteUrl = this.url.hostname + '/bench/deleteById';
  private benchUpdateUrl = this.url.hostname + '/bench/updateBench';
  private benchAddteUrl = this.url.hostname + '/bench/addBench';
  constructor(private http: HttpClient , private url: UrlService) { }

  /** DELETE: detail the bench from the server */
  deleteBench(bench: Bench | number): Observable<Response> {
    const id = typeof bench === 'number' ? bench : bench.id;
    return this.http.post<Response>(this.benchDeleteUrl, id, httpOptions).pipe(
      catchError(this.handleError<Response>('deleteBench'))
    );
  }

  /** GET benchs from the server */
  getBenchs(): Observable<Response> {
    return this.http.get<Response>(this.benchListUrl)
      .pipe(
        catchError(this.handleError<Response>('getBenchs'))
      );
  }

  /** GET bench by id. Will 404 if id not found */
  getBench(id: number): Observable<Response> {
    const url = this.benchListByIdUrl + '?id=' + id;
    return this.http.get<Response>(url).pipe(
      catchError(this.handleError<Response>(`getBench id=${id}`))
    );
  }
  /** POST: add a new bench to the server */
  addBench(bench: {number: string, description: string, workshop: string, robot: Robot}): Observable<Response> {
    return this.http.post<Response>(this.benchAddteUrl, bench, httpOptions).pipe(
      catchError(this.handleError<any>('addBench'))
    );
  }
  /** PUT: update the hero on the server */
  updateBench(bench: Bench): Observable<Response> {
    return this.http.put<Response>(this.benchUpdateUrl, bench, httpOptions).pipe(
      catchError(this.handleError<Response>('updateBench'))
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
    const url = this.url.hostname + '/bench/QueryBench';
    return new Promise(((resolve, reject) =>
      this.http.post(url, data)
        .toPromise().then(res => {
        resolve(res);
      }, error => {
        reject(error);
      })));
  }
}
