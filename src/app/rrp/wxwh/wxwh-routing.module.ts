import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SoftwareUpdateComponent} from './software-update/software-update.component';
import {WarningComponent} from './warning/warning.component';
import {CssdComponent} from './cssd/cssd.component';


const routes: Routes = [
  /**************挂自己功能组件 */
  {
    path: 'rjsj', component: SoftwareUpdateComponent, data: { title: '软件升级' },
  },
  {
    path: 'ycrjsj', component: WarningComponent, data: { title: '远程软件升级' },
  },
  {
    path: 'cssd', component: CssdComponent, data: { title: '参数设定' },
  }
  /***************挂自己功能组件 */
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WxwhRoutingModule { }
