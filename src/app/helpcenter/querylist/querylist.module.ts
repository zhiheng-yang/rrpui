import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import {QuerylistComponent} from './querylist.component';



@NgModule({

  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
  ],
  declarations: [QuerylistComponent],
  exports: [
    QuerylistComponent
  ]
})
export class QuerylistModule { }
