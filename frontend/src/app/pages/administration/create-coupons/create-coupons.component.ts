import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';
import { CouponService } from 'src/app/services/coupon.service';

@Component({
  selector: 'app-create-coupons',
  templateUrl: './create-coupons.component.html',
})
export class CreateCouponsComponent implements OnInit {
  constructor(
    private couponService: CouponService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  activeOptions = [
    { name: 'Sim', value: true },
    { name: 'Não', value: false },
  ];

  isFormSubmitted = false;

  couponForm!: FormGroup;

  createForm(): void {
    this.couponForm = this.fb.group(
      {
        value: [null, [Validators.required]],
        code: [null, [Validators.required]],
        description: [null],
        order_min_value: [null, [Validators.required]],
        active: [null, [Validators.required]],
        expiration_date: [null],
      },
      {}
    );
    // Adicionando validação customizada
    this.couponForm.get('order_min_value')?.setValidators([
      Validators.required,
      this.minOrderValueValidator.bind(this.couponForm), // vincular o contexto do formulário à função de validação
    ]);

    // Atualizar validações
    this.couponForm.updateValueAndValidity();
  }

  private getFormValues() {
    const formValues = this.couponForm.getRawValue();
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
    if (this.couponForm.valid) {
      this.isFormSubmitted = true;
      const data = this.getFormValues();
      this.couponService
        .createCoupon(data)
        .pipe(
          finalize(() => (this.isFormSubmitted = false)),
          catchError((err) => {
            this.toastr.error('Não foi possível criar o cupom', err.error.message);
            return of();
          })
        )
        .subscribe({
          next: () => {
            this.router.navigate(['admin/coupons']);
            this.toastr.success('Cupom criado com sucesso!');
          },
        });
    } else {
      this.toastr.error('Por favor, preencha o formulário corretamente.');
    }
  }

  onBack(): void {
    this.router.navigate(['admin/coupons']);
  }

  private minOrderValueValidator(control: any): { [key: string]: any } | null {
    const orderMinValue = control.value;
    const value = control?.parent?.get('value')?.value;

    if (orderMinValue !== null && value !== null && orderMinValue < value) {
      return { minOrderValueInvalid: true };
    }

    return null;
  }
}
