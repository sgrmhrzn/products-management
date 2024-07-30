import { Observable } from "rxjs";
import { IProductModel } from "./product.model";
import { IFavoriteProductModel } from "./favorite.model";
import { Action } from "@ngrx/store";
import { IQueryParmsModel } from "./query-params.model";
import { PageTypeEnum } from "../../enum/page-type.enum";

export interface IProductListConfigModel {
    type: PageTypeEnum;
    showActionBtn: boolean;
    data$: Observable<IProductModel[] | IFavoriteProductModel[]>;
    onLoad: (params: IQueryParmsModel) => void;
}