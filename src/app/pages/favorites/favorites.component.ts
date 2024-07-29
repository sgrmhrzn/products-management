import { Component, OnInit } from '@angular/core';
import { ProductListComponent } from "../../core/components/product-list/product-list.component";
import { firstValueFrom, Observable } from 'rxjs';
import { IFavoriteModel, IFavoriteProductModel } from '../../core/models/favorite.model';
import { selectActiveUser, selectFavorite, selectFavoriteProducts } from '../../core/state/app.selectors';
import { IGlobalState, initialState } from '../../core/state/app.reducer';
import { Store } from '@ngrx/store';
import { fetchFavoritesRequest } from '../../core/state/app.action';
import { IProductListConfigModel } from '../../core/models/product-list-config.model';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [ProductListComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoriteComponent implements OnInit {
  favorites$: Observable<IFavoriteProductModel[]> = this.store.select(selectFavoriteProducts);
  activeUser$ = this.store.select(selectActiveUser);
  config: IProductListConfigModel = {
    data$: this.favorites$,
    title: 'Favorites',
    showActionBtn: false,
    onSearchSubmit: (searchKeyword: string) => fetchFavoritesRequest({ params: { ...initialState.queryParams, searchKeyword } })
  }
  constructor(private store: Store<IGlobalState>) {

  }
  async ngOnInit() {
    const user = await firstValueFrom(this.activeUser$);
    this.store.dispatch(fetchFavoritesRequest({ params: initialState.queryParams }));
  }
}
