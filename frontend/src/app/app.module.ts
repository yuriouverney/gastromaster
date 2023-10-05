import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

//Import all material modules
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Import Layouts
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';

// Vertical Layout
import { SidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { HeaderComponent } from './layouts/full/header/header.component';
import { BrandingComponent } from './layouts/full/sidebar/branding.component';
import { AppNavItemComponent } from './layouts/full/sidebar/nav-item/nav-item.component';
import { ToastrModule } from 'ngx-toastr';
import { TokenService } from './services/auth/tokens.service';
import { AuthInterceptor } from './middlewares/authInterceptor';
import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ViewActionComponent } from './shared/view-action.component.ts';
import { SettingComponent } from './pages/administration/setting/setting.component';
import { UsersComponent } from './pages/administration/users/users.component';
import { Angular2SmartTableModule } from 'angular2-smart-table';
import { EditUserComponent } from './pages/administration/edit-user/edit-user.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { ProfileComponent } from './pages/user/profile/profile.component';
import { ListReservationComponent } from './pages/administration/list-reservations/list-reservation.component';
import { EditReservationComponent } from './pages/administration/edit-reservation/edit-reservation.component';
import { UserReservationComponent } from './pages/user/user-reservation/user-reservation.component';
import { UserEditReservationComponent } from './pages/user/user-edit-reservation/user-edit-reservation.component';
import { ListProductsComponent } from './pages/administration/list-products/list-products.component';
import { CreateProductsComponent } from './pages/administration/create-products/create-products.component';
import { EditProductsComponent } from './pages/administration/edit-products/edit-products.component';
import { ListCategoriesComponent } from './pages/administration/list-categories/list-categories.component';
import { CreateCategoriesComponent } from './pages/administration/create-categories/create-categories.component';
import { EditCategoriesComponent } from './pages/administration/edit-categories/edit-categories.component';
import { CartComponent } from './pages/user/cart/cart.component';
import { ListOrdersComponent } from './pages/administration/list-orders/list-orders.component';
import { EditOrdersComponent } from './pages/administration/edit-orders/edit-orders.component';
import { UserOrderComponent } from './pages/user/user-order/user-order.component';
import { UserEditOrderComponent } from './pages/user/user-edit-order/user-edit-order.component';
import { CreateCouponsComponent } from './pages/administration/create-coupons/create-coupons.component';
import { EditCouponsComponent } from './pages/administration/edit-coupons/edit-coupons.component';
import { ListCouponsComponent } from './pages/administration/list-coupons/list-coupons.component';
import { UppercaseDirective } from './directives/uppercase.directive';
import { ChartsComponent } from './pages/administration/charts/charts.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    BlankComponent,
    SidebarComponent,
    HeaderComponent,
    BrandingComponent,
    AppNavItemComponent,
    ViewActionComponent,
    SettingComponent,
    UsersComponent,
    EditUserComponent,
    ProfileComponent,
    ListReservationComponent,
    EditReservationComponent,
    UserReservationComponent,
    UserEditReservationComponent,
    ListProductsComponent,
    CreateProductsComponent,
    EditProductsComponent,
    ListCategoriesComponent,
    CreateCategoriesComponent,
    EditCategoriesComponent,
    CartComponent,
    ListOrdersComponent,
    EditOrdersComponent,
    UserOrderComponent,
    UserEditOrderComponent,
    CreateCouponsComponent,
    EditCouponsComponent,
    ListCouponsComponent,
    UppercaseDirective,
    ChartsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    Angular2SmartTableModule,
    OAuthModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 10000,
      preventDuplicates: true,
    }),
    TablerIconsModule.pick(TablerIcons),
    AngularMultiSelectModule,
    NgSelectModule,
    NgChartsModule,
  ],
  providers: [
    TokenService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    OAuthService,
  ],
  exports: [TablerIconsModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
