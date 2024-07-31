import { Injectable } from "@angular/core";
import { switchMap, of, map, catchError, concatMap, mergeMap, throwError, zip, Observable, forkJoin } from "rxjs";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as actions from "./app.action";
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from "../services/user.service";
import { IUserModel } from "../models/user.model";
import { environment } from "../../../environments/environment";
import { Router } from "@angular/router";
import { CommonService } from "../services/common.service";
import _ from "lodash";
import { ProductService } from "../services/product.service";
import { IQueryParamsModel } from "../models/query-params.model";
import { IProductModel } from "../models/product.model";
import { IFavoriteProductModel } from "../models/favorite.model";
import { FavoriteService } from "../services/favorite.service";

@Injectable()
/**
 *
 * App effect
 *
 * */
export class AppEffects {

    /**
     * fetch favorite products
     */
    fetchFavorite = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.fetchFavoritesRequest),
            switchMap(({ params }) =>
                this.favoriteService.getFavorite(params).pipe(
                    map((response) => {
                        const link = this.commonService.parse_link_header(response.headers.get('link') || '');

                        const queryparams: IQueryParamsModel = {
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

    /**
     * set new favorite product
     */
    setFavorite = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.addFavoriteRequest),
            switchMap(({ favorite }) =>
                this.favoriteService.setFavorite(favorite).pipe(
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

    /**
     * remove existing favorite product
     */
    removeFavorite = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.removeFavoriterRequest),
            switchMap(({ favorite }) =>
                this.favoriteService.delete(favorite).pipe(
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
                    mergeMap((response) => {
                        const link = this.commonService.parse_link_header(response.headers.get('link') || '');
                        const queryParams: IQueryParamsModel = {
                            ...params,
                            pages: link ? link["last"].split('_page=')[1] : 1,
                        }
                        const list = new Array<Observable<any>>();
                        response.body?.forEach(x => {
                            list.push(this.favoriteService.isFavorite(params.userId || '', x.id).pipe(map(p => p[0])));
                        })
                        if (list?.length) {
                            return forkJoin(list).pipe(map(res => {
                                response.body?.map(x => x.isFavorite = res.find(y => y?.productId === x.id) ? true : false);
                                return actions.fetchProductsRequestSuccess({ products: response.body as IProductModel[], queryParams });
                            }));
                        } else {
                            return of({}).pipe(map(() => actions.fetchProductsRequestSuccess({ products: response.body as IProductModel[], queryParams })))
                        }
                    })
                )
            )
        )
    );

    /**
     * Add new product
     */
    addProductRequest = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.addProductRequest),
            switchMap(({ product }) =>
                this.productService.getProductByLabel(product.label).pipe(concatMap(r => {
                    const msg = `${product.label} product added`;
                    if (r.length) {
                        this.messageService.error(`${product.label} already exists`);
                        return of();
                    } else {
                        return this.productService.add(product).pipe(map((response) => {

                            this.messageService.success(msg);
                            this.router.navigate(['products']);
                            return actions.addProduct({ product });

                        })
                        )
                    }
                }))
            )
        )
    );

    /**
     * Update product
     */
    updateProductRequest = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.updateProductRequest),
            switchMap(({ product }) =>
                this.productService.getProductByLabel(product.label).pipe(concatMap(r => {
                    if (r.length && r[0].id !== product.id) {
                        this.messageService.error(`${product.label} already exists`);
                        return of();
                    } else {
                        return this.productService.update(product).pipe(map((response) => {
                            const msg = `${response.label} product updated`;
                            this.messageService.success(msg);
                            this.router.navigate(['products']);
                            return actions.updateProduct({ product });
                        }))
                    }
                })
                )
            )
        )
    );

    /**
     * Delete product
     */
    deleteProductRequest = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.deleteProductRequest),
            switchMap(({ product }) =>
                this.productService.delete(product.id).pipe(map((response) => {
                    const msg = `${product.label} product deleted`;
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
     * Add new user
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
     * Update user
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
     * Delete user
     */
    deleteUserRequest = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.deleteUserRequest),
            switchMap(({ user }) =>
                this.userService.deleteUser(user.id).pipe(map((response) => {
                    const msg = `${user.name} user deleted`;
                    this.messageService.success(msg);
                    return actions.deleteUser({ id: user.id });
                })
                )
            )
        )
    );
    //#endregion

    /**
     * Request login, check user credentials
     */
    loginRequest = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.loginRequest),
            switchMap(({ user }) =>
                this.userService.checkUser(user).pipe(map((userData: Array<IUserModel>) => {
                    if (userData.length) {

                        this.messageService.success(`Log in successful`);
                        const user = { id: userData[0].id, name: userData[0].name, role: userData[0].role, username: userData[0].username };
                        localStorage.setItem(environment.ACTIVE_USER_KEY, JSON.stringify(user));
                        this.router.navigateByUrl('products');
                        return actions.loginRequestSuccess({ user });

                    } else {
                        this.messageService.error('Username or password incorrect.');
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
     * @param favoriteService FavoriteService
     */
    constructor(private actions$: Actions,
        private messageService: NzMessageService,
        private userService: UserService,
        private commonService: CommonService,
        private productService: ProductService,
        private router: Router,
        private favoriteService: FavoriteService
    ) { }
}