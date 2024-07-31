import { Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { DetailComponent } from './components/detail/detail.component';
import { ModalComponent } from './modal/modal.component';

export const USERS_ROUTES: Routes = [
  {
    path: '', component: UsersComponent,
    children: [
      { path: 'view/:id', component: DetailComponent, outlet: 'drawer' },
      { path: 'add', component: ModalComponent, outlet: 'drawer' }
    ]
  }
];
