import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UrlService} from '../../../core/service/url.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class JsglService {

  response: Response;
  private getRolesUrl = this.url.hostname + '/role/getRoles';
  private getOperationsUrl = this.url.hostname + '/operation/getOperations';
  private getRoleByIdUrl = this.url.hostname + '/role/getRoleById';
  private deleteRoleUrl = this.url.hostname + '/role/deleteRole';
  // private addRoleUrl = this.url.hostname + '/role/addRole';
  // private getRolesMaxIdUrl = this.url.hostname + '/role/getRolesMaxId';
  private getAllDynamicMenusUrl = this.url.hostname + '/dynamicMenuService/getAllDynamicMenus';
  private addAuthorityUrl = this.url.hostname + '/authority/addAuthority';
  private updateAuthorityUrl = this.url.hostname + '/authority/updateAuthority';
  // 其实是获得所有子菜单，获得全部菜单是/menu/getMenus
  private getMenusUrl = this.url.hostname + '/menu/getMenusByMenuNotNull';
  private findByRoleIdUrl = this.url.hostname + '/authority/findByRoleId';

  private getMenuCorrespondingOperationsUrl = this.url.hostname + '/menuCorrespondingOperation/getMenuCorrespondingOperation';

  constructor(private http: HttpClient,
              private url: UrlService) { }

  /** GET role by id. Will 404 if id not found */
  getRole(id: number): Observable<Response> {
    const url = this.getRoleByIdUrl + '?id=' + id;
    return this.http.get<Response>(url).pipe(
      catchError(this.handleError<Response>(`getRoleById id=${id}`))
    );
  }

  findAuthorityByRoleId(id: number): Observable<Response> {
    const url = this.findByRoleIdUrl + '?role_id=' + id;
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

  getOperations(): Observable<Response> {
    return this.http.get<Response>(this.getOperationsUrl)
      .pipe(
        catchError(this.handleError<Response>('getOperations'))
      );
  }

  getAllDynamicMenus(): Observable<Response> {
    return this.http.get<Response>(this.getAllDynamicMenusUrl)
      .pipe(
        catchError(this.handleError<Response>('getAllDynamicMenusUrl'))
      );
  }

  getMenus(): Observable<Response> {
    return this.http.get<Response>(this.getMenusUrl)
      .pipe(
        catchError(this.handleError<Response>('getMenus'))
      );
  }

  getMenuCorrespondingOperations(): Observable<Response> {
    return this.http.get<Response>(this.getMenuCorrespondingOperationsUrl)
      .pipe(
        catchError(this.handleError<Response>('getMenus'))
      );
  }

  addAuthority(authorityArray: any[]): Observable<Response> {
    return this.http.post<Response>(this.addAuthorityUrl, authorityArray, httpOptions).pipe();
  }

  /** DELETE: detail the role from the server */
  deleteRole(id: number): Observable<Response> {
    const url = this.deleteRoleUrl + '?id=' + id;
    return this.http.delete<Response>(url).pipe(
      catchError(this.handleError<Response>(`role id=${id}`))
    );
  }

  /** PUT: update the user on the server */
  updateAuthority(completedAuthority: any): Observable<Response> {
    return this.http.put<Response>(this.updateAuthorityUrl, completedAuthority, httpOptions).pipe(
      catchError(this.handleError<Response>('resetPassword'))
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
