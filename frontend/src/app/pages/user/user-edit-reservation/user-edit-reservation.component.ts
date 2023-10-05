import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';
import { ReservationService } from 'src/app/services/reservation.service';
import { StatusReservation } from 'src/app/shared/enums/status-reservation.enum';

@Component({
  selector: 'app-user-edit-reservation',
  templateUrl: './user-edit-reservation.component.html',
})
export class UserEditReservationComponent implements OnInit {
  id: number;
  isFormSubmitted = false;
  changePassword = false;
  statusColor: any;
  canEdit = false;
  status: string;
  amountPeople: number[] = [1, 2, 3, 4, 5, 6];

  constructor(
    private reservationService: ReservationService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  statusOptions = [
    { value: StatusReservation.PENDING, description: 'Aguardando Aprovação' },
    { value: StatusReservation.APPROVED, description: 'Confirmado' },
    { value: StatusReservation.CANCELED, description: 'Cancelado' },
  ];

  reservationForm!: FormGroup;

  ngOnInit(): void {
    this.createForm();
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.reservationService.getReservationById(this.id).subscribe((data) => {
        this.reservationForm.patchValue(data);
        const statusOption = this.statusOptions.find((option) => data.status === option.value);
        this.status = statusOption ? statusOption.description : '';
        this.canEdit = data.status === StatusReservation.PENDING;
        this.setStatusColor(this.reservationForm.get('status')?.value);
        this.reservationForm.get('status')?.valueChanges.subscribe((value) => {
          this.setStatusColor(value);
        });
      });
    });
  }

  createForm(): void {
    this.reservationForm = this.fb.group(
      {
        id: ['', [Validators.required]],
        date: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        amountPeople: ['', [Validators.required]],
        obs: [''],
        user_id: ['', [Validators.required]],
        status: ['', [Validators.required]],
        User: this.fb.group({
          name: [''],
          email: [''],
        }),
      },
      {}
    );
  }

  onSubmit(): void {
    if (this.reservationForm.valid) {
      const data = this.reservationForm.getRawValue();
      if (!this.changePassword) {
        delete data.password;
        delete data.confirmPassword;
      }
      this.reservationService
        .updateReservation(data, this.id)
        .pipe(
          finalize(() => (this.isFormSubmitted = false)),
          catchError((err) => {
            this.toastr.error('Não foi possível alterar a reserva', err.error.message);
            return of();
          })
        )
        .subscribe({
          next: () => {
            this.router.navigate(['user/reservations']);
            this.toastr.success('Reserva alterada com sucesso!');
          },
        });
    } else {
      this.toastr.error('Por favor, preencha o formulário corretamente.');
    }
  }

  onBack(): void {
    this.router.navigate(['user/reservations']);
  }

  onDelete(): void {
    this.reservationService
      .deleteReservation(this.id)
      .pipe(
        finalize(() => (this.isFormSubmitted = false)),
        catchError((err) => {
          this.toastr.error('Não foi possível deletar reserva', err.error.message);
          return of();
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['user/reservations']);
          this.toastr.success('reserva deletada com sucesso!');
        },
      });
  }

  setStatusColor(value: any): void {
    switch (value) {
      case StatusReservation.PENDING:
        this.statusColor = 'status-pending';
        break;
      case StatusReservation.APPROVED:
        this.statusColor = 'status-approved';
        break;
      case StatusReservation.CANCELED:
        this.statusColor = 'status-cancelled';
        break;
      default:
        this.statusColor = '';
    }
  }
}
