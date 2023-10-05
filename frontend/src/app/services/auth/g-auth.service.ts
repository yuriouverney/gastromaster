import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GAuthService {
  constructor(private oauthService: OAuthService) {
    this.configure();
  }

  readonly authConfig = {
    clientId: '605641132480-lnnaf6mtvih87uh1bjjk5f32bgrfndi9.apps.googleusercontent.com',
    issuer: `${environment.apiUrl}/auth/google`,
  };

  private configure() {
    this.oauthService.configure(this.authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (!this.oauthService.hasValidAccessToken()) {
        this.oauthService.initLoginFlow();
      }
    });
  }
}
