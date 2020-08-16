import { Injectable } from '@angular/core';
import {UrlService} from '../../core/service/url.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuerylistService {

  constructor(private http: HttpClient,
              private url: UrlService) { }
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
  getCompany() {
    const url = this.url.hostname + '/company/findAllCompany';
    return new Promise(((resolve, reject) =>
      this.http.get(url)
        .toPromise().then(res => {
        resolve(res);
      }, error => {
        reject(error);
      })));
  }
// 根据企业id获取机器人
  getRobot(id) {
    const url = this.url.hostname + '/robot/findAllByCompany?id=';
    return new Promise(((resolve, reject) =>
      this.http.get(url + id)
        .toPromise().then(res => {
        resolve(res);
      }, error => {
        reject(error);
      })));
  }
  //根据企业id获取机器人
  getRobotByCompany(id1,id2) {
    const url = this.url.hostname + 'findByComapny';
    const body ={
      companyid:id1,
      owncompanyid:id2
    }
    return new Promise(((resolve, reject) =>
      this.http.post(url, body)
        .toPromise().then(res => {
        resolve(res);
      }, error => {
        reject(error);
      })));
  }

  // 查询被该企业使用的机器人
  getRobotByCompanyid(id) {
    const url = this.url.hostname + '/robot/findAllByCompanyid?id=';
    return new Promise(((resolve, reject) =>
      this.http.get(url+id)
        .toPromise().then(res => {
        resolve(res);
      }, error => {
        reject(error);
      })));
  }
  // 查找租用自己机器人的企业
  getCompanyByRobot(id) {
    const url = this.url.hostname + '/company/findCompanyByRobot?id=';
    return new Promise(((resolve, reject) =>
      this.http.get(url+id)
        .toPromise().then(res => {
        resolve(res);
      }, error => {
        reject(error);
      })));
  }
  getLeaseByCity(data){
    const url = this.url.hostname + '/lease/findRobotByCity';
    const body = {
      city: data
    }
    return new Promise(((resolve, reject) =>
      this.http.post(url, body)
        .toPromise().then(res => {
        resolve(res);
      }, error => {
        reject(error);
      })));
  }
}
