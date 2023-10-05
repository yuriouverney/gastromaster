import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { environment } from '../../../../environments/environment';
import { CouponService } from 'src/app/services/coupon.service';
import moment from 'moment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private toastr: ToastrService,
    private cuponService: CouponService
  ) {}

  allProducts: any;
  cartProducts: any[] = [];
  displayedColumns: string[] = ['image', 'price', 'actions'];
  checkoutTable = ['checkout'];
  totalPrice = 0;
  couponCode: any;
  couponApplied: boolean;
  newPrice = 0;

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products) => {
      this.allProducts = products.map((product: any) => {
        if (product.promotion && product.promotion_percent) {
          product.price = parseFloat(
            (product.price - product.price * (product.promotion_percent / 100)).toFixed(2)
          );
        }
        product.image = `${environment.apiUrl}/${product.image}`;
        return product;
      });
      const cart = this.cartService.getCart();
      this.cartProducts = [];
      cart.forEach((id) => {
        this.allProducts.forEach((product: any) => {
          if (product.id == id) {
            this.totalPrice += parseFloat(product.price);
            this.cartProducts = [...this.cartProducts, product];
          }
        });
        this.totalPrice = parseFloat(this.totalPrice.toFixed(2));
      });
    });
  }

  onRemove(id: number) {
    this.cartService.removeFromCart(id);
    this.totalPrice = 0;
    this.ngOnInit();
  }

  onCheckout() {
    const cart = this.cartService.getCart();
    if (!this.couponApplied) {
      this.couponCode = null;
    }
    this.orderService.createOrder(cart, this.couponCode).subscribe(() => {
      this.cartService.clearCart();
      this.toastr.success('Pedido realizado com sucesso!');
      this.router.navigate(['user/orders/']);
      this.ngOnInit();
    });
  }

  get hasItems(): boolean {
    const cart = this.cartService.getCart();
    return cart.length > 0;
  }

  applyCoupon() {
    const today = moment().format('YYYY-MM-DD');
    if (!this.couponCode || this.couponCode.length == 0) {
      this.couponCode = 'INVÁLIDO';
      this.toastr.error('Cupom Inválido!');
      this.couponApplied = false;
    }
    this.cuponService.getCouponByCodigo(this.couponCode).subscribe((response) => {
      if (!response) {
        this.couponCode = 'INVÁLIDO';
        this.toastr.error('Cupom Inválido!');
        this.couponApplied = false;
      } else if (!response.active) {
        this.couponCode = 'CUPOM EXPIRADO';
        this.toastr.error('Cupom Expirado!');
        this.couponApplied = false;
      } else if (response.expiration_date && response.expiration_date < today) {
        this.couponCode = 'CUPOM EXPIRADO';
        this.toastr.error('Cupom Expirado!');
        this.couponApplied = false;
      } else if (response.order_min_value && this.totalPrice < response.order_min_value) {
        this.couponCode = 'VALOR INCORRETO';
        this.toastr.error(`Valor mínimo do pedido deve ser: R$${response.order_min_value}`);
        this.couponApplied = false;
      } else {
        this.newPrice = this.totalPrice - response.order_min_value;
        this.newPrice = parseFloat(this.newPrice.toFixed(2));
        this.couponApplied = true;
      }
    });
  }
}
