import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderDetailCreateDto {
  orderId: number;
  itemId: number;
  quantity: number;
  price: number;
  total: number;
  createdBy?: number; 
}

export interface OrderDetailDto {
  id: number;
  orderId: number;
  itemId: number;
  quantity: number;
  price: number;
  total: number;
  createdAt?: string;
  updatedAt?: string | null;
  itemName?: string;
}

@Injectable({ providedIn: 'root' })
export class OrderDetailService {
  private http = inject(HttpClient);
  private base = '/api/OrderDetail';


  create(input: OrderDetailCreateDto): Observable<OrderDetailDto> {
    const payload: OrderDetailCreateDto = {
      ...input,
      createdBy: input.createdBy ?? 1, 
    };
    return this.http.post<OrderDetailDto>(this.base, payload);
  }


  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }


}
