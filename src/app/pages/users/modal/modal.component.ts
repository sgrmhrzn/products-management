import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Store } from '@ngrx/store';
import { Observable, firstValueFrom } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from '../../../core/services/common.service';
import { updateUserRequest, addUserRequest } from '../../../core/state/app.action';
import { IGlobalState } from '../../../core/state/app.reducer';
import { selectUserById } from '../../../core/state/app.selectors';
import { ActivatedRoute, Router } from '@angular/router';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [NzModalModule, NzFlexModule, NzButtonModule, CommonModule, FormsModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzDrawerModule, NzSelectModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
/**
 * Modal component to add & edit role
 */
export class ModalComponent implements OnInit {
  // readonly #modal = inject(NzModalRef);
  // readonly nzModalData: IRoleModel = inject(NZ_MODAL_DATA);
  id!: string;
  form: FormGroup<{
    id: FormControl<string>;
    name: FormControl<string>;
    role: FormControl<number>;
  }> = this.fb.group({
    id: ['', []],
    name: ['', [Validators.required, Validators.maxLength(25)]],
    role: [-1, [Validators.required, Validators.min(0)]],
  });

  isEdit = false;
  current = 0;
  // checkRoleTitle$!: Observable<IRoleModel | undefined>;

  constructor(private fb: NonNullableFormBuilder,
    private store: Store<IGlobalState>,
    private messageService: NzMessageService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {

  }

  async ngOnInit() {
    const res = await firstValueFrom(this.activatedRoute.paramMap);
    const id = res.get('id') || '';
    // const product = await firstValueFrom(this.store.select(selectProductById(id)));
    // this.form.patchValue(product as IProductModel);
    const user = await firstValueFrom(this.store.select(selectUserById(id)));
    if (this.id) {
      this.form.patchValue(user);
    }
    else {
      this.form.get('id')?.setValue(this.commonService.uuidv4());
    }

    // this.form.valueChanges.subscribe(value => {
    //   if (this.form.valid) {
    //     this.#modal.updateConfig({ nzOkDisabled: false });
    //   } else {
    //     this.#modal.updateConfig({ nzOkDisabled: true });
    //   }
    // })
  }

  handleCancel(): void {
    this.router.navigateByUrl('users');
  }

  /**
   * Function to handle save button in the modal footer
   * @param event mouse click event
   */
  handleOk() {
    //check if the role name is already exist or not
    if (this.form.valid) {

      if (this.id) {
        this.store.dispatch(updateUserRequest({ user: { ...this.form.getRawValue() } }))
      } else {
        const newUser = {
          ...this.form.getRawValue(), canDelete: true,
          username: this.form.value.name?.split(' ')[0].toLocaleLowerCase().trim(),
          password: '123456',
          createdDate: new Date()
        }
        this.store.dispatch(addUserRequest({ user: newUser }))
      }
    } else {
      this.form.controls.name.markAsDirty();
      this.form.controls.role.markAsDirty();
    }
  }
}

