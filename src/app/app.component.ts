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

  constructor(private router: Router, private store: Store<IGlobalState>) {

  }
  ngOnInit(): void {
    const session = localStorage.getItem(environment.ACTIVE_USER_KEY) || '';
    if (session) {

      const user = JSON.parse(session);
      if (user) {
        this.store.dispatch(loginRequestSuccess({ user }));
      }
    }
  }
}
