import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {SoftwareUpgrade} from '../../../core/entity/entity';
import {SoftwareUpdateService} from '../service/software-update.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-software-update',
  templateUrl: './software-update.component.html',
  styleUrls: ['./software-update.component.css']
})

export class SoftwareUpdateComponent implements OnInit {
  isVisible = false;
  isVisible1 = false;
  des = '';
   softwareUpgrades: SoftwareUpgrade[];
  softwareUpgrade: SoftwareUpgrade;
  operation;
  constructor(
    private softwareUpdateService: SoftwareUpdateService,
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
    const add = {description: this.des};
    this.softwareUpdateService.addSoftwareUpgrade(add)
      .subscribe((res: any) => {
        this.getSoftwareUpgrades();
        this.message.success('增加成功！');
      });
  }

  handleCancel1(): void {
    this.getSoftwareUpgrades();
    this.isVisible1 = false;
  }

  showModal(data: SoftwareUpgrade): void {
    this.softwareUpgrade = data;
    this.isVisible = true;
  }

  update(): void {
    this.isVisible = false;
    this.softwareUpdateService.updateSoftwareUpgrade(this.softwareUpgrade)
      .subscribe((res: any) => {
        if (res.state === 200) {
          this.getSoftwareUpgrades();
          this.message.success('修改成功！');
        } else {
          this.message.error('服务器异常');
        }
      });
  }

  handleCancel(): void {
    this.getSoftwareUpgrades();
    this.isVisible = false;
  }

  ngOnInit() {
    this.getSoftwareUpgrades();
  }

  getSoftwareUpgrades(): void {
    this.softwareUpdateService.getSoftwareUpgrades()
      .subscribe((res: any) => {
        this.softwareUpgrades = res.data;
      });
  }

  delete(data: SoftwareUpgrade | number): void {
    this.softwareUpdateService.deleteSoftwareUpgrade(data)
      .subscribe((res: any) => {
        this.getSoftwareUpgrades();
        this.message.success('删除成功！');
      });
  }

  fresh(): void {
    window.location.reload();
  }

}
