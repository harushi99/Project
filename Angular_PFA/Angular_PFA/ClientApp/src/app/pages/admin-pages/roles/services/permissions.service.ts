import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/modules/auth';
import { environment } from 'src/environments/environment';
import {  Injectable } from '@angular/core';
import { PermissionModel } from '../model/permission.model';
import { Observable, of } from 'rxjs';




const API_USERS_URL = `${environment.apiUrl}/auth`;
@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {
 
  }
  reqHeader(): HttpHeaders {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) { return; }
    return new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
  }

  getPermissions(): Observable<PermissionModel[]> {
    const httpHeaders = this.reqHeader();
    if (!httpHeaders) { return of(undefined); }
    return this.http.get<PermissionModel[]>(`${API_USERS_URL}/permissions`, {
      headers: httpHeaders,
    });
  }

}
