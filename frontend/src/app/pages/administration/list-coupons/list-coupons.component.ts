import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { ICoupon } from 'src/app/models/coupon.model';
import { CouponService } from 'src/app/services/coupon.service';

@Component({
  selector: 'app-list-coupons',
  templateUrl: './list-coupons.component.html',
})
export class ListCouponsComponent {
  dataSource: MatTableDataSource<ICoupon> = new MatTableDataSource<ICoupon>([]);

  displayedColumns: string[] = ['id', 'value', 'description', 'code', 'actions', 'add'];
  searchInput = new FormControl('');
  constructor(private couponService: CouponService, private router: Router) {}

  ngOnInit(): void {
    this.getAllCoupons();
    this.searchInput.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.applyFilter(value);
    });
  }

  onView(id: number) {
    this.router.navigate(['admin/coupons/edit/' + id]);
  }

  applyFilter(value: string | null): void {
    if (value !== null) {
      value = value.trim().toLowerCase();
      this.dataSource.filter = value;
    }
  }

  onAdd() {
    this.router.navigate(['admin/coupons/create/']);
  }

  private getAllCoupons() {
    this.couponService.getCoupons().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.data.map((reservation) => {
        return reservation;
      });
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const searchText =
          (data.value ?? '').toLowerCase() +
          (data.id ?? '') +
          (data.codigo ?? '') +
          (data.description ?? '').toLowerCase();
        return searchText.indexOf(filter) !== -1;
      };
    });
  }
}
