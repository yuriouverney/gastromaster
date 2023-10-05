import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { IProduct } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
})
export class ListProductsComponent implements OnInit {
  dataSource: MatTableDataSource<IProduct> = new MatTableDataSource<IProduct>([]);

  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'price',
    'promotion',
    'promotion_percent',
    'actions',
    'add',
  ];
  searchInput = new FormControl('');
  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.getAllroducts();
    this.searchInput.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.applyFilter(value);
    });
  }

  onView(id: number) {
    this.router.navigate(['admin/products/edit/' + id]);
  }

  applyFilter(value: string | null): void {
    if (value !== null) {
      value = value.trim().toLowerCase();
      this.dataSource.filter = value;
    }
  }

  onAdd() {
    this.router.navigate(['admin/products/create/']);
  }

  private getAllroducts() {
    this.productService.getProducts().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.data.map((reservation) => {
        return reservation;
      });
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const searchText = (data.name ?? '').toLowerCase() + (data.id ?? '');
        return searchText.indexOf(filter) !== -1;
      };
    });
  }
}
