import { Injectable } from '@angular/core';
import { IProductModel, IQueryProductModel } from '../models/product.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { IQueryParmsModel } from '../models/query-params.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  /**
  *
  * Fetch all products
  *
  * */
  getAll(queryParams:IQueryParmsModel): Observable<HttpResponse<IProductModel[]>> {
    return this.http.get<IProductModel[]>(`${environment.SERVER_URL}products?label_like=${queryParams.searchKeyword}&_page=${queryParams.page}`, { observe: 'response' });
  }

  /**
   * Add new product
   * @param product IProductModel - product information
   * @returns Observable<IProductModel>
   */
  add(product: IProductModel): Observable<IProductModel> {
    return this.http.post<IProductModel>(`${environment.SERVER_URL}products`, product);
  }

  /**
   * Update product
   * @param product IProductModel - product information
   * @returns Observable<IProductModel>
   */
  update(product: IProductModel): Observable<IProductModel> {
    return this.http.patch<IProductModel>(`${environment.SERVER_URL}products/${product.id}`, product);
  }

  /**
   * Delete product
   * @param id string - product id
   * @returns Observable<IProductModel>
   */
  delete(id: string): Observable<IProductModel> {
    return this.http.delete<IProductModel>(`${environment.SERVER_URL}products/${id}`);
  }

}
