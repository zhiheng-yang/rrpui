import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UrlService} from "../core/service/url.service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient,
              private url: UrlService
             ) {
  }
  login(username: string, pwd: string) {
    const Url = this.url.hostname + '/login';
    const body = new FormData();
    body.set('username', username);
    body.set('password', pwd);

    return new Promise(((resolve, reject) =>
      this.http.post(Url, body).toPromise().then(res => {
        resolve(res);
      }, error => {
        reject(error);
      })
    ));
  }
  findremind(companyid) {
    const Url = this.url.hostname + '/lease/findRemind?id=';
    return new Promise(((resolve, reject) =>
        this.http.get(Url + companyid).toPromise().then(res => {
          resolve(res);
        }, error => {
          reject(error);
        })
    ));
  }
  findAuthority(roidid) {
    const Url = this.url.hostname + '/authority/findAuthorityByRoleIdWhenLogin?role_id=';
    return new Promise(((resolve, reject) =>
        this.http.get(Url + roidid).toPromise().then(res => {
          resolve(res);
        }, error => {
          reject(error);
        })
    ));
  }
}
