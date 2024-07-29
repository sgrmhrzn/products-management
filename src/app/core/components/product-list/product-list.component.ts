import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { debounceTime, firstValueFrom, fromEvent, Observable } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { IGlobalState, initialState } from '../../state/app.reducer';
import _ from 'lodash';
import { updateFavoriteFlag, updateFavoriterRequest, addFavoriteRequest, fetchFavoritesRequest, fetchProductsRequest } from '../../state/app.action';
import { IFavoriteModel, IFavoriteProductModel } from '../../models/favorite.model';
import { selectActiveUser, selectFavorite, selectProducts, selectQueryParams } from '../../state/app.selectors';
import { IProductModel } from '../../models/product.model';
import { IQueryParmsModel } from '../../models/query-params.model';
import { IProductListConfigModel } from '../../models/product-list-config.model';
import { RoleEnum } from '../../../enum/role.enum';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterModule, NzCardModule, NzAvatarModule,
    NzIconModule, NzFlexModule, CommonModule,
    NzEmptyModule, FormsModule, NzInputModule,
    NzFormModule, ReactiveFormsModule, NzToolTipModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  @ViewChild('productsContainer') productsContainer!: ElementRef;
  @Input() config!: IProductListConfigModel;
  favorites$: Observable<IFavoriteModel> = this.store.select(selectFavorite);
  // products$: Observable<IProductModel[]> = this.store.select(selectProducts);
  activeUser$ = this.store.select(selectActiveUser);
  queryParams$: Observable<IQueryParmsModel> = this.store.select(selectQueryParams);

  userId: string = "4e1ea1d3-e385-47ec-9344-0995a6804438";

  searchForm: FormGroup<{
    keyword: FormControl<string>;
  }> = this.fb.group({
    keyword: ['', []],
  });
  roleEnum = RoleEnum;
  constructor(private router: Router, private store: Store<IGlobalState>, private fb: NonNullableFormBuilder, private commonService: CommonService) {

  }

  add() {
    this.router.navigate(['products', { outlets: { drawer: ['add'] } }]);
  }

  edit(id: string) {
    console.log(id);
    this.router.navigate(['products', { outlets: { drawer: ['edit', id] } }]);
  }


  async setFavorite(product: IProductModel | IFavoriteProductModel) {
    const favorites = await firstValueFrom(this.favorites$);
    const newFavorites = _.clone(favorites.products);
    const checkProduct = newFavorites.find(f => f.id === product.id);
    if (checkProduct) {
      newFavorites.splice(favorites.products.indexOf(product), 1);
      this.store.dispatch(updateFavoriteFlag({ id: product.id, action: 'remove' }));
    } else {
      newFavorites.push({ id: product.id, label: product.label, price: product.price });
      this.store.dispatch(updateFavoriteFlag({ id: product.id, action: 'add' }));
    }
    if (favorites.id) {
      this.store.dispatch(updateFavoriterRequest({ favorite: { ...favorites, products: newFavorites } }));
    } else {
      this.store.dispatch(addFavoriteRequest({ favorite: { id: this.commonService.uuidv4(), userId: this.userId, products: newFavorites } }));
    }
  }

  ngAfterViewInit(): void {
    const scroll = fromEvent(this.productsContainer.nativeElement, 'scroll');
    const result = scroll.pipe(debounceTime(500));
    result.subscribe(async x => await this.scroll(x));
  }
  async ngOnInit() {
    // this.store.dispatch(fetchProductsRequest({ params: initialState.queryParams }));
    const user = await firstValueFrom(this.activeUser$);
    // this.userId = user?.id || '';
    // this.store.dispatch(fetchFavoritesRequest({ params: initialState.queryParams }))
    this.searchForm.get('keyword')?.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(async value => {
      console.log(value);
      // const params = await firstValueFrom(this.queryParams$);
      this.store.dispatch(this.config.onSearchSubmit(value));
      // handle the value after 300ms of inactivity
    });

  }

  async scroll(event: any) {
    console.log(event.target.clientHeight + event.target.scrollTop, event.target.offsetHeight);
    if ((event.target.clientHeight + event.target.scrollTop) + 100 >= event.target.offsetHeight) {
      // const pageNumer = this.params.page || 0;
      const params = await firstValueFrom(this.queryParams$);
      if (params.pages > params.page) {
        this.store.dispatch(fetchProductsRequest({ params: { ...params, page: params.page + 1, userEvent: 'scroll' } }));
      }
    }

  }
}
