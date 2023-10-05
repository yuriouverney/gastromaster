import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';
import { CouponService } from 'src/app/services/coupon.service';

@Component({
  selector: 'app-edit-coupons',
  templateUrl: './edit-coupons.component.html',
})
export class EditCouponsComponent implements OnInit {
  constructor(
    private couponService: CouponService,
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
      this.couponService.getCouponById(this.id).subscribe((data) => {
        this.couponForm.patchValue(data);
      });
    });
  }

  isFormSubmitted = false;

  activeOptions = [
    { name: 'Sim', value: true },
    { name: 'Não', value: false },
  ];

  couponForm!: FormGroup;

  createForm(): void {
    this.couponForm = this.fb.group(
      {
        value: [null, [Validators.required]],
        code: [null, [Validators.required]],
        description: [null],
        order_min_value: [null],
        active: [null],
        expiration_date: [null],
      },
      {}
    );
  }
  onSubmit(): void {
    if (this.couponForm.valid) {
      this.isFormSubmitted = true;
      const data = this.couponForm.getRawValue();
      this.couponService
        .updateCoupon(data)
        .pipe(
          finalize(() => (this.isFormSubmitted = false)),
          catchError((err) => {
            this.toastr.error('Não foi possível editar cupom', err.error.message);
            return of();
          })
        )
        .subscribe({
          next: () => {
            this.router.navigate(['admin/coupons']);
            this.toastr.success('Cupom editado com sucesso!');
          },
        });
    } else {
      this.toastr.error('Por favor, preencha o formulário corretamente.');
    }
  }

  onBack(): void {
    this.router.navigate(['admin/coupons']);
  }
}
