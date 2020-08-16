import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WxwhRoutingModule} from './wxwh-routing.module';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {WarningComponent} from './warning/warning.component';
import {SoftwareUpdateComponent} from './software-update/software-update.component';
import { CssdComponent } from './cssd/cssd.component';
import { FormsModule } from '@angular/forms';
import {QuerylistModule} from "../../helpcenter/querylist/querylist.module";

@NgModule({
  declarations: [SoftwareUpdateComponent, WarningComponent, CssdComponent],
    imports: [
        CommonModule,
        WxwhRoutingModule,
        NgZorroAntdModule,
        FormsModule,
        QuerylistModule
    ]
})
export class WxwhModule { }
