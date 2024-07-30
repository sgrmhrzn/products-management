import _ from "lodash";
import { addFavorite, addProduct, addUser, deleteProduct, deleteUser, fetchFavoriteSuccess, fetchProductsRequestSuccess, fetchUsersRequestSuccess, loginRequestSuccess, removeFavorite, updateFavoriteFlag, updateProduct, updateUser } from "./app.action";
import { IActiveUserModel, IUserModel } from "../models/user.model";
import { IProductModel } from "../models/product.model";
import { IQueryParmsModel } from "../models/query-params.model";
import { IFavoriteModel, IFavoriteProductModel } from "../models/favorite.model";

/**
 * Global state of store
 */
export interface IGlobalState {
  global: IAppState
}

/**
 * App state of store
 */
export interface IAppState {
  products: IProductModel[];
  favorites: IFavoriteProductModel[];
  queryParams: IQueryParmsModel;
  users: IUserModel[];
  activeUser?: IActiveUserModel;
  error?: string;
}

/**
 * Initial state of store
 */
export const initialState: IAppState = {
  products: [],
  favorites: [],
  queryParams: {
    searchKeyword: '',
    page: 1,
    items: 0,
    itemLimit: 10,
    pages: 0,
    userEvent: '',
    userId: ''
  },
  users: [],
  activeUser: {},
  error: '',
};

/**
 * Reducer for app
 * @param state AppState
 * @param action any
 * @returns 
 */
export function appReducer(state = initialState, action: any): IAppState {
  switch (action.type) {
    case loginRequestSuccess.type: {
      return {
        ...state, activeUser: { ...action.user }
      }
    }
    case fetchUsersRequestSuccess.type: {
      return {
        ...state, users: action.users
      }
    }
    case addUser.type:
      return {
        ...state, users: [...state.users, action.user]
      }
    case updateUser.type:
      return {
        ...state,
        users: state.users.map(user => (user.id === action.user.id ? { ...user, name: action.user.name } : user))
      };
    case deleteUser.type:
      const cloned = _.cloneDeep(state.users);
      _.remove(cloned, { id: action.id });

      return { ...state, users: cloned };
    case fetchProductsRequestSuccess.type:
      return {
        ...state, products: action.queryParams.userEvent === 'scroll' ? [...state.products, ...action.products] : action.products, queryParams: action.queryParams
      }
    case addProduct.type:
      return {
        ...state, products: [...state.products, action.product]
      }
    case updateProduct.type:
      return {
        ...state,
        products: state.products.map(product => (product.id === action.product.id ? { ...product, label: action.product.label, price: action.product.price } : product))
      };
    case deleteProduct.type: {
      const cloned = _.cloneDeep(state.products);
      _.remove(cloned, { id: action.id });

      return { ...state, products: cloned };
    }
    case addFavorite.type: {
      // state.products.find(x => x.id === action.favorite.);

      return {
        ...state, favorites: [...state.favorites, action.favorite], products: state.products.map(p => (p.id === action.favorite.productId ? { ...p, isFavorite: true } : p))
      }
    }
    case removeFavorite.type: {
      const cloned = _.cloneDeep(state.favorites);
      _.remove(cloned, { id: action.favorite.id });

      return {
        ...state, favorites: cloned
      }
    }
    case updateFavoriteFlag.type: {
      return {
        ...state, products: state.products.map(p => (p.id === action.id ? { ...p, isFavorite: action === 'add' ? true : false } : p))
      }
    }
    case fetchFavoriteSuccess.type: {
      const favProducts = action.params.userEvent === 'scroll' ? [...state.favorites, ...action.favorites] : action.favorites;
      return {
        ...state, favorites: _.clone(favProducts).map((x: any) => { return { ...x, isFavorite: true } },), queryParams: action.params
      }
    }
    default:
      return state;
  }
}