import { createAction, props } from '@ngrx/store';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { IActiveUserModel, ILogInUserModel, IUserAssignModel, IUserModel } from '../models/user.model';
import { IProductModel } from '../models/product.model';
import { IQueryParmsModel } from '../models/query-params.model';
import { IFavoriteModel, IFavoriteProductModel } from '../models/favorite.model';

export const loginRequest = createAction('[Login] Login request', props<{ user: ILogInUserModel }>());
export const loginRequestSuccess = createAction('[Login] Login request success', props<{ user: IActiveUserModel }>());

export const fetchUsersRequest = createAction('[Users] request users');
export const fetchUsersRequestSuccess = createAction('[Users] request users success', props<{ users: IUserModel[] }>());
export const addUser = createAction('[User] Add User', props<{ user: IUserModel }>());
export const addUserRequest = createAction('[User] Add User request', props<{ user: IUserModel }>());
export const updateUserRequest = createAction('[User] Update User request', props<{ user: IUserModel }>());
export const updateUser = createAction('[User] Update User', props<{ user: IUserModel }>());
export const deleteUserRequest = createAction('[User] request User delete', props<{ user: IUserModel }>());
export const deleteUser = createAction('[User] Delete User', props<{ id: string }>());

export const addProduct = createAction('[Product] Add product', props<{ product: IProductModel }>());
export const addProductRequest = createAction('[Product] Add product request', props<{ product: IProductModel }>());
export const updateProductRequest = createAction('[Product] Update product request', props<{ product: IProductModel }>());
export const updateProduct = createAction('[Product] Update product', props<{ product: IProductModel }>());
export const deleteProduct = createAction('[Product] Delete product', props<{ id: string }>());
export const fetchProductsRequest = createAction('[Product] request products', props<{ params: IQueryParmsModel }>());
export const fetchProductsRequestSuccess = createAction('[Product] request products success', props<{ products: IProductModel[], queryParams: IQueryParmsModel }>());
export const failedRequest = createAction('[Product] request products failed');
export const deleteProductRequest = createAction('[Product] delete product request', props<{ product: IProductModel }>());
export const updateFavoriteFlag = createAction('[Product] request product favorite flag', props<{ id: string, action: 'add' | 'remove' }>());

export const fetchFavoritesRequest = createAction('[Favorite] request Favorites', props<{ params: IQueryParmsModel }>());
export const fetchFavoriteSuccess = createAction('[Favorite] request Favorite success', props<{ favorites: IFavoriteModel, params: IQueryParmsModel }>());
export const addFavorite = createAction('[Favorite] Add Favorite', props<{ favorite: IFavoriteModel }>());
export const addFavoriteRequest = createAction('[Favorite] Add Favorite request', props<{ favorite: IFavoriteModel }>());
export const updateFavoriterRequest = createAction('[User] Update Favorite request', props<{ favorite: IFavoriteModel }>());
export const updateFavorite = createAction('[Favorite] Update Favorite', props<{ favorite: IFavoriteModel }>());

