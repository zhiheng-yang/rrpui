import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {YhglService} from '../service/yhgl.service';
import {Location} from '@angular/common';
import {NzMessageService} from 'ng-zorro-antd';
declare var $: any;

// 记得清理死代码
@Component({
  selector: 'app-yhgl',
  templateUrl: './yhgl.component.html',
  styleUrls: ['./yhgl.component.css']
})
export class YhglComponent implements OnInit {
  isVisible = false;
  isVisible1 = false;
  updateVisible = false;
  deleteVisible = false;
  resetVisible = false;
  user: any;
  users: [];
  companies: [];
  company: any;
  role: any;
  roles: [];
  operation;
  jsondata = {
    province: '',
    city: '',
    companyid: '',
    owncompanyid: JSON.parse(localStorage.getItem('userinfo')).company.id,
    companytypeid: JSON.parse(localStorage.getItem('userinfo')).company.companyType.id,
  };
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('userinfo'));
    this.onquery(this.jsondata);
    this.getCompanies();
    this.getRoles();
  }

  constructor(
    private yhglService: YhglService,
    private route: ActivatedRoute,
    private location: Location,
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

  onquery(data) {
    // 保留上次查询
    if (this.jsondata === data) {
      this.yhglService.query(this.jsondata).then((res: any) => {
        if (res.state === 200) {
          this.user = res.data[0];
          this.users = res.data;
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
      this.yhglService.query(this.jsondata).then((res: any) => {
        if (res.state === 200) {
          this.users = res.data;
        }
      });
    }
  }


  getUsers(): void {
    // this.yhglService.getUsers()
    //   .subscribe((res: any) => {
    //     this.users = res.data;
    //     // @ts-ignore
    //     this.user = res.data[0];
    //   });

    // @ts-ignore
    // if (this.users[0] != null) {this.users = this.users[0]; console.log(this.users[0]); }
    // this.getInfo();
    const queryDate = {
      companyid: JSON.parse(localStorage.getItem('userinfo')).company.id
    };
    this.onquery(queryDate);
  }

  // $(function(){
   //      $('#ss').click(function(){
   //           var sstxt=$('#filtertxt').val();
   //           $("table tbody tr").hide().filter(":contains('"+sstxt+"')").show();
   //        });
   //   });
  search(): void {
    const sstxt = $('#filterName').val();
    $('tr').hide().filter(':contains(\'' + sstxt + '\')').show();
    $('#show').show();
  }

  showModal1(): void {
    this.isVisible1 = true;
    // this.getUser(1);
  }
  showUpdateModal(id: number): void {
    this.getUser(id);
    this.updateVisible = true;
  }
  updateHandleCancel(): void {
    this.updateVisible = false;
  }

  showDeleteModal(): void {
    this.deleteVisible = true;
  }

  deleteHandleCancel(): void {
    this.deleteVisible = false;
  }

  showResetModal(): void {
    this.resetVisible = true;
  }

  resetHandleCancel(): void {
    this.resetVisible = false;
  }

  // showModal(data: SoftwareUpgrade): void {
  //   this.user = data;
  //   this.isVisible = true;
  // }

  handleCancel(): void {
    this.isVisible1 = false;
  }

  update(): void {
    this.isVisible = false;
    this.yhglService.updateUser(this.user)
      .subscribe((res: any) => {
        // this.user;
        if (res.state === 200) { this.message.success(res.msg); } else { this.message.error(res.msg); }
      });
    this.updateVisible = false;
  }

  getCompanies(): void {
    this.yhglService.getCompanies()
      .subscribe((res: any) => {
        this.companies = res.data;
        // @ts-ignore
        this.company = this.companies[0];
      });
  }

  getRoles(): void {
    this.yhglService.getRoles()
      .subscribe((res: any) => {
        this.roles = res.data;
        // @ts-ignore
        this.role = this.roles[0];
      });
  }

  delete(id: number): void {
    this.deleteVisible = false;
    this.yhglService.deleteUser(id)
      .subscribe((res: any) => {
        this.getUsers();
        if (res.state === 200) { this.message.success(res.msg); } else { this.message.error(res.msg); }
      });
  }

  getUser(id: number): void {
    this.yhglService.getUser(id)
      .subscribe((res: any) => {
        this.user = res.data;
      });
  }

  resetPassword(id: number): void {
    this.resetVisible = false;
    this.yhglService.resetPassword(id)
      .subscribe((res: any) => {
        if (res.state === 200) {  this.message.success(res.msg + ',密码重置为123456'); } else { this.message.error(res.msg); }
        console.log(id);
      });
  }

  // getRole(id: number): void {
  //   this.yhglService.getUser(id)
  //     .subscribe((res: any) => {
  //       this.role = res.data;
  //       // console.log(res.data);
  //     });
  // }

  add(name: any, username: any,
      password: any, contact: any, company: any, role: any): void {
    this.isVisible1 = false;
    // tslint:disable-next-line:max-line-length
    this.user = {name: name.value, username: username.value, password: password.value, contact: contact.value,
      company: this.company, role: this.role,
    }; // 或者直接把密码设置为12345
    this.yhglService.addUser(this.user).subscribe((res: any) => {
      this.getUsers();
      if (res.state === 200) { this.message.success(res.msg); } else { this.message.error(res.msg); }
    });
  }


}
