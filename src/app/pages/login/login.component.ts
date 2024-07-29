import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { IGlobalState } from '../../core/state/app.reducer';
import { loginRequest } from '../../core/state/app.action';
import { Router } from '@angular/router';
import { selectActiveUser } from '../../core/state/app.selectors';
import { firstValueFrom, map } from 'rxjs';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NzFormModule, NzInputModule, ReactiveFormsModule, NzButtonModule, NzFlexModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
/**
 * Login page
 */
export class LoginComponent implements OnInit {

  validateForm: FormGroup<{
    username: FormControl<string>;
    password: FormControl<string>;
  }> = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  constructor(private fb: NonNullableFormBuilder, private store: Store<IGlobalState>, private router: Router) { }
  async ngOnInit() {
    if (localStorage.getItem(environment.ACTIVE_USER_KEY)) {
      this.router.navigateByUrl('products')
    }
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.store.dispatch(loginRequest({ user: this.validateForm.getRawValue() }))
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

}
