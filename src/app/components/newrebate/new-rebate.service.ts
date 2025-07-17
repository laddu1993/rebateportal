import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewRebateService {

  private isMode = environment.production;
  private apiUrl = !this.isMode ? environment.uatApiBaseUrl : environment.prodApiBaseUrl;

  constructor(private http: HttpClient) { }
  getCustomerList(data: any): Observable<any[]> {   
    let headers = new HttpHeaders();

    headers.append('Access-Control-Allow-Headers', 'Content-Type');
    headers.append('Access-Control-Allow-Credentials', 'true');
    //headers.append('Authorization', token);
    //headers.append('Access-Control-Allow-Origin','http://localhost:8080');
    return this.http.post<any[]>(`${this.apiUrl}customer/list`, data);
  }

  addNewCustomer(data: any): Observable<any[]> {   
    let headers = new HttpHeaders();

    headers.append('Access-Control-Allow-Headers', 'Content-Type');
    headers.append('Access-Control-Allow-Credentials', 'true');
    //headers.append('Authorization', token);
    //headers.append('Access-Control-Allow-Origin','http://localhost:8080');
    return this.http.post<any[]>(`${this.apiUrl}customer/add`, data);
  }

  createRebate(data: any): Observable<any[]> {   
    let headers = new HttpHeaders();

    headers.append('Access-Control-Allow-Headers', 'Content-Type');
    headers.append('Access-Control-Allow-Credentials', 'true');
    //headers.append('Authorization', token);
    //headers.append('Access-Control-Allow-Origin','http://localhost:8080');
    return this.http.post<any[]>(`${this.apiUrl}rebate/create`, data);
  }

  getNationalAccounts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'national_accounts');
  }

  createNationalAccount(data: any): Observable<any> {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Headers', 'Content-Type');
    headers.append('Access-Control-Allow-Credentials', 'true');
    return this.http.post<any[]>(this.apiUrl + 'customer/create_national_account', data);
  }

  getExternalOrgs(pageIndex: number, pageSize: number, company_name?: string, fleet_type?: string, state?: string, email_address?: string, zip?: string, firstName?: string, lastName?: string): Observable<any> {
    // Construct base URL with pagination parameters
    let url = `${this.apiUrl}customer/get_external_customers?start=${pageIndex * pageSize}&end=${(pageIndex + 1) * pageSize}`;
    // Append company_name parameter if provided
    if (company_name) {
      url += `&company_name=${encodeURIComponent(company_name)}`;
    }
    // Append fleet_type parameter if provided
    if (fleet_type) {
      url += `&fleet_type=${encodeURIComponent(fleet_type)}`;
    }
    // Append state parameter if provided
    if (state) {
      url += `&state=${encodeURIComponent(state)}`;
    }
    // Append email_address parameter if provided
    if (email_address) {
      url += `&email=${encodeURIComponent(email_address)}`;
    }
    // Append zip code parameter if provided
    if (zip) {
      url += `&zip=${encodeURIComponent(zip)}`;
    }
    // Append first Name parameter if provided
    if (firstName) {
      url += `&firstName=${encodeURIComponent(firstName)}`;
    }
    // Append lastName parameter if provided
    if (lastName) {
      url += `&lastName=${encodeURIComponent(lastName)}`;
    }
    return this.http.get<any>(url);
  }

}
