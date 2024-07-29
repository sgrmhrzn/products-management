import { Observable } from "rxjs";
import { IProductModel } from "./product.model";
import { IFavoriteProductModel } from "./favorite.model";
import { Action } from "@ngrx/store";

export interface IProductListConfigModel {
    title: string;
    showActionBtn: boolean;
    data$: Observable<IProductModel[] | IFavoriteProductModel[]>;
    onSearchSubmit: (searchKeyword: string) => Action;
}