import { Component, OnInit } from '@angular/core';
import {QyglService} from '../service/qygl.service';
import {Company, CompanyType, Robot} from '../../../core/entity/entity';
import {ActivatedRoute} from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import {UrlService} from '../../../core/service/url.service';
import {Zlgl1Service} from '../../zlgl/service/zlgl1.service';


@Component({
  selector: 'app-qygl',
  templateUrl: './qygl.component.html',
  styleUrls: ['./qygl.component.css']
})
export class QyglComponent implements OnInit {
  isVisible = false;
  isVisible1 = false;
  isVisible2 = false;
  isVisible3 = false;
  id;
  add1 = false;
  add2 = false;
  name = '';
  companyType: CompanyType;
  province;
  city;
  address = '';
  legalPerson = '';
  phone = '';
  companyTypes: CompanyType[];
  robot: Robot;
  robots: Robot[];
  companys: Company[];
  company: Company;
  operation;
  contractId;
  dateRange;
  costMonth;
  contract;
  costWay;
  responseurl;
  connector;
  workshopId = '';
  internalId = '';
  uploadUrl = this.url.hostname + '/lease/upload';
  ProvinceData;
  CityData;
  jsondata = {
    province: '',
    city: '',
    companyid: '',
    owncompanyid: JSON.parse(localStorage.getItem('userinfo')).company.id,
    companytypeid: JSON.parse(localStorage.getItem('userinfo')).company.companyType.id,
  };
  ngOnInit() {
    this.getCompanys();
    this.getCompanyTypes();
    this.getprovince();
  }
  constructor(
    private qyglService: QyglService,
    private zlgl1Service: Zlgl1Service,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private url: UrlService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params != null) {
        const operation = JSON.parse(localStorage.getItem('Authority')).filter(t => {
          if (t.menu.toString() === params.menuid) {
            return t.operations;
          }
        });
        this.operation = operation[0].operations;
      }
    });
    if (this.operation.indexOf(4) === -1) {
      this.message.info('您没有打开此页面的权限');
    }
  }
  getCompanys(): void {
    this.qyglService.getCompanys()
      .subscribe((res: any) => {
        this.companys = res.data;
      });
  }
  getprovince() {
    this.qyglService.getProvince().then((res: any) => this.ProvinceData = res.data);
  }
  provinceChange(value: string): void {
    this.qyglService.getCity().then((res:any)=>{
      this.CityData = res.data.filter(t =>t.provinceid === this.province['provinceid']);
      if (this.CityData) {
        this.city = this.CityData[0];
      }
    })
  }
  getCompany(id: number): void {
    this.qyglService.getCompany(id)
      .subscribe((res: any) => {
        this.company = res.data;
      });
  }
  getCompanyTypes(): void {
    this.qyglService.getCompanyTypes()
      .subscribe((res: any) => {
        this.companyTypes = res.data;
      });
  }
  getRobotsByBelongingComapnyId(id: number): void {
    this.qyglService.getRobotByBelongingCompanyId(id)
      .subscribe((res: any) => {
        this.robots = res.data;
      });
  }
  showModal3(data: Company): void {
    this.company = data;
    this.isVisible3 = true;
    this.add1 = true;
  }
  showModa2(data: Company): void {
    this.company = data;
    this.isVisible2 = true;
  }
  showModal1(): void {
    this.isVisible1 = true;
  }
  showModal(data: Company): void {
    this.company = data;
    this.isVisible = true;
  }
  handleChange(info: any): void {
    if (info) {
      if (info.type === 'success') {
        if (info.file) {
          if (info.file.response) {
            if (info.file.response.data !== undefined) {
              const data = info.file.response.data;
              this.responseurl = data;
            }
          }
        }
      }
    }
  }
  modelAdd() {
    this.add1 = !this.add1;
    this.add2 = !this.add2;
  }
  zulin(): void {
    console.log(this.robots);
    this.isVisible2 = false;
    this.add1 = false;
    this.add2 = false;
    const add = { robot: this.robot, contractId: this.contractId, companyId: this.company,
      costWay: this.costWay, costMonth: this.costMonth, startTime: this.dateRange[0], endTime: this.dateRange[1],
      paymentSituation: '0', workshopId: this.workshopId, internalId: this.internalId,
      contract: this.contract, connector: this.connector, uploadurl: this.responseurl, state: '未启用'};
    this.zlgl1Service.addLease(add)
      .subscribe((res: any) => {
        if (res.state === 200) {
          this.onquery(this.jsondata);
          this.message.success('租赁成功！');
        } else {
          this.onquery(this.jsondata);
          this.message.error('租赁失败！');
        }
      });
  }
  add(): void {
    this.isVisible1 = false;
    const add = {name: this.name, companyType: this.companyType, province: this.province.name, city: this.city.name,
      address: this.address, legalPerson: this.legalPerson, phone: this.phone}
    this.qyglService.addCompany(add)
      .subscribe((res: any) => {
        this.getCompanys();
        alert(res.msg);
      });
  }
  update(): void {
    this.isVisible = false;
    const update = {id: this.company.id, name: this.company.name, companyType: this.companyType,
      province: this.company.province, city: this.company.city,
      address: this.company.address, legalPerson: this.company.legalPerson, phone: this.company.phone}
    this.qyglService.updateCompany(update)
      .subscribe((res: any) => {
        this.getCompanys();
        alert(res.msg);
      });
  }
  handleCancel(): void {
    this.isVisible = false;
  }
  handleCancel1(): void {
    this.isVisible1 = false;
  }
  handleCancel2(): void {
    this.isVisible2 = false;
  }
  handleCancel3(): void {
    this.isVisible3 = false;
  }



  //
  // handleCancel(): void {
  //   this.isVisible = false;
  // }
  //
  //
  //
  //
  //
  delete(data: Company | number): void {
    this.qyglService.deleteCompany(data)
      .subscribe((res: any) => {
        this.getCompanys();
        alert(res.msg);
      });
  }

  fresh(): void {
    window.location.reload();
  }
  onquery(data) {
    // 保留上次查询
    if (this.jsondata === data) {
      this.qyglService.query(this.jsondata).then((res: any) => {
        if (res.state === 200) {
          this.companys = res.data;
        }
      });
    } else {
      // data为查询组件所选值
      console.log(data);
      // 初始化 传参jsondata
      this.jsondata = {
        province: '',
        city: '',
        companyid: '',
        owncompanyid: JSON.parse(localStorage.getItem('userinfo')).company.id,
        companytypeid: JSON.parse(localStorage.getItem('userinfo')).company.companyType.id,
      };
      // 传参赋值
      // 若不选条件 则向后端传空值
      if (data.province && data.province.name){
        this.jsondata.province=data.province.name;
      }
      if (data.city && data.city.name){
        this.jsondata.city=data.city.name;
      }
      if (data.company) {
        this.jsondata.companyid = data.company.id;
      }
      this.qyglService.query(this.jsondata).then((res: any) => {
        if (res.state === 200) {
          this.companys = res.data;
        }
      });
    }
  }
}
