import { Component } from '@angular/core';
import { IGlobalState } from '../../core/state/app.reducer';
import { Store } from '@ngrx/store';
import { selectActiveUser, selectUsers } from '../../core/state/app.selectors';
import { Observable } from 'rxjs';
import { IUserModel } from '../../core/models/user.model';
import { NzDrawerModule, NzDrawerOptions, NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { deleteUserRequest, fetchUsersRequest } from '../../core/state/app.action';
import { DetailComponent } from './components/detail/detail.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { CommonModule } from '@angular/common';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { Router, RouterModule } from '@angular/router';
import { RoleEnum } from '../../enum/role.enum';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [NzTableModule, NzDividerModule, NzToolTipModule,
    NzButtonModule, NzIconModule, CommonModule, NzFlexModule, NzDrawerModule, NzPopconfirmModule, RouterModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  drawerRef: NzDrawerRef | undefined;

  //fetch all available users
  users$: Observable<IUserModel[]> = this.store.select(selectUsers);
  activeUser$ = this.store.select(selectActiveUser);
  roleEnum = RoleEnum;
  constructor(private drawerService: NzDrawerService, private store: Store<IGlobalState>, private router: Router) {

  }

  async ngOnInit() {
    this.store.dispatch(fetchUsersRequest());
  }


  /**
   * Function to delete user
   * @param role IUserModel - pass existing user data
   */
  confirmDelete(user: IUserModel) {
    this.store.dispatch(deleteUserRequest({ user }));
  }

  /**
 * Function to open side drawer for view  user details
 * @param user IUserModel - existing role data
 */
  addUser() {
    this.router.navigate(['users', { outlets: { drawer: ['add'] } }]);
  }

  viewDetails(id: string) {
    this.router.navigate(['users', { outlets: { drawer: ['view', id] } }]);
  }

}
