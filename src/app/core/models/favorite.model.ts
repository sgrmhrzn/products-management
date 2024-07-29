export interface IFavoriteModel {
    id: string;
    userId: string;
    products: IFavoriteProductModel[];
}

export interface IFavoriteProductModel {
    id: string;
    label: string;
    price: string;
    isFavorite?: boolean;
}