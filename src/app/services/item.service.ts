import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ItemDto {
  id: number;
  name: string;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class ItemService {
  private http = inject(HttpClient);
  private base = '/api/Item';

  getAll() {
    return this.http.get<ItemDto[]>(this.base);
  }
}
