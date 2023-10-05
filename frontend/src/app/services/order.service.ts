import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from './auth/tokens.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private backendUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  public getOrders(): Observable<any> {
    let token;
    this.tokenService.getAccessToken().subscribe((data) => (token = data));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.backendUrl}/`, { headers });
  }

  public getUserOrders(): Observable<any> {
    let token;
    this.tokenService.getAccessToken().subscribe((data) => (token = data));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.backendUrl}/user`, { headers });
  }

  public getOrderById(id: string): Observable<any> {
    let token;
    this.tokenService.getAccessToken().subscribe((data) => (token = data));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.backendUrl}/${id}`, { headers });
  }

  public createOrder(data: any, couponCode: any): Observable<any> {
    let token;
    this.tokenService.getAccessToken().subscribe((data) => (token = data));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.backendUrl}/`, { data, couponCode }, { headers });
  }

  public removeItemOrder(id: string): Observable<any> {
    let token;
    this.tokenService.getAccessToken().subscribe((data) => (token = data));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.backendUrl}/orderitem/${id}`, { headers });
  }

  public updateOrder(id: string, data: any): Observable<any> {
    let token;
    this.tokenService.getAccessToken().subscribe((data) => (token = data));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.backendUrl}/${id}`, data, {
      headers,
    });
  }
}
