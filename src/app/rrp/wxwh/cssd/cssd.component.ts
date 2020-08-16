import {Component, OnInit} from '@angular/core';
import {Lease, RobotData} from '../../../core/entity/entity';
import {CssdService} from '../service/cssd.service';
import {ActivatedRoute} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';
import {Zlgl1Service} from '../../zlgl/service/zlgl1.service';

@Component({
  selector: 'app-cssd',
  templateUrl: './cssd.component.html',
  styleUrls: ['./cssd.component.css']
})
export class CssdComponent implements OnInit {
  jsondata = {
    province: '',
    city: '',
    companyid: '',
    owncompanyid: JSON.parse(localStorage.getItem('userinfo')).company.id,
    companytypeid: JSON.parse(localStorage.getItem('userinfo')).company.companyType.id,
    robotid: ''
  };
  leases: Lease[];
  lease: Lease;
  isVisible = false;
  robotDatas: RobotData[];
  robotData: RobotData;
  operation;

  constructor(
    private zlgl1Service: Zlgl1Service,
    private cssdService: CssdService,
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

  showModal(data: RobotData): void {
    this.robotData = data;
    this.isVisible = true;
  }

  update(): void {
    this.isVisible = false;
    this.cssdService.updateRobotData(this.robotData)
      .subscribe((res) => {

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

  getRobotDatas(): void {
    this.cssdService.getRobotDatas()
      .subscribe(res => {
        this.robotDatas = res.data;
      });
  }

  delete(data: RobotData | number): void {
    this.cssdService.deleteRobotData(data)
      .subscribe(res => {

        this.onquery(this.jsondata);
        alert(res.msg);
      });
  }

  onquery(data) {
    // 保留上次查询
    if (this.jsondata === data) {
      this.cssdService.query(this.jsondata).then((res: any) => {
        if (res.state === 200) {
          this.robotDatas = res.data;
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
      this.cssdService.query(this.jsondata).then((res: any) => {
        if (res.state === 200) {
          this.robotDatas = res.data;
        }
      });
    }
  }

  setZero(): void {
    this.robotData.encodervalue_zero_X = 0;
    this.robotData.encodervalue_zero_Y = 0;
    this.robotData.encodervalue_zero_Z = 0;
    this.update();
  }

  setZero1(): void {
    this.robotData.enddistance = 0;
    this.update();
  }

  shake1(): void {
    if (this.robotData.vibrate_outputs0 === true) {
      this.robotData.vibrate_outputs0 = false;
    }
    if (this.robotData.vibrate_outputs0 === false) {
      this.robotData.vibrate_outputs0 = true;
    }
  }

  shake2(): void {
    if (this.robotData.vibrate_outputs1 === true) {
      this.robotData.vibrate_outputs1 = false;
    }
    if (this.robotData.vibrate_outputs1 === false) {
      this.robotData.vibrate_outputs1 = true;
    }
  }

  shake3(): void {
    if (this.robotData.vibrate_outputs2 === true) {
      this.robotData.vibrate_outputs2 = false;
    }
    if (this.robotData.vibrate_outputs2 === false) {
      this.robotData.vibrate_outputs2 = true;
    }
  }

  shake4(): void {
    if (this.robotData.vibrate_outputs3 === true) {
      this.robotData.vibrate_outputs3 = false;
    }
    if (this.robotData.vibrate_outputs3 === false) {
      this.robotData.vibrate_outputs3 = true;
    }
  }

  // query(data) {
  //   if (data != null) {
  //     this.jsondata = data;
  //     if (data.robot != null) {
  //       const robotid = data.robot.id;
  //       this.cssdService.getDataByRobotId(robotid).then((res: any) => {
  //         this.robotDatas = res.data;
  //       });
  //     } else {
  //
  //     }
  //   } else {
  //
  //   }
  //
  // }
}
