import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UrlService} from '../../../core/service/url.service';
import {Company, CompanyType, Lease, Robot} from '../../../core/entity/entity';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class Zlgl1Service {
  constructor(private http: HttpClient,
              private url: UrlService) { }
  response: Response;
  private leaseListUrl = this.url.hostname + '/lease/findAllLease';
  private leaseListByIdUrl = this.url.hostname + '/lease/findAllByRobot';
  private newestLeaseByIdUrl = this.url.hostname + '/lease/findNewestByRobot';

  private leaseDeleteUrl = this.url.hostname + '/lease/deleteLease';
  private leaseUpdateUrl = this.url.hostname + '/lease/updateLease';
  private leaseAddteUrl = this.url.hostname + '/lease/addLease';

  /** POST: add a new lease to the server */
  addLease(lease: { robot: Robot, contractId: string, companyId: Company,
    costWay: string, costMonth: string, startTime: string, paymentSituation: string,
    workshopId: string, internalId: string, contract: string, connector: string}): Observable<Response> {
    return this.http.post<Response>(this.leaseAddteUrl, lease, httpOptions).pipe(
      catchError(this.handleError<any>('addCompany'))
    );
  }
  /** DELETE: delete the lease from the server */
  deleteLease(lease: Lease | number): Observable<Response> {
    const id = typeof lease === 'number' ? lease : lease.id;
    return this.http.delete<Response>(this.leaseDeleteUrl + '?id=' + id, httpOptions).pipe(
      catchError(this.handleError<Response>('deleteLease'))
    );
  }
  /** PUT: update the lease on the server */
  updateLease(lease: { id: number, robot: Robot, contractId: string, companyId: Company,
    costWay: string, costMonth: string, startTime: string, paymentSituation: string,
    workshopId: string, internalId: string, contract: string, connector: string}): Observable<Response> {
    return this.http.put<Response>(this.leaseUpdateUrl, lease, httpOptions).pipe(
      catchError(this.handleError<Response>('updateLease'))
    );
  }
  /** GET leases from the server */
  getLeases(): Observable<Response> {
    return this.http.get<Response>(this.leaseListUrl)
      .pipe(
        catchError(this.handleError<Response>('getLeases'))
      );
  }

  /** GET lease by id. Will 404 if id not found */
  getLease(id: number): Observable<Response> {
    const url = this.leaseListByIdUrl + '?id=' + id;
    return this.http.get<Response>(url).pipe(
      catchError(this.handleError<Response>(`getLease id=${id}`))
    );
  }
  // 根据RobotID查找最新的Lease
  getLeaseByRobotId(id: number): Observable<Response> {
    const url = this.newestLeaseByIdUrl + '?id=' + id;
    return this.http.get<Response>(url).pipe(
      catchError(this.handleError<Response>(`getLease id=${id}`))
    );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  post(url, data) {
    return new Promise(((resolve, reject) =>
      this.http.post(url, data)
        .toPromise().then(res => {
        resolve(res);
      }, error => {
        reject(error);
      })));
  }
  get(url) {
    return new Promise(((resolve, reject) =>
      this.http.get(url)
        .toPromise().then(res => {
        resolve(res);
      }, error => {
        reject(error);
      })));
  }
  remind(id) {
    const url = this.url.hostname + '/lease/setRemind?id=';
    return this.get(url + id);
  }
  cancleremind(id) {
    const url = this.url.hostname + '/lease/cancleRemind?id=';
    return this.get(url + id);
  }
  // 启用
  start(data) {
    const url = this.url.hostname + '/lease/start';
    return this.post(url, data);
  }

  // 停用
  stop(data) {
    const url = this.url.hostname + '/lease/stop';
    return this.post(url, data);
  }
  // 动态查询
  queryLease(data) {
    const url = this.url.hostname + '/lease/QueryLease';
    return this.post(url, data);
  }
  // 续费
  pay(data) {
    const url = this.url.hostname + '/lease/pay';
    return this.post(url, data);
  }
}
