export interface IQueryParmsModel {
    searchKeyword?: string;
    page: number;
    items?: number;
    sort?: string;
    itemLimit?: number;
    pages: number;
    userEvent?: 'scroll' | '';
    userId?: string;
}