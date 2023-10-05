import { Component, Output, EventEmitter, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  private cartStatusSubscription: Subscription;
  cartQuantity: number;

  showFiller = false;

  constructor(
    public dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.cartStatusSubscription = this.cartService.getCartStatus().subscribe((status) => {
      this.cartQuantity = status;
    });
  }

  ngOnDestroy() {
    // lembre-se de cancelar a assinatura quando o componente for destruído
    this.cartStatusSubscription.unsubscribe();
  }

  onLogout() {
    localStorage.clear();
    window.location.reload();
  }

  onMyProfile() {
    this.router.navigate(['/user/profile']);
  }

  onMyReservations() {
    this.router.navigate(['/user/reservations']);
  }

  onCartPage() {
    this.router.navigate(['/user/cart']);
  }

  onMyOrders() {
    this.router.navigate(['/user/orders']);
  }
}
