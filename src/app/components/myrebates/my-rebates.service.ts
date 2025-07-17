import { Injectable } from '@angular/core';
import { Myrebates } from './myrebates';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { TokenInterceptor } from 'src/app/helpers/token.interceptor';
import { AuthenticationService } from '../../services/authentication.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MyRebatesService {

  private isMode = environment.production;
  private apiUrl = !this.isMode ? environment.uatApiBaseUrl : environment.prodApiBaseUrl;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  getRebateList(data: any, token: string): Observable<Myrebates[]> {

    /*const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data',
      //'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${token}`
    });*/
    
    return this.http.post<Myrebates[]>(`${this.apiUrl}rebate/list`, data);//, {headers:headers}
  }
  deleteRebate(data: any): Observable<Myrebates[]> { 
    let headers = new HttpHeaders();

    headers.append('Access-Control-Allow-Headers', 'Content-Type');
    headers.append('Access-Control-Allow-Credentials', 'true');
    //headers.append('Authorization', token);
    //headers.append('Access-Control-Allow-Origin','http://localhost:8080');

    return this.http.post<Myrebates[]>(`${this.apiUrl}rebate/delete`, data);
  }
}
