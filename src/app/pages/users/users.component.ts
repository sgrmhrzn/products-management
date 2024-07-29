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
  // permissionEnum = PermissionsEnums;
  // permission = {
  //   add: false,
  //   update: false,
  //   delete: false
  // }
  constructor(private drawerService: NzDrawerService, private store: Store<IGlobalState>, private router: Router) {

  }

  async ngOnInit() {
    this.store.dispatch(fetchUsersRequest());

    // //permission handling
    // const user = await firstValueFrom(this.activeUser$);
    // if (user?.permissions?.includes(PermissionsEnums.StaffsAllPrivilege)) {
    //   this.permission = {
    //     add: true,
    //     update: true,
    //     delete: true
    //   }
    // } else {
    //   if (user?.permissions?.includes(PermissionsEnums.StaffsAllActionPrivilege)) {
    //     this.permission = {
    //       add: true,
    //       update: true,
    //       delete: true
    //     }
    //   } else {

    //     if (user?.permissions?.includes(PermissionsEnums.StaffsAddPrivilege)) {
    //       this.permission.add = true;
    //     } if (user?.permissions?.includes(PermissionsEnums.StaffsEditPrivilege)) {
    //       this.permission.update = true;
    //     } if (user?.permissions?.includes(PermissionsEnums.StaffsDeletePrivilege)) {
    //       this.permission.delete = true;
    //     }
    //   }

    // }
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

    // const drawerOptions: NzDrawerOptions = {
    //   nzContent: DetailComponent,
    //   nzSize: 'default',
    //   nzTitle: `View Staff - ${user.name}`,
    //   nzData: { ...user },
    // }
    // this.drawerRef = this.drawerService.create(drawerOptions);
  }

  viewDetails(id: string) {
    this.router.navigate(['users', { outlets: { drawer: ['view', id] } }]);
  }

}
