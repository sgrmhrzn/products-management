import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IFavoriteProductModel, IFavoriteModel } from '../models/favorite.model';
import { IQueryParamsModel } from '../models/query-params.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(private http: HttpClient) { }

  /**
  * set users favorite product
  * @param favorite 
  * @returns 
  */
  setFavorite(favorite: IFavoriteProductModel) {
    return this.http.post<IFavoriteModel>(`${environment.SERVER_URL}favorites`, favorite);
  }

  /**
   * delete favorite product
   * @param favorite 
   * @returns 
   */
  delete(favorite: IFavoriteProductModel) {
    return this.http.delete<IFavoriteModel>(`${environment.SERVER_URL}favorites/${favorite.id}`);
  }

  /**
   * fetch favorite products
   * @param queryParams 
   * @returns 
   */
  getFavorite(queryParams: IQueryParamsModel): Observable<HttpResponse<IFavoriteProductModel[]>> {
    return this.http.get<IFavoriteProductModel[]>(`${environment.SERVER_URL}favorites?userId=${queryParams.userId}&label_like=${queryParams.searchKeyword}&_page=${queryParams.page}`, { observe: 'response' });
  }

  /**
   * get favorite product by userid and productId
   */
  isFavorite(userId: string, productId: string) {
    return this.http.get<IFavoriteProductModel[]>(`${environment.SERVER_URL}favorites?userId=${userId}&productId=${productId}`);
  }
}
