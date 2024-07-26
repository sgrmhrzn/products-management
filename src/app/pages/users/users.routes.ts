import { Routes } from '@angular/router';
import { UsersComponent } from './users.component';

export const USERS_ROUTES: Routes = [
  {
    path: '', component: UsersComponent,
    // children: [
    //   { path: 'add', component: ProductDrawerComponent, outlet: 'drawer' },
    // ]
  }
];
