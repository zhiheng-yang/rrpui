import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import { DemoComponent } from './demo/demo.component';
import {HlwRoutingModule} from './hlw-routing.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { ChinamapComponent } from './chinamap/chinamap.component';


@NgModule({
  declarations: [
    /**************挂自己功能组件 */
    DemoComponent,
    ChinamapComponent
    /**************挂自己功能组件 */
  ],
  imports: [
    NgxEchartsModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    HlwRoutingModule
  ]
})
export class HlwModule { }
