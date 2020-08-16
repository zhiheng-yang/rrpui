import {Injectable} from '@angular/core';
import {Response, ProcessData} from '../../../core/entity/entity';
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
export class SccsService {
  response: Response;
  private processDataListUrl = this.url.hostname + '/processData/getProcessData';
  private processDataListByIdUrl = this.url.hostname + '/processData/getProcessDataById';
  private processDataListByBenchUrl = this.url.hostname + '/processData/getProcessDataByBench';
  private processDataDeleteUrl = this.url.hostname + '/processData/deleteById';
  private processDataUpdateUrl = this.url.hostname + '/processData/updateProcessData';
  private processDataAddteUrl = this.url.hostname + '/processData/addProcessData';

  constructor(private http: HttpClient, private url: UrlService) {
  }

  /** DELETE: detail the processData from the server */
  deleteProcessData(processData: ProcessData | number): Observable<Response> {
    const id = typeof processData === 'number' ? processData : processData.id;
    return this.http.post<Response>(this.processDataDeleteUrl, id, httpOptions).pipe(
      catchError(this.handleError<Response>('deleteProcessData'))
    );
  }

  /** GET processDatas from the server */
  getProcessDatas(): Observable<Response> {
    return this.http.get<Response>(this.processDataListUrl)
      .pipe(
        catchError(this.handleError<Response>('getProcessDatas'))
      );
  }

  /** GET processData by id. Will 404 if id not found */
  getProcessData(id: number): Observable<Response> {
    const url = this.processDataListByIdUrl + '?id=' + id;
    return this.http.get<Response>(url).pipe(
      catchError(this.handleError<Response>(`getProcessData id=${id}`))
    );
  }

  /** GET processData by id. Will 404 if id not found */
  getProcessDataByBench(id: number): Observable<Response> {
    return this.http.get<Response>(this.processDataListByBenchUrl + '?bench_id=' + id).pipe(
      catchError(this.handleError<Response>(`getProcessDataByBench`))
    );
  }

  // /** POST: add a new processData to the server */
  // addProcessData(processData: {number: string, description: string, workshop: string}): Observable<Response> {
  //   return this.http.post<Response>(this.processDataAddteUrl, processData, httpOptions).pipe(
  //     catchError(this.handleError<any>('addProcessData'))
  //   );
  // }
  /** PUT: update the hero on the server */
  updateProcessData(processData: ProcessData): Observable<Response> {
    return this.http.put<Response>(this.processDataUpdateUrl, processData, httpOptions).pipe(
      catchError(this.handleError<Response>('updateProcessData'))
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
