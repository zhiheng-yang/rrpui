import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UrlService} from '../../../core/service/url.service';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Company, CompanyType} from '../../../core/entity/entity';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class QyglService {
  response: Response;
  constructor(private http: HttpClient, private url: UrlService) { }
  private addCompanyUrl = this.url.hostname + '/company/addCompany';
  private deleteCompanyUrl = this.url.hostname + '/company/deleteCompany';
  private updateCompanyUrl = this.url.hostname + '/company/updateCompany';
  private findAllCompanyTypeUrl = this.url.hostname + '/companyType/findAllCompanyType';
  private findAllCompanyWithRobotUrl = this.url.hostname + '/company/findAllCompanysByTowKeys';
  private findAllCompanyUrl = this.url.hostname + '/company/findAllCompany';
  private findCompanyByIdUrl = this.url.hostname + '/company/findById';
  private findRobotsByBeloingingCompanyId = this.url.hostname + '/robot/findAllByCompany';
  private findCompanyByKeyWords = this.url.hostname + '/company/findByKey';
  /** POST: add a new company to the server */
  addCompany(company: { name: string, companyType: CompanyType, province: string,
    city: string, address: string, legalPerson: string, phone: string }): Observable<Response> {
    return this.http.post<Response>(this.addCompanyUrl, company, httpOptions).pipe(
      catchError(this.handleError<any>('addCompany'))
    );
  }
  /** DELETE: delete the company from the server */
  deleteCompany(company: Company | number): Observable<Response> {
    const id = typeof company === 'number' ? company : company.id;
    return this.http.delete<Response>(this.deleteCompanyUrl + '?id=' + id, httpOptions).pipe(
      catchError(this.handleError<Response>('deleteCollege'))
    );
  }
  /** PUT: update the company on the server */
  updateCompany(company: {id: number, name: string, companyType: CompanyType, province: string,
    city: string, address: string, legalPerson: string, phone: string }): Observable<Response> {
    return this.http.put<Response>(this.updateCompanyUrl, company, httpOptions).pipe(
      catchError(this.handleError<Response>('updateCompany'))
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
  /** GET company from the server */
  getCompanys(): Observable<Response> {
    return this.http.get<Response>(this.findAllCompanyUrl)
      .pipe(
        catchError(this.handleError<Response>('getCompanys'))
      );
  }
  /** GET company by id. Will 404 if id not found */
  getCompany(id: number): Observable<Response> {
    const url = this.findCompanyByIdUrl + '?id=' + id;
    return this.http.get<Response>(url).pipe(
      catchError(this.handleError<Response>(`getCompany id=${id}`))
    );
  }
  /** GET company by BelongingCompany_Id. Will 404 if id not found */
  getRobotByBelongingCompanyId(id: number): Observable<Response> {
    const url = this.findRobotsByBeloingingCompanyId + '?id=' + id;
    return this.http.get<Response>(url).pipe(
      catchError(this.handleError<Response>(`getRobotByBelongingCompanyId id=${id}`))
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
    const url = this.url.hostname + '/company/queryCompany';
    return new Promise(((resolve, reject) =>
      this.http.post(url, data)
        .toPromise().then(res => {
        resolve(res);
      }, error => {
        reject(error);
      })));
  }
  getProvince() {
    const url = this.url.hostname + '/province/getprovince';
    return new Promise(((resolve, reject) =>
      this.http.get(url)
        .toPromise().then(res => {
        resolve(res);
      }, error => {
        reject(error);
      })));
  }
  getCity() {
    const url = this.url.hostname + '/city/getcity';
    return new Promise(((resolve, reject) =>
      this.http.get(url)
        .toPromise().then(res => {
        resolve(res);
      }, error => {
        reject(error);
      })));
  }
}
