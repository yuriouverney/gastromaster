import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of, debounceTime } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { OrderStatus } from 'src/app/shared/enums/order-status.enum';

@Component({
  selector: 'app-edit-orders',
  templateUrl: './edit-orders.component.html',
})
export class EditOrdersComponent implements OnInit {
  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  displayedColumns: string[] = ['id', 'name', 'description', 'price', 'actions'];

  searchInput = new FormControl('');

  statusOptions = [
    { value: OrderStatus.PENDING, description: 'Aguardando Pagamento' },
    { value: OrderStatus.PAID, description: 'Pago' },
    { value: OrderStatus.CANCELED, description: 'Cancelado' },
  ];

  orderItems: any[] = [];

  id: string;

  ngOnInit(): void {
    this.createForm();
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.orderService.getOrderById(this.id).subscribe((data) => {
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
        User: this.fb.group({
          name: ['', [Validators.required]],
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
            this.router.navigate(['admin/orders']);
            this.toastr.success('Categoria criada com sucesso!');
          },
        });
    } else {
      this.toastr.error('Por favor, preencha o formulário corretamente.');
    }
  }

  onBack(): void {
    this.router.navigate(['admin/orders']);
  }

  onRemove(id: string) {
    this.orderService
      .removeItemOrder(id)
      .pipe(
        finalize(() => (this.isFormSubmitted = false)),
        catchError((err) => {
          this.toastr.error('Não foi possível remover item', err.error.message);
          return of();
        })
      )
      .subscribe({
        next: () => {
          this.toastr.success('Item removido com sucesso!');
          this.ngOnInit();
        },
      });
  }
}
