import { Component, Inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from 'src/app/services/auth/auth.service';
import { OnInit } from '@angular/core';
import { GAuthService } from 'src/app/services/auth/g-auth.service';
import { SettingService } from 'src/app/services/setting.service';
import { environment } from '../../../../environments/environment';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class AppSideRegisterComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(GAuthService) private gAuthService: GAuthService,
    private toastr: ToastrService,
    private oauthService: OAuthService,
    private settingService: SettingService,
    private imageService: ImageService
  ) {
    this.configureOAuthService();
  }

  logo: string;
  loginGoogleUrl = `${environment.apiUrl}/auth/google`;

  ngOnInit(): void {
    this.getLogosFromIndexedDb();
  }

  async getLogosFromIndexedDb() {
    const savedLogo = await this.imageService.getImage('logo');
    this.logo = URL.createObjectURL(savedLogo);
  }

  isFormSubmitted = false;

  passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const passwordConfirmation = control.get('passwordConfirmation');

    return password?.value !== passwordConfirmation?.value
      ? { passwordsMatchValidator: true }
      : null;
  };

  form = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(6)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      passwordConfirmation: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordsMatchValidator.bind(this) }
  );

  get f() {
    return this.form.controls;
  }

  get fb() {
    return this.form;
  }

  onSignInWithGoogle(): void {
    this.authService
      .googleLogin()
      .pipe(
        finalize(() => (this.isFormSubmitted = false)),
        catchError((err) => {
          this.toastr.error('Não foi possível efetuar o cadastro', err.error.message);
          return of();
        })
      )
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/index');
          this.toastr.success('Usuário criado com sucesso!');
        },
      });
  }

  onSignUp() {
    if (!this.form.valid) {
      return;
    }
    const userForm = {
      name: this.form.value.name || '',
      email: this.form.value.email || '',
      password: this.form.value.password || '',
    };
    this.isFormSubmitted = true;
    this.authService
      .createUser(userForm)
      .pipe(
        finalize(() => (this.isFormSubmitted = false)),
        catchError((err) => {
          this.toastr.error('Não foi possível efetuar o cadastro', err.error.message);
          return of();
        })
      )
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/auth/login');
          this.toastr.success('Usuário criado com sucesso!');
        },
      });
  }

  private configureOAuthService() {
    this.oauthService.configure(this.gAuthService.authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }
}
