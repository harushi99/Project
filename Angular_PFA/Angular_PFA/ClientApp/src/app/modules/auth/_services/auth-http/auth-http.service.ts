import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { UserModel } from '../..';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../_models/auth.model';

interface UserApiResponse {
  status: string;
  user: UserModel;
}

const API_USERS_URL = `${environment.apiUrl}/auth`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) { }

  // public methods
  login(cin: string, password: string): Observable<any> {
    const params = {
      cin,
      password
    };
    return this.http.post<AuthModel>(`${API_USERS_URL}/login`,   {}, {params});
  }

  // CREATE =>  POST: add a new user to the server
  createUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(API_USERS_URL, user);
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<boolean> {
    const params = {
      email
    };
    return this.http.post<boolean>(`${API_USERS_URL}/forgot`, {}, {params});
  }

    getUserByToken(token): Observable<UserApiResponse> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<UserApiResponse>(`${API_USERS_URL}/me`, {
      headers: httpHeaders,
    });
  }
}
