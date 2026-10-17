import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/api/products`;

  private mock: Product[] = [
    { id: '1', name: 'ASUS Vivobook 15', category: 'laptop', price: 49990, specs: 'Intel Core i5 | 8GB | 512GB SSD', inStock: true },
    { id: '2', name: 'HP Pavilion', category: 'laptop', price: 72990, specs: 'Intel Core i7 | 16GB | 512GB SSD', inStock: true },
    { id: '3', name: 'Dell Inspiron 15', category: 'laptop', price: 54990, specs: 'Intel Core i5 | 8GB | 512GB SSD', inStock: false },
    { id: '4', name: 'iPhone 15', category: 'phone', price: 79990, specs: '128GB | 5G', inStock: true },
    { id: '5', name: 'Samsung Galaxy S23', category: 'phone', price: 64999, specs: '8GB | 128GB | 5G', inStock: true },
    { id: '6', name: 'OnePlus 11R', category: 'phone', price: 39999, specs: '8GB | 128GB | 5G', inStock: true },
  ];

  getProducts(): Observable<Product[]> {
    return environment.useMockData ? of([...this.mock]) : this.http.get<Product[]>(this.url);
  }

  addProduct(product: Product): Observable<Product> {
    if (environment.useMockData) {
      const created = { ...product, id: String(Date.now()) };
      this.mock.push(created);
      return of(created);
    }
    return this.http.post<Product>(this.url, product);
  }
}