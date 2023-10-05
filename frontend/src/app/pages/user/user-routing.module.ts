import { Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { UserReservationComponent } from './user-reservation/user-reservation.component';
import { UserEditReservationComponent } from './user-edit-reservation/user-edit-reservation.component';
import { CartComponent } from './cart/cart.component';
import { UserOrderComponent } from './user-order/user-order.component';
import { UserEditOrderComponent } from './user-edit-order/user-edit-order.component';

export const UserRoutingModule: Routes = [
  {
    path: '',
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'reservations',
        component: UserReservationComponent,
      },
      {
        path: 'reservations/edit/:id',
        component: UserEditReservationComponent,
      },
      {
        path: 'cart',
        component: CartComponent,
      },
      {
        path: 'orders',
        component: UserOrderComponent,
      },
      {
        path: 'orders/edit/:id',
        component: UserEditOrderComponent,
      },
    ],
  },
];
