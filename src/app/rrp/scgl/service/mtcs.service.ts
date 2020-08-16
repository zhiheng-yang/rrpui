import {Injectable} from '@angular/core';
import {Response, BenchData, Bench, Company} from '../../../core/entity/entity';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UrlService} from '../../../core/service/url.service';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class MtcsService {
  response: Response;
  private benchDataListUrl = this.url.hostname + '/benchData/getBenchData';
  private benchDataListByIdUrl = this.url.hostname + '/benchData/getBenchDataById';
  private benchDataListByBenchIdUrl = this.url.hostname + '/benchData/getByBenchMax';
  private benchDataDeleteUrl = this.url.hostname + '/benchData/deleteById';
  private benchDataUpdateUrl = this.url.hostname + '/benchData/updateBenchData';
  private benchDataAddteUrl = this.url.hostname + '/benchData/addBenchData';

  constructor(private http: HttpClient, private url: UrlService) {
  }

  /** DELETE: detail the benchData from the server */
  deleteBenchData(benchData: BenchData | number): Observable<Response> {
    const id = typeof benchData === 'number' ? benchData : benchData.id;
    return this.http.post<Response>(this.benchDataDeleteUrl, id, httpOptions).pipe(
      catchError(this.handleError<Response>('deleteBenchData'))
    );
  }

  /** GET benchDatas from the server */
  getBenchDatas(): Observable<Response> {
    return this.http.get<Response>(this.benchDataListUrl)
      .pipe(
        catchError(this.handleError<Response>('getBenchDatas'))
      );
  }

  /** GET benchData by id. Will 404 if id not found */
  getBenchData(id: number): Observable<Response> {
    const url = this.benchDataListByIdUrl + '?id=' + id;
    return this.http.get<Response>(url).pipe(
      catchError(this.handleError<Response>(`getBenchData id=${id}`))
    );
  }

  getByBenchMax(id: number): Observable<Response> {
    const url = this.benchDataListByBenchIdUrl + '?bench_id=' + id;
    return this.http.get<Response>(url).pipe(
      catchError(this.handleError<Response>(`getByBenchMax bench_id=${id}`))
    );
  }

  /** POST: add a new benchData to the server */
  addBenchData(benchData: { number: string, time: Date, bench: Bench, company: Company, state: number }): Observable<Response> {
    return this.http.post<Response>(this.benchDataAddteUrl, benchData, httpOptions).pipe(
      catchError(this.handleError<any>('addBenchData'))
    );
  }

  /** PUT: update the hero on the server */
  updateBenchData(benchData: BenchData): Observable<Response> {
    return this.http.put<Response>(this.benchDataUpdateUrl, benchData, httpOptions).pipe(
      catchError(this.handleError<Response>('updateBenchData'))
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

  // 动态查询
  query(data) {
    const url = this.url.hostname + '/benchData/QueryBenchData';
    return new Promise(((resolve, reject) =>
      this.http.post(url, data)
        .toPromise().then(res => {
        resolve(res);
      }, error => {
        reject(error);
      })));
  }
}
