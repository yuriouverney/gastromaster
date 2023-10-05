import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: number[] = [];
  private cartStatus = new BehaviorSubject<number>(0);

  constructor(private toastr: ToastrService) {
    this.loadCart();
  }

  loadCart() {
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.emitCartStatus();
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.emitCartStatus();
  }

  addToCart(itemId: number) {
    this.cart.push(itemId);
    this.saveCart();
  }

  getCart() {
    return this.cart;
  }

  getCartStatus() {
    return this.cartStatus.asObservable();
  }

  private emitCartStatus() {
    this.cartStatus.next(this.cart.length);
  }

  removeFromCart(itemId: number) {
    const index = this.cart.indexOf(itemId);
    if (index > -1) {
      this.cart.splice(index, 1);
    }
    this.saveCart();
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }
}
