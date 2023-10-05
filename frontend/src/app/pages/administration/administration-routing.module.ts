import { Routes } from '@angular/router';
import { SettingComponent } from './setting/setting.component';
import { UsersComponent } from './users/users.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ListReservationComponent } from './list-reservations/list-reservation.component';
import { ProfileTypes } from 'src/app/shared/enums/profile-types.enum';
import { EditReservationComponent } from './edit-reservation/edit-reservation.component';
import { ListCategoriesComponent } from './list-categories/list-categories.component';
import { EditCategoriesComponent } from './edit-categories/edit-categories.component';
import { ListProductsComponent } from './list-products/list-products.component';
import { EditProductsComponent } from './edit-products/edit-products.component';
import { CreateProductsComponent } from './create-products/create-products.component';
import { CreateCategoriesComponent } from './create-categories/create-categories.component';
import { ListOrdersComponent } from './list-orders/list-orders.component';
import { EditOrdersComponent } from './edit-orders/edit-orders.component';
import { ListCouponsComponent } from './list-coupons/list-coupons.component';
import { CreateCouponsComponent } from './create-coupons/create-coupons.component';
import { EditCouponsComponent } from './edit-coupons/edit-coupons.component';
import { ChartsComponent } from './charts/charts.component';

export const AdministrationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'setting',
        component: SettingComponent,
        data: { roles: [ProfileTypes.ADMIN] },
      },
      {
        path: 'users',
        component: UsersComponent,
        data: { roles: [ProfileTypes.ADMIN] },
      },
      {
        path: 'users/:id',
        component: EditUserComponent,
        data: { roles: [ProfileTypes.ADMIN] },
      },
      {
        path: 'reservations',
        component: ListReservationComponent,
        data: { roles: [ProfileTypes.ADMIN, ProfileTypes.MANAGER] },
      },
      {
        path: 'reservations/edit/:id',
        component: EditReservationComponent,
        data: { roles: [ProfileTypes.ADMIN, ProfileTypes.MANAGER] },
      },
      {
        path: 'categories',
        component: ListCategoriesComponent,
        data: { roles: [ProfileTypes.ADMIN] },
      },
      {
        path: 'categories/create',
        component: CreateCategoriesComponent,
        data: { roles: [ProfileTypes.ADMIN] },
      },
      {
        path: 'categories/edit/:id',
        component: EditCategoriesComponent,
        data: { roles: [ProfileTypes.ADMIN] },
      },
      {
        path: 'products',
        component: ListProductsComponent,
        data: { roles: [ProfileTypes.ADMIN] },
      },
      {
        path: 'products/create',
        component: CreateProductsComponent,
        data: { roles: [ProfileTypes.ADMIN] },
      },
      {
        path: 'products/edit/:id',
        component: EditProductsComponent,
        data: { roles: [ProfileTypes.ADMIN] },
      },
      {
        path: 'orders',
        component: ListOrdersComponent,
        data: { roles: [ProfileTypes.ADMIN, ProfileTypes.MANAGER] },
      },
      {
        path: 'orders/edit/:id',
        component: EditOrdersComponent,
        data: { roles: [ProfileTypes.ADMIN, ProfileTypes.MANAGER] },
      },
      {
        path: 'coupons',
        component: ListCouponsComponent,
        data: { roles: [ProfileTypes.ADMIN] },
      },
      {
        path: 'coupons/create',
        component: CreateCouponsComponent,
        data: { roles: [ProfileTypes.ADMIN] },
      },
      {
        path: 'coupons/edit/:id',
        component: EditCouponsComponent,
        data: { roles: [ProfileTypes.ADMIN] },
      },
      {
        path: 'charts',
        component: ChartsComponent,
        data: { roles: [ProfileTypes.ADMIN] },
      },
    ],
  },
];
