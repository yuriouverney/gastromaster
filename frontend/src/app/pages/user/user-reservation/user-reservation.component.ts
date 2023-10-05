import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import moment from 'moment';
import { debounceTime } from 'rxjs';
import { IReservation } from 'src/app/models/reservation.model';
import { ReservationService } from 'src/app/services/reservation.service';
import { StatusReservation } from 'src/app/shared/enums/status-reservation.enum';

@Component({
  selector: 'app-user-reservation',
  templateUrl: './user-reservation.component.html',
})
export class UserReservationComponent implements OnInit {
  dataSource: MatTableDataSource<IReservation> = new MatTableDataSource<IReservation>([]);
  displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'date', 'obs', 'status', 'actions'];
  searchInput = new FormControl('');
  constructor(private reservationService: ReservationService, private router: Router) {}

  ngOnInit(): void {
    this.getAllReservationsByUser();
    this.searchInput.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.applyFilter(value);
    });
  }

  onView(id: number) {
    this.router.navigate(['user/reservations/edit/' + id]);
  }

  applyFilter(value: string | null): void {
    if (value !== null) {
      value = value.trim().toLowerCase();
      this.dataSource.filter = value;
    }
  }

  private getAllReservationsByUser() {
    this.reservationService.getReservationsByUser().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.data.map((reservation) => {
        if (reservation.status === StatusReservation.PENDING) {
          reservation.status = 'Aguardando Aprovação';
        } else if (reservation.status === StatusReservation.APPROVED) {
          reservation.status = 'Confirmado';
        } else {
          reservation.status = 'Cancelado';
        }
        reservation.date = moment(reservation.date).format('DD/MM/YYYY');
        return reservation;
      });
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const searchText =
          (data.name ?? '').toLowerCase() +
          (data.email ?? '').toLowerCase() +
          (data.date ?? '') +
          (data.phone ?? '') +
          (data.id ?? '');
        return searchText.indexOf(filter) !== -1;
      };
    });
  }
}
