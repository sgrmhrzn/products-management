import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { IGlobalState } from './core/state/app.reducer';
import { Store } from '@ngrx/store';
import { selectActiveUser } from './core/state/app.selectors';
import { map } from 'rxjs';
import { environment } from '../environments/environment';
import { loginRequestSuccess } from './core/state/app.action';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  //   //check active user session, if no session redirects to login page
  //   activeUser$ = this.store.select(selectActiveUser).pipe(map(a => {
  //     // this.loginUser.set(a);
  //     a?.id ? null : this.router.navigateByUrl('login');
  //   }))

  // isCollapsed = false;

  constructor(private router: Router, private store: Store<IGlobalState>) {

  }
  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem(environment.ACTIVE_USER_KEY) || '');
    if (user) {
      this.store.dispatch(loginRequestSuccess({ user }));
      this.router.navigateByUrl('products');
    }
  }
}
