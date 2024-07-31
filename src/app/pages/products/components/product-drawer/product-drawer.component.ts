import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NonNullableFormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Store } from '@ngrx/store';
import { IGlobalState } from '../../../../core/state/app.reducer';
import { addProductRequest, updateProductRequest } from '../../../../core/state/app.action';
import { CommonService } from '../../../../core/services/common.service';
import { selectProductById } from '../../../../core/state/app.selectors';
import { firstValueFrom, Subscription } from 'rxjs';
import { IProductModel } from '../../../../core/models/product.model';
@Component({
  selector: 'app-product-drawer',
  standalone: true,
  imports: [NzDrawerModule, ReactiveFormsModule, FormsModule, NzFormModule, NzInputModule, NzButtonModule],
  templateUrl: './product-drawer.component.html',
  styleUrl: './product-drawer.component.scss'
})
/**
 * add, edit product drawer component
 */
export class ProductDrawerComponent implements OnInit {
  visible = true;
  form: FormGroup<{
    id: FormControl<string>;
    label: FormControl<string>;
    price: FormControl<string>;
    createdDate: FormControl<Date>;
  }> = this.fb.group({
    id: ['', []],
    createdDate: [new Date(), []],
    label: ['', [Validators.required, Validators.maxLength(25)]],
    price: ['', [Validators.required, Validators.maxLength(6), Validators.max(999999), Validators.min(1)]],
  });

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private fb: NonNullableFormBuilder, private store: Store<IGlobalState>, private commonService: CommonService) {

  }

  async ngOnInit() {
    await this.checkIfProductExistAndPatchToForm();
  }

  /**
   * if id exist check product and patch to form
   */
  async checkIfProductExistAndPatchToForm() {
    const res = await firstValueFrom(this.activatedRoute.paramMap);
    const id = res.get('id') || '';
    const product = await firstValueFrom(this.store.select(selectProductById(id)));
    this.form.patchValue(product as IProductModel);
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
    this.router.navigate(['products']);
  }

  /**
   * save product form information
   */
  save() {
    if (this.form.valid) {

      if (this.form.value.id) {
        this.store.dispatch(updateProductRequest({ product: { ...this.form.getRawValue() } }))
      } else {
        this.store.dispatch(addProductRequest({ product: { ...this.form.getRawValue(), createdDate: new Date(), id: this.commonService.uuidv4() } }))
      }
    } else {
      this.form.controls.label.markAsDirty();
      this.form.controls.price.markAsDirty();
    }
  }
}
