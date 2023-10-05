import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/models/product.model';
import { ISetting } from 'src/app/models/setting.model';
import { ICategory } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { ScrollService } from 'src/app/services/scroll.service';
import { SettingService } from 'src/app/services/setting.service';
import { IUser } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ReservationService } from 'src/app/services/reservation.service';
import { catchError, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { environment } from '../../../environments/environment';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class AppIndexComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private scrollService: ScrollService,
    private categoryService: CategoryService,
    private settingService: SettingService,
    private authService: AuthService,
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private toastr: ToastrService,
    private router: Router,
    private cartService: CartService,
    private imageService: ImageService
  ) {}

  banner: string;
  products: IProduct[] = [];
  productsToShow: IProduct[] = [];
  promotionProducts: IProduct[] = [];
  setting: ISetting = { name: '', logo: '', address: '', phone: '' };
  category: ICategory[] = [];
  selectedCategory: number | undefined = 0;
  openingHour: any[];
  user: IUser;
  reservationForm: FormGroup;
  amountPeople: number[] = [1, 2, 3, 4, 5, 6];
  aboutImage: string;

  ngOnInit() {
    this.getUserData();

    this.getImagesFromIndexedDb();
    this.scrollService.scrollToSection$.subscribe((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    this.createReservationForm();
    this.getSetting();
    this.getProducts();
    this.getCategories();
  }

  async getImagesFromIndexedDb() {
    const savedBlobBanner = await this.imageService.getImage('banner');
    const savedBlobAboutImage = await this.imageService.getImage('aboutImage');
    this.banner = URL.createObjectURL(savedBlobBanner);
    this.aboutImage = URL.createObjectURL(savedBlobAboutImage);
  }

  createReservationForm(): void {
    this.reservationForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      date: ['', [Validators.required, this.dateValidator()]],
      amountPeople: ['', [Validators.required]],
      obs: [''],
      user_id: ['', [Validators.required]],
    });
  }

  private getUserData() {
    this.authService.currentUser$.subscribe((user) => {
      if (user?.id) {
        this.user = user;
        this.reservationForm.patchValue(user);
      }
    });
  }

  private getProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data.map((product: IProduct) => ({
        ...product,
        image: product.image ? `${environment.apiUrl}/${product.image}` : '',
      }));
      this.productsToShow = this.products.sort((a, b) => {
        if (a && b && a.category_id && b.category_id) {
          return a.category_id - b.category_id;
        } else {
          return 0;
        }
      });
      if (this.products) {
        this.promotionProducts = this.products.filter((product: IProduct) => product.promotion);
      }
    });
  }

  private getCategories() {
    this.categoryService.getCategories().subscribe((data) => {
      this.category = data;
    });
  }

  onSelectCategory(categoryId: number) {
    this.selectedCategory = categoryId;
    if (categoryId === 0) {
      this.productsToShow = this.products;
    } else {
      this.productsToShow = this.products.filter(
        (product: IProduct) => product.category_id === categoryId
      );
    }
  }

  getSetting() {
    this.settingService.getSetting().subscribe((data) => {
      this.setting = data;
      this.openingHour = Object.entries(data.opening_hour).map(([day, value]) => ({
        day,
        value,
      }));
      const orderedDays = [
        'Segunda-feira',
        'Terca-feira',
        'Quarta-feira',
        'Quinta-feira',
        'Sexta-feira',
        'Sabado',
        'Domingo',
      ];
      this.openingHour.sort((a, b) => orderedDays.indexOf(a.day) - orderedDays.indexOf(b.day));
    });
  }

  onSubmitReservation() {
    this.reservationForm.patchValue({ user_id: this.user.id });
    if (this.reservationForm.valid) {
      this.reservationService
        .createReservation(this.reservationForm.value)
        .pipe(
          catchError((err) => {
            this.toastr.error('Não foi possível cadastrar reserva', err.error.message);
            return of();
          })
        )
        .subscribe({
          next: () => {
            this.router.navigate(['']);
            this.toastr.success(
              'Reserva cadastrada com sucesso, acompanhe o STATUS do pedido, você será notificado quando o o status for alterado!'
            );
          },
        });
    } else {
      this.toastr.error('Por favor, preencha o formulário corretamente.');
    }
  }

  private dateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedDate = new Date(control.value);
      const currentDate = new Date();

      if (selectedDate < currentDate) {
        return { dateInvalid: true };
      }

      return null;
    };
  }

  onAddItemCart(event: any) {
    this.cartService.addToCart(event);
    this.toastr.success('Produto adicionado ao carrinho', 'Sucesso');
  }
}
