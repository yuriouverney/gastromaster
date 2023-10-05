import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenData } from '../../shared/enums/token-data';

@Injectable()
export class TokenService {
  readonly ACCESS_DATA_KEY = 'authToken';

  /**
   * Get access token
   * @returns {Observable<string>}
   */
  public getAccessToken(): Observable<string> {
    return this.getAccessData().pipe(
      map((accessData) => {
        return accessData;
      })
    );
  }

  /**
   * Set the access data.
   * @param accessData
   * @returns {TokenStorage}
   */
  public setAccessData(tokenData: TokenData): TokenService {
    localStorage.setItem(this.ACCESS_DATA_KEY, JSON.stringify(tokenData));
    return this;
  }

  /**
   * Get access data.
   * @returns {Observable<TokenData>}
   */
  public getAccessData(): Observable<string> {
    const item = localStorage.getItem(this.ACCESS_DATA_KEY);
    const tokenData = item ? JSON.parse(item) : null;
    return of(tokenData);
  }

  /**
   * Remove tokens
   */
  public clear() {
    localStorage.removeItem(this.ACCESS_DATA_KEY);
  }
}
