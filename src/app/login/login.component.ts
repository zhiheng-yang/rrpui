import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {HttpClient} from '@angular/common/http';
import {LoginService} from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})

export class LoginComponent implements OnInit {
  validateForm: FormGroup;

  constructor(private fb: FormBuilder,
              private router: Router,
              private message: NzMessageService,
              private http: HttpClient,
              private loginService: LoginService,
              private modalService: NzModalService) {}

  login() {
    this.loginService.login(this.validateForm.value.username, this.validateForm.value.password).then((res: any) => {
      if (res.state === 200) {
        const userinfo = localStorage.getItem('userinfo');
        const au = localStorage.getItem('Authority');
        if (userinfo && au && JSON.parse(userinfo).id === res.data.id) {
          sessionStorage.setItem('userinfo', JSON.stringify(res.data));
          this.message.success( '登陆成功,请稍后...');
          setTimeout(() => {
              this.router.navigate(['/index/welcome']);
              this.loginService.findremind(res.data.company.id).then((obj: any) => {
                if(obj.state === 200 && obj.data){
                  this.modalService.confirm({
                    nzTitle: null,
                    nzContent: obj.data.msg,
                    nzOkText: '确定',
                  });
                }
              });
            });
        } else {
          this.loginService.findAuthority(res.data.role.id).then((d: any) => {
            localStorage.setItem('Authority', JSON.stringify(d.data));
          });
          this.message.success( '登陆成功,请稍后...');
          localStorage.setItem('userinfo', JSON.stringify(res.data));
          sessionStorage.setItem('userinfo', JSON.stringify(res.data));
          setTimeout(() => {
            this.router.navigate(['/index/welcome']);
            this.loginService.findremind(res.data.company.id).then((obj: any) => {
              if(obj.state === 200 && obj.data){
                this.modalService.confirm({
                  nzTitle: null,
                  nzContent: obj.data.msg,
                  nzOkText: '确定',
                });
              }
            });
          });
        }
      } else {
        this.message.warning('用户名或密码错误');
      }
    }, err => {
      this.message.warning('登陆失败');
    });
  }


  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }
}
