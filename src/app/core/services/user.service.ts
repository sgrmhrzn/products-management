import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILogInUserModel, IUserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
/**
 * Communicate with server for user information
 */
export class UserService {

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
   * Checks if user exists in the system or not
   * @param user ILogInUserModel - Log in user information
   * @returns Observable<Array<IUserModel>>
   */
  checkUser(user: ILogInUserModel): Observable<Array<IUserModel>> {
    return this.http.get<IUserModel[]>(`${environment.SERVER_URL}users?username=${user.username}&password=${user.password}`);
  }

}
