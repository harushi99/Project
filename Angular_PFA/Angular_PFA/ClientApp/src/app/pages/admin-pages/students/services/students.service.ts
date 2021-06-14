import {Inject, Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {AuthService, UserModel} from '../../../../modules/auth';
import {StudentModel} from '../model/student.model';
import {map} from 'rxjs/operators';
import {
    IPaginatorState,
    ITableState,
    PaginatorState,
    TableResponseModel,
    TableService
} from '../../../../_metronic/shared/crud-table';
import {ApplicationModel} from '../../../applications/models/application.model';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {baseFilter} from '../../../../_fake/fake-helpers/http-extenstions';
import {StudentsHTTPService} from './students-http/students-http.service';
import {ROLESEnum} from "../../../../modules/auth/_models/ROLES.enum";

interface StudentsApiResponse {
  status: string;
  users: any;
  pagination: any;
}


@Injectable({
  providedIn: 'root'
})
export class StudentsService extends TableService<StudentModel> {

  API_URL = `${environment.apiUrl}/auth`;

  constructor(
      private authService: AuthService,
      private studentsHttpService: StudentsHTTPService,
      @Inject(HttpClient) http
  ) {
    super(http);
  }
  find(tableState: ITableState): Observable<TableResponseModel<StudentModel>> {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
    return this.http.get<StudentsApiResponse>(`${this.API_URL}/users?role=${ROLESEnum.STUDENT}&page=${this.paginator.page}&perpage=${this.paginator.pageSize}`, {
        headers: httpHeaders
    }).pipe(
        map((response: any) => {
            const filteredResult = baseFilter(response.users, tableState);
            const result: TableResponseModel<StudentModel> = {
            items: filteredResult.items,
            total: response.pagination.total
          };
            return result;
        })
    );
  }

  // Add a student by form
  addByForm(params: any): Observable<StudentModel> {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    return this.studentsHttpService.addByForm(params, auth.access_token)
        .pipe(
            map(
                (response) => {
                  return response.data;
              }
            )
        );
  }

    // Add students by Exel file
    addByExelFile(formData: FormData): Observable<any> {
        const auth = this.authService.getAuthFromLocalStorage();
        if (!auth || !auth.access_token) {
            return of(undefined);
        }
        return this.studentsHttpService.addByExelFile(formData, auth.access_token)
            .pipe(
                map(
                    (response) => {
                        return response;
                    }
                )
            );
    }
    getStudentById(id: any): Observable<StudentModel> {
      const auth = this.authService.getAuthFromLocalStorage();
      if (!auth || !auth.access_token) {
        return of(undefined);
      }
      return this.studentsHttpService.getStudentById( auth.access_token,id)
          .pipe(
              map(
                  (response) => {
                    return response;
                }
              )
          );
    }
    exportStudents(){
      const auth = this.authService.getAuthFromLocalStorage();
      if (!auth || !auth.access_token) {
          return of(undefined);
      }
      return this.studentsHttpService.exportStudents(auth.access_token);
          
    
    }
    delete(cin: number): Observable<any> {
      const auth = this.authService.getAuthFromLocalStorage();
      if (!auth || !auth.access_token) {
        return of(undefined);
      }
      return this.studentsHttpService.deleteStudent(cin,auth.access_token)
          .pipe(
              map(
                  (response) => {
                    return response;
                }
              )
          );
      }
}
