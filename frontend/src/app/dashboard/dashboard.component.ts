import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);
  private router = inject(Router);
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  searchText = signal('');
  error = signal('');
  formError = signal('');
  showForm = signal(false);
  today = new Date();

  menu = [
    { icon: '🏠', label: 'Dashboard', active: true },
    { icon: '📦', label: 'Products', active: false },
    { icon: '🧾', label: 'Orders', active: false },
    { icon: '👤', label: 'Users', active: false },
    { icon: '📊', label: 'Reports', active: false },
    { icon: '⚙️', label: 'Settings', active: false },
  ];

  form = this.emptyForm();

  laptops = computed(() => this.products().filter((p) => p.category === 'laptop'));
  phones = computed(() => this.products().filter((p) => p.category === 'phone'));
  inStockCount = computed(() => this.products().filter((p) => p.inStock).length);
  shownLaptops = computed(() => this.search(this.laptops()));
  shownPhones = computed(() => this.search(this.phones()));

  userName = computed(() => this.auth.user()?.email?.split('@')[0] ?? 'there');
  initial = computed(() => this.userName().charAt(0).toUpperCase());

  ngOnInit() {
    this.load();
  }

  load() {
    this.error.set('');
    this.productService.getProducts().subscribe({
      next: (list) => this.products.set(list),
      error: (e) => this.error.set(this.messageFor(e.status)),
    });
  }

  save() {
    const f = this.form;
    if (!f.name.trim() || !f.price || f.price <= 0) {
      this.formError.set('Enter a product name and a price above 0.');
      return;
    }
    this.formError.set('');
    this.productService
      .addProduct({
        name: f.name.trim(),
        category: f.category,
        price: f.price,
        specs: f.specs.trim(),
        inStock: f.inStock,
      })
      .subscribe({
        next: () => {
          this.form = this.emptyForm();
          this.showForm.set(false);
          this.load();
        },
        error: (e) => this.formError.set(this.messageFor(e.status)),
      });
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }

  private search(list: Product[]): Product[] {
    const q = this.searchText().trim().toLowerCase();
    return q ? list.filter((p) => p.name.toLowerCase().includes(q)) : list;
  }

  private emptyForm() {
    return { name: '', category: 'laptop' as 'laptop' | 'phone', price: null as number | null, specs: '', inStock: true };
  }

  private messageFor(status: number): string {
    switch (status) {
      case 401:
        return 'Your session has expired. Log out and sign in again.';
      case 403:
        return 'You are not authorized. Only admins can use this dashboard.';
      case 0:
        return 'Cannot reach the server. Is the Python backend running?';
      default:
        return 'Something went wrong. Try again.';
    }
  }
}