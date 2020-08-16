import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DemoComponent} from './demo/demo.component';
import {ChinamapComponent} from './chinamap/chinamap.component';


const routes: Routes = [
  /**************挂自己功能组件 */
  {
    path: 'demo', component: DemoComponent, data: { title: 'demo' },
  },
  {
    path: '', component: ChinamapComponent, data: { title: '互联网' },
  },
  /**************挂自己功能组件 */
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HlwRoutingModule { }
