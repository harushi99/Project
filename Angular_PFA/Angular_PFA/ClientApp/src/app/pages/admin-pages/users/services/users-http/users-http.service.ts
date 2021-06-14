import { Injectable } from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {UserModel} from '../../model/user.model';



interface UserApiResponse {
  status: string;
  data: UserModel[];
}

interface UserApiResponseAdd {
  status: string;
  data: UserModel;
}

const API_USERS_URL = `${environment.apiUrl}/auth`;

@Injectable({
  providedIn: 'root'
})
export class UsersHttpService {

 
  constructor(private http: HttpClient) { }

  // Get all users
  getAll(token): Observable<UserApiResponse> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<UserApiResponse>(`${API_USERS_URL}/users`, {
      headers: httpHeaders,
    });
  }
  
  getUserById(token,id) : Observable<UserModel> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<UserModel>(`${environment.apiUrl}/auth/get-user-by-id`,
        {
            headers: httpHeaders,
            params: {
               id:id
            }
          });
  }


  // Add a user by form
  addByForm(params: any, token): Observable<UserApiResponseAdd> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<UserApiResponseAdd>(`${API_USERS_URL}/add-user`,
        {},
        {
            headers: httpHeaders,
            params
          });
  }
// to change
  addByExelFile(formData: FormData, token): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(`${API_USERS_URL}/add-users`,
        formData,
        {
          headers: httpHeaders,
        });
  }

  // Update a user by form
  updateByForm(params: any, token): Observable<UserApiResponseAdd> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<UserApiResponseAdd>(`${API_USERS_URL}/update-user`,
        {},
        {
            headers: httpHeaders,
            params
          });
  }
  
  deleteUser(cin, token): Observable<UserApiResponseAdd> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    if (!httpHeaders) { return of(undefined); }
    return this.http.delete<UserApiResponseAdd>(
      `${API_USERS_URL}/delete-user`,
      { headers: httpHeaders,
        params: {
          cin:cin
       }}
      );
  }

  editRoles(id: number, body: any,token): Observable<UserApiResponseAdd> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    if (!httpHeaders) { return of(undefined); }
    return this.http.post<UserApiResponseAdd>(
      `${API_USERS_URL}/edit-user-roles/${id}`,
      body,
      { headers: httpHeaders}
      );
  }
}
