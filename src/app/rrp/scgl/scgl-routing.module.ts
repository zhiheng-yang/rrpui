import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MtglComponent} from './mtgl/mtgl.component';
import {MtcsComponent} from './mtcs/mtcs.component';
import {SccsComponent} from './sccs/sccs.component';


const routes: Routes = [
  /**************挂自己功能组件 */
  {
    path: 'mtgl', component: MtglComponent, data: { title: 'demo' },
  },
  {
    path: 'mtcs', component: MtcsComponent, data: { title: 'demo' },
  },
  {
    path: 'sccs/:id', component: SccsComponent, data: { title: 'demo' },
  },
  /***************挂自己功能组件 */
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScglRoutingModule { }
