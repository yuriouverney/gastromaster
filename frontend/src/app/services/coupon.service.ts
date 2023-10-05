import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from './auth/tokens.service';
import { environment } from '../../environments/environment';
import { ICoupon } from '../models/coupon.model';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private backendUrl = `${environment.apiUrl}/coupons`;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  public getCoupons(): Observable<any> {
    let token;
    this.tokenService.getAccessToken().subscribe((data) => (token = data));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.backendUrl}/`, { headers });
  }

  public getCouponById(id: string): Observable<any> {
    let token;
    this.tokenService.getAccessToken().subscribe((data) => (token = data));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.backendUrl}/${id}`, { headers });
  }

  public getCouponByCodigo(code: string): Observable<any> {
    let token;
    this.tokenService.getAccessToken().subscribe((data) => (token = data));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.backendUrl}/code/${code}`, { headers });
  }

  public createCoupon(data: ICoupon): Observable<any> {
    let token;
    this.tokenService.getAccessToken().subscribe((data) => (token = data));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.backendUrl}/`, data, { headers });
  }

  public updateCoupon(data: ICoupon): Observable<any> {
    let token;
    this.tokenService.getAccessToken().subscribe((data) => (token = data));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.backendUrl}/`, data, { headers });
  }
}
