import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderDetailCreateDto {
  orderId: number;
  itemId: number;
  quantity: number;
  price: number;
  total: number;
  createdBy?: number; // si tu API lo requiere
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
  // Campo opcional si tu API lo llena al incluir Item
  itemName?: string;
}

@Injectable({ providedIn: 'root' })
export class OrderDetailService {
  private http = inject(HttpClient);
  private base = '/api/OrderDetail';

  /** Crea un detalle (no muta el objeto que recibimos) */
  create(input: OrderDetailCreateDto): Observable<OrderDetailDto> {
    const payload: OrderDetailCreateDto = {
      ...input,
      createdBy: input.createdBy ?? 1, // quita esto si tu backend NO lo requiere
    };
    return this.http.post<OrderDetailDto>(this.base, payload);
  }

  /** Elimina un detalle por id */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }


}
