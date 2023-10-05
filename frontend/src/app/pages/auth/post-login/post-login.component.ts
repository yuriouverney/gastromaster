import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-post-login',
  templateUrl: './post-login.component.html',
  styleUrls: ['./post-login.component.scss'],
})
export class PostLoginComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      this.saveTokenInStorageAndRedirect(token);
    } else {
      this.checkHasTokenOrRedirect();
    }
  }

  private saveTokenInStorageAndRedirect(token: any) {
    localStorage.setItem('authToken', JSON.stringify(token));
    this.authService.getUserData();
    this.toastr.success('Login executado com sucesso!');
    this.router.navigate(['/index']);
  }

  private checkHasTokenOrRedirect() {
    const storedToken = localStorage.getItem('authToken');
    if (!storedToken) {
      this.router.navigate(['/auth/login']);
    }
  }
}
