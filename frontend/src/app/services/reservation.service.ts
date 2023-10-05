import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from './auth/tokens.service';
import { IReservation } from '../models/reservation.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private backendUrl = `${environment.apiUrl}/reservations`;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  public getReservations(): Observable<any> {
    let token;
    this.tokenService.getAccessToken().subscribe((data) => (token = data));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.backendUrl}/`, { headers });
  }

  public getReservationsByUser(): Observable<any> {
    let token;
    this.tokenService.getAccessToken().subscribe((data) => (token = data));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.backendUrl}/user/`, { headers });
  }

  public getReservationByIdAdmin(id: number): Observable<any> {
    let token;
    this.tokenService.getAccessToken().subscribe((data) => (token = data));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.backendUrl}/${id}`, { headers });
  }

  public getReservationById(id: number): Observable<any> {
    let token;
    this.tokenService.getAccessToken().subscribe((data) => (token = data));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.backendUrl}/user/${id}`, { headers });
  }

  public createReservation(form: IReservation): Observable<any> {
    let token;
    this.tokenService.getAccessToken().subscribe((data) => (token = data));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.backendUrl}/`, form, { headers });
  }

  public updateReservationAdmin(form: IReservation, id: number): Observable<any> {
    let token;
    this.tokenService.getAccessToken().subscribe((data) => (token = data));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.backendUrl}/${id}`, form, { headers });
  }

  public updateReservation(form: IReservation, id: number): Observable<any> {
    let token;
    this.tokenService.getAccessToken().subscribe((data) => (token = data));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.backendUrl}/user/${id}`, form, { headers });
  }

  public deleteReservationAdmin(id: number): Observable<any> {
    let token;
    this.tokenService.getAccessToken().subscribe((data) => (token = data));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.backendUrl}/${id}`, { headers });
  }

  public deleteReservation(id: number): Observable<any> {
    let token;
    this.tokenService.getAccessToken().subscribe((data) => (token = data));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.backendUrl}/user/${id}`, { headers });
  }
}
