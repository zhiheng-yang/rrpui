import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DatePipe, registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';
import {IndexModule} from './rrp/index/index.module';
import {RouteReuseStrategy} from '@angular/router';
import {RouteReuse} from './core/routereuse/routeReuse';
import {LoginModule} from './login/login.module';
import { ChartModule } from 'angular-highcharts';
registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, // 需要在IndexModule之前导入
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LoginModule,
    IndexModule, // 需要在AppRoutingModule之后导入
    ChartModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    {provide: RouteReuseStrategy, useClass: RouteReuse},
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
