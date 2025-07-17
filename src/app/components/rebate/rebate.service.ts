import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RebateService {

  private isMode = environment.production;
  private apiUrl = !this.isMode ? environment.uatApiBaseUrl : environment.prodApiBaseUrl;

  constructor(private http: HttpClient) { }
  
  getRebateItemList(data: any): Observable<any[]> {   
    let headers = new HttpHeaders();

    headers.append('Access-Control-Allow-Headers', 'Content-Type');
    headers.append('Access-Control-Allow-Credentials', 'true');
    //headers.append('Authorization', token);
    //headers.append('Access-Control-Allow-Origin','http://localhost:8080');
    return this.http.post<any[]>(`${this.apiUrl}rebate`, data);
  }

  addRebateItem(data: any): Observable<any[]> {   
    let headers = new HttpHeaders();

    headers.append('Access-Control-Allow-Headers', 'Content-Type');
    headers.append('Access-Control-Allow-Credentials', 'true');
    //headers.append('Authorization', token);
    //headers.append('Access-Control-Allow-Origin','http://localhost:8080');
    return this.http.post<any[]>(`${this.apiUrl}rebate/add`, data);
  }
  
  calculateRebateItem(data: any): Observable<any[]> {   
    let headers = new HttpHeaders();

    headers.append('Access-Control-Allow-Headers', 'Content-Type');
    headers.append('Access-Control-Allow-Credentials', 'true');
    //headers.append('Authorization', token);
    //headers.append('Access-Control-Allow-Origin','http://localhost:8080');
    return this.http.post<any[]>(`${this.apiUrl}rebate/recalculate`, data);
  }
  updateRebate(data: any): Observable<any[]> {   
    let headers = new HttpHeaders();

    headers.append('Access-Control-Allow-Headers', 'Content-Type');
    headers.append('Access-Control-Allow-Credentials', 'true');
    //headers.append('Authorization', token);
    //headers.append('Access-Control-Allow-Origin','http://localhost:8080');
    return this.http.post<any[]>(`${this.apiUrl}rebate/update`, data);
  }
  uploadInvoice(data: any): Observable<any[]> {   
    let headers = new HttpHeaders();

    headers.append('Access-Control-Allow-Headers', 'Content-Type');
    headers.append('Access-Control-Allow-Credentials', 'true');
    //headers.append('Authorization', token);
    //headers.append('Access-Control-Allow-Origin','http://localhost:8080');
    return this.http.post<any[]>(`${this.apiUrl}rebate/upload`, data);
  }
  createRebate(data: any): Observable<any[]> {   
    let headers = new HttpHeaders();

    headers.append('Access-Control-Allow-Headers', 'Content-Type');
    headers.append('Access-Control-Allow-Credentials', 'true');
    //headers.append('Authorization', token);
    //headers.append('Access-Control-Allow-Origin','http://localhost:8080');
    return this.http.post<any[]>(`${this.apiUrl}rebate/create`, data);
  }
  getProSawSkuList(): Observable<any[]> {   
    let headers = new HttpHeaders();

    headers.append('Access-Control-Allow-Headers', 'Content-Type');
    headers.append('Access-Control-Allow-Credentials', 'true');
    //headers.append('Authorization', token);
    //headers.append('Access-Control-Allow-Origin','http://localhost:8080');
    return this.http.get<any[]>(`${this.apiUrl}rebate/pro_saw_sku_list`);
  }
}
