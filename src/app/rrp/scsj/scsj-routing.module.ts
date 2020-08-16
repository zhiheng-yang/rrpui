import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CphglComponent} from './cphgl/cphgl.component';
import {DhbmjComponent} from './dhbmj/dhbmj.component';
import {DhbslComponent} from './dhbsl/dhbsl.component';
import {HntflComponent} from './hntfl/hntfl.component';
import {MtgsComponent} from './mtgs/mtgs.component';
import {MtlylComponent} from './mtlyl/mtlyl.component';


const routes: Routes = [
  /**************挂自己功能组件 */
  {
    path: 'cphgl', component: CphglComponent, data: { title: '产品合格率' },
  },
  {
    path: 'dhbmj', component: DhbmjComponent, data: { title: '叠合板面积' },
  },
  {
    path: 'dhbsl', component: DhbslComponent, data: { title: '叠合板数量' },
  },
  {
    path: 'hntfl', component: HntflComponent, data: { title: '混凝土方量' },
  },
  {
    path: 'mtgs', component: MtgsComponent, data: { title: '模台个数' },
  },
  {
    path: 'mtlyl', component: MtlylComponent, data: { title: '模台利用率' },
  },
  /***************挂自己功能组件 */
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScsjRoutingModule { }
