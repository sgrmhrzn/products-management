import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILogInUserModel, IUserAssignModel, IUserModel } from '../models/user.model';
import { CommonService } from './common.service';
import { IFavoriteModel } from '../models/favorite.model';
import { IQueryParmsModel } from '../models/query-params.model';

@Injectable({
  providedIn: 'root'
})
/**
 * Communicate with server for user information
 */
export class UserService {
  commonService = inject(CommonService);
  constructor(private http: HttpClient) { }

  /**
   *
   * Fetch all users
   *
   * */
  getAll(): Observable<IUserModel[]> {
    return this.http.get<IUserModel[]>(`${environment.SERVER_URL}users`);
  }

  /**
 * Add new user
 * @param user IUserModel - user information
 * @returns Observable<IUserModel>
 */
  addUser(user: IUserModel): Observable<IUserModel> {
    return this.http.post<IUserModel>(`${environment.SERVER_URL}users`, user);
  }

  /**
   * Update user
   * @param user IUserModel - user information
   * @returns Observable<IUserModel>
   */
  updateUser(user: IUserModel): Observable<IUserModel> {
    return this.http.patch<IUserModel>(`${environment.SERVER_URL}users/${user.id}`, user);
  }


  /**
   * Delete user
   * @param id string - user id
   * @returns Observable<IUserModel>
   */
  deleteUser(id: string): Observable<IUserModel> {
    return this.http.delete<IUserModel>(`${environment.SERVER_URL}users/${id}`);
  }


  /**
   * Assign selected users to role
   * @param assignedUsers IUserAssignModel - role and users information
   * @returns Observable<IUserAssignModel>
   */
  assignUsers(assignedUsers: IUserAssignModel): Observable<IUserAssignModel> {
    let url = `${environment.SERVER_URL}assignedUsers`;
    if (assignedUsers.id) {
      url += `/${assignedUsers.id}`;
      return this.http.patch<IUserAssignModel>(url, assignedUsers);
    } else {
      return this.http.post<IUserAssignModel>(url, { ...assignedUsers, id: this.commonService.uuidv4() });
    }
  }

  /**
   * Checks if user exists in the system or not
   * @param user ILogInUserModel - Log in user information
   * @returns Observable<Array<IUserModel>>
   */
  checkUser(user: ILogInUserModel): Observable<Array<IUserModel>> {
    return this.http.get<IUserModel[]>(`${environment.SERVER_URL}users?username=${user.username}&password=${user.password}`);
  }

  /**
   * Get all assigned users and roles
   * @returns Observable<IUserAssignModel[]>
   */
  getAllAssignedRolesUsers(): Observable<IUserAssignModel[]> {
    return this.http.get<IUserAssignModel[]>(`${environment.SERVER_URL}assignedUsers`);
  }


  /**
   * Get assigned users of role
   * @param id string - role id
   * @returns Array<IUserAssignModel>
   */
  getRoleUsers(id: string): Observable<IUserAssignModel[]> {
    return this.http.get<IUserAssignModel[]>(`${environment.SERVER_URL}assignedUsers?role.id=${id}`);
  }


  setFavorite(favorite: IFavoriteModel) {
    return this.http.post<IFavoriteModel>(`${environment.SERVER_URL}favorites`, favorite);
  }

  patchFavorite(favorite: IFavoriteModel) {
    return this.http.patch<IFavoriteModel>(`${environment.SERVER_URL}favorites/${favorite.id}`, favorite);
  }

  getFavorite(queryParams: IQueryParmsModel) {
    return this.http.get<IFavoriteModel[]>(`${environment.SERVER_URL}favorites?_page=${queryParams.page}&userId=${queryParams.userId}&q=${queryParams.searchKeyword}`);
  }
}
