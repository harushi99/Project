import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { environment } from 'src/environments/environment';
import { statModel } from '../models/stat.model';

const API_USERS_URL = `${environment.apiUrl}/auth`;

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  getStats(): Observable<statModel> {
    const httpHeaders = this.reqHeader();
    if (!httpHeaders) { return of(undefined); }
    return this.http.get<statModel>(`${API_USERS_URL}/logs/stats`, { headers: httpHeaders });
  }

  reqHeader(): HttpHeaders {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) { return; }
    return new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
  }
}
