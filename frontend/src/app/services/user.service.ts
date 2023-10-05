import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from './auth/tokens.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private backendUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  public getUsers(): Observable<any> {
    let token;
    this.tokenService.getAccessToken().subscribe((data) => (token = data));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.backendUrl}/`, { headers });
  }

  public getUserById(id: number): Observable<any> {
    let token;
    this.tokenService.getAccessToken().subscribe((data) => (token = data));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.backendUrl}/${id}`, { headers });
  }

  public deleteUser(id: number): Observable<any> {
    let token;
    this.tokenService.getAccessToken().subscribe((data) => (token = data));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.backendUrl}/${id}`, { headers });
  }

  public updateUser(id: number, user: any): Observable<any> {
    let token;
    this.tokenService.getAccessToken().subscribe((data) => (token = data));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.backendUrl}/${id}`, user, { headers });
  }
}
