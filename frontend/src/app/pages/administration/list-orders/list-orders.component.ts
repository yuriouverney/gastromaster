import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import moment from 'moment';
import { debounceTime } from 'rxjs';
import { IOrder } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
})
export class ListOrdersComponent implements OnInit {
  dataSource: MatTableDataSource<IOrder> = new MatTableDataSource<IOrder>([]);

  displayedColumns: string[] = ['id', 'status', 'paid_value', 'createdAt', 'actions'];
  searchInput = new FormControl('');
  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.getAllOrders();
    this.searchInput.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.applyFilter(value);
    });
  }

  onView(id: number) {
    this.router.navigate(['admin/orders/edit/' + id]);
  }

  applyFilter(value: string | null): void {
    if (value !== null) {
      value = value.trim().toLowerCase();
      this.dataSource.filter = value;
    }
  }

  private getAllOrders() {
    this.orderService.getOrders().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.data.map((order) => {
        order.status === 'PENDING'
          ? (order.status = 'Aguardando pagamento')
          : order.status === 'PAID'
          ? (order.status = 'Pago')
          : (order.status = 'Cancelado');
        order.createdAt = moment(order.createdAt).format('DD/MM/YYYY HH:mm');
        return order;
      });
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const searchText =
          (data.status ?? '').toLowerCase() +
          (data.id ?? '') +
          (data.paid_value ?? '') +
          (data.createdAt ?? '');
        return searchText.indexOf(filter) !== -1;
      };
    });
  }
}
