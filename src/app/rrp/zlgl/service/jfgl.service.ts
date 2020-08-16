import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UrlService} from '../../../core/service/url.service';
import {Company, Lease, Pay, Robot} from '../../../core/entity/entity';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class JfglService {
  constructor(private http: HttpClient,
              private url: UrlService) { }
  response: Response;
  private payListUrl = this.url.hostname + '/pay/findAllPay';
  private payListByIdUrl = this.url.hostname + '/pay/findById';
  private payDeleteUrl = this.url.hostname + '/pay/deletePay';
  private payUpdateUrl = this.url.hostname + '/pay/updatePay';
  private payAddteUrl = this.url.hostname + '/pay/addPay';
  private findRobotsByBeloingingCompanyId = this.url.hostname + '/robot/findAllByCompany';
  private findAllCompanyTypeUrl = this.url.hostname + '/companyType/findAllCompanyType';
  private findAllCompanyWithRobotUrl = this.url.hostname + '/company/findAllCompanysByTowKeys';
  addPay(pay: {robot: Robot, paymentAmount: number, company: Company,
  paymentTime: string, paymentDeadline: string, examineSituation: string, paymentDuration: string,
  paymentVoucher: string, lease: Lease }): Observable<Response> {
    return this.http.post<Response>(this.payAddteUrl, pay, httpOptions).pipe(
      catchError(this.handleError<any>('addPay'))
    );
  }
  /** DELETE: delete the pay from the server */
  deletePay(pay: Pay | number): Observable<Response> {
    const id = typeof pay === 'number' ? pay : pay.id;
    return this.http.delete<Response>(this.payDeleteUrl + '?id=' + id, httpOptions).pipe(
      catchError(this.handleError<Response>('deletePay'))
    );
  }
  /** PUT: update the pay on the server */
  updatePay(pay: Pay): Observable<Response> {
    return this.http.put<Response>(this.payUpdateUrl, pay, httpOptions).pipe(
      catchError(this.handleError<Response>('updatePay'))
    );
  }
  /** GET pays from the server */
  getPays(): Observable<Response> {
    return this.http.get<Response>(this.payListUrl)
      .pipe(
        catchError(this.handleError<Response>('getPays'))
      );
  }

  /** GET pay by id. Will 404 if id not found */
  getPay(id: number): Observable<Response> {
    const url = this.payListByIdUrl + '?id=' + id;
    return this.http.get<Response>(url).pipe(
      catchError(this.handleError<Response>(`getPay id=${id}`))
    );
  }
  /** GET company by BelongingCompany_Id. Will 404 if id not found */
  getRobotByBelongingCompanyId(id: number): Observable<Response> {
    const url = this.findRobotsByBeloingingCompanyId + '?id=' + id;
    return this.http.get<Response>(url).pipe(
      catchError(this.handleError<Response>(`getRobotByBelongingCompanyId id=${id}`))
    );
  }
  /** GET companyType from the server */
  getCompanyTypes(): Observable<Response> {
    return this.http.get<Response>(this.findAllCompanyTypeUrl)
      .pipe(
        catchError(this.handleError<Response>('getCompanyTypes'))
      );
  }
  /** GET company from the server */
  getCompanysWithRobot(): Observable<Response> {
    return this.http.get<Response>(this.findAllCompanyWithRobotUrl)
      .pipe(
        catchError(this.handleError<Response>('getCompanysWithRobot'))
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
  // 动态查询
  query(data) {
    const url = this.url.hostname + '/lease/QueryPay';
    return this.post(url, data);
  }

  findLeaseByRobotAndCompany(data) {
    const url = this.url.hostname + '/lease/findLeaseByRobotAndCompany';
    return this.post(url, data);
  }
}
