import { Observable } from "rxjs";
import { IProductModel } from "./product.model";
import { IFavoriteProductModel } from "./favorite.model";
import { Action } from "@ngrx/store";
import { IQueryParmsModel } from "./query-params.model";

export interface IProductListConfigModel {
    title: string;
    showActionBtn: boolean;
    data$: Observable<IProductModel[] | IFavoriteProductModel[]>;
    onLoad: (params: IQueryParmsModel) => void;
}