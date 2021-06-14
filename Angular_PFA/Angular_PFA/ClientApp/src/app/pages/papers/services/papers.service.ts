import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { AuthService } from 'src/app/modules/auth';
import { Role } from 'src/app/modules/auth/_models/role.model';
import { baseFilter } from 'src/app/_fake/fake-helpers/http-extenstions';
import { ITableState, TableResponseModel, TableService } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';
import { PapersModel } from '../model/papers.model';

const API_USERS_URL = `${environment.apiUrl}/auth`;


interface PaperApiResponse {
  status: string;
  message: string;
  data: PapersModel;
}

@Injectable({
  providedIn: 'root'
})
export class PapersService extends TableService<PapersModel> {

  constructor(
    private authService: AuthService,
    @Inject(HttpClient) http
  ) {
    super(http);
  }

  find(tableState: ITableState): Observable<TableResponseModel<PapersModel>> {
    const httpHeaders = this.reqHeader();
    if (!httpHeaders) { return of(undefined); }
    return this.http.get<PapersModel[]>(`${API_USERS_URL}/papers`, {
      headers: httpHeaders,
    }).pipe(
      map((response: PapersModel[]) => {
        const filteredResult = baseFilter(response, tableState);
        const result: TableResponseModel<PapersModel> = {
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

  createPaper(body: any): Observable<PaperApiResponse> {
    const httpHeaders = this.reqHeader();
    if(!httpHeaders) return of(undefined);
    return this.http.post<PaperApiResponse>(
      `${API_USERS_URL}/papers`,
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

  getPapers(): Observable<PapersModel[]> {
    const httpHeaders = this.reqHeader();
    if (!httpHeaders) { return of(undefined); }
    return this.http.get<PapersModel[]>(`${API_USERS_URL}/papers`, {
      headers: httpHeaders,
    });
  }

  getPaperFile(filePath: string): Observable<any> {
    const params = {
      file: filePath.slice(6)
    };
    const httpHeaders = this.reqHeader();
    if (!httpHeaders) { return of(undefined); }
    return this.http.get(`${API_USERS_URL}/download`, {
      headers: httpHeaders,
      params,
      responseType: 'arraybuffer'
    });
  }

  getPaperById(id: number): Observable<PaperApiResponse> {
    const httpHeaders = this.reqHeader();
    if (!httpHeaders) { return of(undefined); }
    return this.http.get<PaperApiResponse>(`${API_USERS_URL}/papers/${id}`, {
      headers: httpHeaders,
    });
  }

  edit(id: number, body: any): Observable<PaperApiResponse> {
    const httpHeaders = this.reqHeader();
    if (!httpHeaders) return of(undefined);
    return this.http.post<PaperApiResponse>(
      `${API_USERS_URL}/papers/${id}`,
      body,
      { headers: httpHeaders }
      );
  }

  deletePaper(id: number): Observable<PaperApiResponse> {
    const httpHeaders = this.reqHeader();
    if (!httpHeaders) { return of(undefined); }
    return this.http.delete<PaperApiResponse>(
      `${API_USERS_URL}/papers/${id}`,
      { headers: httpHeaders }
      );
  }

  getRoles(): Observable<Role[]> {
    const httpHeaders = this.reqHeader();
    if (!httpHeaders) { return of(undefined); }
    return this.http.get<Role[]>(`${API_USERS_URL}/roles`, {
      headers: httpHeaders,
    });
  }

  getRoleById(id): Observable<any[]> {
    const httpHeaders = this.reqHeader();
    if (!httpHeaders) { return of(undefined); }
    return this.http.get<any[]>(`${API_USERS_URL}/roles/${id}`, {
      headers: httpHeaders,
    });
  }

}
