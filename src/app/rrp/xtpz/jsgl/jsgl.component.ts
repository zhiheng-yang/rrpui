import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {JsglService} from '../service/jsgl.service';
import {NzMessageService} from 'ng-zorro-antd';
declare var $: any;

@Component({
  selector: 'app-jsgl',
  templateUrl: './jsgl.component.html',
  styleUrls: ['./jsgl.component.css']
})
export class JsglComponent implements OnInit {

  isVisible = false;
  deleteVisible = false;
  updateVisible = false;
  role: any;
  toAddRole: any;
  roles: [];
  operation: any;
  operations: [];
  dynamicMenus: [];
  menus: [];
  // add
  toAddRolesMenus: any[] = [];
  menuOperations: any[] = [];
  authorityArray: any[] = [];

  updateRoleMenuOperation: any[] = [];
  checkDic: { [key: string]: boolean; } = {};

  // menuCorrespondingOperation: any[] = [];

  checkDic2: { [key: string]: boolean; } = {};
  // tslint:disable-next-line:variable-name
  operation_Au;
  constructor(
    private jsglService: JsglService,
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
        this.operation_Au = operation[0].operations;
      }
    });
    if (this.operation_Au.indexOf(4) === -1) {
      this.message.info('您没有打开此页面的权限');
    }
  }

  ngOnInit() {
    // 存在并发
    this.getMenus();
    this.getMenuCorrespondingOperations();
    this.getRoles();
    this.getOperations();
    // @ts-ignore
    // this.role = this.roles[0];
    this.getAllDynamicMenus();
  }

  /**
   * 使用jQuery，筛选，代替后台的查找
   */
  search(): void {
    const sstxt = $('#filterName').val();
    $('tr').hide().filter(':contains(\'' + sstxt + '\')').show();
    $('#show').show();
  }

  /**
   * 这是一种不太好的办法，应该用[(ngModel)]绑定字典或者数组，使用下面update的方法，有空改
   */
  joinAddMenus(menu: any, operation: any, isChecked: boolean): void {
    const eachMenuOperation = { eMenu: menu.id, eOperation: operation.id};
    if (isChecked) {
      if (!this.toAddRolesMenus.includes(menu)) {
        // @ts-ignore
        this.toAddRolesMenus.push(menu);
      }
      // if (!this.menuOperations.includes(eachMenuOperation))
      this.menuOperations.push(eachMenuOperation);
    } else {
      console.log(this.menuOperations.includes(eachMenuOperation));
      // tslint:disable-next-line:max-line-length
      this.menuOperations = this.menuOperations.filter(item => !(item.eMenu === eachMenuOperation.eMenu && item.eOperation === eachMenuOperation.eOperation));
      // 删除toAddRolesMenu数组中国呢的指定元素
      this.toAddRolesMenus = this.toAddRolesMenus.filter(item => item !== menu);
    }
    // console.log(this.toAddRolesMenus);
    // console.log(this.menuOperations);
  }

  add(description: any): void {
    this.authorityArray = [];
    // this.getRolesMaxId();
    console.log(this.roles);
    let maxId = 0;
    // tslint:disable-next-line:only-arrow-functions
    this.getRoles();
    this.roles.forEach(function(e) {
      if (e['id'] > maxId) {
        maxId = e['id'];
      }
    });
    this.isVisible = false;

    this.toAddRole = { id: ++maxId, description: description.value, menus: this.toAddRolesMenus };

    console.log(this.toAddRole);

    for (const sliced of this.menuOperations) {
      this.authorityArray.push({role: maxId, menu: Number(sliced['eMenu']), operation: Number(sliced['eOperation'])});
    }

    const completedAuthority: any = {toAddRole: this.toAddRole, authorityArray: this.authorityArray};

    this.jsglService.addAuthority(completedAuthority).subscribe((res: any) => {
      this.getRoles();
      if (res.state === 200) { this.message.success(res.msg); } else { this.message.error(res.msg); }
    });

    console.log(completedAuthority);
  }

  showModal(): void {
    this.isVisible = true;
    // console.log(this.operations);
    // this.getUser(1);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  delete(id: number): void {
    this.deleteVisible = false;
    this.jsglService.deleteRole(id)
      .subscribe((res: any) => {
        this.getRoles();
        if (res.state === 200) { this.message.success(res.msg); } else { this.message.error(res.msg); }
        console.log(id);
      });
  }

  getRoles(): void {
    this.jsglService.getRoles()
      .subscribe((res: any) => {
        this.roles = res.data;
        // @ts-ignore
        this.role = this.roles[0];

        // this.roles = res.data;
      });
  }

  getOperations(): void {
    this.jsglService.getOperations()
      .subscribe((res: any) => {
        this.operations = res.data;
        // @ts-ignore
        // this.role = this.roles[0];
      });
  }

  getMenus(): void {
    this.jsglService.getMenus()
      .subscribe((res: any) => {
        this.menus = res.data;
        console.log(this.menus);
      });
  }

  getMenuCorrespondingOperations(): void {
    this.jsglService.getMenuCorrespondingOperations()
      .subscribe((res: any) => {
        const menuCorrespondingOperation = res.data;
        this.checkDic2 = {};
        for (const e of menuCorrespondingOperation) this.checkDic2[e['menu']+'$'+e['operation']] = true;
      });
  }

  getAllDynamicMenus(): void {
    this.jsglService.getAllDynamicMenus()
      .subscribe((res: any) => {
        this.dynamicMenus = res.data;
        // @ts-ignore
        // this.role = this.roles[0];
      });
  }

  getInfo(data: any, data2: any, data3: any): void {
    console.log(data);
    console.log(data2);
    console.log(data3);
    console.log(this.menus);
    console.log(this.roles);
    // console.log(this.operations);
  }

  showDeleteModal(): void {
    this.deleteVisible = true;
    // this.getUser(1);
  }

  // private updateRoleMenuOperation: any[] = [];
  // private checkDic: { [key: string]: boolean; } = {};

  showUpdateModal(role: any): void {
    this.updateVisible = true;

    this.role = role;

    console.log(this.role);

    this.jsglService.findAuthorityByRoleId(this.role.id)
      .subscribe((res: any) => {
        this.checkDic = {};
        console.log(res.data);
        this.updateRoleMenuOperation = res.data;
        // 最好使用filter，最后改
        for (const sliceMenu of this.menus) {
          for (const sliceOperation of this.operations) {
            let result = false;
            for (const eachRoleMenuOperation of this.updateRoleMenuOperation) {
              if (eachRoleMenuOperation.menu === sliceMenu['id'] && eachRoleMenuOperation.operation === sliceOperation['id']) {
                result = true;
                break;
              }
            }
            // 没有复合索引，只能字符串或者数字
            this.checkDic[sliceMenu['id'] + '$' + sliceOperation['id']] = result;
          }
        }
        console.log(this.checkDic);
      });
    // this.getUser(1);
  }
  show() {
    console.log(this.checkDic);
  }
  update(): void {
    // this.getRolesMaxId();

    this.isVisible = false;
    const toUpdateRoleMenus = [];
    // 也应该用filter
    for (const key in this.checkDic) {
      if (this.checkDic[key] === true) {
        const toEachUpdateRoleMenus = this.menus.filter(item => item['id'] === Number(key.substring(0, key.indexOf('$'))))[0];
        if (!toUpdateRoleMenus.includes(toEachUpdateRoleMenus)) {
          toUpdateRoleMenus.push(toEachUpdateRoleMenus);
        }
      }
    }
    const toUpdateRole =  {
      id: this.role.id, description: this.role.description, menus: toUpdateRoleMenus
    };
    console.log(toUpdateRole);
    const toUpdateMenuOperations = [];
    for (const key in this.checkDic) {
      if (this.checkDic[key]) {
        toUpdateMenuOperations.push({
          // tslint:disable-next-line:max-line-length
          role: this.role.id, menu: Number(key.substring(0, key.indexOf('$'))), operation: Number(key.substring(key.indexOf('$') + 1, key.length + 1))
        });
      }
    }

    const completedAuthority: any = {toAddRole: toUpdateRole, authorityArray: toUpdateMenuOperations};

    this.jsglService.updateAuthority(completedAuthority).subscribe((res: any) => {
      this.getRoles();
      if (res.state === 200) { this.message.success(res.msg); } else { this.message.error(res.msg); }
    });
    // console.log(toUpdateRoleMenus);
    // console.log(toUpdateMenuOperations);
    // console.log(completedAuthority);
    // this.getMenus();
    // this.getAllDynamicMenus();
    this.updateVisible = false;
  }

  handleUpdateCancel(): void {
    this.updateVisible = false;
  }

}
