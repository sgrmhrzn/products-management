import { Injectable } from "@angular/core";
import { switchMap, of, map, catchError, concatMap, mergeMap, throwError, zip, Observable } from "rxjs";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as actions from "./app.action";
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from "../services/user.service";
import { IUserAssignModel, IUserModel } from "../models/user.model";
import { environment } from "../../../environments/environment";
import { Router } from "@angular/router";
import { CommonService } from "../services/common.service";
import _ from "lodash";
import { ProductService } from "../services/product.service";
import { IQueryParmsModel } from "../models/query-params.model";
import { IProductModel } from "../models/product.model";
import { IFavoriteProductModel } from "../models/favorite.model";

@Injectable()
/**
 *
 * App effect
 *
 * */
export class AppEffects {

    fetchFavorite = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.fetchFavoritesRequest),
            switchMap(({ params }) =>
                this.userService.getFavorite(params).pipe(
                    map((response) => {
                        const link = this.commonService.parse_link_header(response.headers.get('link') || '');

                        const queryparams: IQueryParmsModel = {
                            ...params,
                            pages: link ? +link["last"].split('_page=')[1] : 1,
                        }
                        return actions.fetchFavoriteSuccess({ favorites: response.body as IFavoriteProductModel[], params: queryparams });
                    }),
                    catchError(() => of())
                )
            )
        )
    );

    setFavorite = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.addFavoriteRequest),
            switchMap(({ favorite }) =>
                this.userService.setFavorite(favorite).pipe(
                    map((response) => {
                        const msg = `${favorite.label} added to favorite`;

                        this.messageService.success(msg);

                        return actions.addFavorite({ favorite });
                    }),
                    catchError(() => of())
                )
            )
        )
    );


    removeFavorite = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.removeFavoriterRequest),
            switchMap(({ favorite }) =>
                this.userService.delete(favorite).pipe(
                    map((response) => {
                        const msg = `${favorite.label} removed from favorite`;

                        this.messageService.success(msg);
                        return actions.removeFavorite({ favorite });
                    }),
                    catchError(() => of())
                )
            )
        )
    );


    //#region products
    /**
     *
     * Fetch products
     *
     * */
    requestProducts = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.fetchProductsRequest),
            switchMap(({ params }) =>
                this.productService.getAll(params).pipe(
                    map((response) => {
                        const link = this.commonService.parse_link_header(response.headers.get('link') || '');
                        const queryParams: IQueryParmsModel = {
                            ...params,
                            pages: link ? link["last"].split('_page=')[1] : 1,
                        }
                        return actions.fetchProductsRequestSuccess({ products: response.body as IProductModel[], queryParams });
                    }),
                    catchError(() => of())
                )
            )
        )
    );

    /**
     * Add new product and log activity
     */
    addProductRequest = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.addProductRequest),
            switchMap(({ product }) =>
                this.productService.add(product).pipe(map((response) => {
                    const msg = `${response.label} product added`;

                    this.messageService.success(msg);
                    return actions.addProduct({ product });
                })
                )
            )
        )
    );

    /**
     * Update product and log activity
     */
    updateProductRequest = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.updateProductRequest),
            switchMap(({ product }) =>
                this.productService.update(product).pipe(map((response) => {
                    const msg = `${response.label} product updated`;
                    this.messageService.success(msg);
                    return actions.updateProduct({ product });
                })
                )
            )
        )
    );

    /**
     * Delete product and log activity
     */
    deleteProductRequest = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.deleteProductRequest),
            switchMap(({ product }) =>
                this.productService.delete(product.id).pipe(map((response) => {
                    const msg = `${response.label} product deleted`;
                    this.messageService.success(msg);
                    return actions.deleteProduct({ id: product.id });
                })
                )
            )
        )
    );
    //#endregion


    //#region users
    /**
     * Fetch all users
     */
    fetchUsersRequest = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.fetchUsersRequest),
            switchMap(() =>
                this.userService.getAll().pipe(
                    map((response) => {
                        return actions.fetchUsersRequestSuccess({ users: response });
                    }),
                    catchError(() => of())
                )
            )
        )
    );
    /**
     * Add new user and log activity
     */
    addUserRequest = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.addUserRequest),
            switchMap(({ user }) =>
                this.userService.addUser(user).pipe(map((response) => {
                    const msg = `${response.name} user added`;
                    // return this.commonService.addNewActivity({ msg, staff: user, type: ActivityEnum.UserCreate }).pipe(
                    //     map((activityRes) => {
                    this.messageService.success(msg);
                    return actions.addUser({ user });
                    // }),
                    // catchError(() => of())
                    // )
                })
                )
            )
        )
    );

    /**
     * Update user and log activity
     */
    updateUserRequest = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.updateUserRequest),
            switchMap(({ user }) =>
                this.userService.updateUser(user).pipe(map((response) => {
                    const msg = `${response.name} user updated`;
                    this.messageService.success(msg);
                    return actions.updateUser({ user });
                })
                )
            )
        )
    );

    /**
     * Delete user and log activity
     */
    deleteUserRequest = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.deleteUserRequest),
            switchMap(({ user }) =>
                this.userService.deleteUser(user.id).pipe(map((response) => {
                    const msg = `${response.name} user deleted`;
                    this.messageService.success(msg);
                    return actions.deleteUser({ id: user.id });
                })
                )
            )
        )
    );
    //#endregion

    /**
     * Request login, check user credentials, fetch assigned product and permissions of logged in user  
     */
    loginRequest = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.loginRequest),
            switchMap(({ user }) =>
                this.userService.checkUser(user).pipe(map((userData: Array<IUserModel>) => {
                    if (userData.length) {
                        // return this.userService.getAllAssignedProductsUsers().pipe(map(d => d.filter(f => f.userIds.includes(userData[0].id))), mergeMap((productData: IUserAssignModel[]) => {
                        // if (productData.length) {

                        //     return this.productService.getProductPermissons(productData[0].product.id).pipe(
                        //         map((permissionData) => {
                        this.messageService.success(`Log in successful`);
                        const user = { id: userData[0].id, name: userData[0].name, role: userData[0].role, username: userData[0].username };
                        localStorage.setItem(environment.ACTIVE_USER_KEY, JSON.stringify(user));
                        this.router.navigateByUrl('products');
                        return actions.loginRequestSuccess({ user });
                        //         }),
                        //         catchError((error) => { return throwError(() => new Error(`Error - ${error}`)) })
                        //     )
                        // } else {
                        //     this.messageService.error("Product hasn't been assigned to this user. Please contact administrator.");
                        //     return throwError(() => new Error('Username or password incorrect.'))
                        // }
                        // }),

                        // )
                    } else {
                        this.messageService.error('Username or password incorrect.');
                        // return throwError(() => new Error('Username or password incorrect.'))
                        return actions.loginRequestSuccess({ user });

                    }
                })
                ),
            )
        )
    );


    /**
     * 
     * @param actions$ Actions
     * @param productService ProductService
     * @param messageService NzMessageService
     * @param permissionService PermissionService
     * @param userService UserService
     * @param commonService CommonService
     * @param router Router
     */
    constructor(private actions$: Actions,
        private messageService: NzMessageService,
        private userService: UserService,
        private commonService: CommonService,
        private productService: ProductService,
        private router: Router
    ) { }
}