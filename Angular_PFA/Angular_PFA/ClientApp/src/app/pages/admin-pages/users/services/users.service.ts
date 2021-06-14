import {Inject, Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {AuthService} from '../../../../modules/auth';
import {UserModel} from '../model/user.model';
import { map, catchError, finalize } from 'rxjs/operators';
import {ITableState, TableResponseModel, TableService} from '../../../../_metronic/shared/crud-table';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {baseFilter} from '../../../../_fake/fake-helpers/http-extenstions';
import {UsersHttpService} from './users-http/users-http.service';
import {ROLESEnum} from "../../../../modules/auth/_models/ROLES.enum";

interface UsersApiResponse {
  status: string;
  users: any;
  pagination: any;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService extends TableService<UserModel> {

  API_USERS_URL = `${environment.apiUrl}/auth`;

  constructor(
      private authService: AuthService,
      private usersHttpService: UsersHttpService,
      @Inject(HttpClient) http
  ) {
    super(http);
  }
  find(tableState: ITableState): Observable<TableResponseModel<UserModel>> {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
    return this.http.get<UsersApiResponse>(`${this.API_USERS_URL}/users?page=${this.paginator.page}&perpage=${this.paginator.pageSize}`, {
      headers: httpHeaders,
    }).pipe(
        map((response: UsersApiResponse) => {
          const filteredResult = baseFilter(response.users, tableState);
          const result: TableResponseModel<UserModel> = {
            items: filteredResult.items,
            total: response.pagination.total
          };
          return result;
        })
    );
  }

  // Add a user by form
  addByForm(params: any): Observable<UserModel> {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    return this.usersHttpService.addByForm(params, auth.access_token)
        .pipe(
            map(
                (response) => {
                  return response.data;
              }
            )
        );
  }

  updateByForm(params: any): Observable<UserModel> {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    return this.usersHttpService.updateByForm(params, auth.access_token)
        .pipe(
            map(
                (response) => {
                  return response.data;
              }
            )
        );
  }

    // Add users by Exel file
    addByExelFile(formData: FormData): Observable<any> {
        const auth = this.authService.getAuthFromLocalStorage();
        if (!auth || !auth.access_token) {
            return of(undefined);
        }
        return this.usersHttpService.addByExelFile(formData, auth.access_token)
            .pipe(
                map(
                    (response) => {
                        return response;
                    }
                )
            );
    }

    getUserById(id: any): Observable<UserModel> {
      const auth = this.authService.getAuthFromLocalStorage();
      if (!auth || !auth.access_token) {
        return of(undefined);
      }
      return this.usersHttpService.getUserById(auth.access_token,id)
          .pipe(
              map(
                  (response) => {
                    return response;
                }
              )
          );
    }
  delete(cin: any): Observable<any> {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    return this.usersHttpService.deleteUser(cin,auth.access_token)
        .pipe(
            map(
                (response) => {
                  return response;
              }
            )
        );
    }
  editRoles(cin:number,body:any){
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    return this.usersHttpService.editRoles(cin,body,auth.access_token)
        .pipe(
            map(
                (response) => {
                  return response;
              }
            )
        );

  }

}
