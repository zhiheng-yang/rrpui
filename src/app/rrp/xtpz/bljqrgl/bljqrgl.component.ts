import { Component, OnInit } from '@angular/core';
import {Company, Robot} from '../../../core/entity/entity';
import {ActivatedRoute} from '@angular/router';
import {BljqrglService} from '../service/bljqrgl.service';
import {QyglService} from '../service/qygl.service';
import { NzMessageService } from 'ng-zorro-antd';
import {UrlService} from '../../../core/service/url.service';
import {Zlgl1Service} from '../../zlgl/service/zlgl1.service';

@Component({
  selector: 'app-bljqrgl',
  templateUrl: './bljqrgl.component.html',
  styleUrls: ['./bljqrgl.component.css']
})
export class BljqrglComponent implements OnInit {
  // 更新用
  isVisible = false;
  isVisible1 = false;
  isVisible2 = false;
  responseurl;
  id = '';
  name = '';
  way = '';
  add1 = false;
  add2 = false;
  contract;
  workshopId = '';
  internalId = '';
  shengchanxian = '';
  contractId;
  costMonth;
  costWay;
  connector;
  dateRange = [];
  useSituation = '未启用';
  ways: string[] = ['租赁', '购买', '制造'];
  company: Company;
  robots: Robot[];
  companys: Company[];
  isDisabled = false;
  uploadUrl = this.url.hostname + '/lease/upload';
  robot: Robot;
  operation;
  jsondata = {
    province : '',
    city : '',
    companyid: '',
    owncompanyid: JSON.parse(localStorage.getItem('userinfo')).company.id,
    companytypeid: JSON.parse(localStorage.getItem('userinfo')).company.companyType.id,
    robotid: ''
  }
  constructor(
    private bljqrglService: BljqrglService,
    private qyglService: QyglService,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private zlgl1Service: Zlgl1Service,
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
  ngOnInit() {
    this.getRobots();
    this.getCompanys();
  }
// 更新用
  showModal(data: Robot): void {
    this.robot = data;
    this.isVisible = true;
  }
  showModal1(): void {
    this.isVisible1 = true;
  }
  showModal2(data: Robot): void {
    this.add1 = true;
    this.robot = data;
    this.isVisible2 = true;
  }
  handleCancel1(): void {
    this.isVisible1 = false;
  }
  handleCancel(): void {
    this.isVisible = false;
  }
  handleCancel2(): void {
    this.isVisible2 = false;
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
  isDis(data: Robot): void {
    alert(data.way === '租赁');
  }
  zulin(): void {
    console.log(this.robots);
    this.isVisible2 = false;
    this.add1 = false;
    this.add2 = false;
    this.robot.way = '已租赁';
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
    this.bljqrglService.updateRobot(this.robot)
      .subscribe((res: any) => {
        this.getRobots();
        alert(res.msg);
      });
  }
  add(): void {
    this.isVisible1 = false;
    const add = {id: this.id
      , name: this.name, way: this.way, belongingCompany: this.company, use_situation: this.useSituation, shengchanxian: this.shengchanxian}
    this.bljqrglService.addRobot(add)
      .subscribe((res: any) => {
        this.getRobots();
        alert(res.msg);
      });
  }
  delete(data: Robot | number): void {
    this.bljqrglService.deleteRobot(data)
      .subscribe((res: any) => {
        this.getRobots();
        alert(res.msg);
      });
  }
  update(): void {
    this.isVisible = false;
    this.bljqrglService.updateRobot(this.robot)
      .subscribe((res: any) => {
        this.getRobots();
        alert(res.msg);
      });
  }
  getRobots(): void {
    this.bljqrglService.getRobots()
      .subscribe((res: any) => {
        this.robots = res.data;
      });
  }
  getRobot(id: number): void {
    this.bljqrglService.getRobot(id)
      .subscribe((res: any) => {
        this.robot = res.data;
      });
  }

  getCompanys(): void {
    this.qyglService.getCompanys()
      .subscribe((res: any) => {
        this.companys = res.data;
      });
  }
  fresh(): void {
    window.location.reload();
  }
  onquery(data) {
    // 保留上次查询
    if (this.jsondata === data) {
      this.bljqrglService.query(this.jsondata).then((res: any) => {
        if (res.state === 200) {
          this.robots = res.data;
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
        robotid: ''
      };
      // 传参赋值
      // 若不选条件 则向后端传空值
      if (data.province && data.province.name){
        this.jsondata.province=data.province.name;
      }
      if (data.city && data.city.name){
        this.jsondata.city=data.city.name;
      }
      if (data.robot) {
        this.jsondata.robotid = data.robot.id;
      }
      if (data.company) {
        this.jsondata.companyid = data.company.id;
      }
      this.bljqrglService.query(this.jsondata).then((res: any) => {
        if (res.state === 200) {
          this.robots = res.data;
        }
      });
    }
  }
}
