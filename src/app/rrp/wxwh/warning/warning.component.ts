import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WarningService} from '../service/warning.service';
import {Warning} from '../../../core/entity/entity';
import {NzMessageService} from 'ng-zorro-antd';
import {Zlgl1Service} from '../../zlgl/service/zlgl1.service';

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.css']
})

export class WarningComponent implements OnInit {
  isVisible = false;
  // isVisible1 = false;
  warnings: Warning[];
  warning: Warning;
  // warning1: Warning;
  operation;
  jsondata = {
    province: '',
    city: '',
    companyid: '',
    owncompanyid: JSON.parse(localStorage.getItem('userinfo')).company.id,
    companytypeid: JSON.parse(localStorage.getItem('userinfo')).company.companyType.id,
    robotid: ''
  };

  constructor(
    private zlgl1Service: Zlgl1Service,
    private warningService: WarningService,
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

  //
  // showModal1(): void {
  //   this.warning1 = null;
  //   this.isVisible1 = true;
  // }
  //
  // add(): void {
  //   this.isVisible1 = false;
  //   this.warningService.addWarning(this.warning1)
  //     .subscribe((res) => {
  //
  //       alert(res.msg);
  //     });
  // }
  //
  // handleCancel1(): void {
  //
  //   this.isVisible1 = false;
  // }

  showModal(data: Warning): void {
    this.warning = data;
    this.isVisible = true;
  }

  update(): void {
    this.isVisible = false;
    this.warningService.updateWarning(this.warning)
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
    // this.getWarnings();
    this.onquery(this.jsondata);
  }

  getWarnings(): void {
    this.warningService.getWarnings()
      .subscribe(res => {
        this.warnings = res.data;
      });
  }

  delete(data: Warning | number): void {
    this.warningService.deleteWarning(data)
      .subscribe(res => {

        this.onquery(this.jsondata);
        alert(res.msg);
      });
  }

  onquery(data) {
    // 保留上次查询
    if (this.jsondata === data) {
      this.warningService.query(this.jsondata).then((res: any) => {
        if (res.state === 200) {
          this.warnings = res.data;
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

      this.warningService.query(this.jsondata).then((res: any) => {
        if (res.state === 200) {
          this.warnings = res.data;
        }
      });
    }
  }

  // show(): void {
  //   this.warningService.getWarnings()
  //     .subscribe(res => {
  //       this.warnings = res.data;
  //       for (let i = 0; i < this.warnings.length; i++) {
  //         for (let j = 0; j < 29; j++) {
  //           if (this.warnings[i].)
  //         }
  //       }
  //     });
  // }


  // query(data) {
  //   if (data != null) {
  //     this.jsondata = data;
  //     if (data.robot != null) {
  //       const robotid = data.robot.id;
  //       this.warningService.getDataByRobotId(robotid).then((res: any) => {
  //         this.warnings = res.data;
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
