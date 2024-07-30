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

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [NzDescriptionsModule, NzBadgeModule, CommonModule, NzAvatarModule, DateTimeFormatPipe, NzDrawerModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
  // readonly nzModalData = inject(NZ_DRAWER_DATA);

  user$!: Observable<IUserModel>;
  roleEnum = RoleEnum;

  constructor(private store: Store<IGlobalState>, private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) {

  }
  async ngOnInit() {
    const res = await firstValueFrom(this.activatedRoute.paramMap);
    const id = res.get('id') || '';
    // const product = await firstValueFrom(this.store.select(selectProductById(id)));
    // this.form.patchValue(product as IProductModel);
    this.user$ = this.store.select(selectUserById(id));
    // this.user.subscribe(res => console.log(res));
    // this.user = user;
    // console.log(res.get('id'), this.user);

  }

  close(): void {
    // this.visible = false;
    this.router.navigate(['users']);
  }

}
