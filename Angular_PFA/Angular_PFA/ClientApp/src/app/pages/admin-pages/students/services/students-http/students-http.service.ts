import { Injectable } from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {StudentModel} from '../../model/student.model';

interface StudentApiResponse {
  status: string;
  data: StudentModel[];
}

interface StudentApiResponseAdd {
  status: string;
  data: StudentModel;
}


const API_USERS_URL = `${environment.apiUrl}/auth`;

@Injectable({
  providedIn: 'root'
})
export class StudentsHTTPService {

  constructor(private http: HttpClient) { }

  // Get all students
  getAll(token): Observable<StudentApiResponse> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<StudentApiResponse>(`${API_USERS_URL}/get-students`, {
      headers: httpHeaders,
    });
  }

  getStudentById(token, id): Observable<StudentModel> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
     return this.http.get<StudentModel>(`${API_USERS_URL}/get-user-by-id`,
        {
            headers: httpHeaders,
            params: {
              id
            }
          });
  }

  // Add a student by form
  addByForm(params: any, token): Observable<StudentApiResponseAdd> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<StudentApiResponseAdd>(`${API_USERS_URL}/add-student`,
        {},
        {
            headers: httpHeaders,
            params
          });
  }

  addByExelFile(formData: FormData, token): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(`${API_USERS_URL}/add-students`,
        formData,
        {
          headers: httpHeaders,
        });
  }
  exportStudents(token): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return  this.http.get(`${API_USERS_URL}/get-students-excel`, {
        headers: httpHeaders,
        responseType: 'arraybuffer',
    });

  }
 deleteStudent(cin, token): Observable<StudentApiResponseAdd > {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    if (!httpHeaders) { return of(undefined); }
    return this.http.delete<StudentApiResponseAdd >(
      `${API_USERS_URL}/delete-user`,
      { headers: httpHeaders,
        params: {
          cin:cin
       }}
      );
  }

}
