import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ZlglRoutingModule} from './zlgl-routing.module';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { Zlgl1Component } from './zlgl1/zlgl1.component';
import { JfglComponent } from './jfgl/jfgl.component';
import {QuerylistModule} from '../../helpcenter/querylist/querylist.module';
import { SpglComponent } from './spgl/spgl.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {CoreModule} from "../../core/core.module";

@NgModule({
  declarations: [Zlgl1Component, JfglComponent, SpglComponent],
    imports: [
        CommonModule,
        ZlglRoutingModule,
        NgZorroAntdModule,
        FormsModule,
        QuerylistModule,
        PdfViewerModule,
        CoreModule
    ]
})
export class ZlglModule { }
