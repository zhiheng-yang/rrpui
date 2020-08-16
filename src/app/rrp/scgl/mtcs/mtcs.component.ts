import {Component, OnInit, ViewChild} from '@angular/core';
import {Bench, BenchData} from '../../../core/entity/entity';
import {ActivatedRoute} from '@angular/router';
import {MtcsService} from '../service/mtcs.service';
import {SccsComponent} from '../sccs/sccs.component';
import {NzMessageService} from 'ng-zorro-antd';
import {MtglService} from "../service/mtgl.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-mtcs',
  templateUrl: './mtcs.component.html',
  styleUrls: ['./mtcs.component.css']
})
export class MtcsComponent implements OnInit {
  isVisible = false;
  isVisible1 = false;
  number = '';
  des = '';
  benchs: Bench[];
  workshop = '';
  benchDatas: BenchData[];
  benchData: BenchData;
  benchData1: BenchData;
  benchid;
  items;
  adds = [];
  produces = [];
  accountArray;
  operation;
  // 前端传参
  jsondata = {
    province: '',
    city: '',
    companyid: '',
    owncompanyid: JSON.parse(localStorage.getItem('userinfo')).company.id,
    companytypeid: JSON.parse(localStorage.getItem('userinfo')).company.companyType.id,
    robotid: ''
  };
  @ViewChild(SccsComponent, {static: false}) sccsComponent: SccsComponent;

  constructor(
    private benchService: MtglService,
    private datePipe: DatePipe,
    private benchDataService: MtcsService,
    private route: ActivatedRoute,
    private message: NzMessageService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params != null) {
        let operation = JSON.parse(localStorage.getItem("Authority")).filter(t => {
          if (t.menu.toString() === params['menuid']) {
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

  showModal1(): void {
    this.getBenchs();
    this.isVisible1 = true;
  }

  clickItem(item) {
    let check = true;
    this.benchDataService.getByBenchMax(item)
      .subscribe((res: any) => {
        if (res.data !== null) {
          // console.log(this.adds);
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.adds.length; i++) {
            // alert(this.adds[i].id === res.data.id);
            if (this.adds[i].id === res.data.id) {
              check = false;
              this.adds.splice(i, 1);
            }
          }
          if (check) {
            this.adds.push(res.data);
          }
        }
      });
  }

  add() {
    this.isVisible1 = false;
    // console.log(this.adds);
    if (this.adds !== null) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.adds.length; i++) {
        const time1 = new Date();
        const time = this.datePipe.transform(time1, 'yyyy-MM-dd HH:mm:ss');
        const num = time + this.adds[i].bench.number;
        const add = {number: num, time: time1, bench: this.adds[i].bench, company: this.adds[i].company, state: 0};
        this.benchDataService.addBenchData(add)
          .subscribe((res: any) => {
            this.getBenchDatas();
            // alert(res.msg);
          });
      }
      this.adds = [];
    }
  }


  handleCancel1(): void {
    this.isVisible1 = false;
  }

  showModal(data: BenchData): void {
    this.benchData = data;
    this.sccsComponent.getdata(data.bench.id);
    this.sccsComponent.isVisible = true;
  }

  update(): void {
    this.isVisible = false;
    this.benchDataService.updateBenchData(this.benchData)
      .subscribe((res: any) => {
        this.onquery(this.jsondata);
        alert(res.msg);
      });
  }

  handleCancel(): void {
    this.onquery(this.jsondata);
    this.isVisible = false;
  }

  ngOnInit() {
    this.onquery(this.jsondata);
  }

  getBenchDatas(): void {
    this.benchDataService.getBenchDatas()
      .subscribe((res: any) => {
        this.benchDatas = res.data;
      });
  }

  delete(data: BenchData | number): void {
    this.benchDataService.deleteBenchData(data)
      .subscribe((res: any) => {
        this.onquery(this.jsondata);
        alert(res.msg);
      });
  }

  fresh(): void {
    window.location.reload();
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
      if (data.province) {
        this.jsondata.province = data.province;
      }
      if (data.city) {
        this.jsondata.city = data.city;
      }
      if (data.robot) {
        this.jsondata.robotid = data.robot.id;
      }
      if (data.company) {
        this.jsondata.companyid = data.company.id;
      }
      this.benchDataService.query(this.jsondata).then((res: any) => {
        if (res.state === 200) {
          this.benchDatas = res.data;
        }
      });
    }
  }

  getBenchs(): void {
    this.benchService.getBenchs()
      .subscribe((res: any) => {
        this.benchs = res.data;
      });
  }

  produce(): void {

    // tslint:disable-next-line:variable-name
    const confirm_ = confirm('确认启动?');
    if (confirm_) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.produces.length; i++) {
        this.benchDataService.getBenchData(this.produces[i])
          .subscribe((res: any) => {
            const update = res.data;
            update.state = 2;
            this.benchDataService.updateBenchData(update)
              .subscribe((res1: any) => {
                this.getBenchDatas();
              });
          });
      }
    }
  }

  checkProduce(item): void {
    let check = true;
    if (this.produces !== null) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.produces.length; i++) {
        // alert(this.produces[i].id === item.id);
        if (this.produces[i] === item) {
          check = false;
          this.produces.splice(i, 1);
        }
      }
      if (check) {
        this.produces.push(item);
      }
      console.log(this.produces);
    }
  }

}
