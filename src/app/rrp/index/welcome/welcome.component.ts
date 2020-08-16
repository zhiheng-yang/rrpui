import { Component, OnInit, ViewChild } from '@angular/core';
import {MtcsService} from '../../scgl/service/mtcs.service';
import {BenchCount, BenchData, BoardCount, ConcreteCount, Lease, Robot, Sczt} from '../../../core/entity/entity';
import { NzMessageService } from 'ng-zorro-antd';
import {QuerylistComponent} from '../../../helpcenter/querylist/querylist.component';
import {BljqrglService} from '../../xtpz/service/bljqrgl.service';
import {Zlgl1Service} from '../../zlgl/service/zlgl1.service';
import {MtgsService} from '../../scsj/service/mtgs.service';
import {DhbslService} from '../../scsj/service/dhbsl.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.less']
})
export class WelcomeComponent implements OnInit {
  @ViewChild('querylist', {static: false }) querylist: QuerylistComponent;
  benchDatas: BenchData[];
  benchData: BenchData;
  robot: Robot;
  shengchanxian: string;
  lease: Lease;
  connector: string;
  benchCount: BenchCount;
  benchNum: number;
  boardCount: BoardCount;
  boardNum: number;
  concreteCount: ConcreteCount;
  conCount: number;
  sczt: Sczt;
  mtjr: string;
  smsb: string;
  znbl: string;
  zdms: string;
  ntsc: string;
  dcxz: string;
  xczx: string;
  zdpt: string;
  znbl1: string;
  jsondata = {
    province: '',
    city: '',
    companyid: '',
    owncompanyid: JSON.parse(localStorage.getItem('userinfo')).company.id,
    companytypeid: JSON.parse(localStorage.getItem('userinfo')).company.companyType.id,
    robotid: ''
  };
  constructor(
    private benchDataService: MtcsService,
    private bljqrglService: BljqrglService,
    private zlglService: Zlgl1Service,
    private mtgsService: MtgsService,
    private dhbslService: DhbslService,
               ) {
  }
  getRobot(id: number): void {
    this.bljqrglService.getRobot(id)
      .subscribe((res: any) => {
        this.robot = res.data;
        this.shengchanxian = res.data.shengchanxian;
      });
  }
  getLease(id: number): void {
    this.zlglService.getLeaseByRobotId(id)
      .subscribe((res: any) => {
        this.lease = res.data;
        this.connector = res.data.connector;
      });
  }
  getBenchNum(id: number): void {
    this.mtgsService.getCountByRobotId(id)
      .subscribe((res: any) => {
        this.benchCount = res.data;
        this.benchNum = res.data.count;
      });
  }
  getBoardNum(id: number): void {
    this.dhbslService.getCountByRobotId(id)
      .subscribe((res: any) => {
        this.boardCount = res.data;
        this.boardNum = res.data.count;
      });
  }
  getConcreteCount(id: number): void {
    this.dhbslService.getConcreteCountByRobotId(id)
      .subscribe((res: any) => {
        this.concreteCount = res.data;
        this.conCount = res.data.count;
      });
  }
  getSczt(id: number): void {
    this.dhbslService.getScztByRobotId(id)
      .subscribe((res: any) => {
        this.sczt = res.data;
        this.mtjr = res.data.mtjr;
        this.smsb = res.data.smsb;
        this.znbl = res.data.znbl;
        this.zdms = res.data.zdms;
        this.ntsc = res.data.ntsc;
        this.dcxz = res.data.dcxz;
        this.xczx = res.data.xczx;
        this.zdpt = res.data.zdpt;
        this.znbl1 = res.data.znbl1;
      });
  }
  ngOnInit() {
    const query = JSON.parse(localStorage.getItem('query'));
    if (query.province) {
      this.onquery(query);
    } else {
      this.onquery(this.jsondata);
    }
  }
  onquery(data) {
    // 保留上次查询
    if (this.jsondata === data) {
      this.benchDataService.query(this.jsondata).then((res: any) => {
        if (res.state === 200) {
          this.benchDatas = res.data;
        }
      });
    } else {
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
      if (data.province) {
        this.jsondata.province = data.province;
      }
      if (data.city) {
        this.jsondata.city = data.city;
      }
      if (data.robot) {
        this.jsondata.robotid = data.robot.id;
        this.getRobot(data.robot.id);
        this.getLease(data.robot.id);
        this.getBenchNum(data.robot.id);
        this.getBoardNum(data.robot.id);
        this.getConcreteCount(data.robot.id);
        this.getSczt(data.robot.id);
      }
      if (data.company) {
        this.jsondata.companyid = data.company.id;
      }
      this.benchDataService.query(this.jsondata).then((res: any) => {
        if (res.state === 200) {
          this.benchDatas = res.data;
          localStorage.setItem('query', JSON.stringify({
            province: data.province ? data.province : undefined,
            city: data.city ? data.city : undefined,
            company: data.company ? data.company : undefined,
            robot: data.robot ? data.robot : undefined
          }));
        }
      });
    }
  }
}
