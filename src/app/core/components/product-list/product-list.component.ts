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
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { debounceTime, delay, firstValueFrom, fromEvent, Observable, of } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { IGlobalState, initialState } from '../../state/app.reducer';
import _ from 'lodash';
import { updateFavoriteFlag, removeFavoriterRequest, addFavoriteRequest, fetchFavoritesRequest, fetchProductsRequest, deleteProductRequest } from '../../state/app.action';
import { IFavoriteModel, IFavoriteProductModel } from '../../models/favorite.model';
import { selectActiveUser, selectFavorite, selectProducts, selectQueryParams } from '../../state/app.selectors';
import { IProductModel } from '../../models/product.model';
import { IQueryParmsModel } from '../../models/query-params.model';
import { IProductListConfigModel } from '../../models/product-list-config.model';
import { RoleEnum } from '../../../enum/role.enum';
import { PageTypeEnum } from '../../../enum/page-type.enum';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterModule, NzCardModule, NzAvatarModule,
    NzIconModule, NzFlexModule, CommonModule,
    NzEmptyModule, FormsModule, NzInputModule,
    NzFormModule, ReactiveFormsModule, NzToolTipModule, NzSpinModule, NzPopconfirmModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  @ViewChild('productsContainer') productsContainer!: ElementRef;
  @Input() config!: IProductListConfigModel;
  favorites$: Observable<IFavoriteProductModel[]> = this.store.select(selectFavorite);
  // products$: Observable<IProductModel[]> = this.store.select(selectProducts);
  activeUser$ = this.store.select(selectActiveUser);
  queryParams$: Observable<IQueryParmsModel> = this.store.select(selectQueryParams);

  searchForm: FormGroup<{
    keyword: FormControl<string>;
  }> = this.fb.group({
    keyword: ['', []],
  });
  roleEnum = RoleEnum;
  pageEnum = PageTypeEnum;
  hideLoader = true;
  constructor(private router: Router, private store: Store<IGlobalState>, private fb: NonNullableFormBuilder, private commonService: CommonService) {

  }

  add() {
    this.router.navigate(['products', { outlets: { drawer: ['add'] } }]);
  }

  edit(id: string) {
    console.log(id);
    this.router.navigate(['products', { outlets: { drawer: ['edit', id] } }]);
  }

  deleteProduct(product: IProductModel | IFavoriteProductModel) {
    this.store.dispatch(deleteProductRequest({ product: product as IProductModel }))
  }


  async setFavorite(product: IProductModel | IFavoriteProductModel) {
    const favorites = await firstValueFrom(this.favorites$);
    const user = await firstValueFrom(this.activeUser$);
    const newFavorites = _.clone(favorites);
    const checkProduct = newFavorites.find(f => f.id === product.id);
    if (checkProduct && this.config.type === this.pageEnum.Favorites) {
      this.store.dispatch(removeFavoriterRequest({ favorite: checkProduct }));
    } else {
      if (!product.isFavorite) {
        const fav = { id: this.commonService.uuidv4(), productId: product.id, label: product.label, price: product.price, userId: user?.id || '' };
        this.store.dispatch(addFavoriteRequest({ favorite: fav }));
      }
    }

  }

  ngAfterViewInit(): void {
    const scroll = fromEvent(this.productsContainer.nativeElement, 'scroll');
    const result = scroll.pipe(debounceTime(500));
    result.subscribe(async x => await this.scroll(x));
  }
  async ngOnInit() {
    const user = await firstValueFrom(this.activeUser$);
    this.config.onLoad({ ...initialState.queryParams, userId: user?.id });
    this.searchForm.get('keyword')?.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(async value => {
      // handle the value after 500ms of inactivity
      this.config.onLoad({ ...initialState.queryParams, userId: user?.id, searchKeyword: value });
    });
  }

  async scroll(event: any) {
    if ((event.target.offsetHeight + event.target.scrollTop) >= event.target.scrollHeight) {
      const params = await firstValueFrom(this.queryParams$);
      if (params.pages > params.page) {
        // this.hideLoader = false;

        // const result = of().pipe(delay(1000));
        // result.subscribe(r => {this.hideLoader = true; console.log('hide')});

        // this.hideLoader = true;
        this.config.onLoad({ ...params, page: params.page + 1, userEvent: 'scroll' });
      }
    }

  }
}
