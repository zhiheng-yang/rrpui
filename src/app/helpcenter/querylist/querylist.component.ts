import { Component, OnInit, Output, EventEmitter, Input,HostListener } from '@angular/core';
import {QuerylistService} from './querylist.service';
// @ts-ignore
import j from 'src/assets/json/city.json';
import { formatDate } from '@angular/common';
import { Observable } from 'rxjs';
import {Company, Province, City, Robot} from "../../core/entity/entity";
@Component({
  selector: 'app-querylist',
  templateUrl: './querylist.component.html',
  styleUrls: ['./querylist.component.less']
})
export class QuerylistComponent implements OnInit {

  constructor(
    private querylistService: QuerylistService
  ) { }
  @Output() onQuery: EventEmitter<any> = new EventEmitter<any>();
  @Input() dateVisible = false;
  @Input() robotVisible = true;
  @Input() robotManagement = false;
  @Input() cache = false;
  isCollapse = false;
  selectedCompany:Company;
  CompanyData = [];
  selectedRobot:Robot;
  selectedProvince:Province;
  selectedCity:City;
  RobotData = [];
  ProvinceData =[];
  CityData =[];
  company;
  startdate;
  enddate;
  ngOnInit() {
    this.company = JSON.parse(localStorage.getItem('userinfo')).company;
    // 非骊久
    if (this.company.id != 1) {
      // 购买 或 租用 企业
      if (this.company.companyType.id === 3 || this.company.companyType.id === 4 ) {
        this.getRobot(this.company.id);
      } else {
        // 出租企业
        this.querylistService.getProvince().then((res:any) => {
          this.ProvinceData = res.data;
          if (this.cache) {
            this.getcache();
          }
        });
      }
    } else {
      // 骊久
      this.querylistService.getProvince().then((res:any) => {
        this.ProvinceData = res.data;
        if(this.cache) {
          this.getcache();
        }
      });
    }
    // this.getCompany();
  }
  query() {
    const data = {};
    if(this.selectedProvince && this.selectedProvince.name){
      data['province'] = this.selectedProvince;
    }
    if(this.selectedCity && this.selectedCity.name){
      data['city'] = this.selectedCity;
    }
    if(this.selectedCompany){
      data['company'] = this.selectedCompany;
    }
    if(this.selectedRobot){
      data['robot'] = this.selectedRobot;
    }
    if(this.startdate){
      data['startdate'] = formatDate(this.startdate.getTime(), 'yyyy-MM-dd', 'zh-Hans');
    }

    if(this.enddate) {
      data['enddate'] =  formatDate(this.enddate.getTime(), 'yyyy-MM-dd', 'zh-Hans');
    }
    this.onQuery.emit(data);
  }
  getCompany() {
    this.querylistService.getCompany().then((res:any) => {
      this.CompanyData = res.data;
    })
  }
  getRobot(id){
    if (this.robotManagement === true){
      this.querylistService.getRobot(id).then((res:any)=>{
        this.RobotData = res.data;
      })
    } else {
      //出租企业或制造企业
      if(this.company.companyType.id === 2|| this.company.companyType.id === 1) {
        if(this.company.id != 1){
          this.querylistService.getRobotByCompany(this.selectedCompany.id,this.company.id).then((res:any)=>{
            this.RobotData = res.data;
          });
        } else {
          this.querylistService.getRobotByCompanyid(this.selectedCompany.id).then((res:any)=>{
            this.RobotData = res.data;
          });
        }
      } else {
        // 购买或租用企业 只能看自己企业下的机器人
        this.querylistService.getRobotByCompanyid(id).then((res:any) => {
          this.RobotData = res.data;
        });
      }
    }
  }

  // 展开/关闭
  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;

  }
  CompanyChange(data) {
    this.selectedRobot = undefined;
    this.selectedCompany = data;
    if(data != undefined){
      this.getRobot(data.id);
    }

  }
  RobotChange(data) {

    this.selectedRobot = data;
  }
  provinceChange(value): void {
    this.querylistService.getCity().then((res:any)=>{
      this.CityData = res.data.filter(t=>t.provinceid === this.selectedProvince.provinceid);
      if(this.CityData){
        if(!this.selectedCity){
          this.selectedCity = this.CityData[0];
          this.cityChange(this.selectedCity);
        }
      }
    })
  }
  cityChange(value){
    // 骊久
    if (this.company.id==1) {
      this.querylistService.getCompany().then((res: any) => {
        this.CompanyData = res.data.filter(t => t.city === value['name'] && t.province === this.selectedProvince.name);
        if (this.CompanyData.length === 0) {
          this.selectedCompany = undefined;
          this.CompanyChange(this.selectedCompany);
        }
      })
    } else {
      // 出租企业
      if(this.company.companyType.id === 2){
        this.querylistService.getCompanyByRobot(this.company.id).then((res:any)=>{
          this.CompanyData = res.data.filter(t => t.city === value && t.province === this.selectedProvince);
          if (this.CompanyData.length === 0) {
            this.selectedCompany = undefined;
            this.CompanyChange(this.selectedCompany);
          }
        })
      }
    }
  }
  // 取缓存 上次查询条件
  getcache() {
    const data = JSON.parse(localStorage.getItem('query'));
    if (data.province && data.province.id) {
      this.selectedProvince = this.ProvinceData.filter(t => t.id === data.province.id)[0];
      this.provinceChange(data.province);
    }
    if(data.city && data.city.id){
      this.CityData.push(data.city);
      this.selectedCity = this.CityData[0];
      this.cityChange(data.city)
    }
    if(data.company && data.company.id){
      this.CompanyData.push(data.company);
      this.selectedCompany = this.CompanyData.filter(t => t.id === data.company.id)[0];
      this.CompanyChange(data.company);
    }
    if(data.robot && data.robot.id){
      this.RobotData.push(data.robot);
      this.RobotChange(data.robot);
    }
  }
  sayHello(){
    console.log('hello')
  }
  reset(){
    this.selectedProvince = undefined;
    this.selectedCity = undefined;
    this.selectedCompany = undefined;
    this.selectedRobot = undefined;
    this.startdate = undefined;
    this.enddate = undefined;
  }

}
