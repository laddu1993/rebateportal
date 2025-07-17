import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationClient {

  private isMode = environment.production;
  private apiUrl = !this.isMode ? environment.uatApiBaseUrl : environment.prodApiBaseUrl;
  
  constructor(private http: HttpClient) {}

  public login(username: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('email', username);
    formData.append('password', password);

    return this.http.post(
      this.apiUrl + 'login',
      formData,
      { responseType: 'json' }
    );
  }
  public login_old(username: string, password: string): Observable<any> {
    const body = { "email": username, "password": password };
    const headers = new HttpHeaders({      
      'Custom-Header-1': JSON.stringify(body)
    });
    
    //<{ token: string }>
    return this.http.post(this.apiUrl + 'login', {}, { headers, responseType: 'text' }).pipe(
      catchError(error => {
        console.error('Error occurred:', error);
        return of({ error: 'Authentication failed' });
      })
    );;//.pipe(
      //tap(response => {
        //this.authToken = response.token;
        //this.loggedInSubject.next(true);
        //localStorage.setItem('authToken', this.authToken); // Store token in localStorage
      //})
    //);
  }

  public register(
    username: string,
    email: string,
    password: string
  ): Observable<string> {
    return this.http.post(
      this.apiUrl + '/user/register',
      {
        username: username,
        email: email,
        password: password,
      },
      { responseType: 'text' }
    );
  }
}