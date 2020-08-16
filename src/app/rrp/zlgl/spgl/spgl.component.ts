import { Component, OnInit } from '@angular/core';
import {SpglService} from "../service/spgl.service";
import { NzMessageService } from 'ng-zorro-antd';
import {Lease, Pay} from "../../../core/entity/entity";

@Component({
  selector: 'app-spgl',
  templateUrl: './spgl.component.html',
  styleUrls: ['./spgl.component.css']
})
export class SpglComponent implements OnInit {

  constructor(private spglService:SpglService,
              private message: NzMessageService

  ) { }
  approvals;
  jsondata ={
    province:'',
    city:"",
    robotid:'',
    companyid:'',
    owncompanyid: JSON.parse(localStorage.getItem('userinfo')).company.id,
    companytypeid: JSON.parse(localStorage.getItem('userinfo')).company.companyType.id,
  }
  pay:Pay;
  approval;
  isVisible = false;
  ngOnInit() {
    this.onquery(this.jsondata);
  }
  onquery(data){
    this.query(data);
  }
  query(data){
    console.log(data);
    if (data ===this.jsondata){
        this.spglService.query(this.jsondata).then((res:any)=>{
          if(res.state===200){
            this.approvals = res.data;
          }
        })
    } else {
      this.jsondata={
        province:'',
        city:'',
        robotid:'',
        companyid: '',
        owncompanyid: JSON.parse(localStorage.getItem('userinfo')).company.id,
        companytypeid: JSON.parse(localStorage.getItem('userinfo')).company.companyType.id,
      }
      if(data !=undefined){
        if (data.province && data.province.name) {
          this.jsondata.province = data.province.name;
        }
        if (data.city && data.city.name) {
          this.jsondata.city = data.city.name;
        }
        if (data.robot){
          this.jsondata.robotid=data.robot.id;
        }
        if (data.company) {
          this.jsondata.companyid = data.company.id;
        }
        this.spglService.query(this.jsondata).then((res:any)=>{
          if(res.state===200){
            this.approvals = res.data;
          }
        })
      }
    }
  }

  //确认
  confirm(data){
    const json ={
      id: data.id,
      request: data.request,
      leaseid: data.lease.id
    }
    this.spglService.confirm(json).then((res:any)=>{
      if (res.state === 200){
        this.onquery(this.jsondata);
        this.message.success('确认成功！')

      }
    })
  }

  //驳回
  reject(data){
    const json ={
      id: data.id,
      request: data.request,
      leaseid: data.lease.id
    }
    this.spglService.reject(json).then((res:any)=>{
      if (res.state === 200){
        this.onquery(this.jsondata);
        this.message.success('已驳回！')

      }
    })
  }
  //详情
  showModa(data): void {
    this.approval = data;
    this.spglService.getPay(data.lease.id).then((res:any)=>{
      if(res.state === 200){
        this.pay = res.data;
        this.isVisible = true;
      }
    })
  }
  handleCancel(){
    this.isVisible = false;
  }
}
