import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ScglRoutingModule} from './scgl-routing.module';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import { MtglComponent } from './mtgl/mtgl.component';
import { MtcsComponent } from './mtcs/mtcs.component';
import { SccsComponent } from './sccs/sccs.component';
import {QuerylistModule} from "../../helpcenter/querylist/querylist.module";



@NgModule({
  declarations: [
    /**************定义自己功能组件 */
    MtglComponent,
    MtcsComponent,
    SccsComponent
    /**************定义自己功能组件 */
  ],
    imports: [
        CommonModule,
        ScglRoutingModule,
        FormsModule,
        NgZorroAntdModule,
        QuerylistModule,
    ]
})
export class ScglModule { }
