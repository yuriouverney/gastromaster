import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { ICategory } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
})
export class ListCategoriesComponent implements OnInit {
  dataSource: MatTableDataSource<ICategory> = new MatTableDataSource<ICategory>([]);

  displayedColumns: string[] = ['id', 'name', 'actions', 'add'];
  searchInput = new FormControl('');
  constructor(private categoryService: CategoryService, private router: Router) {}

  ngOnInit(): void {
    this.getAllCategories();
    this.searchInput.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.applyFilter(value);
    });
  }

  onView(id: number) {
    this.router.navigate(['admin/categories/edit/' + id]);
  }

  applyFilter(value: string | null): void {
    if (value !== null) {
      value = value.trim().toLowerCase();
      this.dataSource.filter = value;
    }
  }

  onAdd() {
    this.router.navigate(['admin/categories/create/']);
  }

  private getAllCategories() {
    this.categoryService.getCategories().subscribe((data) => {
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
