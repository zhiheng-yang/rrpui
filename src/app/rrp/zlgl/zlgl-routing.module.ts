import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Zlgl1Component} from './zlgl1/zlgl1.component';
import {JfglComponent} from './jfgl/jfgl.component';
import {SpglComponent} from './spgl/spgl.component';


const routes: Routes = [
  {
    path: 'zlgl1', component: Zlgl1Component, data: { title: '租赁管理' },
  },
  {
    path: 'jfgl', component: JfglComponent, data: { title: '缴费管理' },
  },
  {
    path: 'spgl', component: SpglComponent, data: { title: '审批管理' },
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZlglRoutingModule { }
