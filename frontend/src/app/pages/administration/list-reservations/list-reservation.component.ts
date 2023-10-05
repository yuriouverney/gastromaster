import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IReservation } from 'src/app/models/reservation.model';
import { debounceTime } from 'rxjs';
import { ReservationService } from 'src/app/services/reservation.service';
import moment from 'moment';
import { StatusReservation } from 'src/app/shared/enums/status-reservation.enum';

@Component({
  selector: 'app-list-reservation',
  templateUrl: './list-reservation.component.html',
})
export class ListReservationComponent implements OnInit {
  dataSource: MatTableDataSource<IReservation> = new MatTableDataSource<IReservation>([]);

  displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'date', 'obs', 'status', 'actions'];
  searchInput = new FormControl('');
  constructor(private reservationService: ReservationService, private router: Router) {}

  ngOnInit(): void {
    this.getAllReservations();
    this.searchInput.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.applyFilter(value);
    });
  }

  onView(id: number) {
    this.router.navigate(['admin/reservations/edit/' + id]);
  }

  applyFilter(value: string | null): void {
    if (value !== null) {
      value = value.trim().toLowerCase();
      this.dataSource.filter = value;
    }
  }

  private getAllReservations() {
    this.reservationService.getReservations().subscribe((data) => {
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
