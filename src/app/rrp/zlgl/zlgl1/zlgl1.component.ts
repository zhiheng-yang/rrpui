import { Component, OnInit } from '@angular/core';
import {JfglService} from '../service/jfgl.service';
import {QyglService} from '../../xtpz/service/qygl.service';
import {ActivatedRoute} from '@angular/router';
import {Company, Lease, Pay, Robot} from '../../../core/entity/entity';
import {Zlgl1Service} from '../service/zlgl1.service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import {formatDate} from '@angular/common';
import {UrlService} from '../../../core/service/url.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-zlgl1',
  templateUrl: './zlgl1.component.html',
  styleUrls: ['./zlgl1.component.css']
})
export class Zlgl1Component implements OnInit {
// 修改弹窗
  isVisible = false;
  // 增加弹框
  isVisible1 = false;
  // 查看详情弹框
  isVisible2 = false;
  // 续费
  isVisible3 = false;
   contractId;
   costMonth;
   costWay;
   contract;
   connector;
   paymentSituation = '1';
   workshopId = '';
   internalId = '';
   leases: Lease[];
   lease: Lease;
   id;
   robot: Robot;
   robots: Robot[];
  // 查找到的机器人的所属公司
  company: Company;
  company1: Company;
  companys1: Company[];
  companys: Company[];
  uploadUrl = this.url.hostname + '/lease/upload';
  responseurl;
  operation;
  jsondata = {
    province: '',
    city: '',
    companyid: '',
    owncompanyid: JSON.parse(localStorage.getItem('userinfo')).company.id,
    companytypeid: JSON.parse(localStorage.getItem('userinfo')).company.companyType.id,
    robotid: ''
  };
  pay = {
    money: undefined,
    date: undefined
  };
  dateRange = [];
  add1 = false;
  add2 = false;
  ngOnInit() {
    this.query(this.jsondata);
    this.getCompanysWithRobot();
    this.getCompanys();
  }
  constructor(
    private zlgl1Service: Zlgl1Service,
    private jfglService: JfglService,
    private qyglService: QyglService,
    private route: ActivatedRoute,
    private modalService: NzModalService,
    private message: NzMessageService,
    private url: UrlService,
    private sanitizer: DomSanitizer
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
  getCompanysWithRobot(): void {
    this.qyglService.getCompanysWithRobot()
      .subscribe((res: any) => {
        this.companys = res.data;
      });
  }
  getCompanys(): void {
    this.qyglService.getCompanys()
      .subscribe((res: any) => {
        this.companys1 = res.data;
      });
  }
  getRobotsByBelongingComapnyId(data): void {
    console.log(data);
    this.qyglService.getRobotByBelongingCompanyId(data.id)
      .subscribe((res: any) => {
        this.robots = res.data;
      });
  }
  showModa2(data: Lease): void {
    this.lease = data;
    this.contractId = data.contractId;
    this.costMonth = data.costMonth;
    this.costWay = data.costWay;
    this.contract = data.contract;
    this.connector = data.connector;
    this.company1 = data.companyId;
    this.id = data.id;
    this.dateRange = [data.startTime, data.endTime];
    this.robot = data.robot;
    this.isVisible2 = true;
  }
  showModal1(): void {
    this.add1 = true;
    this.isVisible1 = true;
    this.dateRange = [];
    this.contractId = undefined;
    this.costMonth = undefined;
    this.costWay = undefined;
    this.contract = undefined;
    this.company1 = undefined;
    this.connector = undefined;
  }
  showModa3(data) {
    if (data.paymentSituation === '2'){
      this.message.info('已发起续费请求，请耐心等待客服经理审批！');
    } else {
      this.isVisible3 = true;
      this.lease = data;
      this.pay = {
        date: '',
        money: ''
      };
    }
  }
  showModal(data: Lease): void {
    this.getCompanysWithRobot();
    this.getCompanys();
    this.lease = data;
    this.contractId = data.contractId;
    this.costMonth = data.costMonth;
    this.costWay = data.costWay;
    this.contract = data.contract;
    this.company1 = data.companyId;
    this.connector = data.connector;
    this.id = data.id;
    this.dateRange = [data.startTime, data.endTime];
    this.robot = data.robot;
    this.isVisible = true;
  }
  add(): void {
    console.log(this.robots);
    this.isVisible1 = false;
    this.add1 = false;
    this.add2 = false;
    const add = { robot: this.robot, contractId: this.contractId, companyId: this.company1,
      costWay: this.costWay, costMonth: this.costMonth, startTime: this.dateRange[0], endTime: this.dateRange[1],
      paymentSituation: '0', workshopId: this.workshopId, internalId: this.internalId,
      contract: this.contract, connector: this.connector, uploadurl: this.responseurl, state: '未启用'};
    this.zlgl1Service.addLease(add)
      .subscribe((res: any) => {
        if(res.state === 200) {
          this.onquery(this.jsondata);
          this.message.success('增加成功！');
        } else {
          this.onquery(this.jsondata);
          this.message.error('增加失败！');
        }
      });
  }
  delete(data: Lease | number): void {
    this.zlgl1Service.deleteLease(data)
      .subscribe((res: any) => {
        this.onquery(this.jsondata);
        this.message.success('删除成功！');
      });
  }
  update(): void {
    const update = {id: this.id, robot: this.robot, contractId: this.contractId, companyId: this.company1,
      costWay: this.costWay, costMonth: this.costMonth, startTime: Date.parse(new Date().toDateString()) + '',
      paymentSituation: this.paymentSituation, workshopId: this.workshopId, internalId: this.internalId,
      contract: this.contract, connector: this.connector};
    this.zlgl1Service.updateLease(update)
      .subscribe((res: any) => {
        this.onquery(this.jsondata);
        this.message.success('修改成功！');
      });
  }
  handleCancel(): void {
    this.isVisible = false;
  }
  handleCancel1(): void {
    this.isVisible1 = false;
    this.add1 = false;
    this.add2 =  false;
  }
  handleCancel2(): void {
    this.isVisible2 = false;
  }
  fresh(): void {
    window.location.reload();
  }
  remind(data) {
    console.log(data);
    this.modalService.confirm({
      nzTitle: null,
      nzContent: '<b style="color: red;">您确定要对该布料机器人发送缴费提醒吗？</b>',
      nzOkText: '确定',
      nzOnOk: () => this.remindOk(data),
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel')
    });
  }
  cancleremind(data) {
    this.modalService.confirm({
      nzTitle: null,
      nzContent: '<b style="color: red;">您确定要对该布料机器人取消提醒吗？</b>',
      nzOkText: '确定',
      nzOnOk: () => this.remindCancle(data),
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel')
    });
  }
  remindOk(data) {
    this.zlgl1Service.remind(data.id).then(res => {
      this.onquery(this.jsondata);
    });
  }
  remindCancle(data) {
    this.zlgl1Service.cancleremind(data.id).then(res => {
      this.onquery(this.jsondata);
    });
  }
  showModalVisible(data, state) {
    console.log(data);
    // 启用
    if (state === 1) {
      this.modalService.confirm({
        nzTitle: null,
        nzContent: '<b style="color: red;">您确定要启用该布料机器人吗？</b>',
        nzOkText: '确定',
        nzOnOk: () => this.zlgl1Service.start(data).then((res: any) => {
          if (res.state === 200) {
            this.onquery(this.jsondata);
            this.message.success(res.data.msg);
          }
        }),
        nzCancelText: '取消',
        nzOnCancel: () => console.log('Cancel')
      });

    }
    if (state === 2) {
      this.modalService.confirm({
        nzTitle: null,
        nzContent: '<b style="color: red;">您确定要停用该布料机器人吗？</b>',
        nzOkText: '确定',
        nzOnOk: () => this.zlgl1Service.stop(data).then((res: any) => {
          if (res.state === 200) {
            this.onquery(this.jsondata);
            this.message.success(res.data.msg);
          }
        }),
        nzCancelText: '取消',
        nzOnCancel: () => console.log('Cancel')
      });

    }
  }
  modelAdd() {
    this.add1 = !this.add1;
    this.add2 = !this.add2;
  }

  onquery(data) {
    console.log(data);
    this.query(data);
  }
  query(data) {
      if (data !== undefined) {
        this.jsondata = {
          province: '',
          city: '',
          companyid: '',
          owncompanyid: JSON.parse(localStorage.getItem('userinfo')).company.id,
          companytypeid: JSON.parse(localStorage.getItem('userinfo')).company.companyType.id,
          robotid: ''
        };
        if (data.province && data.province.name) {
          this.jsondata.province = data.province.name;
        }
        if (data.city && data.city.name) {
          this.jsondata.city = data.city.name;
        }
        if (data.robot) {
          this.jsondata.robotid = data.robot.id;
        }
        if (data.company) {
          this.jsondata.companyid = data.company.id;
        }
        this.zlgl1Service.queryLease(this.jsondata).then((res: any) => {
          this.leases = res.data;
        });
      }
  }
  Pay() {
    const pay = new Pay();
    pay.lease = this.lease;
    pay.company = this.lease.companyId;
    pay.robot = this.lease.robot;
    pay.examineSituation = '待审核';
    pay.paymentTime =  formatDate(new Date().getTime(), 'yyyy-MM-dd', 'zh-Hans');
    pay.paymentDeadline = this.pay.date;
    pay.paymentAmount =  parseInt(this.pay.money);
    console.log(pay);
    this.zlgl1Service.pay(pay).then((res: any) => {
      if (res.state === 200) {
        this.message.success('已发出审批请求，等待客服经理审批！');
        this.isVisible3 = false;
      }
    });


  }

  // 获得response信息
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
}
