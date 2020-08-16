import { Component, OnInit } from '@angular/core';
import {Company, CompanyType, Lease, Pay, Robot} from '../../../core/entity/entity';
import {QyglService} from '../../xtpz/service/qygl.service';
import {ActivatedRoute} from '@angular/router';
import {JfglService} from '../service/jfgl.service';
import {Zlgl1Service} from '../service/zlgl1.service';
import { NzMessageService } from 'ng-zorro-antd';
import { formatDate } from '@angular/common';
import {UrlService} from "../../../core/service/url.service";

@Component({
  selector: 'app-jfgl',
  templateUrl: './jfgl.component.html',
  styleUrls: ['./jfgl.component.css']
})
export class JfglComponent implements OnInit {
  // 修改弹窗
  isVisible = false;
  // 增加弹框
  isVisible1 = false;
  // 查看详情弹框
  isVisible2 = false;
  add1 = false; // 添加缴费记录窗口1
  add2 = false; // 添加缴费记录窗口2
   id;
  belongcompany;
   paymentAmount: number;
   paymentTime;
   paymentDeadline;
   examineSituation = '未审核';
   paymentDuration: string;
   paymentVoucher: string;
   contractId;
   company: Company;
   company1: Company;
   robot: Robot;
   lease: Lease;
   leases: Lease[] =[];
   robots: Robot[] =[];
  // 所有公司
   companys: Company[];
  // 拥有机器人的公司
   companys1: Company[];
   pays: Pay[];
  pay: Pay;
  operation;
  uploadUrl = this.url.hostname + '/pay/upload';
  jsondata = {
    province:'',
    city:"",
    robotid:'',
    companyid:'',
    owncompanyid: JSON.parse(localStorage.getItem('userinfo')).company.id,
    companytypeid: JSON.parse(localStorage.getItem('userinfo')).company.companyType.id,
  }
  responseurl;
  ngOnInit() {
    this.onquery(this.jsondata);
    this.getCompanys();
    this.getCompanysWithRobot();
    this.getLeases();
  }
  constructor(
    private jfglService: JfglService,
    private qyglService: QyglService,
    private zlgl1Service: Zlgl1Service,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private url: UrlService,
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
  getPays(): void {
    this.jfglService.getPays()
      .subscribe((res: any) => {
        this.pays = res.data;
      });
  }
  getPay(id: number): void {
    this.jfglService.getPay(id)
      .subscribe((res: any) => {
        this.pay = res.data;
      });
  }
  getLeases(){
    this.zlgl1Service.getLeases().subscribe((res:any)=>{
      this.leases =res.data;
    })
  }
  getRobotsByBelongingComapnyId(data): void {
    this.qyglService.getRobotByBelongingCompanyId(data.id)
      .subscribe((res: any) => {
        this.robots = res.data;
      });
  }
  getCompanysWithRobot(): void {
    this.qyglService.getCompanysWithRobot()
      .subscribe((res: any) => {
        this.companys1 = res.data;
      });
  }
  getCompanys(): void {
    this.qyglService.getCompanys()
      .subscribe((res: any) => {
        this.companys = res.data;
      });
  }
  showModa2(data: Pay): void {
    console.log(data);
    this.pay = data;
    this.isVisible2 = true;
    this.id = data.id;
    this.paymentAmount = data.paymentAmount;
    this.paymentTime = data.paymentTime;
    this.examineSituation = data.examineSituation;
    this.paymentDuration = data.paymentDuration;
    this.paymentDeadline = data.paymentDeadline;
    this.paymentVoucher = data.paymentVouncher;
    this.company = data.company;
    this.robot = data.robot;
    this.lease = data.lease;
  }
  showModal1(): void {
    // this.getCompanysWithRobot();
    // this.getCompanys();
    this.isVisible1 = true;
    this.add1 = true;
  }
  showModal(data: Pay): void {
    console.log(data)
    if (!this.leases || this.leases.indexOf(data.lease) ==-1){
      this.leases.push(data.lease)
    }
    if(!this.robots || this.robots.indexOf(data.robot) ==-1){
      this.robots.push(data.robot)
    }

    this.pay = data;
    this.paymentAmount = data.paymentAmount;
    this.paymentTime = data.paymentTime;
    this.examineSituation = data.examineSituation;
    this.paymentDuration = data.paymentDuration;
    this.paymentDeadline = data.paymentDeadline;
    this.paymentVoucher = data.paymentVouncher;
    this.company = this.companys.filter(t=>t.id===data.company.id)[0];
    this.belongcompany = this.companys1.filter(t=>t.id === data.robot.belongingCompany.id)[0];

    this.robot = this.robots.filter(t=>t.id === data.robot.id)[0];
    this.lease = this.leases.filter(t=>t.id===data.lease.id)[0];
    this.isVisible = true;
  }
  add(): void {
    this.isVisible1 = false;
    this.add2 = false;
    this.add1 = false;
    const add = {robot: this.robot, paymentAmount: this.paymentAmount, company: this.company,
      paymentTime: this.lease.paymentdeadline, paymentDeadline: formatDate(this.paymentDeadline.getTime(), 'yyyy-MM-dd', 'zh-Hans'), examineSituation: this.examineSituation,
      paymentDuration: this.paymentDuration, paymentVoucher: this.paymentVoucher, lease: this.lease ,
      uploadurl: this.responseurl};
    this.jfglService.addPay(add)
      .subscribe((res: any) => {
        if(res.state===200){
          this.onquery(this.jsondata);
          this.message.success('增加成功！')
        } else {
          this.message.error('增加失败！')
        }
      });
  }
  delete(data: Pay | number): void {
    this.jfglService.deletePay(data)
      .subscribe((res: any) => {
        if(res.state===200) {
          this.onquery(this.jsondata);
          this.message.success('删除成功！')
        }
      });
  }
  update(): void {
    this.isVisible = false;
    this.jfglService.updatePay(this.pay)
      .subscribe((res: any) => {
        if(res.state===200) {
          this.onquery(this.jsondata);
          this.message.success('修改成功！')
        }
      });
  }
  handleCancel(): void {
    this.isVisible = false;
  }
  handleCancel1(): void {
    this.isVisible1 = false;
    this.add1 = false;
    this.add2 = false;
  }
  handleCancel2(): void {
    this.isVisible2 = false;
  }
  fresh(): void {
    window.location.reload();
  }
  leasechange(data){
    this.lease = data;
  }
  robotChange(data){
    this.lease = null;
    this.contractId =null;
    const jsondata ={
      companyid: data.id===undefined?'':data.id,
      belongingCompanyid: this.belongcompany.id===undefined?'':this.belongcompany.id,
      robotid: this.robot.id===undefined?'':this.robot.id,
    }
    this.jfglService.findLeaseByRobotAndCompany(jsondata).then((res:any)=>{
      if(res.state ===200){
        this.leases = res.data;
        if(res.data.length === 1){
          this.lease = res.data[0];
          this.contractId = this.lease.contractId;
        }
      }
    })
  }
  companychange(data){
    this.lease =null;
    this.contractId =null;
    const jsondata ={
      companyid: data.id===undefined?'':data.id,
      belongingCompanyid: this.belongcompany.id===undefined?'':this.belongcompany.id,
      robotid: this.robot.id===undefined?'':this.robot.id,
    }
    console.log(jsondata);
    this.jfglService.findLeaseByRobotAndCompany(jsondata).then((res:any)=>{
      if(res.state ===200){
        this.leases = res.data;
        if(res.data.length === 1){
          this.lease = res.data[0];
          this.contractId = this.lease.contractId;
        }
      }
    })

  }
  modelAdd() {
    this.add1 = !this.add1;
    this.add2 = !this.add2;
  }
  onquery(data) {
    this.query(data);
  }
  query(data) {
    if(data == this.jsondata){
      this.jfglService.query(this.jsondata).then((res:any)=>{
        if(res.state===200){
          this.pays = res.data;
        }
      })
    } else {
      this.jsondata ={
        province:'',
        city:"",
        robotid:'',
        companyid: '',
        owncompanyid: JSON.parse(localStorage.getItem('userinfo')).company.id,
        companytypeid: JSON.parse(localStorage.getItem('userinfo')).company.companyType.id,
      }
      if(data !=undefined){
        if (data.province && data.province.name){
          this.jsondata.province=data.province.name;
        }
        if (data.city && data.city.name){
          this.jsondata.city=data.city.name;
        }
        if (data.robot){
          this.jsondata.robotid=data.robot.id;
        }
        if (data.company) {
          this.jsondata.companyid = data.company.id;
        }
        this.jfglService.query(this.jsondata).then((res:any)=>{
          if(res.state===200){
            this.pays = res.data;
          }
        })
      }
    }
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
