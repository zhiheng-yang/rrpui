import {Component, OnInit} from '@angular/core';
import {Bench, Robot} from '../../../core/entity/entity';
import {ActivatedRoute} from '@angular/router';
import {MtglService} from '../service/mtgl.service';
import {NzMessageService} from 'ng-zorro-antd';
import {BljqrglService} from '../../xtpz/service/bljqrgl.service';


@Component({
  selector: 'app-mtgl',
  templateUrl: './mtgl.component.html',
  styleUrls: ['./mtgl.component.css']
})
export class MtglComponent implements OnInit {
  isVisible = false;
  isVisible1 = false;
  number = '';
  des = '';
  workshop = '';
  robot;
  robots: Robot[];
  benchs: Bench[];
  bench: Bench;
  jsondata = {
        province: '',
        city: '',
        companyid: '',
        owncompanyid: JSON.parse(localStorage.getItem('userinfo')).company.id,
        companytypeid: JSON.parse(localStorage.getItem('userinfo')).company.companyType.id,
        robotid: ''
      };
  operation;

  constructor(
    private benchService: MtglService,
    private bljqrglService: BljqrglService,
    private route: ActivatedRoute,
    private message: NzMessageService
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

  showModal1(): void {
    this.isVisible1 = true;
  }

  add(): void {
    this.isVisible1 = false;
    const add = {number: this.number, description: this.des, workshop: this.workshop, robot: this.robot, company: JSON.parse(localStorage.getItem('userinfo')).company};
    this.benchService.addBench(add)
      .subscribe((res: any) => {
        this.onquery(this.jsondata);
        alert(res.msg);
      });
  }

  handleCancel1(): void {
    this.onquery(this.jsondata);
    this.isVisible1 = false;
  }

  showModal(data: Bench): void {
    this.bench = data;
    this.isVisible = true;
  }

  update(): void {
    this.isVisible = false;
    this.benchService.updateBench(this.bench)
      .subscribe((res: any) => {
        this.onquery(this.jsondata);
        this.message.success('修改成功！');
      });
  }

  handleCancel(): void {
    this.onquery(this.jsondata);
    this.isVisible = false;
  }

  ngOnInit() {
    this.onquery(this.jsondata);
    this.getRobots();
  }

  // @ts-ignore
  compareFn(o1: Compare, o2: Compare): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  getRobots(): void {
    this.bljqrglService.getRobots()
      .subscribe((res: any) => {
        this.robots = res.data;
      });
  }

  // getBenchs(): void {
  //   this.benchService.getBenchs()
  //     .subscribe((res: any) => {
  //       this.benchs = res.data;
  //     });
  // }

  delete(data: Bench | number): void {
    this.benchService.deleteBench(data)
      .subscribe((res: any) => {
        this.onquery(this.jsondata);
        this.message.success('删除成功！');
      });
  }

  fresh(): void {
    window.location.reload();
  }

  onquery(data) {
    // 保留上次查询
    if (this.jsondata === data) {
      this.benchService.query(this.jsondata).then((res: any) => {
        if (res.state === 200) {
          this.benchs = res.data;
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
      this.benchService.query(this.jsondata).then((res: any) => {
        if (res.state === 200) {
          this.benchs = res.data;
        }
      });
    }
  }
  // query(data) {
  //   if (data != null) {
  //     this.jsondata = data;
  //     if (data.robot != null) {
  //       const robotid = data.robot.id;
  //       this.benchService.getDataByRobotId(robotid).then((res: any) => {
  //         this.benchs = res.data;
  //       });
  //     } else {
  //       this.getBenchs();
  //     }
  //   } else {
  //     this.getBenchs();
  //   }
  //
  // }
}
