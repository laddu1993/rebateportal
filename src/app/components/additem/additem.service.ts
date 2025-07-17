import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdditemService {

  private isMode = environment.production;
  private apiUrl = !this.isMode ? environment.uatApiBaseUrl : environment.prodApiBaseUrl;
  assetUrl = environment.assetUrl;

  constructor(private http: HttpClient) { }
  getInvoices(data: any): Observable<any[]> {   
    let headers = new HttpHeaders();

    headers.append('Access-Control-Allow-Headers', 'Content-Type');
    headers.append('Access-Control-Allow-Credentials', 'true');
    //headers.append('Authorization', token);
    
    return this.http.post<any[]>(`${this.apiUrl}rebate/search`, data);
  }
}
