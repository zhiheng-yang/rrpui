import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private router: Router
  )  {
    // const token = localStorage.getItem('token');
    const token = sessionStorage.getItem('userinfo');
    if (token != null) {
      this.router.navigate(['/index/welcome']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
