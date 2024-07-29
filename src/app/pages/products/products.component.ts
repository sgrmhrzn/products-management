import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { IProductModel } from '../../core/models/product.model';
import { IGlobalState, initialState } from '../../core/state/app.reducer';
import { Store } from '@ngrx/store';
import { selectProducts } from '../../core/state/app.selectors';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { fetchProductsRequest } from '../../core/state/app.action';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import _ from 'lodash';
import { ProductListComponent } from "../../core/components/product-list/product-list.component";
import { IProductListConfigModel } from '../../core/models/product-list-config.model';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterModule, NzCardModule, NzAvatarModule,
    NzIconModule, NzFlexModule, CommonModule,
    NzEmptyModule, FormsModule, NzInputModule,
    NzFormModule, ReactiveFormsModule, NzToolTipModule, ProductListComponent],

  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  products$: Observable<IProductModel[]> = this.store.select(selectProducts);
  config: IProductListConfigModel = {
    data$: this.products$,
    title: 'Products',
    showActionBtn: true,
    onSearchSubmit: (searchKeyword: string) => fetchProductsRequest({ params: { ...initialState.queryParams, searchKeyword } })

  }
  constructor(private store: Store<IGlobalState>) {

  }
  ngOnInit(): void {
    this.store.dispatch(fetchProductsRequest({ params: initialState.queryParams }));
  }

}
