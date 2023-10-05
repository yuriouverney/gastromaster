import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { catchError, debounceTime, finalize, of } from 'rxjs';
import { ICoupon } from 'src/app/models/coupon.model';
import { CouponService } from 'src/app/services/coupon.service';
import { OrderService } from 'src/app/services/order.service';
import { OrderStatus } from 'src/app/shared/enums/order-status.enum';

@Component({
  selector: 'app-user-edit-order',
  templateUrl: './user-edit-order.component.html',
})
export class UserEditOrderComponent implements OnInit {
  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private couponService: CouponService
  ) {}

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  displayedColumns: string[] = ['id', 'name', 'description', 'price'];

  searchInput = new FormControl('');

  statusOptions = [
    { value: OrderStatus.PENDING, description: 'Aguardando Pagamento' },
    { value: OrderStatus.PAID, description: 'Pago' },
    { value: OrderStatus.CANCELED, description: 'Cancelado' },
  ];

  orderItems: any[] = [];
  coupon: ICoupon;

  id: string;
  status: string;

  ngOnInit(): void {
    this.createForm();
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.orderService.getOrderById(this.id).subscribe((data) => {
        if (data.coupon_id) {
          this.couponService.getCouponById(data.coupon_id).subscribe((coupon) => {
            const objeto = { Coupon: { value: coupon.value } };
            this.orderForm.patchValue(objeto);
            this.coupon = coupon;
          });
        }
        const statusOption = this.statusOptions.find((option) => data.status === option.value);
        this.status = statusOption ? statusOption.description : '';
        data.createdAt = moment(data.createdAt).format('DD/MM/YYYY HH:mm');
        this.orderItems = data.order_items;
        this.orderForm.patchValue(data);
        this.createTable();
      });
    });
  }

  createTable() {
    this.dataSource = new MatTableDataSource<any>(this.orderItems);
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchText = (data.product.name ?? '').toLowerCase() + (data.id ?? '');
      return searchText.indexOf(filter) !== -1;
    };
    this.searchInput.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.applyFilter(value);
    });
  }

  applyFilter(value: string | null): void {
    if (value !== null) {
      value = value.trim().toLowerCase();
      this.dataSource.filter = value;
    }
  }

  isFormSubmitted = false;

  orderForm!: FormGroup;

  createForm(): void {
    this.orderForm = this.fb.group(
      {
        id: ['', [Validators.required]],
        status: ['', [Validators.required]],
        order_price: ['', [Validators.required]],
        createdAt: ['', [Validators.required]],
        paid_value: ['', [Validators.required]],
        User: this.fb.group({
          name: ['', [Validators.required]],
        }),
        Coupon: this.fb.group({
          value: [null],
        }),
      },
      {}
    );
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      this.isFormSubmitted = true;
      const data = this.orderForm.getRawValue();
      this.orderService
        .updateOrder(this.id, data)
        .pipe(
          finalize(() => (this.isFormSubmitted = false)),
          catchError((err) => {
            this.toastr.error('Não foi possível criar categoria', err.error.message);
            return of();
          })
        )
        .subscribe({
          next: () => {
            this.router.navigate(['user/orders']);
            this.toastr.success('Categoria criada com sucesso!');
          },
        });
    } else {
      this.toastr.error('Por favor, preencha o formulário corretamente.');
    }
  }

  onBack(): void {
    this.router.navigate(['user/orders']);
  }
}
