import { IQueryParamsModel } from "./query-params.model";

export interface IProductModel {
    id: string;
    label: string;
    price: string;
    createdDate: Date;
    isFavorite?: boolean;
}

export interface IQueryProductModel extends IQueryParamsModel {
    data: IProductModel[];
}