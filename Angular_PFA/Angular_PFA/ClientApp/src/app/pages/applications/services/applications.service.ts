import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { AuthService } from 'src/app/modules/auth';
import { baseFilter } from 'src/app/_fake/fake-helpers/http-extenstions';
import { ITableState, TableResponseModel, TableService } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';
import { ApplicationModel } from '../models/application.model';

const API_USERS_URL = `${environment.apiUrl}/auth`;

interface ApplicationApiResponse {
  applications: ApplicationModel[];
  message: string;
  error: string;
}

interface ApplicationApiResponseCommand {
  message: string;
  error: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService extends TableService<ApplicationModel> {

  constructor(
    private authService: AuthService,
    @Inject(HttpClient) http
  ) {
    super(http);
  }

  find(tableState: ITableState): Observable<TableResponseModel<ApplicationModel>> {
    const httpHeaders = this.reqHeader();
    if (!httpHeaders) { return of(undefined); }
    return this.http.get<ApplicationApiResponse>(`${API_USERS_URL}/applications?page=${this.paginator.page}&perpage=${this.paginator.pageSize}`, {
      headers: httpHeaders,
    }).pipe(
      map((response: ApplicationApiResponse) => {
        const filteredResult = baseFilter(response.applications, tableState);
        const result: TableResponseModel<ApplicationModel> = {
          items: filteredResult.items,
          total: filteredResult.total
        };
        return result;
      })
    );
  }

  edit(id: number, body: any): Observable<ApplicationApiResponseCommand> {
    const httpHeaders = this.reqHeader();
    if (!httpHeaders) { return of(undefined); }
    return this.http.post<ApplicationApiResponseCommand>(
      `${API_USERS_URL}/applications/${id}`,
      body,
      { headers: httpHeaders }
      );
  }

  deleteApplication(id: number): Observable<ApplicationApiResponseCommand> {
    const httpHeaders = this.reqHeader();
    if (!httpHeaders) { return of(undefined); }
    return this.http.delete<ApplicationApiResponseCommand>(
      `${API_USERS_URL}/applications/${id}`,
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

  addApplication(formData: FormData): Observable<any> {
    const httpHeaders = this.reqHeader();
    if (!httpHeaders) { return of(undefined); }
    return this.http.post(`${API_USERS_URL}/applications`, formData, { headers: httpHeaders });
  }

  getApplicationById(id: string): Observable<any> {
    const httpHeaders = this.reqHeader();
    if (!httpHeaders) { return of(undefined); }
    return this.http.get(`${API_USERS_URL}/applications/${id}`, { headers: httpHeaders });
  }

  getApplicationRequirments(requirements: string): Observable<any> {
    const httpHeaders = this.reqHeader();
    if (!httpHeaders) { return of(undefined); }
    const params = {
      file: requirements
    };
    return this.http.get(`${API_USERS_URL}/download`, { headers: httpHeaders, params, responseType: 'arraybuffer' });
  }
}
