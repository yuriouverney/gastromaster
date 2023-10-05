import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, BehaviorSubject, map } from 'rxjs';
import { IUser } from '../../models/user.model';
import { TokenService } from './tokens.service';
import { TokenData } from '../../shared/enums/token-data';
import { IPermission } from '../../models/permission.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private backendUrl = `${environment.apiUrl}/auth`;
  public currentUser: IUser | null = null;
  public permission: IPermission | null = null;
  public permission$ = new BehaviorSubject<IPermission | null>(null);
  public currentUser$ = new BehaviorSubject<IUser | null>(null);
  readonly authConfig = {
    clientId: '605641132480-lnnaf6mtvih87uh1bjjk5f32bgrfndi9.apps.googleusercontent.com',
    issuer: `${environment.apiUrl}/auth/google`,
  };

  constructor(private http: HttpClient, private tokenService: TokenService) {
    this.getUserData();
  }

  public createUser(form: IUser): Observable<any> {
    return this.http.post<any>(`${this.backendUrl}/register`, { form });
  }

  private saveAccessData(tokenData: TokenData) {
    this.tokenService.setAccessData(tokenData);
  }

  public googleLogin(): Observable<any> {
    return this.http.get<any>(`${this.backendUrl}/google`);
  }

  public login(form: IUser): Observable<any> {
    return this.http.post<any>(`${this.backendUrl}/login`, { form }).pipe(
      tap((response: any) => {
        const tokens: TokenData = response.token;
        this.saveAccessData(tokens);
        this.getUserData();
      })
    );
  }

  public logout(): void {
    this.tokenService.clear();
    this.setCurrentUser(null);
  }

  public getUserData() {
    const key = this.tokenService.ACCESS_DATA_KEY;
    if (key) {
      const tokenKey = localStorage.getItem(key);
      if (tokenKey) {
        this.tokenService.getAccessToken().subscribe((token) => {
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

          this.http
            .get<any>(`${this.backendUrl}/getuserdata`, { headers })
            .pipe(
              map((response: any) => {
                this.setCurrentUser(response.session, response.session.Permission.type);
                return response;
              })
            )
            .subscribe(
              () => {
                return true;
              },
              (error) => {
                console.error('Error fetching user data:', error);
              }
            );
        });
        return true;
      }
    }
    return false;
  }

  public setCurrentUser(user: IUser | null = null, permission: IPermission | null = null): void {
    this.currentUser$.next(user);
    this.permission$.next(permission);
  }
}
