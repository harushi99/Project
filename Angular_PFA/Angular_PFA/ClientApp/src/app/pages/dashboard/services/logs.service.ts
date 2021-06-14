import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { environment } from 'src/environments/environment';
import { LogModel } from '../models/log.model';

const API_USERS_URL = `${environment.apiUrl}/auth`;

interface LogApiResponse {
  status: "string";
  data: LogModel[];
  error: string;
}

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  getLogs(): Observable<LogApiResponse> {
    const httpHeaders = this.reqHeader();
    if (!httpHeaders) { return of(undefined); }
    return this.http.get<LogApiResponse>(`${API_USERS_URL}/logs`, { headers: httpHeaders });
  }

  reqHeader(): HttpHeaders {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) { return; }
    return new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
  }

}
