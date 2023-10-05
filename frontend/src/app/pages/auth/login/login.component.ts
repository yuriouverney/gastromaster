import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class AppSideLoginComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private imageService: ImageService
  ) {}

  logo: string;
  loginGoogleUrl = `${environment.apiUrl}/auth/google`;
  isLoading = true;

  ngOnInit(): void {
    this.imageService.getLogo().subscribe((data) => {
      this.logo = data;
    });
  }

  async getLogosFromIndexedDb() {
    const savedLogo = await this.imageService.getImage('logo');
    this.logo = URL.createObjectURL(savedLogo);
  }

  isFormSubmitted = false;
  get f() {
    return this.form.controls;
  }
  form = new FormGroup(
    {
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    },
    {}
  );

  onSignIn() {
    if (!this.form.valid) {
      return;
    }

    const userForm = {
      email: this.form.value.email || '',
      password: this.form.value.password || '',
    };

    this.removeSessionStorage();
    this.isFormSubmitted = true;
    this.authService
      .login(userForm)
      .pipe(
        finalize(() => (this.isFormSubmitted = false)),
        catchError((err) => {
          this.toastr.error('Não foi possível fazer login', err.error.message);
          return of();
        })
      )
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/index');
          this.toastr.success('Login executado com sucesso!');
        },
      });
  }

  removeSessionStorage() {
    this.authService.logout();
  }
}
