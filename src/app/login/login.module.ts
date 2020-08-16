import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgZorroAntdModule, NZ_I18N, NzIconModule} from 'ng-zorro-antd';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LoginComponent } from './login.component';
import {Routes, RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
const routes: Routes = [
  {path: '', component: LoginComponent, data: {reuse: false, track: false}}
];
@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NzIconModule,
    RouterModule.forChild(routes),
  ],
  providers: [
  ],
})
export class LoginModule { }
