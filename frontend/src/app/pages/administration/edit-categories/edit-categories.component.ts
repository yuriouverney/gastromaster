import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-edit-categories',
  templateUrl: './edit-categories.component.html',
})
export class EditCategoriesComponent implements OnInit {
  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  id: string;

  ngOnInit(): void {
    this.createForm();
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.categoryService.getCategoryById(this.id).subscribe((data) => {
        this.categoryForm.patchValue(data);
      });
    });
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
        .updateCategory(data)
        .pipe(
          finalize(() => (this.isFormSubmitted = false)),
          catchError((err) => {
            this.toastr.error('Não foi possível editar categoria', err.error.message);
            return of();
          })
        )
        .subscribe({
          next: () => {
            this.router.navigate(['admin/categories']);
            this.toastr.success('Categoria editada com sucesso!');
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
