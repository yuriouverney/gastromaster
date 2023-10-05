import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';
import { ICategory } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-create-products',
  templateUrl: './create-products.component.html',
})
export class CreateProductsComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {}

  categories: ICategory[] = [];
  selectedFile: File | null = null;

  ngOnInit(): void {
    this.createForm();
    this.categoryService.getCategories().subscribe((data) => (this.categories = data));
  }

  promotionOptions = [
    { name: 'Sim', value: true },
    { name: 'Não', value: false },
  ];

  isFormSubmitted = false;

  productForm!: FormGroup;

  createForm(): void {
    this.productForm = this.fb.group(
      {
        name: [null, [Validators.required]],
        description: [null],
        price: [null, [Validators.required]],
        image: [null],
        promotion: [null, [Validators.required]],
        promotion_percent: [null],
        category_id: [null, [Validators.required]],
      },
      {}
    );
  }

  private getFormValues() {
    const formValues = this.productForm.getRawValue();
    const filteredFormValues = Object.keys(formValues).reduce((result, key) => {
      const value = formValues[key];
      if (value !== null && value !== 'null') {
        result[key] = value;
      }
      return result;
    }, {} as { [key: string]: any });

    return filteredFormValues;
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isFormSubmitted = true;

      const formData = new FormData();
      const productData = this.getFormValues();

      Object.keys(productData).forEach((key) => {
        if (key !== 'image') {
          formData.append(key, productData[key]);
        }
      });

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }
      this.productService
        .createProduct(formData)
        .pipe(
          finalize(() => (this.isFormSubmitted = false)),
          catchError((err) => {
            this.toastr.error('Não foi possível cadastrar produto', err.error.message);
            return of();
          })
        )
        .subscribe({
          next: () => {
            this.router.navigate(['admin/products']);
            this.toastr.success('Produto cadastrado com sucesso!');
          },
        });
    } else {
      this.toastr.error('Por favor, preencha o formulário corretamente.');
    }
  }

  onBack(): void {
    this.router.navigate(['admin/products']);
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  get promotionItem(): any {
    const isPromotionIten = this.productForm.get('promotion')?.value;
    if (isPromotionIten) {
      return true;
    } else {
      return false;
    }
  }
}
