import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ScsjRoutingModule} from './scsj-routing.module';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { MtgsComponent } from './mtgs/mtgs.component';
import { MtlylComponent } from './mtlyl/mtlyl.component';
import { HntflComponent } from './hntfl/hntfl.component';
import { DhbslComponent } from './dhbsl/dhbsl.component';
import { DhbmjComponent } from './dhbmj/dhbmj.component';
import { CphglComponent } from './cphgl/cphgl.component';
import {QuerylistModule} from "../../helpcenter/querylist/querylist.module";

@NgModule({
  declarations: [
  MtgsComponent,
  MtlylComponent,
  HntflComponent,
  DhbslComponent,
  DhbmjComponent,
  CphglComponent],
    imports: [
        CommonModule,
        ScsjRoutingModule,
        NgZorroAntdModule,
        FormsModule,
        QuerylistModule
    ]
})
export class ScsjModule { }
