import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs/operators';
import { ProfileTypes } from 'src/app/shared/enums/profile-types.enum';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.permission$.pipe(
      switchMap((permission: any) => {
        if (permission !== null) {
          if (this.hasPermission(next, permission)) {
            return of(true);
          } else {
            this.router.navigate(['']);
            return of(false);
          }
        } else {
          // If permission is null, wait and subscribe to the permission Observable
          return new Promise((resolve) => {
            this.authService.permission$.subscribe((permission: any) => {
              if (permission !== null && this.hasPermission(next, permission)) {
                resolve(true);
              } else {
                this.router.navigate(['']);
                resolve(false);
              }
            });
          });
        }
      })
    ) as Observable<boolean | UrlTree>;
  }

  private hasPermission(route: ActivatedRouteSnapshot, type: ProfileTypes | null): boolean {
    const requiredRoles = route.data['roles'] as ProfileTypes[];
    return type ? requiredRoles.includes(type) : false;
  }
}
