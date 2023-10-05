import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  id: number;
  isFormSubmitted = false;
  changePassword = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  userForm!: FormGroup;
  editMode = true;
  user: any;

  ngOnInit(): void {
    this.createForm();
    this.user = this.authService.currentUser$.subscribe((user) => {
      if (user?.id) {
        this.id = user?.id;
        this.userService.getUserById(this.id).subscribe((data) => {
          this.userForm.patchValue(data);
        });
      }
    });
  }
  createForm(): void {
    this.userForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(6)]],
        email: ['', [Validators.required, Validators.email]],
        UserProfile: this.fb.group({
          address: [''],
          phone: [''],
        }),
        password: [''],
        confirmPassword: [''],
      },
      { validator: this.passwordMatchValidator.bind(this) }
    );
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const data = this.userForm.getRawValue();
      if (!this.changePassword) {
        delete data.password;
        delete data.confirmPassword;
      }
      this.userService
        .updateUser(this.id, data)
        .pipe(
          finalize(() => (this.isFormSubmitted = false)),
          catchError((err) => {
            this.toastr.error('Não foi possível editar usuário', err.error.message);
            return of();
          })
        )
        .subscribe({
          next: () => {
            this.router.navigate(['']);
            this.toastr.success('Usuário editado com sucesso!');
          },
        });
    } else {
      this.toastr.error('Por favor, preencha o formulário corretamente.');
    }
  }

  onVoltar(): void {
    this.router.navigate(['']);
  }

  onChangePass() {
    this.changePassword == false ? (this.changePassword = true) : (this.changePassword = false);
    if (this.changePassword) {
      this.userForm.get('confirmPassword')?.setValidators([Validators.required]);
      this.userForm.get('passwordassword')?.setValidators([Validators.required]);
      this.userForm.get('password')?.updateValueAndValidity();
      this.userForm.get('confirmPassword')?.updateValueAndValidity();
    } else {
      this.userForm.get('confirmPassword')?.clearValidators();
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
      this.userForm.get('confirmPassword')?.updateValueAndValidity();
    }
  }

  passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
    if (this.changePassword) {
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;

      if (password !== confirmPassword) {
        return { passwordMismatch: true };
      }

      return null;
    } else {
      return null;
    }
  }
}
