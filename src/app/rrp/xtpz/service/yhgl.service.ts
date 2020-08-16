import { Injectable } from '@angular/core';
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
export class YhglService {

  response: Response;
  private deleteUserUrl = this.url.hostname + '/user/deleteById';
  private getUserByIdUrl = this.url.hostname + '/user/getUserById';
  private updateUserUrl = this.url.hostname + '/user/updateUser';
  private getUsersUrl = this.url.hostname + '/user/getUsers';
  private addUserUrl = this.url.hostname + '/user/addUser';
  private getCompaniesUrl = this.url.hostname + '/company/findAllCompany';
  private getCompanyByIdUrl = this.url.hostname + '/company/findById';
  private getRolesUrl = this.url.hostname + '/role/getRoles';
  private getRoleByIdUrl = this.url.hostname + 'role/getRoleById';
  private resetPasswordUrl = this.url.hostname + '/user/resetPassword';

  constructor(private http: HttpClient,
              private url: UrlService) { }

  // /** DELETE: detail the softwareUpgrade from the server */
  // deleteUser(user: any | number): Observable<Response> {
  //   const id = typeof user === 'number' ? user : user.id;
  //   return this.http.post<Response>(this.deleteUserUrl, id, httpOptions).pipe(
  //     catchError(this.handleError<Response>('deleteSoftwareUpgrade'))
  //   );
  // }

  // 动态查询
  query(data) {
    const url = this.url.hostname + '/user/queryUser';
    return new Promise(((resolve, reject) =>
      this.http.post(url, data)
        .toPromise().then(res => {
        resolve(res);
      }, error => {
        reject(error);
      }))
    );
  }
  /** DELETE: detail the user from the server */
  deleteUser(id: number): Observable<Response> {
    const url = this.deleteUserUrl + '?id=' + id;
    return this.http.delete<Response>(url).pipe(
      catchError(this.handleError<Response>(`deleteUser id=${id}`))
    );
  }

  // /** POST: add a new user to the server */
  // addUser(softwareUpgrade: SoftwareUpgrade): Observable<Response> {
  //   return this.http.put<Response>(this.addUserUrl, softwareUpgrade, httpOptions).pipe(
  //     catchError(this.handleError<Response>('addUser'))
  //   );
  // }

  // // 两种方式都可以
  // /** PUT: update the user on the server */
  // resetPassword(user: any): Observable<Response> {
  //   return this.http.put<Response>(this.resetPasswordUrl, user, httpOptions).pipe(
  //     catchError(this.handleError<Response>('resetPassword'))
  //   );
  // }
  // 两种方式都可以
  /** PUT: update the user on the server */
  resetPassword(id: number): Observable<Response> {
    const url = this.resetPasswordUrl + '?id=' + id;
    // return this.http.post<Response>(url).pipe(
    //   catchError(this.handleError<Response>(`resetPassword id=${id}`))
    //
    // );
    return this.http.post<Response>(url, id, httpOptions).pipe();
  }

  /** PUT: update the user on the server */
  updateUser(user: any): Observable<Response> {
    return this.http.put<Response>(this.updateUserUrl, user, httpOptions).pipe(
      catchError(this.handleError<Response>('updateUser'))
    );
  }

  // /** GET softwareUpgrades from the server 由query代替完成*/
  // getUsers(): Observable<Response> {
  //   return this.http.get<Response>(this.getUsersUrl)
  //     .pipe(
  //       catchError(this.handleError<Response>('getUsers'))
  //     );
  // }

  getCompanies(): Observable<Response> {
    return this.http.get<Response>(this.getCompaniesUrl)
      .pipe(
        catchError(this.handleError<Response>('getCompanies'))
      );
  }

  /** GET user by id. Will 404 if id not found */
  getUser(id: number): Observable<Response> {
    const url = this.getUserByIdUrl + '?id=' + id;
    return this.http.get<Response>(url).pipe(
      catchError(this.handleError<Response>(`getUserById id=${id}`))
    );
  }

  /** GET role by id. Will 404 if id not found */
  getRole(id: number): Observable<Response> {
    const url = this.getRoleByIdUrl + '?id=' + id;
    return this.http.get<Response>(url).pipe(
      catchError(this.handleError<Response>(`getRoleById id=${id}`))
    );
  }

  getRoles(): Observable<Response> {
    return this.http.get<Response>(this.getRolesUrl)
      .pipe(
        catchError(this.handleError<Response>('getRoles'))
      );
  }

  /** GET company by id. Will 404 if id not found */
  getCompany(id: number): Observable<Response> {
    const url = this.getCompanyByIdUrl + '?id=' + id;
    return this.http.get<Response>(url).pipe(
      catchError(this.handleError<Response>(`getCompany id=${id}`))
    );
  }

  addUser(user: any): Observable<Response> {
    return this.http.post<Response>(this.addUserUrl, user, httpOptions).pipe();
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
