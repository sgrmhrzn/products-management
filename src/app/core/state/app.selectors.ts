import { createSelector } from '@ngrx/store';
import { IGlobalState } from './app.reducer';
import _ from 'lodash';
import { IUserModel } from '../models/user.model';

//selector for products
export const selectProducts = (state: IGlobalState) => state.global.products;

export const selectQueryParams = (state: IGlobalState) => state.global.queryParams;

export const selectFavorite = (state: IGlobalState) => state.global.favorites;

export const selectFavoriteProducts = (state: IGlobalState) => state.global.favorites;

//selector for users
export const selectUsers = (state: IGlobalState) => state.global.users;

//selector for user by id
export const selectProductById = (id: string) =>
    createSelector(selectProducts, products => {
        return products.find(p => p.id === id);
    });

//selector for user by id
export const selectUserById = (id: string) =>
    createSelector(selectUsers, users => {
        return users.find(r => r.id === id) || {} as IUserModel;
    });

//selector for active user
export const selectActiveUser = (state: IGlobalState) => state.global.activeUser;
