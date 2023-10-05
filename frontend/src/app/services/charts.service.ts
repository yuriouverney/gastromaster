import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from './auth/tokens.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  private backendUrl = `${environment.apiUrl}/charts`;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  public getProductsPerMonth(): Observable<any> {
    let token;
    this.tokenService.getAccessToken().subscribe((data) => (token = data));
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.backendUrl}/productssoldpermonth`, { headers });
  }
}
