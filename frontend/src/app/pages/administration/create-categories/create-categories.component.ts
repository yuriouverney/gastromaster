import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-create-categories',
  templateUrl: './create-categories.component.html',
})
export class CreateCategoriesComponent implements OnInit {
  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  isFormSubmitted = false;

  categoryForm!: FormGroup;

  createForm(): void {
    this.categoryForm = this.fb.group(
      {
        name: ['', [Validators.required]],
      },
      {}
    );
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.isFormSubmitted = true;
      const data = this.categoryForm.getRawValue();
      this.categoryService
        .createCategory(data)
        .pipe(
          finalize(() => (this.isFormSubmitted = false)),
          catchError((err) => {
            this.toastr.error('Não foi possível criar categoria', err.error.message);
            return of();
          })
        )
        .subscribe({
          next: () => {
            this.router.navigate(['admin/categories']);
            this.toastr.success('Categoria criada com sucesso!');
          },
        });
    } else {
      this.toastr.error('Por favor, preencha o formulário corretamente.');
    }
  }

  onBack(): void {
    this.router.navigate(['admin/categories']);
  }
}
