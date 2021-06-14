import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/modules/auth';
import { RoleModel } from './../model/roles.model';
import { environment } from 'src/environments/environment';
import {  Inject, Injectable } from '@angular/core';
import { PermissionModel } from '../model/permission.model';
import { Observable, of } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { baseFilter } from 'src/app/_fake/fake-helpers/http-extenstions';
import { ITableState, TableResponseModel, TableService } from 'src/app/_metronic/shared/crud-table';



const API_USERS_URL = `${environment.apiUrl}/auth`;

interface RoleApiResponse {
  roles: RoleModel;
  status: string;
  message: string;
  error: string;
}

interface RoleIDApiResponse {
  role: RoleModel;
  permissions:PermissionModel[];
  status: string;
  message: string;
  error: string;
}

@Injectable({
  providedIn: 'root'
})
export class RolesService extends TableService<RoleModel> {

  constructor(
    private authService: AuthService,
    @Inject(HttpClient) http
  ) {
    super(http);
  }

  find(tableState: ITableState): Observable<TableResponseModel<RoleModel>> {
    const httpHeaders = this.reqHeader();
    if (!httpHeaders) { return of(undefined); }
    return this.http.get<RoleModel[]>(`${API_USERS_URL}/roles`, {
      headers: httpHeaders,
    }).pipe(
      map((response: RoleModel[]) => {
        const filteredResult = baseFilter(response, tableState);
        const result: TableResponseModel<RoleModel> = {
          items: response,
          total: response.length
        };
        return {
          items: response,
          total: response.length
        };
      })
    );
  }

  createRole(body: any): Observable<RoleApiResponse > {
    const httpHeaders = this.reqHeader();
    if(!httpHeaders) return of(undefined);
    return this.http.post<RoleApiResponse >(
      `${API_USERS_URL}/roles`,
      body,
      { headers: httpHeaders }
      );
  }

  reqHeader(): HttpHeaders {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) { return; }
    return new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
  }

  getRoles(): Observable<RoleModel[]> {
    const httpHeaders = this.reqHeader();
    if (!httpHeaders) { return of(undefined); }
    return this.http.get<RoleModel[]>(`${API_USERS_URL}/roles`, {
      headers: httpHeaders,
    });
  }

  getRoleById(id: number): Observable<RoleIDApiResponse> {
    const httpHeaders = this.reqHeader();
    if (!httpHeaders) { return of(undefined); }
    return this.http.get<RoleIDApiResponse>(`${API_USERS_URL}/roles/${id}`, {
      headers: httpHeaders,
    });
  }

  edit(id: number, body: any): Observable<RoleIDApiResponse > {
    const httpHeaders = this.reqHeader();
    if (!httpHeaders) return of(undefined);
    return this.http.post<RoleIDApiResponse>(
      `${API_USERS_URL}/roles/${id}`,
      body,
      { headers: httpHeaders}
      );
  }

  deleteRole(id: number): Observable<RoleApiResponse> {
    const httpHeaders = this.reqHeader();
    if (!httpHeaders) { return of(undefined); }
    return this.http.delete<RoleApiResponse>(
      `${API_USERS_URL}/roles/${id}`,
      { headers: httpHeaders }
      );
  }

}
