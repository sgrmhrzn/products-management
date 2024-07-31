/**
 * query parameter model to request with filtered data
 */
export interface IQueryParamsModel {
    searchKeyword?: string;
    page: number;
    items?: number;
    sort?: string;
    itemLimit?: number;
    pages: number;
    userEvent?: 'scroll' | '';
    userId?: string;
}