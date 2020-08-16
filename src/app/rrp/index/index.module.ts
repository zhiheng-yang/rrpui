import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {IndexComponent} from './index.component';
import {EmptyComponent} from './empty/empty.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';
import {WelcomeComponent} from './welcome/welcome.component';
import {ZlglComponent} from '../zlgl/zlgl.component';
import {YxqkComponent} from '../yxqk/yxqk.component';
import {XtpzComponent} from '../xtpz/xtpz.component';
import {HlwComponent} from '../hlw/hlw.component';
import {WxwhComponent} from '../wxwh/wxwh.component';
import {ScsjComponent} from '../scsj/scsj.component';
import {ScglComponent} from '../scgl/scgl.component';
import {QuerylistModule} from "../../helpcenter/querylist/querylist.module";


const routes: Routes = [
  {
    path: '', component: IndexComponent, children: [
      // 首页
      {
        path: 'welcome', component: WelcomeComponent, data: {reuse: false, track: false}
      },
      // 互联网
      {
        path: 'hlw', loadChildren: () => import('../hlw/hlw.module').then(m => m.HlwModule)
      },
      // 维修维护
      {
        path: 'wxwh', loadChildren: () => import('../wxwh/wxwh.module').then(m => m.WxwhModule)
      },
      // 生产数据
      {
        path: 'scsj', loadChildren: () => import('../scsj/scsj.module').then(m => m.ScsjModule)
      },
      // 生产管理
      {
        path: 'scgl', loadChildren: () => import('../scgl/scgl.module').then(m => m.ScglModule)
      },
      // 运行情况
      {
        path: 'yxqk', loadChildren: () => import('../yxqk/yxqk.module').then(m => m.YxqkModule)
      },
      // 租赁管理
      {
        path: 'zlgl', loadChildren: () => import('../zlgl/zlgl.module').then(m => m.ZlglModule)
      },
      // 系统配置
      {
        path: 'xtpz', loadChildren: () => import('../xtpz/xtpz.module').then(m => m.XtpzModule)
      },
      {
        path: 'empty', component: EmptyComponent, data: {reuse: false, track: false}
      },
    ], data: {reuse: false, track: false}
  }
];
@NgModule({
  declarations: [
    IndexComponent,
    WelcomeComponent,
    EmptyComponent,
    ZlglComponent,
    YxqkComponent,
    XtpzComponent,
    HlwComponent,
    WxwhComponent,
    ScsjComponent,
    ScglComponent
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    RouterModule,
    RouterModule.forChild(routes),
    FormsModule,
    QuerylistModule,
  ]
})
export class IndexModule { }
