import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface PersonDto {
  id: number; firstName: string; lastName: string; email: string; fullName: string;
}
export interface OrderDetailDto {
  id: number; itemId: number; itemName?: string; quantity: number; price: number; total: number;
}
export interface ApiOrderDto {
  id: number; number: number;
  person: PersonDto | null;
  orderDetail: OrderDetailDto[] | null;   
  createdAt?: string; updatedAt?: string | null;
}
export interface OrderDto {
  id: number; number: number;
  person: PersonDto | null;
  details: OrderDetailDto[];              
  createdAt?: string; updatedAt?: string | null;
}
export interface OrderCreateDto { number: number; personId: number; }

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private base = '/api/Order'; 
  getAll() {
    return this.http.get<ApiOrderDto[]>(this.base).pipe(
      map(list => (list ?? []).map(o => ({
        id: o.id,
        number: o.number,
        person: o.person,
        details: Array.isArray(o.orderDetail) ? o.orderDetail : [],
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
      } satisfies OrderDto)))
    );
  }

  create(dto: OrderCreateDto) {
    return this.http.post<{ id:number }>(this.base, dto);
  }
}
