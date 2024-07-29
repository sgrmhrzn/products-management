import { createSelector } from '@ngrx/store';
import { IGlobalState } from './app.reducer';
import _ from 'lodash';
import { IUserModel } from '../models/user.model';

//selector for products
export const selectProducts = (state: IGlobalState) => state.global.products;

export const selectQueryParams = (state: IGlobalState) => state.global.queryParams;

export const selectFavorite = (state: IGlobalState) => state.global.favorites;

export const selectFavoriteProducts = (state: IGlobalState) => state.global.favorites.products;

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

//selector for assigned users
export const selectAssignedUsers = (userIds: string[]) =>
    createSelector(selectUsers, users => {
        const filtered = new Array<IUserModel>();
        userIds.forEach(id => {
            const u = users.find(user => user.id === id);
            if (u) {
                filtered.push({ id: u?.id, name: u?.name, username: u?.username, password: u?.password } as IUserModel)
            }
        });
        return filtered;
    });

//selector for product by title
export const selectRoleByTitle = (title: string) =>
    createSelector(selectProducts, roles => {
        return roles.find(r => r.label.toLocaleLowerCase()?.trim() === title.toLocaleLowerCase()?.trim());
    });

//selector for active user
export const selectActiveUser = (state: IGlobalState) => state.global.activeUser;
