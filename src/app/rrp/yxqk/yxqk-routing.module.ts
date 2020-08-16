import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {YxsjtjComponent} from './yxsjtj/yxsjtj.component';
import {SbyxztComponent} from './sbyxzt/sbyxzt.component';


const routes: Routes = [
  /**************挂自己功能组件 */
  {
    path: 'yxsjtj', component: YxsjtjComponent, data: { title: '运行数据统计' },
  },
  {
    path: 'sbyxzt', component: SbyxztComponent, data: { title: '设备运行状态' },
  },
  /***************挂自己功能组件 */
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YxqkRoutingModule { }
