import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {YxqkRoutingModule} from './yxqk-routing.module';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { SbyxztComponent } from './sbyxzt/sbyxzt.component';
import { YxsjtjComponent } from './yxsjtj/yxsjtj.component';

@NgModule({
  declarations: [SbyxztComponent, YxsjtjComponent],
  imports: [
    CommonModule,
    YxqkRoutingModule,
    NgZorroAntdModule,
    FormsModule
  ]
})
export class YxqkModule { }
