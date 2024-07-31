import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { NZ_DRAWER_DATA, NzDrawerModule } from 'ng-zorro-antd/drawer';
import { mergeMap, map, firstValueFrom, Observable } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';
import { IGlobalState } from '../../../../core/state/app.reducer';
import { selectUserById } from '../../../../core/state/app.selectors';
import { CommonModule } from '@angular/common';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { DateTimeFormatPipe } from '../../../../core/pipes/date-time-format.pipe';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { ActivatedRoute, Router } from '@angular/router';
import { IUserModel } from '../../../../core/models/user.model';
import { RoleEnum } from '../../../../enum/role.enum';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [NzDescriptionsModule, NzBadgeModule, CommonModule, NzAvatarModule, DateTimeFormatPipe, NzDrawerModule, NzButtonModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
/**
 * user detail component
 */
export class DetailComponent implements OnInit {
  user$!: Observable<IUserModel>;
  roleEnum = RoleEnum;

  constructor(private store: Store<IGlobalState>, private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) {

  }
  async ngOnInit() {
    const res = await firstValueFrom(this.activatedRoute.paramMap);
    const id = res.get('id') || '';
    this.user$ = this.store.select(selectUserById(id));

  }

  close(): void {
    this.router.navigate(['users']);
  }

}
