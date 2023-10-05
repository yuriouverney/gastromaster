import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { IUser } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  dataSource: MatTableDataSource<IUser> = new MatTableDataSource<IUser>([]);

  displayedColumns: string[] = ['id', 'name', 'email', 'actions'];
  searchInput = new FormControl('');
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.getAllUsers();
    this.searchInput.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.applyFilter(value);
    });
  }

  onView(id: number) {
    this.router.navigate(['admin/users/' + id]);
  }

  applyFilter(value: string | null): void {
    if (value !== null) {
      value = value.trim().toLowerCase();
      this.dataSource.filter = value;
    }
  }

  private getAllUsers() {
    this.userService.getUsers().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.filterPredicate = (data: IUser, filter: string) => {
        const searchText = (data.name ?? '').toLowerCase() + (data.email ?? '').toLowerCase();
        return searchText.indexOf(filter) !== -1;
      };
    });
  }
}
